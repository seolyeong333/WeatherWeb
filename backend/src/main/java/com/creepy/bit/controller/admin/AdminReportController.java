package com.creepy.bit.controller.admin;

import com.creepy.bit.domain.ReportDto;
import com.creepy.bit.service.admin.AdminReportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    private final AdminReportService adminReportService;

    public AdminReportController(AdminReportService adminReportService) {
        this.adminReportService = adminReportService;
    }

    // 장소 신고 목록 가져오기 (targetType = "place")
    @GetMapping("/place")
    public List<ReportDto> getPlaceReports() {
        return adminReportService.getPlaceReports();
    }
    
    // 한줄평 신고 목록 가져오기 (targetType = "opinion")
    @GetMapping("/opinions")
    public ResponseEntity<List<ReportDto>> getOpinionReports() {
        List<ReportDto> reports = adminReportService.getOpinionReports();
        return ResponseEntity.ok(reports);
    }

    // 신고 상태 변경 처리
    @PatchMapping("/{reportId}/status")
    public void updateReportStatus(@PathVariable int reportId, @RequestParam String status) {
        adminReportService.updateReportStatus(reportId, status);
    }

    // 한줄평 신고 삭제 처리
   @PatchMapping("/opinions/{opinionId}/delete")
    public ResponseEntity<Void> deleteOpinionByAdmin(
            @PathVariable int opinionId,
            @RequestParam int reportId) {

        adminReportService.deleteOpinionAndResolveReport(opinionId, reportId);
        return ResponseEntity.ok().build();
    }

    // 장소 신고 경고 처리
    @PostMapping("/flag-place")
    public ResponseEntity<Void> flagPlace(@RequestBody Map<String, String> body) {
        String placeName = body.get("placeName");
        adminReportService.flagPlace(placeName);
        return ResponseEntity.ok().build();
    }


    // AdminReportController.java

    @GetMapping("/check-flag")
    public ResponseEntity<Map<String, Boolean>> isPlaceFlagged(@RequestParam String placeName) {
        boolean isFlagged = adminReportService.isPlaceFlagged(placeName);
        return ResponseEntity.ok(Collections.singletonMap("flagged", isFlagged));
    }



}
