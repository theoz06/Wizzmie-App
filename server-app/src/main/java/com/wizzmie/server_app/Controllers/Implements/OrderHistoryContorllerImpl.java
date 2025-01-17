package com.wizzmie.server_app.Controllers.Implements;

import java.util.List;
import java.util.ArrayList;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.DTO.Respon.OrderHistoryResponse;


import com.wizzmie.server_app.Services.Implements.OrderHistoryServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;



@Controller
@RequestMapping("api/order")
public class OrderHistoryContorllerImpl {
    
    @Autowired
    private OrderHistoryServiceImpl orderHistoryServiceImpl;

    @GetMapping("/history")    
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistory (){
        try {
            List<OrderHistoryResponse> orderHistory = orderHistoryServiceImpl.getOrderHistory();
            return new ResponseEntity<>(orderHistory, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(new ArrayList<>(), e.getStatus());
        }
    }

}
