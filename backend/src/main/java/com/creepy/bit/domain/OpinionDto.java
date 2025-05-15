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
    private boolean isPublic;
    private int likes;
    private int dislikes;
    private String createdAt;
}