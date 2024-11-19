package com.wizzmie.server_app.Services;


public enum EnumRole {
    ADMIN("Admin"),
    KITCHEN("Kitchen"),
    PELAYAN("Pelayanan"),
    CUSTOMER("Customer");
    
    private final String role;

    EnumRole(String usersRoles){
        this.role = usersRoles;
    }

    public String getUsersRole(){
        return role;
    }

    public static EnumRole fromString(String role) {
        for (EnumRole r : EnumRole.values()) {
            if (r.role.equalsIgnoreCase(role)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Role not found: " + role);
    }
}
