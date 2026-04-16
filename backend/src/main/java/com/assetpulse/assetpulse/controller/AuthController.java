package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.dto.ActivateAccountRequest;
import com.assetpulse.assetpulse.dto.AuthResponse;
import com.assetpulse.assetpulse.dto.LoginRequest;
import com.assetpulse.assetpulse.dto.RegisterRequest;
import com.assetpulse.assetpulse.service.AuthService;
import com.assetpulse.assetpulse.service.UserService;
import org.springframework.web.bind.annotation.*;

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