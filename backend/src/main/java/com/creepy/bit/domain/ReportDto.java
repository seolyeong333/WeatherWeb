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
    private String content;
    private String status;
    private String createdAt;
}
