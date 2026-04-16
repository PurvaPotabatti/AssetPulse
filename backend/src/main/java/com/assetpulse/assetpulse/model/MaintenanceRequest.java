package com.assetpulse.assetpulse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "maintenance_requests")
public class MaintenanceRequest {

    @Id
    private String id;

    private String assetMongoId;
    private String assetId;
    private String assetName;

    private String employeeMongoId;
    private String employeeId;
    private String employeeName;

    private String issueDescription;

    private String status;
    // OPEN
    // IN_PROGRESS
    // RESOLVED
    // REJECTED

    private LocalDateTime createdAt;

    public MaintenanceRequest(){
        this.createdAt = LocalDateTime.now();
        this.status = "OPEN";
    }

    private String assignmentId;

    // getters setters


    public String getId() {
        return id;
    }

    public String getAssetMongoId() {
        return assetMongoId;
    }

    public void setAssetMongoId(String assetMongoId) {
        this.assetMongoId = assetMongoId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getEmployeeMongoId() {
        return employeeMongoId;
    }

    public void setEmployeeMongoId(String employeeMongoId) {
        this.employeeMongoId = employeeMongoId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getIssueDescription() {
        return issueDescription;
    }

    public void setIssueDescription(String issueDescription) {
        this.issueDescription = issueDescription;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(String assignmentId) {
        this.assignmentId = assignmentId;
    }
}