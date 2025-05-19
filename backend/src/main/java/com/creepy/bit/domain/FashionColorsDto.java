package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
// import java.util.ArrayList;

@Getter
@Setter
public class FashionColorsDto {
    private int id;
    private String weatherType;
    private double minTemp;
    private double maxTemp;
    private String colorCode;
    private String itemSuggestion;  // DB에서 받은 아이콘 문자열 
    private List<String> itemSuggestionList; // = new ArrayList<>(); // 프론트로 보내줄 아이콘 List
}
