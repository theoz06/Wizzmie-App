package com.wizzmie.server_app.Services;


public enum EnumRole {
    ADMIN("admin"),
    KITCHEN("kitchen"),
    PELAYAN("pelayanan"),
    CUSTOMER("customer");
    
    private String role;

    EnumRole(String userRoles){
        this.role = userRoles;
    }

    public String getUserRole(){
        return role;
    }
}
