package com.creepy.bit.controller;

import com.creepy.bit.service.OpenAIService; // OpenAIService 위치에 맞게 수정

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    // 장소 추천 요청
    @PostMapping("/place")
    public ResponseEntity<String> askPlace(@RequestBody Map<String, String> body) {
        String location = body.get("location");
        String category = body.getOrDefault("category", "핫플");
        String answer = openAIService.askPlace(location, category);
        return ResponseEntity.ok(answer);
    }
    
    // 타로 요청
    @PostMapping("/tarot")
    public ResponseEntity<String> askTarot(@RequestBody Map<String, Object> body) {
        List<Map<String, Object>> cards = (List<Map<String, Object>>) body.get("cards");
        String answer = openAIService.askTarot(cards);
        return ResponseEntity.ok(answer);
    }

}
