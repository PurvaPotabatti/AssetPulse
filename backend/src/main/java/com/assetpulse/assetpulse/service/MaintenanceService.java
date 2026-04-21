package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.model.MaintenanceRequest;
import com.assetpulse.assetpulse.model.Assignment;
import com.assetpulse.assetpulse.repository.AssignmentRepository;
import com.assetpulse.assetpulse.repository.MaintenanceRepository;
import com.assetpulse.assetpulse.model.Asset;
import com.assetpulse.assetpulse.repository.AssetRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;

    public MaintenanceService(
            MaintenanceRepository maintenanceRepository,
            AssignmentRepository assignmentRepository,
            AssetRepository assetRepository
    ) {
        this.maintenanceRepository = maintenanceRepository;
        this.assignmentRepository = assignmentRepository;
        this.assetRepository = assetRepository;
    }


    /*
        create maintenance request
     */
    public MaintenanceRequest createRequest(
            String assignmentId,
            String employeeMongoId,
            String issueDescription
    ){

        Assignment assignment =
                assignmentRepository.findById(assignmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Assignment not found")
                        );

        MaintenanceRequest request = new MaintenanceRequest();

        request.setAssignmentId(assignmentId);

        request.setAssetMongoId(
                assignment.getAssetMongoId()
        );

        request.setAssetId(
                assignment.getAssetId()
        );

        request.setAssetName(
                assignment.getAssetName()
        );

        request.setEmployeeMongoId(employeeMongoId);

        request.setEmployeeId(
                assignment.getEmployeeId()
        );

        request.setEmployeeName(
                assignment.getEmployeeName()
        );

        request.setIssueDescription(issueDescription);

        request.setPriority("NOT_ASSIGNED");
        request.setAssignedTo(null);
        request.setCost(null);

        return maintenanceRepository.save(request);
    }



    /*
        employee requests
     */
    public List<MaintenanceRequest> getEmployeeRequests(
            String employeeMongoId
    ){

        return maintenanceRepository
                .findByEmployeeMongoId(employeeMongoId);
    }



    /*
        admin view all requests
     */
    public List<MaintenanceRequest> getAllRequests(){

        return maintenanceRepository.findAll();
    }

    public MaintenanceRequest scheduleMaintenance(
            MaintenanceRequest request
    ){

        if(request.getPriority() == null)
            request.setPriority("NOT_ASSIGNED");

        if(request.getStatus() == null)
            request.setStatus("OPEN");

        if(request.getCreatedAt() == null)
            request.setCreatedAt(
                    java.time.LocalDateTime.now()
            );

    /*
        FETCH ASSET
     */
        Asset asset = assetRepository
                .findById(request.getAssetMongoId())
                .orElseThrow(() ->
                        new RuntimeException("Asset not found")
                );

    /*
        UPDATE ASSET LIFECYCLE STATUS
     */
        switch(request.getStatus()){

            case "IN_PROGRESS":

                asset.setStatus("IN_MAINTENANCE");

                break;

            case "RESOLVED":

            /*
               asset goes back to employee
             */

                asset.setStatus("ASSIGNED");

                break;

            case "REJECTED":

                asset.setStatus("ASSIGNED");

                break;

            case "OPEN":

                asset.setStatus("ASSIGNED");

                break;
        }

        assetRepository.save(asset);

        return maintenanceRepository.save(request);

    }

}