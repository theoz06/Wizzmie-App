package com.wizzmie.server_app.Services.Implements;

import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Customer;
import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.OrderItem;
import com.wizzmie.server_app.Entity.Orders;
import com.wizzmie.server_app.Entity.Status;
import com.wizzmie.server_app.Entity.Helper.Cart;
import com.wizzmie.server_app.Entity.Helper.CartItem;
import com.wizzmie.server_app.Repository.CustomerRepository;
import com.wizzmie.server_app.Repository.MenuRepository;
import com.wizzmie.server_app.Repository.OrderItemRepository;
import com.wizzmie.server_app.Repository.OrderRepository;
import com.wizzmie.server_app.Repository.StatusRepository;

@Service
public class OrderServiceImpl {
    
    private OrderRepository orderRepository;
    private OrderItemRepository orderItemRepository;
    private StatusRepository statusRepository;
    private CustomerRepository customerRepository;
    private MenuRepository menuRepository;
    private SimpMessagingTemplate messagingTemplate;



    public OrderServiceImpl(OrderRepository orderRepository, 
                            MenuRepository menuRepository,
                            OrderItemRepository orderItemRepository, 
                            StatusRepository statusRepository, 
                            CustomerRepository customerRepository,
                            SimpMessagingTemplate messagingTemplate){

        this.menuRepository = menuRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.statusRepository = statusRepository;
        this.customerRepository = customerRepository;
        this.messagingTemplate = messagingTemplate;
    }


    public Orders createOrder(HttpSession session){
        Cart cart = (Cart) session.getAttribute("CART");
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

        session.removeAttribute("CART");

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

    public String updateOrderStatus(Integer orderId){
        
        Orders order = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order Not Found"));

        Status currentStatus = order.getOrderStatus();
        if (currentStatus == null || currentStatus.getId() == null) {
            throw new IllegalArgumentException("Current status or status ID is null for order ID: " + orderId);
        }

        
        switch (currentStatus.getId()) {
            case 2:
                updateStatus(order, 3);

                //Send Data To Waiters Monitor
                messagingTemplate.convertAndSend("/server/orders", order);

                //Remove Data From Kitchen Monitor
                messagingTemplate.convertAndSend("/kitchen/remove-order", order.getId());
                break;
            case 3:
                updateStatus(order, 4);
                break;
        
            default:
                throw new IllegalArgumentException(
                    "Invalid status transition for order ID: " + orderId
            );
        }

        return "Order Status Updated to: " + order.getOrderStatus().getDescription();
    
    }

    private void updateStatus(Orders order, Integer newStatusId){
       
        Status newStatus = statusRepository.findById(newStatusId).orElseThrow(()-> new RuntimeException("Status Not Found"));
        order.setOrderStatus(newStatus);
        orderRepository.save(order);
    }
    
}
