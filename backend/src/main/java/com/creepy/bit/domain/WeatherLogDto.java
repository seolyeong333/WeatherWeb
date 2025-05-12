package com.creepy.bit.domain;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class WeatherLogDto {    // 캐시 테이블 할수도 안할수도~
    private int weatherId;
    private String location;
    private double latitude;
    private double longitude;
    private String dateTime;
    private String weather;
    private double temperature;
    private int pm10;
    private int pm25;
    private String createdAt;
}
