package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.List;
import com.creepy.bit.domain.TarotCardDto;
import com.creepy.bit.service.TarotService;

@RestController
@RequestMapping("/api/tarot") 
public class TarotController {

    @Autowired
    private TarotService tarotService;

    @GetMapping("/result")
    public List<TarotCardDto> getTarotResults(@RequestParam int categoryId, @RequestParam List<Integer> cardIds) {
        
        System.out.println("categoryId = " + categoryId);
        System.out.println("cardIds = " + cardIds);
        System.out.println(tarotService.getCardsByIds(categoryId, cardIds));

        return tarotService.getCardsByIds(categoryId, cardIds);
    }
}
