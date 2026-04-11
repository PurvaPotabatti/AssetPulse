package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.dto.AuthResponse;
import com.assetpulse.assetpulse.dto.CreateUserRequest;
import com.assetpulse.assetpulse.model.Role;
import com.assetpulse.assetpulse.model.User;
import com.assetpulse.assetpulse.repository.RoleRepository;
import com.assetpulse.assetpulse.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /*
        CREATE EMPLOYEE
     */
    public AuthResponse createEmployee(CreateUserRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role employeeRole = roleRepository
                .findByRoleName("EMPLOYEE")
                .orElseThrow(() -> new RuntimeException("EMPLOYEE role not found"));

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(hashedPassword);

        user.setRoleId(employeeRole.getId());

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

        user.setInvitedBy(request.getAdminId()); // NEW LINE

        user.setStatus("ACTIVE");

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                employeeRole.getRoleName()
        );
    }


    /*
        GET ALL EMPLOYEES
     */
    public List<User> getAllEmployees(String adminId) {

        Role employeeRole = roleRepository
                .findByRoleName("EMPLOYEE")
                .orElseThrow(() -> new RuntimeException("EMPLOYEE role not found"));

        return userRepository.findByRoleIdAndInvitedBy(
                employeeRole.getId(),
                adminId
        );
    }

    public void deleteEmployee(String id) {

        userRepository.deleteById(id);

    }

}