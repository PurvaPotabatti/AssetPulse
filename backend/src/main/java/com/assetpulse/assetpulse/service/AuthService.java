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

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository, JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
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
}