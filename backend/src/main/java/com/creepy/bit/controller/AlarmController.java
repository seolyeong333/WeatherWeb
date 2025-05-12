package com.creepy.bit.controller;

import com.creepy.bit.domain.AlarmDto;
import com.creepy.bit.service.AlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alarms")
public class AlarmController {

    @Autowired
    private AlarmService alarmService;

    // 알림 추가
    @PostMapping
    public ResponseEntity<String> addAlarm(@RequestBody AlarmDto alarmDto) {
        try {
            alarmService.insertAlarm(alarmDto);
            return ResponseEntity.ok("알림 설정 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("알림 설정 실패");
        }
    }   

    // 알림 목록 조회 (userId 기반)
    @GetMapping
    public ResponseEntity<List<AlarmDto>> getAlarms(@RequestParam int userId) {
        try {
            List<AlarmDto> alarms = alarmService.getAlarmsByUser(userId);
            return ResponseEntity.ok(alarms);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 알림 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAlarm(@PathVariable("id") int alarmId) {
        try {
            alarmService.deleteAlarm(alarmId);
            return ResponseEntity.ok("알림 삭제 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("알림 삭제 실패");
        }
    }

    // 알림 수정
    @PatchMapping("/{id}")
    public ResponseEntity<String> updateAlarm(
            @PathVariable("id") int alarmId,
            @RequestBody Map<String, String> updateData) {
        try {
            String conditionType = updateData.get("conditionType");
            String value = updateData.get("value");
            alarmService.updateAlarm(alarmId, conditionType, value);
            return ResponseEntity.ok("알림 수정 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("알림 수정 실패");
        }
    }
}
