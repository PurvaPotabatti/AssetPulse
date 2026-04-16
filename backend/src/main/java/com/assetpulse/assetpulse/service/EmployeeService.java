package com.assetpulse.assetpulse.service;

import com.assetpulse.assetpulse.dto.MyAssetDTO;
import com.assetpulse.assetpulse.model.Assignment;
import com.assetpulse.assetpulse.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final AssignmentRepository assignmentRepository;

    public EmployeeService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public List<MyAssetDTO> getMyAssets(String employeeId) {

        List<Assignment> assignments =
                assignmentRepository.findByEmployeeIdAndStatus(
                        employeeId,
                        "ASSIGNED"
                );

        return assignments.stream()
                .map(a -> new MyAssetDTO(

                        a.getId(),

                        a.getAssetName(),

                        a.getAssetId(),

                        "Laptop", // temporary until category stored in assignment

                        a.getAssignedDate(),

                        a.getCondition(),

                        mapConditionToStatus(a.getCondition())

                ))
                .collect(Collectors.toList());
    }

    private String mapConditionToStatus(String condition) {

        if(condition == null)
            return "ASSIGNED";

        switch(condition) {

            case "NEEDS_REPAIR":
            case "DAMAGED":
                return "IN_MAINTENANCE";

            default:
                return "ASSIGNED";
        }
    }

}