package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherMessageDto {
    private int weatherMessageId;
    private String weatherType;
    private double minTemp;
    private double maxTemp;
    private String message;
    private String weatherFit;

}
