package com.wizzmie.server_app.Services.Implements;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Repository.CustomerRepository;
import com.wizzmie.server_app.Repository.UserRepository;

@Service
public class CustomerServiceImpl {
    
    private CustomerRepository customerRepository;

    private UserRepository userRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, UserRepository userRepository){
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Customer getOrCreateCustomer(Customer request){
        Integer generatedId = generateCustId();
        Optional<Customer> customerSaved = customerRepository.findByPhone(request.getPhone());

        if(customerSaved.isPresent()){
            Customer updateCustomer = customerSaved.get();
            updateCustomer.setName(request.getName());
            return updateCustomer;
        }

        Customer customer = new Customer();
        customer.setId(generatedId);
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        
        customerRepository.save(customer);
        return customer;
    }

    private Integer generateCustId(){
        Integer id;
        do{
            id = (int) ((Math.random() * 99));
        }while(userRepository.findById(id).equals(id) && customerRepository.findById(id).equals(id));
        return id;
    }
}
