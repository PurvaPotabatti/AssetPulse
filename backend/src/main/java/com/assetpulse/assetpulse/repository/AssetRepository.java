package com.assetpulse.assetpulse.repository;

import com.assetpulse.assetpulse.model.Asset;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends MongoRepository<Asset, String> {

    // fetch assets belonging to logged-in admin
    List<Asset> findByAdminId(String adminId);

    // check duplicate assetId
    boolean existsByAssetId(String assetId);

    // optional: fetch assets by status
    List<Asset> findByAdminIdAndStatus(String adminId, String status);

    // optional: fetch assets by category
    List<Asset> findByAdminIdAndCategory(String adminId, String category);

}