package com.wizzmie.server_app.Services.Implements;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Rating;
import com.wizzmie.server_app.Repository.RatingRepository;

@Service
public class MAECalculator {

    @Autowired
    private RatingRepository ratingRepository;
    
    public double calculateContentBasedMAE(Integer customerId, Map<Integer, Double> contentBasedScores){
        double contentMAE = calculateMAE(customerId, contentBasedScores);
        return contentMAE;
    }

    public double calculateCollaborativeBasedMAE(Integer customerId, Map<Integer, Double> collaborativeScores){
        double collabMAE = calculateMAE(customerId, collaborativeScores);
        return collabMAE;
    }

    public double calculateHybridBasedMAE(Integer customerId, Map<Integer, Double> hybridScores){
        double hybridMAE = calculateMAE(customerId, hybridScores);
        return hybridMAE;
    }

    private double calculateMAE(Integer customerId, Map<Integer, Double> predictedScores){
        List<Rating> actualRatings = ratingRepository.findByCustomerId(customerId);
        System.out.println("Actual ratings: " + actualRatings);
        System.out.println("Predicted scores: " + predictedScores);
        
        if(actualRatings.isEmpty()){
            return 0.0;
        }
        
        double totalError = 0.0;
        int count = 0;
        
        for (Rating rating : actualRatings){
            Integer menuId = rating.getMenu().getId();
            if(predictedScores.containsKey(menuId)){
                // predicted sudah dalam range 0-1, kali 5 untuk mendapat skala 0-5
                double predicted = predictedScores.get(menuId) * 5.0;
                // actual dalam skala 0-5, tidak perlu dibagi
                double actual = rating.getRating();
                
                System.out.println("Menu " + menuId + 
                    ": predicted=" + predicted + 
                    ", actual=" + actual);
                    
                totalError += Math.abs(predicted - actual);
                count++;
            }
        }
        
        return count > 0 ? totalError / count : 0.0;
    }

}
