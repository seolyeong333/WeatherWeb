package com.creepy.bit.domain;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import com.creepy.bit.domain.TarotColorDto;

@Getter
@Setter
public class TarotCardDto {
    private int cardId;
    private String cardName;
    private String description;
    private List<TarotColorDto> colors;
}

