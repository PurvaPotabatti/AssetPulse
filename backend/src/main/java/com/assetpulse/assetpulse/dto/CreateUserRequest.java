package com.assetpulse.assetpulse.dto;

public class CreateUserRequest {

    private String name;
    private String email;
    private String phone;
    private String password;
    private String department;
    private String designation;
    private String adminId;
    private String status;

    public CreateUserRequest() {}

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPassword() { return password; }
    public String getDepartment() { return department; }
    public String getDesignation() { return designation; }
    public String getAdminId() { return adminId; }   // NEW
    public String getStatus() { return status; }


    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPassword(String password) { this.password = password; }
    public void setDepartment(String department) { this.department = department; }
    public void setDesignation(String designation) { this.designation = designation; }
    public void setAdminId(String adminId) { this.adminId = adminId; }   // NEW
    public void setStatus(String status) { this.status = status; }
}