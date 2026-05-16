    package com.assetpulse.assetpulse.service;

    import com.assetpulse.assetpulse.dto.AuthResponse;
    import com.assetpulse.assetpulse.dto.CreateUserRequest;
    import com.assetpulse.assetpulse.model.Role;
    import com.assetpulse.assetpulse.model.User;
    import com.assetpulse.assetpulse.repository.RoleRepository;
    import com.assetpulse.assetpulse.repository.UserRepository;

    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.List;

    @Service
    public class UserService {

        private final UserRepository userRepository;
        private final RoleRepository roleRepository;
        private final BCryptPasswordEncoder passwordEncoder;
        private final EmailService emailService;

        @Value("${app.frontend.url}")
        private String frontendUrl;

        public UserService(UserRepository userRepository,
                           RoleRepository roleRepository,
                           EmailService emailService) {

            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
            this.emailService = emailService;
            this.passwordEncoder = new BCryptPasswordEncoder();
        }



        /*
            CREATE EMPLOYEE
         */
        public AuthResponse createEmployee(CreateUserRequest request) {

            if(userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }

            Role employeeRole = roleRepository
                    .findByRoleName("EMPLOYEE")
                    .orElseThrow(() -> new RuntimeException("EMPLOYEE role not found"));

            /*
               generate employee id
            */
            long count = userRepository.countByRoleId(employeeRole.getId()) + 1;

            String year = String.valueOf(LocalDateTime.now().getYear());

            String employeeCode = String.format(
                    "EMP-%s-%04d",
                    year,
                    count
            );

            String inviteToken = java.util.UUID.randomUUID().toString();

            String inviteLink = frontendUrl + "/setup-password?token=" + inviteToken;

            System.out.println("=================================");
            System.out.println("EMPLOYEE INVITE LINK:");
            System.out.println(inviteLink);
            System.out.println("=================================");


            User user = new User();

            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setPasswordHash(null);

            user.setRoleId(employeeRole.getId());

            user.setDepartment(
                    request.getDepartment() == null || request.getDepartment().isBlank()
                            ? null
                            : request.getDepartment()
            );

            user.setDesignation(
                    request.getDesignation() == null || request.getDesignation().isBlank()
                            ? null
                            : request.getDesignation()
            );

            user.setInvitedBy(request.getAdminId()); // NEW LINE
            user.setStatus("INVITED");
            user.setInviteToken(inviteToken);
            user.setInviteExpiry(LocalDateTime.now().plusDays(7));
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setEmployeeId(employeeCode);
            userRepository.save(user);

            try {
                emailService.sendInviteEmail(user.getEmail(), inviteLink);
            } catch (Exception e) {
                System.out.println("EMAIL FAILED: " + e.getMessage());
            }

            return new AuthResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    employeeRole.getRoleName(),
                    null
            );
        }


        /*
            GET ALL EMPLOYEES
         */
        public List<User> getAllEmployees(String adminId) {

            Role employeeRole = roleRepository
                    .findByRoleName("EMPLOYEE")
                    .orElseThrow(() -> new RuntimeException("EMPLOYEE role not found"));

            return userRepository.findByRoleIdAndInvitedBy(
                    employeeRole.getId(),
                    adminId
            );
        }

        public void deleteEmployee(String id) {

            userRepository.deleteById(id);

        }

        public User updateEmployee(String id, CreateUserRequest request) {

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

        /*
           check if email is changed
        */
            if(request.getEmail() != null &&
                    !request.getEmail().equals(user.getEmail())) {

            /*
               prevent duplicate email
            */
                if(userRepository.existsByEmail(request.getEmail())) {

                    throw new RuntimeException("Email already exists");

                }

                user.setEmail(request.getEmail());

            }

            user.setName(request.getName());

            user.setDepartment(
                    request.getDepartment() == null || request.getDepartment().isBlank()
                            ? null
                            : request.getDepartment()
            );

            user.setDesignation(
                    request.getDesignation() == null || request.getDesignation().isBlank()
                            ? null
                            : request.getDesignation()
            );

            user.setStatus(request.getStatus());

            user.setUpdatedAt(LocalDateTime.now());

            return userRepository.save(user);

        }

        public void activateAccount(String token, String password) {

            User user = userRepository
                    .findByInviteToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid activation token"));

            if(user.getInviteExpiry().isBefore(LocalDateTime.now())) {

                throw new RuntimeException("Activation link expired");
            }

            String hashedPassword = passwordEncoder.encode(password);

            user.setPasswordHash(hashedPassword);

            user.setStatus("ACTIVE");

            user.setInviteToken(null);

            user.setInviteExpiry(null);

            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);
        }

        public void resendInvite(String userId) {

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

    /*
        only invited employees allowed
     */
            if(!"INVITED".equals(user.getStatus())) {
                throw new RuntimeException("Only invited employees can receive invite again");
            }

    /*
        generate new token
     */
            String newInviteToken = java.util.UUID.randomUUID().toString();

    /*
        generate new expiry
     */
            user.setInviteToken(newInviteToken);

            user.setInviteExpiry(
                    LocalDateTime.now().plusDays(7)
            );

            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);

    /*
        new invite link
     */
            String inviteLink =
                    frontendUrl + "/setup-password?token=" + newInviteToken;

            System.out.println("=================================");
            System.out.println("RESENT INVITE LINK:");
            System.out.println(inviteLink);
            System.out.println("=================================");

    /*
        resend email
     */
            try {

                emailService.sendInviteEmail(
                        user.getEmail(),
                        inviteLink
                );

                System.out.println("INVITE RESENT SUCCESSFULLY");

            } catch (Exception e) {

                System.out.println(
                        "RESEND INVITE FAILED: " + e.getMessage()
                );
            }
        }

    }