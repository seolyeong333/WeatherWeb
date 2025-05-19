package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

import java.time.LocalDate;

import com.creepy.bit.util.JWTUtil;
import com.creepy.bit.domain.TarotCardDto;
import com.creepy.bit.domain.TarotPlayLogsDto;
import com.creepy.bit.service.TarotService;
import com.creepy.bit.service.OpenAIService;

@RestController
@RequestMapping("/api/tarot") 
public class TarotController {

    @Autowired
    private TarotService tarotService;
    
    @Autowired
    private OpenAIService openAiService;

    @Autowired 
    private JWTUtil jwtUtil;

     @GetMapping("/mylogs")
    public ResponseEntity<List<TarotPlayLogsDto>> getMyLogs(@RequestHeader("Authorization") String token) {
        String pureToken = token.replace("Bearer ", "");
        int userId = jwtUtil.getUserId(pureToken);
        System.out.println(userId);

        List<TarotPlayLogsDto> logs = tarotService.getMyTarotLogs(userId);
        System.out.println(logs);

        return ResponseEntity.ok(logs);
    }


    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkPlayedToday(@RequestHeader("Authorization") String token) {
        String pureToken = token.replace("Bearer ", "");
        int userId = jwtUtil.getUserId(pureToken);

        boolean played = tarotService.hasPlayedToday(userId, LocalDate.now()) > 0;

        Map<String, Boolean> response = new HashMap<>();
        response.put("played", played);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/result")
    public ResponseEntity<Map<String, Object>> getTarotResults( @RequestHeader("Authorization") String token, @RequestBody List<Integer> cardIds
    ) {
        String pureToken = token.replace("Bearer ", "");
        int userId = jwtUtil.getUserId(pureToken);

        List<TarotCardDto> cards = tarotService.getCardsByIds(cardIds);

        // 카드 정보를 AI에게 보낼 수 있는 형식으로 변환
        List<Map<String, Object>> selectedCardsInfo = cards.stream().map(card -> {
            Map<String, Object> map = new HashMap<>();
            map.put("cardName", card.getCardName());
            map.put("description", card.getDescription());
            map.put("colors", card.getColors().stream().map(color -> {
                Map<String, String> c = new HashMap<>();
                c.put("colorName", color.getColorName());
                return c;
            }).toList());
            return map;
        }).toList();

        String message = openAiService.askTarot(selectedCardsInfo);

        Map<String, Object> response = new HashMap<>();
        response.put("cards", cards);
        response.put("message", message);
        tarotService.savePlayLog(userId, cards, message);

        return ResponseEntity.ok(response);
    }








}
