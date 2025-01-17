package com.wizzmie.server_app.Services.Implements;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Request.CustomerDTO;
import com.wizzmie.server_app.Entity.Category;
import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Repository.CategoryRepository;
import com.wizzmie.server_app.Repository.CustomerRepository;
import com.wizzmie.server_app.Services.EnumRole;

@Service
public class CustomerServiceImpl {
    
    private CustomerRepository customerRepository;
    private CategoryRepository categoryRepository;



    public CustomerServiceImpl(CustomerRepository customerRepository, CategoryRepository categoryRepository){
        this.customerRepository = customerRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Customer getOrCreateCustomer(CustomerDTO request){
        
        Optional<Customer> customerSaved = customerRepository.findByPhone(request.getPhone());

        if(customerSaved.isPresent()){
            Customer updateCustomer = customerSaved.get();
            updateCustomer.setName(request.getName());
            
            Optional<Category> categoryOptional = categoryRepository.findById(request.getCategoryId());
            Category category = categoryOptional.orElseThrow(() -> new RuntimeException("Category not found"));
            updateCustomer.setCategory(category);
            return updateCustomer;
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());

        Optional<Category> categoryOptional = categoryRepository.findById(request.getCategoryId());
        Category category = categoryOptional.orElseThrow(() -> new RuntimeException("Category not found"));
        customer.setCategory(category);

        customer.setRole(EnumRole.CUSTOMER);
        customerRepository.save(customer);
        return customer;
    }
}
