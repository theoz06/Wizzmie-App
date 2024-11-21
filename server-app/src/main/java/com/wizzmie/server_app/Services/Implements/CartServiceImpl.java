package com.wizzmie.server_app.Services.Implements;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

import com.wizzmie.server_app.Entity.Helper.Cart;
import com.wizzmie.server_app.Entity.Helper.CartItem;

@Service
public class CartServiceImpl {
    private static final String CART_SESSION_KEY = "CART";

    public Cart getCart(HttpSession session){
        Cart cart = (Cart) session.getAttribute(CART_SESSION_KEY);
        if(cart == null){
            cart = new Cart();
            session.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    public void addToCart(Integer tableNumber,HttpSession session, CartItem cartItem){

        if (tableNumber == null ) {
            throw new RuntimeException("Table number or customer ID is not set in the session.");
        }

        Cart cart = getCart(session);

        CartItem existingItem = cart.getCartItems().stream()
                                    .filter(item -> item.getMenuId().equals(cartItem.getMenuId()))
                                    .findFirst()
                                    .orElse(null);

        if(existingItem != null){
            existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
        }else{
            cart.setTableNumber(tableNumber);
            cart.addCartItem(cartItem);
        }
        session.setAttribute(CART_SESSION_KEY, cart);
    }

    public void removeFromCart(HttpSession session, Integer menuId){
        Cart cart = getCart(session);
        cart.getCartItems().removeIf(item -> item.getMenuId().equals(menuId));
        session.setAttribute(CART_SESSION_KEY, cart);
    }

    public void clearCart(HttpSession session){
        session.removeAttribute(CART_SESSION_KEY);
    }
}
