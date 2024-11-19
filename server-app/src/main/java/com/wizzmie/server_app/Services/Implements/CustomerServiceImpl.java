package com.wizzmie.server_app.Services.Implements;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Repository.CustomerRepository;

@Service
public class CustomerServiceImpl {
    
    private CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Customer getOrCreateCustomer(Customer request){

        Optional<Customer> customerSaved = customerRepository.findByPhone(request.getPhone());

        if(customerSaved.isPresent()){
            Customer updateCustomer = customerSaved.get();
            updateCustomer.setName(request.getName());
            return updateCustomer;
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        
        customerRepository.save(customer);
        return customer;
    }
}
