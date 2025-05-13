package com.creepy.bit.controller;

import com.creepy.bit.service.OpenAIService; // OpenAIService 위치에 맞게 수정

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/ask")
    public ResponseEntity<String> ask(@RequestBody Map<String, String> body) {
        System.out.println("OpenAIController POST ask 호출");
        String location = body.get("location");
        System.out.println(location);
        String category = (String) body.getOrDefault("category", "핫플");
        String answer = openAIService.ask(location, category);
        System.out.println("OpenAIController "+answer);
        return ResponseEntity.ok(answer);
    }
}
