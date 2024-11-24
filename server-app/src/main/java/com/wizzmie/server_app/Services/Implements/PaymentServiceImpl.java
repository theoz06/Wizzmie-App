package com.wizzmie.server_app.Services.Implements;

import com.midtrans.httpclient.TransactionApi;
import com.midtrans.httpclient.CoreApi;
import com.midtrans.httpclient.SnapApi;
import com.midtrans.httpclient.error.MidtransError;
import com.mysql.cj.util.Base64Decoder;
import com.wizzmie.server_app.Config.MidtransConfig;
import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Entity.Status;
import com.wizzmie.server_app.Repository.OrderItemRepository;
import com.wizzmie.server_app.Repository.OrderRepository;
import com.wizzmie.server_app.Repository.StatusRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.net.URL;

import javax.transaction.Transactional;

import org.json.JSONObject;
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

    @Autowired
    private MidtransConfig midtransConfig;




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
    
    //Tanpa Midtrans Java SDK
    @Transactional
    public void HandlePaymentCallback(Integer orderId){

        try {
            Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));
        
            String auth = Base64.getEncoder().encodeToString((midtransConfig.getServerKey() + ":").getBytes());
    
            //connet to Htpp
            HttpURLConnection conn = (HttpURLConnection) new URL(midtransConfig.getStatusUrl()+ orderId + "/status").openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Basic " + auth);
            conn.setRequestProperty("Accept", "application/json");
    
            //Read Respon
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String inputLine;
    
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
                
            
            }
            
            JSONObject jsonResponse = new JSONObject(response.toString());
            String transactionStatus = jsonResponse.getString("transaction_status");
    
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
                    throw new RuntimeException("Unknown transaction status: ");
            }
            in.close();
        }catch (Exception e){
            System.err.println("Error: " + e.getMessage());
        }


    }

    public JSONObject createPayment (Integer orderId){
        try {
            Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));

            Map<String, Object> chargeParams = new HashMap<>();

            //Transaction
            Map<String, Object> transactionDetails = new HashMap<>();
            transactionDetails.put("order_id", order.getId().toString());
            transactionDetails.put("gross_amount", order.getTotalAmount().toString());
            chargeParams.put("transaction_details", transactionDetails);

            //Customer Details
            Map<String, Object> customerDetails = new HashMap<>();
            customerDetails.put("first_name", order.getCustomer().getName().toString());
            customerDetails.put("phone", order.getCustomer().getPhone().toString());
            chargeParams.put("customer_details", customerDetails);

            chargeParams.put("transaction_details", transactionDetails);
            chargeParams.put("customer_details", customerDetails);
            chargeParams.put("payment_type", "qris");

            JSONObject result = CoreApi.chargeTransaction(chargeParams); 
            return result;

        } catch (MidtransError e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage(), e.getCause());
        }
    }

    public void handlerPaymentStatus(Integer orderId){
        try{
            Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));

            JSONObject response = TransactionApi.checkTransaction(orderId.toString());

            switch (response.toString()) {
                case "settlement":
                    order.setPaid(true);
                    Status updateStatusOrder = statusRepository.findById(2)
                                               .orElseThrow(() -> new RuntimeException("Status not found"));
                    order.setOrderStatus(updateStatusOrder);
        
                    orderRepository.save(order);
                    break;
                case "pending":
                    // Pembayaran masih pending
                    throw new RuntimeException("Pending");
        
                case "cancel":
                case "deny":
                case "expire":
                    // Pembayaran gagal atau dibatalkan
                    orderItemRepository.deleteByOrderId(order.getId());
                    orderRepository.delete(order);
                    break;
                default:
                    throw new RuntimeException("Unknown transaction status: ");
            }
        }catch(MidtransError e){
            e.printStackTrace();
        }
    }

}
