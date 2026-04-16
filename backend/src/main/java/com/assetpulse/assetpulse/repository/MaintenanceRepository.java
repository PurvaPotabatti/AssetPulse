package com.assetpulse.assetpulse.repository;

import com.assetpulse.assetpulse.model.MaintenanceRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MaintenanceRepository
        extends MongoRepository<MaintenanceRequest, String> {

    List<MaintenanceRequest> findByEmployeeMongoId(String employeeMongoId);

    List<MaintenanceRequest> findByAssetMongoId(String assetMongoId);

    List<MaintenanceRequest> findByStatus(String status);

}