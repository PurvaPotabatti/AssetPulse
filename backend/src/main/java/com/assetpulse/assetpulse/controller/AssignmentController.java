package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.model.Assignment;
import com.assetpulse.assetpulse.service.AssignmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    /*
        assign asset
    */
    @PostMapping
    public Assignment assignAsset(
            @RequestBody Assignment assignment,
            Authentication authentication
    ) {

        String adminId = authentication.getName();

        assignment.setAdminId(adminId);

        return assignmentService.assignAsset(assignment);
    }


    /*
        get all assignments of logged-in admin
    */
    @GetMapping
    public List<Assignment> getAssignments(
            Authentication authentication
    ) {

        String adminId = authentication.getName();

        return assignmentService.getAssignments(adminId);
    }


    /*
        return asset
    */
    @PutMapping("/{id}/return")
    public Assignment returnAsset(
            @PathVariable String id
    ) {

        return assignmentService.returnAsset(id);
    }


    /*
        get asset assignment history
    */
    @GetMapping("/asset/{assetId}")
    public List<Assignment> getAssetHistory(
            @PathVariable String assetId
    ) {

        return assignmentService.getAssetHistory(assetId);
    }


    /*
        get assignments of employee
    */
    @GetMapping("/employee/{employeeId}")
    public List<Assignment> getEmployeeAssignments(
            @PathVariable String employeeId
    ) {

        return assignmentService.getEmployeeAssignments(employeeId);
    }
}