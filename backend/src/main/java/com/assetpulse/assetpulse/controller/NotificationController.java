package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.model.Notification;
import com.assetpulse.assetpulse.service.NotificationService;

import com.assetpulse.assetpulse.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private final JwtUtil jwtUtil;

    /*
        Get logged-in user's notifications
    */
    @GetMapping("/my")
    public ResponseEntity<List<Notification>> getMyNotifications(

            HttpServletRequest request

    ) {

        String token = request
                .getHeader("Authorization")
                .substring(7);

        String userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(
                notificationService.getMyNotifications(userId)
        );

    }

    /*
        Mark all notifications as read
    */
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(

            HttpServletRequest request

    ) {

        String token = request
                .getHeader("Authorization")
                .substring(7);

        String userId = jwtUtil.extractUserId(token);

        notificationService.markAllAsRead(userId);

        return ResponseEntity.ok(
                "Notifications marked as read"
        );

    }

}
