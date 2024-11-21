package com.wizzmie.server_app.Controllers.Implements;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.wizzmie.server_app.Entity.Helper.Cart;
import com.wizzmie.server_app.Entity.Helper.CartItem;
import com.wizzmie.server_app.Services.Implements.CartServiceImpl;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("api/cart")
public class CartControllerImpl {
    
    private CartServiceImpl cartServiceImpl;

    public CartControllerImpl(CartServiceImpl cartServiceImpl){
        this.cartServiceImpl = cartServiceImpl;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(HttpSession session) {
        try {
            Cart cart = cartServiceImpl.getCart(session);

            if (cart.getCartItems().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } 
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatus());
        }

    }

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(HttpSession session, @RequestBody CartItem item) {
        try {
            cartServiceImpl.addToCart(session, item);
            return new ResponseEntity<>("Item added to cart", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
        
    }

    @DeleteMapping("/remove/{menuId}")
    public ResponseEntity<String> removeFromCart(HttpSession session, @RequestParam Integer menuId) {
        try {
            cartServiceImpl.removeFromCart(session, menuId);
            return new ResponseEntity<>("Item removed from cart", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(HttpSession session) {
        try {
            cartServiceImpl.clearCart(session);
            return new ResponseEntity<>("Cart cleared", HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getReason(), e.getStatus());
        }
    }

    
    
}
