package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.dto.AuthResponse;
import com.assetpulse.assetpulse.dto.LoginRequest;
import com.assetpulse.assetpulse.dto.RegisterRequest;
import com.assetpulse.assetpulse.model.Role;
import com.assetpulse.assetpulse.model.User;
import com.assetpulse.assetpulse.repository.RoleRepository;
import com.assetpulse.assetpulse.repository.UserRepository;

import com.assetpulse.assetpulse.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    @Value("${app.frontend.url}")
    private String frontendUrl;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository, JwtUtil jwtUtil, EmailService emailService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.emailService = emailService;
    }

    /*
    ADMIN REGISTRATION
     */
    public AuthResponse registerAdmin(RegisterRequest request) {

        // check if email already exists
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // find ADMIN role from roles collection
        Role adminRole = roleRepository
                .findByRoleName("ADMIN")
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

        // hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // create user object
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(hashedPassword);
        user.setRoleId(adminRole.getId());
        user.setDepartment(
                request.getDepartment() == null || request.getDepartment().isBlank()
                        ? null
                        : request.getDepartment()
        );

        user.setDesignation(
                request.getDesignation() == null || request.getDesignation().isBlank()
                        ? null
                        : request.getDesignation()
        );

        user.setStatus("ACTIVE");
        user.setInvitedBy(null);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // save user
        userRepository.save(user);

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                adminRole.getRoleName(),
                null
        );
    }

    /*
    LOGIN (ADMIN or EMPLOYEE)
     */
    public AuthResponse login(LoginRequest request) {

        // find user by email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // check password
        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // get role
        Role role = roleRepository
                .findById(user.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getId(),
                role.getRoleName()
        );

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                role.getRoleName(),
                token
        );    }

    public void forgotPassword(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

    /*
      Prevent email enumeration attacks
    */
        if (user == null) {
            return;
        }

    /*
      Allow only ACTIVE users
    */
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            return;
        }

        String resetToken = UUID.randomUUID().toString();

        user.setResetPasswordToken(resetToken);

        user.setResetPasswordExpiry(
                LocalDateTime.now().plusMinutes(30)
        );

        userRepository.save(user);

        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

        emailService.sendResetPasswordEmail(
                user.getEmail(),
                resetLink
        );
    }

    public void resetPassword(
            String token,
            String newPassword
    ) {

        User user = userRepository
                .findByResetPasswordToken(token)
                .orElseThrow(() ->
                        new RuntimeException("Invalid reset link")
                );

    /*
      Check token expiry
    */
        if (
                user.getResetPasswordExpiry() == null ||
                        user.getResetPasswordExpiry().isBefore(LocalDateTime.now())
        ) {

            throw new RuntimeException(
                    "Reset link has expired"
            );
        }

    /*
      Update password
    */
        user.setPasswordHash(
                passwordEncoder.encode(newPassword)
        );

    /*
      Clear reset token
    */
        user.setResetPasswordToken(null);

        user.setResetPasswordExpiry(null);

        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }
}