package com.wizzmie.server_app.DTO.Respon;

public class AuthResponse {
    private String token;

    public AuthResponse(String token){
        this.token = token;
    }

    public String getToken(){
        return token;
    }
}
