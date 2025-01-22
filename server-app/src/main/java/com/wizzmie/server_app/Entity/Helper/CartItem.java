package com.wizzmie.server_app.Entity.Helper;

import org.jetbrains.annotations.Nullable;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CartItem {
    private Integer menuId;
    private String menuName;
    private Double price;
    private Integer quantity;
    private String imageUrl;

    @Nullable
    private String description;

    public CartItem(Integer menuId, String menuName, Double price, Integer quantity, String description) {
        this.menuId = menuId;
        this.menuName = menuName;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }

}

