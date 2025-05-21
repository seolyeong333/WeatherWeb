package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpinionDto {
    private int opinionId;
    private int userId;
    private String placeId;
    private String placeName;
    private String content;
    private int rating;
    private boolean isPublic;
    private String createdAt;
}