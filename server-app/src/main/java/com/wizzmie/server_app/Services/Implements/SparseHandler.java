package com.wizzmie.server_app.Services.Implements;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.Rating;
import com.wizzmie.server_app.Repository.CustomerRepository;
import com.wizzmie.server_app.Repository.MenuRepository;
import com.wizzmie.server_app.Repository.RatingRepository;

@Service
public class SparseHandler {
    
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private MenuRepository menuRepository;
    @Autowired
    private CustomerRepository customerRepository;

    public boolean isDataSparse() {
        long totalMenus = menuRepository.count();
        long menusWithRatings = ratingRepository.countDistinctMenus();
        double sparsityRatio = 1.0 - (menusWithRatings / (double) totalMenus);
        
        return sparsityRatio > 0.5; // Threshold sparsity
    }


     // Metode K-NN untuk sparse data
    public Map<Integer, Double> recommendUsingKNN(
        Integer customerId, 
        int limit
    ) {
        List<Rating> ratings = ratingRepository.findAll();
        List<Customer> customers = customerRepository.findAll();
        List<Menu> menus = menuRepository.findAll();
        int k = Math.min(5, (int) Math.sqrt(customers.size()));

        // Bangun vektor rating untuk setiap customer
        Map<Integer, Map<Integer, Double>> customerRatingVectors = new HashMap<>();
        for (Customer customer : customers) {
            Map<Integer, Double> ratingVector = new HashMap<>();
            ratings.stream()
                .filter(r -> r.getCustomerId().equals(customer.getId()))
                .forEach(r -> ratingVector.put(r.getMenu().getId(), r.getRating()));
            customerRatingVectors.put(customer.getId(), ratingVector);
        }

        // Cari k-tetangga terdekat
        Map<Integer, Double> nearestNeighborRecommendations = findNearestNeighborRecommendations(
            customerId, 
            customerRatingVectors, 
            k
        );

        // Sorting dan batasi
        return nearestNeighborRecommendations.entrySet().stream()
            .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
            .limit(limit)
            .collect(Collectors.toMap(
                Map.Entry::getKey, 
                Map.Entry::getValue, 
                (e1, e2) -> e1, 
                LinkedHashMap::new
            ));
    }

    private Map<Integer, Double> findNearestNeighborRecommendations(
        Integer targetCustomerId, 
        Map<Integer, Map<Integer, Double>> customerRatingVectors,
        int k
    ) {
        Map<Integer, Double> similarities = new HashMap<>();
        Map<Integer, Double> recommendations = new HashMap<>();

        // Hitung similaritas antara customer target dengan customer lain
        for (Map.Entry<Integer, Map<Integer, Double>> entry : customerRatingVectors.entrySet()) {
            if (!entry.getKey().equals(targetCustomerId)) {
                double similarity = calculateCosineSimilarity(
                    customerRatingVectors.get(targetCustomerId), 
                    entry.getValue()
                );
                similarities.put(entry.getKey(), similarity);
            }
        }

        // Ambil k tetangga terdekat
        List<Integer> nearestNeighbors = similarities.entrySet().stream()
            .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
            .limit(k)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // Gabungkan rating dari tetangga terdekat
        Set<Integer> unratedMenus = findUnratedMenus(targetCustomerId, customerRatingVectors);
        for (Integer menuId : unratedMenus) {
            double weightedRatingSum = 0.0;
            double similaritySum = 0.0;

            for (Integer neighborId : nearestNeighbors) {
                Map<Integer, Double> neighborRatings = customerRatingVectors.get(neighborId);
                if (neighborRatings.containsKey(menuId)) {
                    double similarity = similarities.get(neighborId);
                    weightedRatingSum += similarity * neighborRatings.get(menuId);
                    similaritySum += Math.abs(similarity);
                }
            }

            if (similaritySum > 0) {
                recommendations.put(menuId, weightedRatingSum / similaritySum);
            }
        }

        return recommendations;
    }
    
    private double calculateCosineSimilarity(
        Map<Integer, Double> vector1, 
        Map<Integer, Double> vector2
    ) {
        Set<Integer> commonKeys = new HashSet<>(vector1.keySet());
        commonKeys.retainAll(vector2.keySet());

        if (commonKeys.isEmpty()) return 0.0;

        double dotProduct = 0.0;
        double normVector1 = 0.0;
        double normVector2 = 0.0;

        for (Integer key : commonKeys) {
            double val1 = vector1.get(key);
            double val2 = vector2.get(key);
            
            dotProduct += val1 * val2;
            normVector1 += val1 * val1;
            normVector2 += val2 * val2;
        }

        return dotProduct / (Math.sqrt(normVector1) * Math.sqrt(normVector2));
    }

    private Set<Integer> findUnratedMenus(
        Integer targetCustomerId, 
        Map<Integer, Map<Integer, Double>> customerRatingVectors
    ) {
        Set<Integer> allMenuIds = menuRepository.findAll().stream()
            .map(Menu::getId)
            .collect(Collectors.toSet());
        
        Set<Integer> ratedMenuIds = customerRatingVectors.get(targetCustomerId).keySet();
        
        allMenuIds.removeAll(ratedMenuIds);
        return allMenuIds;
    }
}
