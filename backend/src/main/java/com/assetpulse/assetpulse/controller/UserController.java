package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.dto.ActivateAccountRequest;
import com.assetpulse.assetpulse.dto.AuthResponse;
import com.assetpulse.assetpulse.dto.CreateUserRequest;
import com.assetpulse.assetpulse.dto.ChangePasswordRequest;
import com.assetpulse.assetpulse.model.User;
import com.assetpulse.assetpulse.service.UserService;
import com.assetpulse.assetpulse.dto.ProfileResponse;
import com.assetpulse.assetpulse.dto.UpdateProfileRequest;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /*
        CREATE EMPLOYEE
     */
    @PostMapping
    public AuthResponse createEmployee(@RequestBody CreateUserRequest request) {

        return userService.createEmployee(request);

    }


    /*
        GET ALL EMPLOYEES
     */
    @GetMapping("/{adminId}")
    public List<User> getAllEmployees(@PathVariable String adminId) {

        return userService.getAllEmployees(adminId);
    }

    /*
        DELETE EMPLOYEE
     */
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable String id) {

        userService.deleteEmployee(id);

        return "Employee deleted successfully";

    }

    @PutMapping("/{id}")
    public User updateEmployee(

            @PathVariable String id,
            @RequestBody CreateUserRequest request

    ) {

        return userService.updateEmployee(id, request);

    }


    @GetMapping("/profile")
    public ProfileResponse getCurrentUserProfile(
            @RequestAttribute("userId") String userId
    ) {

        return userService.getCurrentUserProfile(userId);

    }


    @PutMapping("/profile")
    public ProfileResponse updateCurrentUserProfile(

            @RequestAttribute("userId") String userId,

            @RequestBody UpdateProfileRequest request

    ) {

        return userService.updateCurrentUserProfile(
                userId,
                request
        );

    }

    @PutMapping("/change-password")
    public String changePassword(

            @RequestAttribute("userId") String userId,

            @RequestBody ChangePasswordRequest request

    ) {

        return userService.changePassword(
                userId,
                request
        );

    }



    @PostMapping("/activate")
    public String activateAccount(@RequestBody ActivateAccountRequest request) {

        userService.activateAccount(
                request.getToken(),
                request.getPassword()
        );

        return "Account activated successfully";
    }


    @PostMapping("/resend-invite/{id}")
    public String resendInvite(@PathVariable String id) {

        userService.resendInvite(id);

        return "Invite resent successfully";
    }



}