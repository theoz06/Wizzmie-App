package com.wizzmie.server_app.Services.Implements;

import com.midtrans.httpclient.TransactionApi;
import com.midtrans.httpclient.CoreApi;
import com.midtrans.httpclient.SnapApi;
import com.midtrans.httpclient.error.MidtransError;
import com.wizzmie.server_app.Config.MidtransConfig;
import com.wizzmie.server_app.DTO.Request.MailRequest;
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

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private RatingServiceImpl ratingServiceImpl;

    @Autowired
    private MailServiceImpl mailServiceImpl;


    private String paymentType = "";
    private List<String> listedPayment;                                      

    //Generate Snap Token
    //Not Use
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
    public Map<String, Object> HandlePaymentCallback(Integer orderId){

        Map<String, Object> response = new HashMap<>();
        
        try {
            // Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));
        
            String auth = Base64.getEncoder().encodeToString((midtransConfig.getServerKey() + ":").getBytes());
    
            //connet to Htpp
            HttpURLConnection conn = (HttpURLConnection) new URL(midtransConfig.getStatusUrl()+ orderId + "/status").openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", ("Basic " + auth));
            conn.setRequestProperty("Accept", "application/json");
    
            //Read Respon
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder jsonResponse = new StringBuilder();
            String inputLine;
    
            while ((inputLine = in.readLine()) != null) {
                jsonResponse.append(inputLine);   
            }

            if (jsonResponse.length() == 0) {
                throw new RuntimeException("Empty response from payment gateway");
            }
            
            JSONObject json = new JSONObject(jsonResponse.toString());
            

            if (!json.has("transaction_status")){
                throw new RuntimeException("Transaction status not found");
            }

            String transactionStatus = json.getString("transaction_status");
    
            switch (transactionStatus) {
                case "settlement":
                    handlerSuccsesPayment(orderId);
                    response.put("status_code", 200);
                    response.put("transaction_status", transactionStatus);
                    response.put("message", "payment successfully");
                    break;
                case "pending":
                    response.put("status_code", 200);
                    response.put("transaction_status", transactionStatus);
                    response.put("message", "payment on proccess");
                    break;
        
                case "cancel":
                case "deny":
                case "expire":
                    handlerFailedPayment(orderId);
                    response.put("status_code", 200);
                    response.put("transaction_status", transactionStatus);
                    response.put("message", "payment failed!");
                    break;
                default:
                    throw new RuntimeException("Unknown transaction status: ");
            }
            
            response.put("empty", false);
        }catch (Exception e){
            System.err.println("Error: " + e.getMessage());
            response.put("error_message", e.getMessage());
            response.put("empty", false); 
        }
        
        return response;

    }

    public String createPayment (Integer orderId){
        try {
            Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));

            Map<String, Object> chargeParams = new HashMap<>();

            //Transaction
            Map<String, Object> transactionDetails = new HashMap<>();
            transactionDetails.put("order_id", order.getId().toString());
            transactionDetails.put("gross_amount", order.getTotalAmount().intValue());
            

            //Customer Details
            Map<String, Object> customerDetails = new HashMap<>();
            customerDetails.put("first_name", order.getCustomer().getName().toString());
            customerDetails.put("phone", order.getCustomer().getPhone().toString());
     

            chargeParams.put("transaction_details", transactionDetails);
            chargeParams.put("customer_details", customerDetails);
            chargeParams.put("payment_type", "qris");

            System.out.println("Request to Midtrans: " + new JSONObject(chargeParams).toString());

            JSONObject result = CoreApi.chargeTransaction(chargeParams);
            JSONObject jsonResult = new JSONObject(result.toString());

            JSONArray actionArray = jsonResult.getJSONArray("actions");
            
            String url = null;

            for (int i = 0; i < actionArray.length(); i++){
                JSONObject action = actionArray.getJSONObject(i);
                if (action.getString("name").equals("generate-qr-code")){
                    url = action.getString("url");
                    break;
                }
            }

            if(url !=null){
                mailServiceImpl.sendMail( null, url);
                return url;
            }
            return ("QRIS URL not found");

        } catch (MidtransError e) {
            System.err.println("Midtrans Error Details:");
            System.err.println("Message: " + e.getMessage());
            System.err.println("Status Code: " + e.getStatusCode());
            System.err.println("Response Body: " + e.getResponseBody());
            e.printStackTrace();
            throw new RuntimeException(e.getMessage(), e.getCause());
        }
    }

    //Check Transaction status using Midtrans CoreApi
    public Map<String, Object> handlerPaymentStatus(Integer orderId){
        Map<String, Object> response = new HashMap<>();
        try {
            // Panggil API transaksi dari Midtrans
            JSONObject midtransResponse = TransactionApi.checkTransaction(orderId.toString());
    
            // Ambil status transaksi
            String transactionStatus = midtransResponse.getString("transaction_status");
    
            // Logika berdasarkan status transaksi
            switch (transactionStatus) {
                case "settlement":
                    handlerSuccsesPayment(orderId); // Tangani pembayaran berhasil
                    response.put("status_code", 200);
                    response.put("transaction_status", transactionStatus);
                    response.put("message", "Payment successful.");
                    break;
    
                case "pending":
                    response.put("status_code", 200);
                    response.put("transaction_status", transactionStatus);
                    response.put("message", "Payment is in process.");
                    break;
    
                case "cancel":
                case "deny":
                case "expire":
                    handlerFailedPayment(orderId); // Tangani pembayaran gagal
                    response.put("status_code", 200);
                    response.put("transaction_status", transactionStatus);
                    response.put("message", "Payment failed!");
                    break;
    
                default:
                    throw new RuntimeException("Unknown transaction status: " + transactionStatus);
            }
        } catch (MidtransError e) {
            
            e.printStackTrace();
            response.put("status_code", 500);
            response.put("transaction_status", "error");
            response.put("message", "Error occurred: " + e.getMessage());
        } 
        return response; 
    }


    private void handlerSuccsesPayment(Integer orderId){
        Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));

        if (order.getOrderStatus().getId().equals(1)){
            order.setPaid(true);
                    Status updateStatusOrder = statusRepository.findById(2)
                                               .orElseThrow(() -> new RuntimeException("Status not found"));
        order.setOrderStatus(updateStatusOrder);
        
        orderRepository.save(order);

        ratingServiceImpl.updateCustomerRating(order.getCustomer().getId());

        System.out.println("Sending WebSocket messages for order: " + orderId);
        try {
            messagingTemplate.convertAndSend("/admin/active-orders", order);
            messagingTemplate.convertAndSend("/kitchen/prepared-orders", order);
            System.out.println("WebSocket messages sent successfully");
        } catch (Exception e) {
            System.err.println("Error sending WebSocket messages: " + e.getMessage());
            e.printStackTrace();
        }
        }
    }

    private void handlerFailedPayment(Integer orderId){
        Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));
        orderItemRepository.deleteByOrderId(order.getId());
        orderRepository.delete(order);
    }
}
