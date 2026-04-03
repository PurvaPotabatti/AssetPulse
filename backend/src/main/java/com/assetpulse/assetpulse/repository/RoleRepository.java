package com.assetpulse.assetpulse.repository;

import com.assetpulse.assetpulse.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {

    Optional<Role> findByRoleName(String roleName);

}