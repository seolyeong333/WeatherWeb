package com.creepy.bit.controller;

import com.creepy.bit.util.JWTUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/alarm")
public class AlarmSseController {

    private final Map<Integer, SseEmitter> sseEmitters = new ConcurrentHashMap<>();

    @Autowired
    private JWTUtil jwtUtil;

    public boolean hasEmitter(int userId) {
        return sseEmitters.containsKey(userId);
    }

    @GetMapping(path = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestParam String token) {
         if (!jwtUtil.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰");
        }

        int userId = jwtUtil.getUserId(token);
        System.out.println("✅ SSE 구독 성공 → userId=" + userId);

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        sseEmitters.put(userId, emitter);

        emitter.onCompletion(() -> sseEmitters.remove(userId));
        emitter.onTimeout(() -> sseEmitters.remove(userId));

        try {
            emitter.send(SseEmitter.event().name("CONNECTED").data("SSE 연결됨"));
        } catch (IOException e) {
            emitter.completeWithError(e);
            System.out.println("❌ SSE 전송 실패: " + e.getMessage());
        }

        return emitter;
    }

    public void sendAlarm(int userId, String message) {
          SseEmitter emitter = sseEmitters.get(userId);
        if (emitter != null) {
            try {
                System.out.println("📤 SSE 알림 전송 → userId=" + userId + ", message=" + message); // ✅ 이 줄 꼭 필요
                emitter.send(SseEmitter.event().name("ALARM").data(message));
            } catch (IOException e) {
                emitter.completeWithError(e);
                sseEmitters.remove(userId);
                System.out.println("❌ SSE 전송 실패: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ SSE emitter 없음 → userId=" + userId); // 연결 안 되어 있을 때
        }
    }
}