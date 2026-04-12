package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.model.Asset;
import com.assetpulse.assetpulse.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;

    // CREATE asset
    public Asset createAsset(Asset asset, String adminId) {

        asset.setAdminId(adminId);

        // auto generate assetId
        asset.setAssetId(generateAssetId());

        asset.setCreatedAt(LocalDateTime.now());
        asset.setUpdatedAt(LocalDateTime.now());

        return assetRepository.save(asset);
    }


    // GET all assets for admin
    public List<Asset> getAssetsByAdmin(String adminId) {
        return assetRepository.findByAdminId(adminId);
    }


    // GET single asset
    public Optional<Asset> getAssetById(String id) {
        return assetRepository.findById(id);
    }


    // UPDATE asset
    public Asset updateAsset(String id, Asset updatedAsset, String adminId) {

        Asset existing = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        // ensure asset belongs to same admin
        if (!existing.getAdminId().equals(adminId)) {
            throw new RuntimeException("Unauthorized");
        }

        existing.setName(updatedAsset.getName());
        existing.setCategory(updatedAsset.getCategory());
        existing.setDescription(updatedAsset.getDescription());
        existing.setBrand(updatedAsset.getBrand());
        existing.setModel(updatedAsset.getModel());
        existing.setStatus(updatedAsset.getStatus());
        existing.setPurchaseDate(updatedAsset.getPurchaseDate());
        existing.setWarrantyExpiry(updatedAsset.getWarrantyExpiry());
        existing.setCost(updatedAsset.getCost());
        existing.setLocation(updatedAsset.getLocation());
        existing.setAssignedTo(updatedAsset.getAssignedTo());
        existing.setNotes(updatedAsset.getNotes());

        existing.setUpdatedAt(LocalDateTime.now());

        return assetRepository.save(existing);
    }


    // DELETE asset
    public void deleteAsset(String id, String adminId) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (!asset.getAdminId().equals(adminId)) {
            throw new RuntimeException("Unauthorized");
        }

        assetRepository.deleteById(id);
    }


    // auto generate assetId
    private String generateAssetId() {

        int year = Year.now().getValue();

        int counter = 1;

        String assetId;

        do {

            assetId = String.format(
                    "AST-%d-%04d",
                    year,
                    counter++
            );

        } while (assetRepository.existsByAssetId(assetId));

        return assetId;
    }
}