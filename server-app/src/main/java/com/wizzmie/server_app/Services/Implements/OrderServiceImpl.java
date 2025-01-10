package com.wizzmie.server_app.Services.Implements;

import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.DTO.Respon.UserResponse;
import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.OrderHistory;
import com.wizzmie.server_app.Entity.OrderItem;
import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Entity.Status;
import com.wizzmie.server_app.Entity.User;
import com.wizzmie.server_app.Entity.Helper.Cart;
import com.wizzmie.server_app.Entity.Helper.CartItem;
import com.wizzmie.server_app.Repository.CustomerRepository;
import com.wizzmie.server_app.Repository.MenuRepository;
import com.wizzmie.server_app.Repository.OrderHistoryRepository;
import com.wizzmie.server_app.Repository.OrderItemRepository;
import com.wizzmie.server_app.Repository.OrderRepository;
import com.wizzmie.server_app.Repository.StatusRepository;
import com.wizzmie.server_app.Repository.UserRepository;

@Service
public class OrderServiceImpl {
    
    private OrderRepository orderRepository;
    private OrderItemRepository orderItemRepository;
    private StatusRepository statusRepository;
    private CustomerRepository customerRepository;
    private MenuRepository menuRepository;
    private SimpMessagingTemplate messagingTemplate;
    private OrderHistoryRepository orderHistoryRepository;
    private UserRepository userRepository;





    public OrderServiceImpl(OrderRepository orderRepository, 
                            MenuRepository menuRepository,
                            OrderItemRepository orderItemRepository, 
                            StatusRepository statusRepository, 
                            CustomerRepository customerRepository,
                            SimpMessagingTemplate messagingTemplate,
                            OrderHistoryRepository orderHistoryRepository,
                            UserRepository userRepository
                            ){

        this.menuRepository = menuRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.statusRepository = statusRepository;
        this.customerRepository = customerRepository;
        this.messagingTemplate = messagingTemplate;
        this.orderHistoryRepository = orderHistoryRepository;
        this.userRepository = userRepository;
    }


    public Orders createOrder(HttpSession session, Integer tableNumber, Integer customerId){
        if (tableNumber == null || customerId == null) {
            throw new RuntimeException("Table number and customer ID are required.");
        }

        String sessionKey = String.format("CART_%d_%d", tableNumber, customerId);

        Cart cart = (Cart) session.getAttribute(sessionKey);
        if (cart == null || cart.getCartItems().isEmpty()){
            throw new RuntimeException("Cart is Empty");
        }

        Orders order = new Orders();

        Customer customer = customerRepository.findById(cart.getCustomerId()).orElseThrow(()-> new RuntimeException("Customer Not Found"));
        order.setCustomer(customer);
        order.setTableNumber(cart.getTableNumber());
        order.setTotalAmount(cart.getTotalAmount());

        Status status = statusRepository.findById(1).orElseThrow(()-> new RuntimeException("Status Not Found"));
        order.setOrderStatus(status);
        order.setPaid(false);
        order.setOrderDate(LocalDateTime.now());

        orderRepository.save(order);

        for (CartItem item : cart.getCartItems()){
            OrderItem orderItem = new OrderItem();

            Menu menu = menuRepository.findById(item.getMenuId()).orElseThrow(()-> new RuntimeException("Menu Not Found"));
            orderItem.setMenu(menu);
            orderItem.setPrice(menu.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setOrder(order);

            orderItemRepository.save(orderItem);
        }

        session.removeAttribute(sessionKey);

        return order;
    }

    public List<Orders> getPaidOrders(){
        List<Orders> orders = orderRepository.findByStatusPaid(true);
       return orders;
    }

    public List<Orders> getOrdersWithStatusAsPrepared(){
        List<Orders> orders = orderRepository.findByOrderStatusId(2);
        return orders;
    }

    public List<Orders> getReadyToServeOrders(){
        List<Orders> orders = orderRepository.findByOrderStatusId(3);
        return orders;
    }

    public String updateOrderStatus(Integer orderId, Integer changedBy){
        
        Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));

        User user = userRepository.findById(changedBy).orElseThrow(() -> new RuntimeException("User Not Found"));

        Status currentStatus = order.getOrderStatus();
        if (currentStatus == null || currentStatus.getId() == null) {
            throw new IllegalArgumentException("Current status or status ID is null for order ID: " + orderId);
        }

        Integer previousStatusId = currentStatus.getId();

        switch (currentStatus.getId()) {
            case 2:
                updateStatus(order, 3);
                messagingTemplate.convertAndSend("/pelayan/ready-orders", order);

                break;
            case 3:
                updateStatus(order, 4);
                messagingTemplate.convertAndSend("/admin/active-orders", order);

                break;
        
            default:
                throw new IllegalArgumentException(
                    "Invalid status transition for order ID: " + orderId
            );
        }

        savedOrderHistory(order, previousStatusId, order.getOrderStatus().getId(), user);

        return "Order Status Updated to: " + order.getOrderStatus().getDescription();
    
    }

    private void updateStatus(Orders order, Integer newStatusId){
       
        Status newStatus = statusRepository.findById(newStatusId).orElseThrow(()-> new RuntimeException("Status Not Found"));
        order.setOrderStatus(newStatus);
        orderRepository.save(order);
    }

    private void savedOrderHistory(Orders order, Integer previousStatus, Integer updatedStatus, User user){
        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setPreviousStatusId(previousStatus);
        history.setUpdatedStatusId(updatedStatus);
        history.setUser(user);
        history.setUpdateAt(LocalDateTime.now());

        orderHistoryRepository.save(history);
    }
    
}
