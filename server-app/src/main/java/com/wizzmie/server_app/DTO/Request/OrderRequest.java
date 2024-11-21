package com.wizzmie.server_app.DTO.Request;


import lombok.Data;


@Data
public class OrderRequest {

    private Integer tableNumber;
    private Double totalAmount;
    private Integer orderStatusId;
    private Integer customerId;

    public OrderRequest(Integer tableNumber, Double totalAmount, Integer orderStatusId, Integer customerId) {
        this.tableNumber = tableNumber;
        this.totalAmount = totalAmount;
        this.orderStatusId = orderStatusId;
        this.customerId = customerId;
    }


    public OrderRequest() {
    }
    

}
