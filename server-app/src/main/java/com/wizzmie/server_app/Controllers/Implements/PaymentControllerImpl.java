package com.wizzmie.server_app.Controllers.Implements;


import java.util.Map;

import org.json.JSONObject;
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
    public ResponseEntity<String> handlePaymentCallback(@PathVariable Integer orderId){
        
        try {
            paymentServiceImpl.HandlePaymentCallback(orderId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("order/{orderId}/qris")
    public ResponseEntity<JSONObject> generateQRIS(@PathVariable Integer orderId) {
        try {
            JSONObject result = paymentServiceImpl.createPayment(orderId);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{transactionId}/status")
    public ResponseEntity<String> handlerPaymentStatus(@PathVariable Integer orderId){
        try {
            paymentServiceImpl.handlerPaymentStatus(orderId);
            return new ResponseEntity<>("Payment callback successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    

}
