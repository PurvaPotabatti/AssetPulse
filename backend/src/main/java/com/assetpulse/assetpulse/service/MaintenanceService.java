package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.model.MaintenanceRequest;
import com.assetpulse.assetpulse.model.Assignment;
import com.assetpulse.assetpulse.repository.AssignmentRepository;
import com.assetpulse.assetpulse.repository.MaintenanceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final AssignmentRepository assignmentRepository;

    public MaintenanceService(
            MaintenanceRepository maintenanceRepository,
            AssignmentRepository assignmentRepository
    ) {
        this.maintenanceRepository = maintenanceRepository;
        this.assignmentRepository = assignmentRepository;
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

}