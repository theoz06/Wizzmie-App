package com.wizzmie.server_app.Services.Implements;

import java.util.stream.Collectors;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Respon.OrderHistoryResponse;
import com.wizzmie.server_app.DTO.Respon.UserDto;
import com.wizzmie.server_app.Entity.OrderHistory;
import com.wizzmie.server_app.Entity.User;
import com.wizzmie.server_app.Repository.OrderHistoryRepository;
import com.wizzmie.server_app.Repository.UserRepository;

@Service
public class OrderHistoryServiceImpl {
    
    @Autowired
    private OrderHistoryRepository orderHistoryRepository;
    @Autowired
    private UserRepository userRepository;


    public List<OrderHistoryResponse> getOrderHistory(){
       List<OrderHistory> orderHistories = orderHistoryRepository.findAll();

       return orderHistories.stream().filter(orderHistory ->  orderHistory.getUpdatedStatusId() == 4).map(orderHistory -> {
        User user = userRepository.findById(orderHistory.getUser().getId()).orElseThrow(()-> new RuntimeException("User Not Found"));
        
        UserDto updatedBy = new UserDto(
            user.getId(),
            user.getName()
        );

        return new OrderHistoryResponse(
            orderHistory.getOrder().getId(),
            orderHistory.getOrder().getCustomer().getName(),
            orderHistory.getOrder().getTableNumber(),
            orderHistory.getOrder().getTotalAmount(),
            updatedBy
        );
       }).collect(Collectors.toList());
    }


}
