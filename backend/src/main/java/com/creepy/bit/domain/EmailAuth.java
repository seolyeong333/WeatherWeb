package com.creepy.bit.domain;

import java.time.LocalDateTime;

public class EmailAuth {    // 이메일 인증관련 DTO
    private String authKey;
    private LocalDateTime createdAt;

    public EmailAuth(String authKey) {
        this.authKey = authKey;
        this.createdAt = LocalDateTime.now(); 
    }

    public String getAuthKey() {
        return authKey;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}



