package com.wizzmie.server_app.Controllers.Implements;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Services.Implements.OrderServiceImpl;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("api/order")
public class OrderController {

    @Autowired
    private OrderServiceImpl orderServiceImpl; 

    @GetMapping
    public ResponseEntity<List<Orders>> getPaidOrders(){
        try {
            List<Orders> orders = orderServiceImpl.getPaidOrders();
            if(orders.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(orders, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatus());
        }
        
    }


    @PostMapping("/customer/create-order")
    public ResponseEntity<String> createOrder(HttpSession session){
        try {
            orderServiceImpl.createOrder(session);
            return ResponseEntity.ok("Order Created!");
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>("Order Failed!", e.getStatus());
        }
    }

    @GetMapping("/active-orders/kitchen")
    public ResponseEntity<List<Orders>> getActiveOrdersKitchen() {
        try{
            List<Orders> orders = orderServiceImpl.getOrdersWithStatusAsPrepared();
            
            if (orders.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }else{
                return new ResponseEntity<>(orders, HttpStatus.OK);
            }
        }catch(ResponseStatusException e){
            return new ResponseEntity<>(e.getStatus());
        }
        
    }

    @GetMapping("/active-orders/pelayan")
    public ResponseEntity<List<Orders>> getActiveOrdersPelayan() {
        try{
            List<Orders> readyOrders = orderServiceImpl.getReadyToServeOrders();
            
            if (readyOrders.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }else{
                return new ResponseEntity<>(readyOrders, HttpStatus.OK);
            }
        }catch(ResponseStatusException e){
            return new ResponseEntity<>(e.getStatus());
        }
        
    }

    @PostMapping("active-orders/update-status/{orderId}")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Integer orderId, @RequestBody Map<String, Integer> requestBody){
        try {
            Integer changedBy = requestBody.get("changedBy");
            if(changedBy == null){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing 'updatedByUserId' in request body");
            }

            String res = orderServiceImpl.updateOrderStatus(orderId, changedBy);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getMessage(), e.getStatus());
        }
    }
    

}
