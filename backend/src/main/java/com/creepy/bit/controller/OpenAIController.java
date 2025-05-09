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
        String question = body.get("question");
        String answer = openAIService.ask(question);
        return ResponseEntity.ok(answer);
    }
}
