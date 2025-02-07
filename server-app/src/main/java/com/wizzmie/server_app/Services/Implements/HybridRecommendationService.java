package com.wizzmie.server_app.Services.Implements;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Respon.MenuRecommendationResponse;
import com.wizzmie.server_app.Entity.Category;
import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.OrderItem;
import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Entity.Rating;
import com.wizzmie.server_app.Repository.CustomerRepository;
import com.wizzmie.server_app.Repository.MenuRepository;
import com.wizzmie.server_app.Repository.OrderRepository;
import com.wizzmie.server_app.Repository.RatingRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.time.temporal.ChronoUnit;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;

@Service
public class HybridRecommendationService {

    private final MenuRepository menuRepository;
    private final OrderRepository orderRepository;
    private final RatingRepository ratingRepository;
    private final CustomerRepository customerRepository;
    private final TfIdfVectorizer tfIdfVectorizer;

    public HybridRecommendationService( MenuRepository menuRepository, 
                                        OrderRepository orderRepository, 
                                        RatingRepository ratingRepository, 
                                        CustomerRepository customerRepository
                                        ) {
        this.menuRepository = menuRepository;
        this.orderRepository = orderRepository;
        this.ratingRepository = ratingRepository;
        this.customerRepository = customerRepository;
        this.tfIdfVectorizer = new TfIdfVectorizer();
        
    }

    @Value("${recommendation.collaborative.weight}")
    private Double collaborativeWeight = 0.6;

    @Value("${recommendation.content.weight}")
    private Double contentWeight = 0.4;

    public List<MenuRecommendationResponse> getRecommendations(Integer customerId, int limit){

        // Get collaborative filtering recommendations
        Map<Integer, Double> collaborativeScores = getCollaborativeFilteringScores(customerId);

         // Get content-based recommendations
        Map<Integer, Double> contentBasedScores = getContentBasedFilteringScores(customerId);
                
        // Combine scores using weighted average
        Map<Integer, Double> hybridScores = new HashMap<>();
        Set<Integer> allMenuIds = new HashSet<>();
        allMenuIds.addAll(collaborativeScores.keySet());
        allMenuIds.addAll(contentBasedScores.keySet());
        
        for (Integer menuId : allMenuIds) {
            double collabScore = collaborativeScores.getOrDefault(menuId, 0.0);
            double contentScore = contentBasedScores.getOrDefault(menuId, 0.0);
            double hybridScore = (collabScore * collaborativeWeight) + (contentScore * contentWeight);
            hybridScores.put(menuId, hybridScore);
        }
        
        // Sort and return top recommendations
        return hybridScores.entrySet().parallelStream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> {
                    Menu menu = menuRepository.findById(entry.getKey())
                            .orElseThrow(() -> new RuntimeException("Menu not found"));
                    return new MenuRecommendationResponse(menu, entry.getValue());
                })
                .collect(Collectors.toList());
    }
        
    private Map<Integer, Double> getContentBasedFilteringScores(Integer customerId) {

        Customer customer = customerRepository.findById(customerId)
        .orElseThrow(() -> new RuntimeException("Customer not found"));
        Category preferredCategory = customer.getCategory();

        List<Menu> allMenus = menuRepository.findAll();
        Set<Integer> orderedMenuIds = orderRepository.findByCustomerId(customerId).stream()
                .flatMap(order -> order.getOrderItems().stream())
                .map(item -> item.getMenu().getId())
                .collect(Collectors.toSet());

        List<String> allMenuNames = allMenus.stream().map(Menu::getName).collect(Collectors.toList());

        Map<Integer, Double> contentBasedScores = new HashMap<>();
        for (Menu menu : allMenus){
            if(!orderedMenuIds.contains(menu.getId())){
                double categoryScore = (preferredCategory != null && menu.getCategory().getId().equals(preferredCategory.getId())) ? 1.0 : 0.0;
                double nameScore = calculateNameSimilarity(menu, orderedMenuIds, allMenuNames);
                double priceScore = calculatePriceSimilarity(menu, orderedMenuIds);
                double popularityScore = calculatePopularityScore(menu);

                double finalScore = (categoryScore * 0.25) + (nameScore * 0.25) + (priceScore * 0.25) + (popularityScore * 0.3);
                contentBasedScores.put(menu.getId(), finalScore);
            }
        }
        
        return contentBasedScores;
    }

    private double calculatePriceSimilarity(Menu menu, Set<Integer> orderedMenuIds) {
        List<Menu> orderedMenus = menuRepository.findAllById(orderedMenuIds);
        if (orderedMenus.isEmpty()) {
            return 0.0;
        }
        
        double avgOrderedPrice = orderedMenus.stream()
                .mapToDouble(Menu::getPrice)
                .average()
                .orElse(0.0);
        
        double maxPriceDiff = menuRepository.findAll().stream()
                .mapToDouble(Menu::getPrice)
                .max()
                .orElse(1.0);
        
        return 1.0 - (Math.abs(menu.getPrice() - avgOrderedPrice) / maxPriceDiff);
    }

    private double calculateNameSimilarity(Menu menu, Set<Integer> orderedMenuIds, List<String> allMenuNames) {
        List<Menu> orderedMenus = menuRepository.findAllById(orderedMenuIds);
        if (orderedMenus.isEmpty()) {
            return 0.0;
        }

        List<String> orderedMenuNames = orderedMenus.stream()
                .map(Menu::getName)
                .collect(Collectors.toList());

        return tfIdfVectorizer.calculateSimilarity(menu.getName(), orderedMenuNames, allMenuNames);
    }
    
    private double calculatePopularityScore(Menu menu){
        // Rating score (normalized to 0-1)
        List<Rating> menuRatings = ratingRepository.findRatingByMenuId(menu.getId());
        double avgRating;
        
        if (menuRatings.isEmpty()) {
            avgRating = 0.0;
        } else {
            double sumRatings = 0.0;
            for (Rating rating : menuRatings) {
                sumRatings += rating.getRating();
            }
            avgRating = sumRatings / menuRatings.size();
        }
        double ratingScore = avgRating / 5.0;

        // Order frequency score (normalized to 0-1)
        long orderCount = orderRepository.findAll().stream()
            .flatMap(order -> order.getOrderItems().stream())
            .filter(item -> item.getMenu().getId().equals(menu.getId()))
            .count();

        double maxOrders = orderRepository.findAll().stream()
            .flatMap(order -> order.getOrderItems().stream())
            .map(item -> item.getMenu().getId())
            .collect(Collectors.groupingBy(id -> id, Collectors.counting()))
            .values()
            .stream()
            .mapToLong(Long::longValue)
            .max()
            .orElse(1L);

        double orderScore = orderCount / (double) maxOrders;

        // Recent orders score (give more weight to recent orders)
        double recencyScore = calculateRecencyScore(menu);

        // Combine all popularity metrics
        return (ratingScore * 0.4) +           // Rating weight 40%
            (orderScore * 0.35) +           // Order frequency weight 35%
            (recencyScore * 0.25);          // Recent orders weight 25%    
    }

    private double calculateRecencyScore(Menu menu) {
        List<Orders> recentOrders = orderRepository.findByMenuIdOrderByOrderDateDesc(menu.getId());
        if (recentOrders.isEmpty()) {
            return 0.0;
        }
    
        // Get current time in milliseconds
        long currentTime = System.currentTimeMillis();
        
        // Calculate average time difference of recent orders (last 30 days)
        double avgTimeDiff = recentOrders.stream()
                .limit(30)
                .mapToLong(order -> currentTime - ChronoUnit.MILLIS.between(order.getOrderDate(), LocalDateTime.now()))
                .average()
                .orElse(Double.MAX_VALUE);
        
        // Normalize time difference (closer to 1 means more recent orders)
        double maxTimeDiff = 30L * 24L * 60L * 60L * 1000L; // 30 days in milliseconds
        return Math.max(0.0, 1.0 - (avgTimeDiff / maxTimeDiff));
    }
    private Map<Integer, Double> getCollaborativeFilteringScores(Integer customerId) {
        Map<Integer, Double> orderBasedScores = getOrderBasedScore(customerId);
        Map<Integer, Double> ratingBasedScores = getRatingBasedScore(customerId);

        Map<Integer, Double> combineScores = new HashMap<>();
        Set<Integer> allMenuIds = new HashSet<>();
        allMenuIds.addAll(orderBasedScores.keySet());
        allMenuIds.addAll(ratingBasedScores.keySet());
        
        for(Integer menuId : allMenuIds) {
            double ratingScore = ratingBasedScores.getOrDefault(menuId, 0.0);
            double orderScore = orderBasedScores.getOrDefault(menuId, 0.0);
            double combinedScore = (ratingScore + orderScore) / 2;
            combineScores.put(menuId, combinedScore);
        }

        return combineScores;
    }

    private Map<Integer, Double> getOrderBasedScore(Integer customerId){


        // Ambil semua pesanan dari semua pelanggan
        List<Orders> allOrders = orderRepository.findAll();
        Map<Integer, Set<Integer>> customerOrderHistory = new HashMap<>();
        
        // Bangun User-Item Matrix berdasarkan pesanan
        for (Orders order : allOrders) {
            int custId = order.getCustomer().getId();
            customerOrderHistory.putIfAbsent(custId, new HashSet<>());
            for (OrderItem item : order.getOrderItems()) {
                customerOrderHistory.get(custId).add(item.getMenu().getId());
            }
        }
        
        // Ambil riwayat pesanan customer target
        Set<Integer> targetOrderHistory = customerOrderHistory.get(customerId);
        if (targetOrderHistory == null || targetOrderHistory.isEmpty()) {
            return new HashMap<>();
        }
        
        // Hitung Pearson Correlation antara customerId dengan customer lain
        Map<Integer, Double> similarityScores = new HashMap<>();
        for (Map.Entry<Integer, Set<Integer>> entry : customerOrderHistory.entrySet()) {
            if (!entry.getKey().equals(customerId)) {
                double similarity = calculateJaccardSimilarity(targetOrderHistory, entry.getValue());
                similarityScores.put(entry.getKey(), similarity);
            }
        }
        
        // Prediksi skor menu berdasarkan pelanggan yang mirip
        Map<Integer, Double> orderBasedScores = new HashMap<>();
        for (Map.Entry<Integer, Double> similarityEntry : similarityScores.entrySet()) {
            int similarCustomerId = similarityEntry.getKey();
            double similarity = similarityEntry.getValue();
            
            Set<Integer> similarCustomerOrders = customerOrderHistory.get(similarCustomerId);
            for (Integer menuId : similarCustomerOrders) {
                if (!targetOrderHistory.contains(menuId)) { // Hanya menu yang belum dipesan customer target
                    orderBasedScores.put(menuId, orderBasedScores.getOrDefault(menuId, 0.0) + similarity);
                }
            }
        }
        
        return orderBasedScores;
    }

    private double calculateJaccardSimilarity(Set<Integer> set1, Set<Integer> set2) {
        Set<Integer> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        
        return (double) intersection.size() / (set1.size() + set2.size() - intersection.size());
    }

    public Map<Integer, Double> getRatingBasedScore(Integer customerId){

                // Get all ratings
                List<Rating> allRatings = ratingRepository.findAll();
                Map<Integer, Map<Integer, Double>> userItemRatings = new HashMap<>();
                
                // Create user-item rating matrix
                for (Rating rating : allRatings) {
                    userItemRatings
                        .computeIfAbsent(rating.getCustomerId(), k -> new HashMap<>())
                        .put(rating.getMenu().getId(), rating.getRating());
                }
                
                // Calculate user similarities
                Map<Integer, Double> userSimilarities = new HashMap<>();
                Map<Integer, Double> targetUserRatings = userItemRatings.get(customerId);
                
                if (targetUserRatings == null || targetUserRatings.isEmpty()) {
                    return new HashMap<>();
                }
                
                for (Map.Entry<Integer, Map<Integer, Double>> entry : userItemRatings.entrySet()) {
                    if (!entry.getKey().equals(customerId)) {
                        double similarity = calculatePearsonCorrelation(targetUserRatings, entry.getValue());
                        userSimilarities.put(entry.getKey(), similarity);
                    }
                }
                
                // Calculate predicted ratings
                Map<Integer, Double> predictedRatings = new HashMap<>();
                Set<Integer> allMenuIds = menuRepository.findAll().stream()
                        .map(Menu::getId)
                        .collect(Collectors.toSet());
                
                for (Integer menuId : allMenuIds) {
                    if (!targetUserRatings.containsKey(menuId)) {
                        double weightedSum = 0.0;
                        double similaritySum = 0.0;
                        
                        for (Map.Entry<Integer, Double> similarUser : userSimilarities.entrySet()) {
                            Map<Integer, Double> similarUserRatings = userItemRatings.get(similarUser.getKey());
                            if (similarUserRatings.containsKey(menuId)) {
                                weightedSum += similarUser.getValue() * similarUserRatings.get(menuId);
                                similaritySum += Math.abs(similarUser.getValue());
                            }
                        }
                        
                        if (similaritySum > 0) {
                            predictedRatings.put(menuId, weightedSum / similaritySum);
                        }
                    }
                }

        return predictedRatings;
    }

    private double calculatePearsonCorrelation(Map<Integer, Double> ratings1, Map<Integer, Double> ratings2) {
        List<Double> vector1 = new ArrayList<>();
        List<Double> vector2 = new ArrayList<>();
        
        // Get common items
        for (Map.Entry<Integer, Double> entry : ratings1.entrySet()) {
            if (ratings2.containsKey(entry.getKey())) {
                vector1.add(entry.getValue());
                vector2.add(ratings2.get(entry.getKey()));
            }
        }
        
        if (vector1.isEmpty()) {
            return 0.0;
        }
        
        double mean1 = vector1.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double mean2 = vector2.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        
        double numerator = 0.0;
        double denominator1 = 0.0;
        double denominator2 = 0.0;
        
        for (int i = 0; i < vector1.size(); i++) {
            double diff1 = vector1.get(i) - mean1;
            double diff2 = vector2.get(i) - mean2;
            numerator += diff1 * diff2;
            denominator1 += diff1 * diff1;
            denominator2 += diff2 * diff2;
        }
        
        if (denominator1 == 0.0 || denominator2 == 0.0) {
            return 0.0;
        }
        
        return numerator / Math.sqrt(denominator1 * denominator2);
    }

}
