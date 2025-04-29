// ✅ WeatherService.java
// 역할: OpenWeather API를 호출해서 현재 날씨, 공기질, 5일 예보 데이터를 받아오는 서비스 클래스

package com.creepy.bit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class WeatherService {

    // 🌟 application.yml에서 OpenWeather API 키를 주입받음
    @Value("${openweather.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate(); // HTTP 통신을 위한 RestTemplate 객체 생성

    // 🌟 현재 날씨 정보 가져오기
    public String getCurrentWeather(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.openweathermap.org/data/2.5/weather")
                .queryParam("lat", lat)          // 위도
                .queryParam("lon", lon)          // 경도
                .queryParam("appid", apiKey)     // API 키
                .queryParam("units", "metric")   // 온도 섭씨
                .queryParam("lang", "kr")        // 한국어
                .toUriString();

        return restTemplate.getForObject(url, String.class); // GET 요청 결과를 문자열로 반환
    }

    // 🌟 공기질(Air Pollution) 정보 가져오기
    public String getAirPollution(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.openweathermap.org/data/2.5/air_pollution")
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("appid", apiKey)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }

    // 🌟 5일 예보 데이터 가져오기 (3시간 간격 데이터)
    public String getForecast(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.openweathermap.org/data/2.5/forecast")
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("appid", apiKey)
                .queryParam("units", "metric")
                .queryParam("lang", "kr")
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }
}
