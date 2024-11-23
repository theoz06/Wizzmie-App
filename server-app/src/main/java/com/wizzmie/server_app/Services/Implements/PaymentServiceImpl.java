package com.wizzmie.server_app.Services.Implements;

import com.midtrans.httpclient.SnapApi;
import com.midtrans.httpclient.error.MidtransError;
import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Entity.Status;
import com.wizzmie.server_app.Repository.OrderItemRepository;
import com.wizzmie.server_app.Repository.OrderRepository;
import com.wizzmie.server_app.Repository.StatusRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service    
public class PaymentServiceImpl {
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;


    private String paymentType = "";
    private List<String> listedPayment;

    //Generate Snap Token
    public String generateSnapToken(Integer orderId){
        Orders order = orderRepository.findById(orderId)
                       .orElseThrow(()-> new RuntimeException("Order Not Found"));
        
        try {
            //Generate UUID untuk order
            String uniqueOrderId = UUID.randomUUID().toString();

            Map<String, Object> transactionDetails = new HashMap<>();

            transactionDetails.put("order_id", uniqueOrderId);
            transactionDetails.put("gross_amount", order.getTotalAmount());

            Map<String, Object> customerDetails = new HashMap<>();
            customerDetails.put("name", order.getCustomer().getName());
            customerDetails.put("phone", order.getCustomer().getPhone());

            Map<String, Object> body = new HashMap<>();
            body.put("transaction_details", transactionDetails);
            body.put("customer_details", customerDetails);

            if (!paymentType.isEmpty()) {
                body.put("payment_type", paymentType);
            }
            if (listedPayment != null) {
                body.put("enabled_payments", listedPayment);
            }
    

            return SnapApi.createTransactionToken(body);
        } catch (MidtransError e) {
            throw new RuntimeException("Midtrans error :" + e.getMessage());
        }

    }

    @Transactional
    public void HandlePaymentCallback(Integer orderId, String transactionStatus){
        Orders order = orderRepository.findById(orderId)
                       .orElseThrow(()-> new RuntimeException("Order Not Found!"));

        switch (transactionStatus) {
            case "settlement":
                order.setPaid(true);
                Status updateStatusOrder = statusRepository.findById(2)
                                           .orElseThrow(() -> new RuntimeException("Status not found"));
                order.setOrderStatus(updateStatusOrder);
    
                orderRepository.save(order);
                break;
            case "pending":
                // Pembayaran masih pending
                order.setPaid(false);
                order.setOrderStatus(statusRepository.findById(1)
                    .orElseThrow(() -> new RuntimeException("Status not found")));
                break;
    
            case "cancel":
            case "deny":
            case "expire":
                // Pembayaran gagal atau dibatalkan
                orderItemRepository.deleteByOrderId(order.getId());
                orderRepository.delete(order);
                break;
            default:
                throw new RuntimeException("Unknown transaction status: " + transactionStatus);
        }
    }

}
