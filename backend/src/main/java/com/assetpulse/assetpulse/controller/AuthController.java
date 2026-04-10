package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.dto.AuthResponse;
import com.assetpulse.assetpulse.dto.LoginRequest;
import com.assetpulse.assetpulse.dto.RegisterRequest;
import com.assetpulse.assetpulse.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /*
     ADMIN REGISTER
     */
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        return authService.registerAdmin(request);
    }

    /*
     LOGIN
     */
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);
    }
}