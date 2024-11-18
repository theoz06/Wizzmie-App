package com.wizzmie.server_app.Services.Implements;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Repository.CustomerRepository;

@Service
public class CustomerServiceImpl {
    
    private CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    public Customer create(Customer request){
        
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());

        Optional<Customer> customerSaved = customerRepository.findByPhone(request.getPhone());

        if(customerSaved.isPresent()){
            return customerSaved.get();
        }

        customerRepository.save(customer);
        return customer;
    }
}
