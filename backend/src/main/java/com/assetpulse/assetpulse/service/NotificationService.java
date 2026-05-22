package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.model.Notification;
import com.assetpulse.assetpulse.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /*
        Create notification
    */
    public void createNotification(

            String userId,
            String title,
            String message,
            String type,
            String maintenanceRequestId

    ) {

        Notification notification = Notification.builder()

                .userId(userId)

                .title(title)

                .message(message)

                .type(type)

                .maintenanceRequestId(
                        maintenanceRequestId
                )

                .isRead(false)

                .isActive(true)

                .createdAt(LocalDateTime.now())

                .build();

        notificationRepository.save(notification);

    }

    /*
        Get notifications for user
    */
    public List<Notification> getMyNotifications(String userId) {

        return notificationRepository
                .findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId);

    }

    /*
        Mark all notifications as read
    */
    public void markAllAsRead(String userId) {

        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsActiveTrueOrderByCreatedAtDesc(userId);

        notifications.forEach(notification ->
                notification.setRead(true)
        );

        notificationRepository.saveAll(notifications);

    }


    /*
    deactivate notification
    linked to maintenance request
*/
    public void deactivateMaintenanceNotification(
            String maintenanceRequestId
    ) {

        Notification notification =
                notificationRepository
                        .findByMaintenanceRequestId(
                                maintenanceRequestId
                        );

        if(notification != null) {

            notification.setIsActive(false);

            notificationRepository.save(notification);

        }

    }
}