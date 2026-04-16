package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.dto.MyAssetDTO;
import com.assetpulse.assetpulse.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /*
        GET LOGGED-IN EMPLOYEE ASSETS
     */
    @GetMapping("/my-assets")
    public List<MyAssetDTO> getMyAssets(
            @RequestAttribute("userId") String userId
    ) {

        System.out.println("JWT userId = " + userId);

        return employeeService.getMyAssets(userId);

    }

}