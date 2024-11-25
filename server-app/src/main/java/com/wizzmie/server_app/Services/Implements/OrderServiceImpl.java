package com.wizzmie.server_app.Services.Implements;

import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.DTO.Respon.OrderActiveKitchenResponse;
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


    public OrderServiceImpl(OrderRepository orderRepository, 
                            MenuRepository menuRepository,
                            OrderItemRepository orderItemRepository, 
                            StatusRepository statusRepository, 
                            CustomerRepository customerRepository){

        this.menuRepository = menuRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.statusRepository = statusRepository;
        this.customerRepository = customerRepository;
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

    
}
