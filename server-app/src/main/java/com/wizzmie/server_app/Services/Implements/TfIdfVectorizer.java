package com.wizzmie.server_app.Services.Implements;

import java.util.*;
import java.util.stream.Collectors;

public class TfIdfVectorizer {
    
    public double calculateSimilarity(String target, List<String> orderedMenuNames, List<String> allMenuNames) {
        List<String> allTexts = new ArrayList<>(orderedMenuNames);
        allTexts.add(target);

        Map<String, Double> targetTfIdf = computeTfIdf(target, allTexts);
        double maxSimilarity = 0.0;

        for (String orderedMenu : orderedMenuNames) {
            Map<String, Double> orderedTfIdf = computeTfIdf(orderedMenu, allTexts);
            double similarity = cosineSimilarity(targetTfIdf, orderedTfIdf);
            maxSimilarity = Math.max(maxSimilarity, similarity);
        }

        return maxSimilarity;
    }

    private Map<String, Double> computeTfIdf(String text, List<String> allTexts) {
        Map<String, Integer> termFrequency = new HashMap<>();
        String[] words = text.toLowerCase().split("\\s+");

        for (String word : words) {
            termFrequency.put(word, termFrequency.getOrDefault(word, 0) + 1);
        }

        Map<String, Double> tfIdf = new HashMap<>();
        for (String word : termFrequency.keySet()) {
            double tf = termFrequency.get(word) / (double) words.length;
            double idf = computeIdf(word, allTexts);
            tfIdf.put(word, tf * idf);
        }

        return tfIdf;
    }

    private double computeIdf(String term, List<String> allTexts) {
        long docCount = allTexts.stream().filter(text -> text.toLowerCase().contains(term)).count();
        return Math.log(1 + (double) allTexts.size() / (1 + docCount));
    }

    private double cosineSimilarity(Map<String, Double> vec1, Map<String, Double> vec2) {
        Set<String> allKeys = new HashSet<>(vec1.keySet());
        allKeys.addAll(vec2.keySet());

        double dotProduct = 0.0, normVec1 = 0.0, normVec2 = 0.0;

        for (String key : allKeys) {
            double v1 = vec1.getOrDefault(key, 0.0);
            double v2 = vec2.getOrDefault(key, 0.0);
            dotProduct += v1 * v2;
            normVec1 += v1 * v1;
            normVec2 += v2 * v2;
        }

        return (normVec1 == 0 || normVec2 == 0) ? 0 : dotProduct / (Math.sqrt(normVec1) * Math.sqrt(normVec2));
    }
}
