package com.assetpulse.assetpulse.dto;

public class ResetPasswordRequest {

    private String token;

    private String password;

    public ResetPasswordRequest() {
    }

    public String getToken() {
        return token;
    }

    public String getPassword() {
        return password;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}