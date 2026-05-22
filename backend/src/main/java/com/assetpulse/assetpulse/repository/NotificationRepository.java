package com.assetpulse.assetpulse.repository;

import com.assetpulse.assetpulse.model.Notification;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    /*
        Active notifications only
    */
    List<Notification>
    findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(
            String userId
    );

    Notification findByMaintenanceRequestId(
            String maintenanceRequestId
    );

}