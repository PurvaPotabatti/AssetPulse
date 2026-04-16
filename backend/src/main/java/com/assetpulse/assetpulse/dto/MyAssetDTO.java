package com.assetpulse.assetpulse.dto;

import java.time.LocalDate;

public class MyAssetDTO {

    private String id;

    private String assetName;

    private String assetId;

    private String category;

    private LocalDate assignedDate;

    private String condition;

    private String status;

    public MyAssetDTO(
            String id,
            String assetName,
            String assetId,
            String category,
            LocalDate assignedDate,
            String condition,
            String status
    ) {
        this.id = id;
        this.assetName = assetName;
        this.assetId = assetId;
        this.category = category;
        this.assignedDate = assignedDate;
        this.condition = condition;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public String getAssetName() {
        return assetName;
    }

    public String getAssetId() {
        return assetId;
    }

    public String getCategory() {
        return category;
    }

    public LocalDate getAssignedDate() {
        return assignedDate;
    }

    public String getCondition() {
        return condition;
    }

    public String getStatus() {
        return status;
    }
}