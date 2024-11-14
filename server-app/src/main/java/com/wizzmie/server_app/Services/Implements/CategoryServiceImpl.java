package com.wizzmie.server_app.Services.Implements;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.Entity.Category;
import com.wizzmie.server_app.Repository.CategoryRepository;
import com.wizzmie.server_app.Services.GenericService;



@Service
public class CategoryServiceImpl implements GenericService<Category, Integer>  {
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category create(Category entity) {
        Optional<Category> categories = categoryRepository.findByDescription(entity.getDescription());
        
        if (categories.isPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category Already Exist!");
        }

        return categoryRepository.save(entity);
    }

    @Override
    public Category update(Integer id, Category entity) {
        Category SavedCategory = categoryRepository.findById(id)
                                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category is doesn't Exist!"));

        SavedCategory.setDescription(entity.getDescription());
        return categoryRepository.save(entity);
    }

    @Override
    public String delete(Integer id) {
        Category SavedCategory = categoryRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Category is doesn't exist!"));
        categoryRepository.delete(SavedCategory);
        return ("Category Deleted!");
    }

}
