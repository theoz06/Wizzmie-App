package com.wizzmie.server_app.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Respon.OrderHistoryResponse;
import com.wizzmie.server_app.Entity.OrderHistory;
import com.wizzmie.server_app.Repository.OrderHistoryRepository;

@Service
public class OrderHistoryServiceImpl {
    
    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    public List<OrderHistory> getOrderHistory(){
       return orderHistoryRepository.findAll();
       
    }


}
