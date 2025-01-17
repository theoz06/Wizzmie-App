package com.wizzmie.server_app.Services.Implements;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.OrderItem;
import com.wizzmie.server_app.Entity.Rating;
import com.wizzmie.server_app.Repository.OrderItemRepository;
import com.wizzmie.server_app.Repository.RatingRepository;

@Service
@Transactional
public class RatingServiceImpl {

    private final RatingRepository ratingRepository;
    private final OrderItemRepository orderItemRepository;

    private static final int PURCHASE_THRESHOLD = 10;
    private static final double MAX_RATING = 5.0;

    public RatingServiceImpl (RatingRepository ratingRepository, OrderItemRepository orderItemRepository){
        this.orderItemRepository = orderItemRepository;
        this.ratingRepository = ratingRepository;
    }

    public void updateCustomerRating (Integer customerId) {
        List<OrderItem> orderItems = orderItemRepository.findByCustomerId(customerId);
        Map<Menu, Integer> totalQtyPerMenu = new HashMap<>();

        // Hitung total quantity per menu dari order yang sudah dibayar
        for (OrderItem item : orderItems) {
            if (item.getOrder().getPaid()) {
                totalQtyPerMenu.merge(
                    item.getMenu(),
                    item.getQuantity(),
                    Integer::sum
                );
            }
        }

        for (Map.Entry<Menu, Integer> entry : totalQtyPerMenu.entrySet()) {
            Menu menu = entry.getKey();
            int totalQuantity = entry.getValue();
            double rating = calculateRating(totalQuantity);
            
            Rating ratingEntity = ratingRepository
                .findByCustomerIdAndMenu(customerId, menu)
                .orElse(new Rating());
                
            ratingEntity.setCustomerId(customerId);
            ratingEntity.setMenu(menu);
            ratingEntity.setRating(rating);
            ratingEntity.setTotalQuantity(totalQuantity);
            ratingEntity.setLastCalculated(LocalDateTime.now());
            
            ratingRepository.save(ratingEntity);
        }
    }

    private double calculateRating(int totalQuantity) {
        if (totalQuantity >= PURCHASE_THRESHOLD) {
            return MAX_RATING;
        }
        return (double) totalQuantity / PURCHASE_THRESHOLD * MAX_RATING;
    }

}
