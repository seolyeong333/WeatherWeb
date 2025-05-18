package com.creepy.bit.service;

import com.creepy.bit.domain.TarotCardDto;
import com.creepy.bit.domain.TarotColorDto;
import com.creepy.bit.domain.TarotPlayLogsDto;
import com.creepy.bit.mapper.MainMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import java.time.LocalDate;

@Service
public class TarotService {

    @Autowired
    private MainMapper mainMapper;

    public int hasPlayedToday(int userId, LocalDate today) {
    return mainMapper.countPlayLogsToday(userId, today);
    }

    public List<TarotPlayLogsDto> getMyTarotLogs(int userId) {
        return mainMapper.getPlayMyLogs(userId);
    }

    public List<TarotCardDto> getCardsByIds(List<Integer> cardIds) {
        List<TarotCardDto> cards = mainMapper.getCardsByIds(cardIds);
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

    public void savePlayLog(int userId, List<TarotCardDto> cards, String message) {
    TarotPlayLogsDto log = new TarotPlayLogsDto();
    log.setUserId(userId);
    log.setIsPlay(LocalDate.now());
    log.setDescription(message);  // AI 메시지 저장

    // 카드 ID 리스트 → "1,3,10"
    String cardIdList = cards.stream()
        .map(card -> String.valueOf(card.getCardId()))
        .collect(Collectors.joining(","));
    log.setCardIds(cardIdList);

    // 색상 이름 리스트 → "빨강,파랑,노랑"
    String colorList = cards.stream()
        .map(card -> {
            if (card.getColors() != null && !card.getColors().isEmpty()) {
                return card.getColors().get(0).getColorName(); // 랜덤 1개만 저장했으므로
            }
            return "없음";
        })
        .collect(Collectors.joining(","));
    log.setCardColors(colorList);

    mainMapper.insertPlayLog(log);
}

}
