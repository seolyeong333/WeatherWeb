package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TarotPlayLogsDto {
    private int playId;         // 기록 고유 ID
    private int userId;         // 사용자 ID
    private int tarotId;        // 뽑은 타로 카드 ID
    private LocalDate isPlay;   // 플레이 날짜
    private String description; // 타로 설명
}
