package com.creepy.bit.controller;

import com.creepy.bit.domain.ReportDto;
import com.creepy.bit.service.ReportService;
import com.creepy.bit.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private JWTUtil jwtUtil;

    // 🔸 1. 신고하기 (사용자)
    @PostMapping
    public ResponseEntity<String> submitReport(@RequestHeader("Authorization") String token,
                                            @RequestBody ReportDto reportDto) {
        System.out.println("ReportController POST 호출");
        try {
            String pureToken = token.replace("Bearer ", "");
            int userId = jwtUtil.getUserId(pureToken);
            reportDto.setUserId(userId);

            // ✅ 중복 신고 확인
            if (reportService.isDuplicateReport(reportDto)) {
                return ResponseEntity.status(409).body("이미 동일한 내용의 신고가 접수되어 있습니다.");
            }

            reportService.insertReport(reportDto);
            return ResponseEntity.ok("신고 접수 완료");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("신고 접수 실패");
        }
    }


    // 🔸 2. 신고 목록 조회 (사용자: 쿼리 파라미터로 userId 전달)
    @GetMapping(params = "userId")
    public ResponseEntity<List<ReportDto>> getUserReports(@RequestParam int userId) {
        System.out.println("ReportController GET 호출");
        List<ReportDto> list = reportService.getReportsByUserId(userId);
        return ResponseEntity.ok(list);
    }

    // 🔸 3. 신고 목록 조회 (관리자: 전체)
    @GetMapping
    public ResponseEntity<List<ReportDto>> getAllReports() {
        System.out.println("ReportController GET 호출");
        List<ReportDto> list = reportService.getAllReports();
        return ResponseEntity.ok(list);
    }

    // 🔸 4. 신고 자세히 보기
    @GetMapping("/{id}")
    public ResponseEntity<ReportDto> getReportDetail(@PathVariable int id) {
        System.out.println("ReportController /{id} GET 호출");
        ReportDto report = reportService.getReportById(id);
        if (report != null) {
            return ResponseEntity.ok(report);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 🔸 5. 신고 처리 상태 변경 (관리자)
    @PatchMapping("/{id}")
    public ResponseEntity<String> updateReportStatus(@PathVariable int id,
                                                     @RequestBody Map<String, String> body) {
        System.out.println("ReportController /{id} PATCH 호출");
        String status = body.get("status");
        boolean success = reportService.updateReportStatus(id, status);
        if (success) {
            return ResponseEntity.ok("상태 변경 완료");
        } else {
            return ResponseEntity.internalServerError().body("상태 변경 실패");
        }
    }
}
