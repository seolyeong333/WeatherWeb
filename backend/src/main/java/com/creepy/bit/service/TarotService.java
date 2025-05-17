package com.creepy.bit.service;

import com.creepy.bit.domain.TarotCardDto;
import com.creepy.bit.domain.TarotColorDto;
import com.creepy.bit.domain.TarotPlayLogsDto;
import com.creepy.bit.mapper.MainMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

import java.time.LocalDate;

@Service
public class TarotService {

    @Autowired
    private MainMapper mainMapper;

    public int hasPlayedToday(int userId, LocalDate today) {
    return mainMapper.countPlayLogsToday(userId, today);
    }


    public List<TarotCardDto> getCardsByIds(int categoryId, List<Integer> cardIds) {
        List<TarotCardDto> cards = mainMapper.getCardsByIds(categoryId, cardIds);
        Random random = new Random();

        for (TarotCardDto card : cards) {
            List<TarotColorDto> allColors = mainMapper.getColorsByCardId(card.getCardId());

            if (allColors != null && !allColors.isEmpty()) {
                // ✅ 랜덤 1개만 선택해서 리스트로 감싸기
                TarotColorDto selected = allColors.get(random.nextInt(allColors.size()));
                card.setColors(List.of(selected));
            } else {
                card.setColors(List.of()); // 비어있으면 빈 리스트
            }

            System.out.println(card.getCardName() + " → 선택된 색상: " + 
                (card.getColors().isEmpty() ? "없음" : card.getColors().get(0).getColorName()));
        }

        return cards;
    }

    public void savePlayLog(int userId, List<TarotCardDto> cards) {
        for (TarotCardDto card : cards) {
            TarotPlayLogsDto log = new TarotPlayLogsDto();
            log.setUserId(userId);
            log.setCardId(card.getCardId());
            log.setIsPlay(LocalDate.now());
            log.setDescription(card.getDescription());

            mainMapper.insertPlayLog(log);
        }

    }



}
