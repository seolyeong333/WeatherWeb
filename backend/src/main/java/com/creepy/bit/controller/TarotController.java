package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.time.LocalDate;

import com.creepy.bit.util.JWTUtil;
import com.creepy.bit.domain.TarotCardDto;
import com.creepy.bit.service.TarotService;

@RestController
@RequestMapping("/api/tarot") 
public class TarotController {

    @Autowired
    private TarotService tarotService;

    @Autowired 
    private JWTUtil jwtUtil;


    @GetMapping("/result")
    public List<TarotCardDto> getTarotResults(@RequestHeader("Authorization") String token, @RequestParam int categoryId, @RequestParam List<Integer> cardIds) {
        String pureToken = token.replace("Bearer ", "");
        int userId = jwtUtil.getUserId(pureToken);

        int count = tarotService.hasPlayedToday(userId, LocalDate.now());
        if (count > 0) {
            return Collections.emptyList(); 
       }
        List<TarotCardDto> cards = tarotService.getCardsByIds(categoryId, cardIds);

        tarotService.savePlayLog(userId, cards);

        return cards;
    }

}
