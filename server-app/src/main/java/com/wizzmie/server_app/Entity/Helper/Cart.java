package com.wizzmie.server_app.Entity.Helper;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Cart {

    private Integer CustomerId;
    private Integer tableNumber;
    private List<CartItem> cartItems = new ArrayList<>();
   
    public void addCartItem(CartItem cartItem){
        cartItems.add(cartItem);
    }
    
    public void removeCartItem(CartItem cartItem){
        cartItems.remove(cartItem);
    }

    public void clearCart(){
        cartItems.clear();
    }

    public Double getTotalAmount(){

        Double totalPrice = cartItems.stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();
        Double ppn = 0.03 * totalPrice;

        return ppn + totalPrice;
    }


    public List<CartItem> getCartItems() {
        return this.cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public Integer getCustomerId() {
        return this.CustomerId;
    }

    public void setCustomerId(Integer CustomerId) {
        this.CustomerId = CustomerId;
    }

    public Integer getTableNumber() {
        return this.tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    
}
