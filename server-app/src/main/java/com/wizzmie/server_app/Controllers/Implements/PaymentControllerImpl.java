package com.wizzmie.server_app.Controllers.Implements;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import com.wizzmie.server_app.Services.Implements.PaymentServiceImpl;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("api/payments/")
public class PaymentControllerImpl {

    @Autowired
    private PaymentServiceImpl paymentServiceImpl;


    @PostMapping("generate-token/order/{orderId}")
    public ResponseEntity<String> generateTokenPayment(@PathVariable Integer orderId){

        try {
            String token = paymentServiceImpl.generateSnapToken(orderId);
            return new ResponseEntity<>(token, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("check-status/{orderId}")
    public ResponseEntity<Map<String, Object>> handlePaymentCallback(@PathVariable Integer orderId){
        
        try {
            Map<String, Object> res = paymentServiceImpl.HandlePaymentCallback(orderId);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
          Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status_code", 400);
            errorResponse.put("message", "Bad request: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("order/{orderId}/qris")
    public ResponseEntity<String> generateQRIS(@PathVariable Integer orderId) {
        try {
            String result = paymentServiceImpl.createPayment(orderId);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{orderId}/status")
    public ResponseEntity<Map<String, Object>> handlerPaymentStatus(@PathVariable Integer orderId){
        try {
            Map<String, Object> res = paymentServiceImpl.handlerPaymentStatus(orderId);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    
}
