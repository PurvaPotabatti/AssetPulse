package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.model.MaintenanceRequest;
import com.assetpulse.assetpulse.service.MaintenanceService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(
            MaintenanceService maintenanceService
    ) {
        this.maintenanceService = maintenanceService;
    }



    /*
        create issue
     */
    @PostMapping
    public MaintenanceRequest createRequest(

            @RequestBody Map<String,String> body,

            @RequestAttribute("userId")
            String employeeMongoId

    ){

        return maintenanceService.createRequest(

                body.get("assignmentId"),

                employeeMongoId,

                body.get("issueDescription")
        );
    }



    /*
        employee requests page
     */
    @GetMapping("/my")
    public List<MaintenanceRequest> myRequests(

            @RequestAttribute("userId")
            String employeeMongoId

    ){

        return maintenanceService.getEmployeeRequests(
                employeeMongoId
        );
    }



    /*
        admin page
     */
    @GetMapping
    public List<MaintenanceRequest> allRequests(){

        return maintenanceService.getAllRequests();
    }

    @PostMapping("/schedule")
    public MaintenanceRequest scheduleMaintenance(

            @RequestBody MaintenanceRequest request

    ){

        return maintenanceService.scheduleMaintenance(request);

    }

}