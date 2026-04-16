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

        /*
           generate employee id
        */
        long count = userRepository.countByRoleId(employeeRole.getId()) + 1;

        String year = String.valueOf(LocalDateTime.now().getYear());

        String employeeCode = String.format(
                "EMP-%s-%04d",
                year,
                count
        );

        String inviteToken = java.util.UUID.randomUUID().toString();
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(null);

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
        user.setStatus("INVITED");
        user.setInviteToken(inviteToken);
        user.setInviteExpiry(LocalDateTime.now().plusDays(7));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setEmployeeId(employeeCode);
        userRepository.save(user);

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                employeeRole.getRoleName(),
                null
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

    public User updateEmployee(String id, CreateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

    /*
       check if email is changed
    */
        if(request.getEmail() != null &&
                !request.getEmail().equals(user.getEmail())) {

        /*
           prevent duplicate email
        */
            if(userRepository.existsByEmail(request.getEmail())) {

                throw new RuntimeException("Email already exists");

            }

            user.setEmail(request.getEmail());

        }

        user.setName(request.getName());

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

        user.setStatus(request.getStatus());

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);

    }

    public void activateAccount(String token, String password) {

        User user = userRepository
                .findByInviteToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid activation token"));

        if(user.getInviteExpiry().isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Activation link expired");
        }

        String hashedPassword = passwordEncoder.encode(password);

        user.setPasswordHash(hashedPassword);

        user.setStatus("ACTIVE");

        user.setInviteToken(null);

        user.setInviteExpiry(null);

        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

}