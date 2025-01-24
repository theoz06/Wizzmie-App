package com.wizzmie.server_app.Services.Implements;

import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Menu;
import com.wizzmie.server_app.Entity.Helper.Cart;
import com.wizzmie.server_app.Entity.Helper.CartItem;
import com.wizzmie.server_app.Repository.MenuRepository;

@Service
public class CartServiceImpl {
    private static final String CART_SESSION_KEY = "CART_%d_%d";

    @Autowired
    private MenuRepository menuRepository;

    public Cart getCart(HttpSession session, Integer tableNumber, Integer customerId) {
        if (tableNumber == null || customerId == null) {
            throw new RuntimeException("Table number and customer ID are required.");
        }
        
        String sessionKey = String.format(CART_SESSION_KEY, tableNumber, customerId);
        
        Cart cart = (Cart) session.getAttribute(sessionKey);
        
        if (cart == null) {
            cart = new Cart();
            session.setAttribute(sessionKey, cart);
        }
        
        return cart;
    }

    public void addToCart(Integer tableNumber, Integer customerId, HttpSession session, CartItem cartItem) {
        if (tableNumber == null || customerId == null) {
            throw new RuntimeException("Table number and customer ID are required.");
        }

        Optional<Menu> menu = menuRepository.findById(cartItem.getMenuId());
        if (!menu.isPresent()){
            throw new RuntimeException("Menu tidak ditemukan.");
        }

        if (!menu.get().getIsAvailable()){
            throw new RuntimeException("Menu sedang tidak tersedia, silahkan pilih menu lain.");
        }
        
        Cart cart = getCart(session, tableNumber, customerId);
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getMenuId().equals(cartItem.getMenuId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
        } else {
            cart.setTableNumber(tableNumber);
            cart.setCustomerId(customerId);
            cart.addCartItem(cartItem);
        }

        String sessionKey = String.format(CART_SESSION_KEY, tableNumber, customerId);
        session.setAttribute(sessionKey, cart);
    
    }

    public void updateQty (HttpSession session, Integer tableNumber, Integer customerId, Integer menuId, Integer newQuantity){
        Cart cart = getCart(session, tableNumber, customerId);

        cart.getCartItems().forEach(item -> {
            if (item.getMenuId().equals(menuId)){
                item.setQuantity(newQuantity);
            }
        });

        String sessionKey = String.format(CART_SESSION_KEY, tableNumber, customerId);
        session.setAttribute(sessionKey, cart);
    }

    public void updateItemDescription (HttpSession session, Integer tableNumber, Integer customerId, Integer menuId, String newDescription){
        Cart cart = getCart(session, tableNumber, customerId);

        cart.getCartItems().forEach(item -> {
            if (item.getMenuId().equals(menuId)){
                item.setDescription(newDescription);
            }
        });
    }

    public void removeFromCart(HttpSession session, Integer tableNumber, Integer customerId, Integer menuId){
        Cart cart = getCart(session, tableNumber, customerId);
        cart.getCartItems().removeIf(item -> item.getMenuId().equals(menuId));

        String sessionKey = String.format(CART_SESSION_KEY, tableNumber, customerId);
        session.setAttribute(sessionKey, cart);
    }

    public void clearCart(HttpSession session, Integer tableNumber, Integer customerId){
        Cart cart = getCart(session, tableNumber, customerId);
        cart.getCartItems().clear();

        String sessionKey = String.format(CART_SESSION_KEY, tableNumber, customerId);
        session.setAttribute(sessionKey, cart);
    }
}
