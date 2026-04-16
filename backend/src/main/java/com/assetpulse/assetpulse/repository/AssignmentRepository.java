package com.assetpulse.assetpulse.repository;

import com.assetpulse.assetpulse.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends MongoRepository<Assignment, String> {

    // get all assignments for specific admin
    List<Assignment> findByAdminId(String adminId);

    // check if asset already assigned (active assignment)
    Optional<Assignment> findByAssetIdAndStatus(String assetId, String status);

    // get assignment history of asset
    List<Assignment> findByAssetId(String assetId);

    // get assignments of employee
    List<Assignment> findByEmployeeId(String employeeId);

    List<Assignment> findByEmployeeIdAndStatus(String employeeId, String status);



}