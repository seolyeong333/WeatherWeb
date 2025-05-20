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
        System.out.println("AlarmController POST 호출");

        try {
            Integer existingAlarmId = alarmService.findDuplicateAlarm(alarmDto);

            if (existingAlarmId == null) {
                // 🔹 중복 없음 → 새로 insert
                alarmService.insertAlarm(alarmDto);
                return ResponseEntity.ok("알림 설정 완료");
            } else {
                // 🔸 중복 있음 → update
                alarmDto.setAlarmId(existingAlarmId); // 업데이트용 ID 설정
                alarmService.updateAlarm(alarmDto);
                return ResponseEntity.ok("알림이 업데이트되었습니다");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("알림 설정 실패");
        }
    }

    // 알림 목록 조회 (userId 기반)
    @GetMapping
    public ResponseEntity<List<AlarmDto>> getAlarms(@RequestParam int userId) {
        System.out.println("AlarmController GET 호출");
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
        System.out.println("AlarmController DELETE /{id} 호출");
        try {
            alarmService.deleteAlarm(alarmId);
            return ResponseEntity.ok("알림 삭제 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("알림 삭제 실패");
        }
    }
/*
    // 알림 수정
    @PatchMapping("/{id}")
    public ResponseEntity<String> updateAlarm(
            @PathVariable("id") int alarmId,
            @RequestBody Map<String, String> updateData) {
        System.out.println("AlarmController PATCH /{id} 호출");
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
    */
}
