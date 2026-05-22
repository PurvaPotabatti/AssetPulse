package com.assetpulse.assetpulse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")

public class Notification {

    @Id
    private String id;

    /*
        Receiver of notification
    */
    private String userId;

    /*
        Example:
        "New Maintenance Request"
    */
    private String title;

    /*
        Example:
        "John Doe reported issue for Dell Latitude"
    */
    private String message;

    /*
        Example:
        MAINTENANCE_REQUEST
        ASSET_ASSIGNED
    */
    private String type;
    /*
    related maintenance request
*/
    private String maintenanceRequestId;

    /*
        unread = false
        read = true
    */
    private boolean isRead;

    /*
        notification creation time
    */
    private LocalDateTime createdAt;
    private Boolean isActive;

}