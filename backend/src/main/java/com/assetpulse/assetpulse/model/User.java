package com.assetpulse.assetpulse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    private String email;

    private String phone;

    private String passwordHash;

    private String roleId;

    private String department;

    private String designation;

    private String status;

    private String inviteToken;
    private LocalDateTime inviteExpiry;

    private String invitedBy;

    private LocalDateTime lastLogin;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String employeeId;

    public User() {
    }

    public User(String name, String email, String phone, String passwordHash,
                String roleId, String department, String designation,
                String status, String invitedBy,
                LocalDateTime createdAt, LocalDateTime updatedAt) {

        this.name = name;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.roleId = roleId;
        this.department = department;
        this.designation = designation;
        this.status = status;
        this.invitedBy = invitedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getRoleId() {
        return roleId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getDepartment() {
        return department;
    }

    public String getDesignation() {
        return designation;
    }

    public String getStatus() {
        return status;
    }

    public String getInviteToken() {
        return inviteToken;
    }

    public LocalDateTime getInviteExpiry() {
        return inviteExpiry;
    }

    public String getInvitedBy() {
        return invitedBy;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setInvitedBy(String invitedBy) {
        this.invitedBy = invitedBy;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public void setInviteExpiry(LocalDateTime inviteExpiry) {
        this.inviteExpiry = inviteExpiry;
    }

    public void setInviteToken(String invitedToken) {
        this.inviteToken = invitedToken;
    }
}