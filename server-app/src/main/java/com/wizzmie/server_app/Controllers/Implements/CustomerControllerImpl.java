package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Services.Implements.CustomerServiceImpl;

@RestController
@RequestMapping("api/customer")
public class CustomerControllerImpl {
    private CustomerServiceImpl customerServiceImpl;

    public CustomerControllerImpl(CustomerServiceImpl customerServiceImpl){
        this.customerServiceImpl = customerServiceImpl;
    }

    public ResponseEntity<Customer> create(Customer request){
        try {
            Customer customer = customerServiceImpl.create(request);
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatus());
        }
    }
}
