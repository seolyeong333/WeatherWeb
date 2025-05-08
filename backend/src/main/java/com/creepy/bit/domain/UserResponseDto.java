package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class UserResponseDto {
    private int userId;
    private String email;
    private String nickname;
    private String gender;
    private LocalDate birthday;
    private String provider; 
    private String auth; 
    private String createdAt; 
}

