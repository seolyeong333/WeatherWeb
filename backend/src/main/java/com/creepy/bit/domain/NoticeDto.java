package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeDto {
    private int noticeId;
    private String title;
    private String content;
    private String createdAt;

}