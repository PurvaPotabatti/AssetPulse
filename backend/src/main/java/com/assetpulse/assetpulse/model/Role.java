package com.assetpulse.assetpulse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "roles")
public class Role {

    @Id
    private String id;

    private String roleName;

    private List<String> permissions;

    private LocalDateTime createdAt;

    public Role() {
    }

    public Role(String roleName, List<String> permissions, LocalDateTime createdAt) {
        this.roleName = roleName;
        this.permissions = permissions;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getRoleName() {
        return roleName;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}