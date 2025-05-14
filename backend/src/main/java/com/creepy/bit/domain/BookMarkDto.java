package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookMarkDto {
    private int bookmarkId;
    private int userId;
    private String placeId;
    private String placeName;
    private String createdAt;
} 
