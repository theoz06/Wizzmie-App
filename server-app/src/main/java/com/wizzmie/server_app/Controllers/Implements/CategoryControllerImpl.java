package com.wizzmie.server_app.Controllers.Implements;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.Controllers.GenericController;
import com.wizzmie.server_app.Entity.Category;
import com.wizzmie.server_app.Services.Implements.CategoryServiceImpl;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("api/category")
public class CategoryControllerImpl implements GenericController<Category, Integer> {
    
    private CategoryServiceImpl categoryServiceImpl;
    
    @Override
    @GetMapping("/public")
    public ResponseEntity<List<Category>> getAll() {
        List<Category> categories = categoryServiceImpl.getAll();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @Override
    @PostMapping("/admin/create")
    public ResponseEntity<Category> create(@RequestBody Category entity) {
            categoryServiceImpl.create(entity);
            return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Override
    @PutMapping("/admin/update/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody Category entity) {
        try {
            categoryServiceImpl.update(id, entity);
            return new ResponseEntity<>("Category is Updated!", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    @Override
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
           String status =  categoryServiceImpl.delete(id);
            return ResponseEntity.status(HttpStatus.OK).body(status);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }
    
}
