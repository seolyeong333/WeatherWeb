package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportDto {
    private int reportId;
    private int userId;
    private String targetId;
    private String targetType;
    private String placeName;        // 신고 대상 장소명 (place인 경우만: JOIN place_logs.name)
    private String content;
    private String status;
    private String createdAt;

     //  JOIN으로 확장해서 사용할 필드들
    private String reporterNickname; // 신고자 닉네임 (JOIN users.nickname)
    
    private String opinionContent;   // 한줄평 내용 (opinion인 경우만: JOIN opinions.content)
}
