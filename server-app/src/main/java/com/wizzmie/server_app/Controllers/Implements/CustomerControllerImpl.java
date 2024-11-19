package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Services.Implements.CustomerServiceImpl;

@RestController
@RequestMapping("api/public/customer")
public class CustomerControllerImpl {
    private CustomerServiceImpl customerServiceImpl;

    public CustomerControllerImpl(CustomerServiceImpl customerServiceImpl){
        this.customerServiceImpl = customerServiceImpl;
    }

    @PostMapping
    public ResponseEntity<Customer> getOrCreateCustomer(@RequestBody Customer request){
        try {
            Customer customer = customerServiceImpl.getOrCreateCustomer(request);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatus());
        }
    }
}

