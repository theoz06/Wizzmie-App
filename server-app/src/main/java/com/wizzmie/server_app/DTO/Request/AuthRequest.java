package com.wizzmie.server_app.DTO.Request;



public class AuthRequest {

    private String nik;
    private String password;

    public AuthRequest(String nik, String password) {
        this.nik = nik;
        this.password = password;
    }

    public AuthRequest() {
    }


    public String getNik() {
        return nik;
    }
    public void setNik(String nik) {
        this.nik = nik;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
