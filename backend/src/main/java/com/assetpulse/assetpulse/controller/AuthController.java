package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.dto.ActivateAccountRequest;
import com.assetpulse.assetpulse.dto.AuthResponse;
import com.assetpulse.assetpulse.dto.LoginRequest;
import com.assetpulse.assetpulse.dto.RegisterRequest;
import com.assetpulse.assetpulse.service.AuthService;
import com.assetpulse.assetpulse.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.assetpulse.assetpulse.dto.ForgotPasswordRequest;
import com.assetpulse.assetpulse.dto.ResetPasswordRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserService userService; // ADD THIS

    public AuthController(
            AuthService authService,
            UserService userService // ADD THIS
    ) {
        this.authService = authService;
        this.userService = userService;
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

    @PostMapping("/forgot-password")
    public String forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) {

        authService.forgotPassword(
                request.getEmail()
        );

        return "If an account exists, a reset link has been sent.";
    }

    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        authService.resetPassword(
                request.getToken(),
                request.getPassword()
        );

        return "Password reset successful";
    }

    /*
     ACTIVATE EMPLOYEE ACCOUNT
     */
    @PostMapping("/activate")
    public String activateAccount(
            @RequestBody ActivateAccountRequest request
    ) {

        userService.activateAccount(
                request.getToken(),
                request.getPassword()
        );

        return "Account activated successfully";
    }

}