package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.Entity.Helper.Cart;
import com.wizzmie.server_app.Entity.Helper.CartItem;
import com.wizzmie.server_app.Services.Implements.CartServiceImpl;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("api/customer/orderpage/table/{tableNumber}/customer/{customerId}")
public class CartControllerImpl {
   
    @Autowired
    private CartServiceImpl cartServiceImpl;
    
    @GetMapping("/cart")
    public ResponseEntity<Cart> getCart(@PathVariable Integer tableNumber, 
                                      @PathVariable Integer customerId, 
                                      HttpSession session) {
        try {
            
            Cart cart = cartServiceImpl.getCart(session, tableNumber, customerId);
            
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatus());
        }
    }

    @PostMapping("/cart/add")
    public ResponseEntity<String> addToCart(@PathVariable Integer tableNumber,
                                          @PathVariable Integer customerId,
                                          HttpSession session,
                                          @RequestBody CartItem item) {
        try {
            
            cartServiceImpl.addToCart(tableNumber, customerId, session, item);
            return new ResponseEntity<>("Item added to cart", HttpStatus.OK);
        } catch (ResponseStatusException e) {
        
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    @DeleteMapping("/cart/remove/{menuId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Integer tableNumber, @PathVariable Integer customerId, HttpSession session, @RequestParam Integer menuId) {
        try {
            cartServiceImpl.removeFromCart(session, tableNumber, customerId, menuId);
            return new ResponseEntity<>("Item removed from cart", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    @DeleteMapping("/cart/clear")
    public ResponseEntity<String> clearCart(@PathVariable Integer tableNumber, @PathVariable Integer customerId, HttpSession session) {
        try {
            cartServiceImpl.clearCart(session, tableNumber, customerId);
            return new ResponseEntity<>("Cart cleared", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

}
