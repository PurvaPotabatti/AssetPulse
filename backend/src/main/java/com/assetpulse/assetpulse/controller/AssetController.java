package com.assetpulse.assetpulse.controller;

import com.assetpulse.assetpulse.model.Asset;
import com.assetpulse.assetpulse.service.AssetService;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;


    /*
      CREATE asset
     */
    @PostMapping
    public Asset createAsset(

            @RequestBody Asset asset,

            HttpServletRequest request

    ) {

        String adminId = (String) request.getAttribute("userId");

        return assetService.createAsset(asset, adminId);

    }


    /*
      GET all assets
     */
    @GetMapping
    public List<Asset> getAssets(HttpServletRequest request) {
        String adminId = (String) request.getAttribute("userId");
        return assetService.getAssetsByAdmin(adminId);
    }


    /*
      UPDATE asset
     */
    @PutMapping("/{id}")
    public Asset updateAsset(

            @PathVariable String id,

            @RequestBody Asset asset,

            HttpServletRequest request

    ) {

        String adminId = (String) request.getAttribute("userId");

        return assetService.updateAsset(id, asset, adminId);

    }


    /*
      DELETE asset
     */
    @DeleteMapping("/{id}")
    public void deleteAsset(

            @PathVariable String id,

            HttpServletRequest request

    ) {

        String adminId = (String) request.getAttribute("userId");

        assetService.deleteAsset(id, adminId);

    }

}