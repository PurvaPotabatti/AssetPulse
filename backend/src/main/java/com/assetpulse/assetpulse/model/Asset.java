package com.assetpulse.assetpulse.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "assets")
public class Asset {

    @Id
    private String id;

    // auto-generated unique id like AST-2026-0001
    private String assetId;

    // basic details
    private String name;
    private String category;
    private String description;

    // optional details
    private String brand;
    private String model;

    // tracking
    private String status;
    // AVAILABLE, ASSIGNED, MAINTENANCE, RETIRED, LOST

    private LocalDate purchaseDate;
    private LocalDate warrantyExpiry;

    private Double cost;

    private String location;

    // relation with employee
    private String assignedTo; // employeeId

    private String notes;

    // multi-tenant support
    private String adminId;

    // audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}