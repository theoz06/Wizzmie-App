package com.wizzmie.server_app.Services.Implements;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Respon.MenuRecommendationResponse;
import com.wizzmie.server_app.Entity.Category;
import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Entity.Rating;
import com.wizzmie.server_app.Repository.CustomerRepository;
import com.wizzmie.server_app.Repository.MenuRepository;
import com.wizzmie.server_app.Repository.OrderRepository;
import com.wizzmie.server_app.Repository.RatingRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;

@Service
public class HybridRecommendationService {

    private final MenuRepository menuRepository;
    private final OrderRepository orderRepository;
    private final RatingRepository ratingRepository;
    private final CustomerRepository customerRepository;

    public HybridRecommendationService( MenuRepository menuRepository, 
                                        OrderRepository orderRepository, 
                                        RatingRepository ratingRepository, 
                                        CustomerRepository customerRepository) {
        this.menuRepository = menuRepository;
        this.orderRepository = orderRepository;
        this.ratingRepository = ratingRepository;
        this.customerRepository = customerRepository;
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
        return hybridScores.entrySet().stream()
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
        
    private Map<Integer, Double> getCollaborativeFilteringScores(Integer customerId) {
        // Get customer's preferred category
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Category preferredCategory = customer.getCategory();
        
        // Get customer's order history
        List<Orders> customerOrders = orderRepository.findByCustomerId(customerId);
        Set<Integer> orderedMenuIds = customerOrders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .map(item -> item.getMenu().getId())
                .collect(Collectors.toSet());
        
        // Calculate content-based scores
        Map<Integer, Double> contentScores = new HashMap<>();
        List<Menu> allMenus = menuRepository.findAll();
        
        for (Menu menu : allMenus) {
            if (!orderedMenuIds.contains(menu.getId())) {
                double categoryScore = (preferredCategory != null && 
                    menu.getCategory().getId().equals(preferredCategory.getId())) ? 1.0 : 0.0;
                
                double priceScore = calculatePriceSimilarity(menu, orderedMenuIds);
                
                contentScores.put(menu.getId(), (categoryScore + priceScore) / 2);
            }
        }
        
        return contentScores;
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
    
}
