package com.creepy.bit.service;

import com.creepy.bit.domain.TarotCardDto;
import com.creepy.bit.domain.TarotColorDto;
import com.creepy.bit.mapper.MainMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TarotService {

    @Autowired
    private MainMapper mainMapper;

    public List<TarotCardDto> getCardsByIds(int categoryId, List<Integer> cardIds) {
        List<TarotCardDto> cards = mainMapper.getCardsByIds(categoryId, cardIds);

        for (TarotCardDto card : cards) {
            List<TarotColorDto> colors = mainMapper.getColorsByCardId(card.getCardId());
            card.setColors(colors);
        }

        return cards;
    }

}
