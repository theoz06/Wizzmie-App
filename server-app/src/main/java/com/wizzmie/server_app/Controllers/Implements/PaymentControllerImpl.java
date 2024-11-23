package com.wizzmie.server_app.Controllers.Implements;

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
import org.springframework.web.bind.annotation.RequestBody;


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

    @PostMapping("callback")
    public ResponseEntity<String> handlePaymentCallback(@RequestBody Map<String, Object> payload){
        
        try {
            if (!payload.containsKey("order_id") || !payload.containsKey("transaction_status")) {
                throw new RuntimeException("Invalid payload: Missing order_id or payment_successfully");
            }

            Integer orderId = Integer.parseInt(payload.get("order_id").toString());
            String transactionStatus = (String) payload.get("transaction_status");

            paymentServiceImpl.HandlePaymentCallback(orderId, transactionStatus);
            return new ResponseEntity<>("Payment callback successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
