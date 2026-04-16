package com.assetpulse.assetpulse.repository;

import com.assetpulse.assetpulse.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    List<User> findByRoleId(String roleId);
    List<User> findByRoleIdAndInvitedBy(String roleId, String invitedBy);
    long countByRoleId(String roleId);
    Optional<User> findByInviteToken(String inviteToken);

}