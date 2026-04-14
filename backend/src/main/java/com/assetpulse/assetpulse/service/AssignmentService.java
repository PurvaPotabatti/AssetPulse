package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.model.Assignment;
import com.assetpulse.assetpulse.model.Asset;
import com.assetpulse.assetpulse.repository.AssignmentRepository;
import com.assetpulse.assetpulse.repository.AssetRepository;

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

    /*
        Assign asset to employee
    */
    public Assignment assignAsset(Assignment assignment) {

        // check asset exists
        Asset asset = assetRepository.findById(assignment.getAssetMongoId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        // check asset availability
        if(!asset.getStatus().equals("Available"))  {
            throw new RuntimeException("Asset is not available for assignment");
        }

        // set values
        assignment.setStatus("Assigned");
        assignment.setAssignedDate(LocalDate.now());

        // update asset status
        asset.setStatus("Assigned");
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
        assignment.setStatus("Returned");
        assignment.setReturnDate(LocalDate.now());

        // update asset status
        Asset asset = assetRepository.findById(assignment.getAssetMongoId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        asset.setStatus("Available");

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