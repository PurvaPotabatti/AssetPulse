<p align="center">
  <img src="screenshots/landing.png" alt="AssetPulse Banner" width="100%">
</p>

<h1 align="center">AssetPulse</h1>

<p align="center">
  <strong>A secure role-based Asset Management System built with Spring Boot, React.js, MongoDB Atlas, and JWT Authentication.</strong>
</p>

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-success?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple?style=for-the-badge&logo=vite)

---

## Project Motivation

Organizations often rely on spreadsheets or manual records to manage assets, making it difficult to track assignments, maintenance requests, and asset availability.

AssetPulse was developed to provide a centralized platform where administrators can efficiently manage organizational assets while employees can easily access assigned assets, raise maintenance requests, and update their profiles through a secure role-based system.


## Live Demo

- Frontend (Vercel): https://asset-pulse.vercel.app
- Backend API (Render): https://assetpulse-backend-omjn.onrender.com


---

## 📖 About

AssetPulse is a full-stack asset management system designed to help organizations efficiently manage assets, employees, assignments, and maintenance requests through a secure role-based platform. It enables administrators to efficiently manage assets, employees, assignments, and maintenance requests while providing employees with a dedicated portal to view assigned assets, raise maintenance requests, and manage their profiles.

The application follows a secure role-based architecture using **Spring Security** and **JWT Authentication**, ensuring that users can only access resources permitted by their assigned roles. A React frontend communicates with the Spring Boot backend through REST APIs, with MongoDB Atlas serving as the database.

---

## ✨ Key Features

### 🔐 Authentication & Security

- JWT-based Authentication
- Role-Based Access Control (Admin & Employee)
- Spring Security Integration
- Secure Password Reset
- First-Time Account Setup
- Protected Routes
- Stateless Authentication

### 👨‍💼 Administrator Module

- Dashboard Overview
- Employee Management
- Asset Management
- Asset Assignment
- Maintenance Request Management
- Notification Management
- Search & Filter Functionality

### 👨‍💻 Employee Module

- Employee Dashboard
- View Assigned Assets
- Raise Maintenance Requests
- Track Request Status
- Update Profile

### 🌐 General Features

- Responsive User Interface
- RESTful API Architecture
- MongoDB Integration
- Clean Dashboard Design
- Toast Notifications


---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js, Vite |
| Backend | Spring Boot |
| Security | Spring Security, JWT |
| Database | MongoDB Atlas |
| Build Tool | Maven |
| Styling | CSS |
| Deployment | Vercel, Render |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/PurvaPotabatti/AssetPulse.git
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
---
## Note

Email invitation and password reset functionality are fully implemented and work correctly in the local development environment.

Due to outbound SMTP restrictions on the free deployment platform, email delivery may not function in the live demo.

All other application features are fully operational.

---

## 📸 Screenshots

### Landing Page

![Landing](screenshots/landing.png)



### Login

![Login](screenshots/login.png)



### Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)



### Assets Management

![Assets](screenshots/assets-page.png)



### Employees Management

![Employees](screenshots/employees-page.png)



### Employee Dashboard

![Employee Dashboard](screenshots/employee-dashboard.png)



### Employee Assets

![Employee Assets](screenshots/employee-assets.png)



### Maintenance Requests

![Maintenance](screenshots/maintenance-page.png)



### Employee Profile

![Employee Profile](screenshots/employee-profile.png)