package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.model.Assignment;
import com.assetpulse.assetpulse.model.Asset;
import com.assetpulse.assetpulse.model.User;
import com.assetpulse.assetpulse.repository.AssignmentRepository;
import com.assetpulse.assetpulse.repository.AssetRepository;

import com.assetpulse.assetpulse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    /*
        Assign asset to employee
    */
    public Assignment assignAsset(Assignment assignment) {

        Asset asset = assetRepository.findById(assignment.getAssetMongoId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if(!asset.getStatus().equals("AVAILABLE")) {
            throw new RuntimeException("Asset is not available for assignment");
        }

    /*
        FETCH EMPLOYEE DETAILS
     */
        User employee = userRepository.findById(
                assignment.getEmployeeId()   // this currently contains mongo id from UI
        ).orElseThrow(() -> new RuntimeException("Employee not found"));

    /*
        STORE CORRECT VALUES
     */
        assignment.setEmployeeId(employee.getId());
        assignment.setEmployeeName(employee.getName());
        assignment.setDepartment(employee.getDepartment());

        assignment.setStatus("ASSIGNED");
        assignment.setAssignedDate(LocalDate.now());

        asset.setStatus("ASSIGNED");

        assetRepository.save(asset);

        return assignmentRepository.save(assignment);
    }


    /*
        return asset
    */
    public Assignment returnAsset(String assignmentId) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // update assignment
        assignment.setStatus("RETURNED");
        assignment.setReturnDate(LocalDate.now());

        // update asset status
        Asset asset = assetRepository.findById(assignment.getAssetMongoId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        asset.setStatus("AVAILABLE");

        assetRepository.save(asset);

        return assignmentRepository.save(assignment);
    }


    /*
        get assignments of admin
    */
    public List<Assignment> getAssignments(String adminId) {

        return assignmentRepository.findByAdminId(adminId);
    }


    /*
        get assignment history of asset
    */
    public List<Assignment> getAssetHistory(String assetId) {

        return assignmentRepository.findByAssetId(assetId);
    }


    /*
        get assignments of employee
    */
    public List<Assignment> getEmployeeAssignments(String employeeId) {

        return assignmentRepository.findByEmployeeId(employeeId);
    }
}