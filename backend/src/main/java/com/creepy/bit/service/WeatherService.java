package com.creepy.bit.service;

import com.creepy.bit.domain.WeatherMessageDto;
import com.creepy.bit.domain.FashionColorsDto;
import com.creepy.bit.mapper.MainMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import org.json.JSONObject;
import org.json.JSONArray;

import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class WeatherService {

    @Autowired
    private MainMapper mainMapper;

    // OpenWeather에서 발급받은 API 키 (yml 또는 properties에 설정돼 있어야 함)
    @Value("${openweather.api.key}")
    private String apiKey;

    // HTTP 요청용 객체. REST API 호출할 때 사용
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 현재 날씨 데이터를 가져옴
     * 호출 예시: https://api.openweathermap.org/data/2.5/weather?lat=...&lon=...
     * lang=kr 설정 덕분에 날씨 상태 설명이 한글로 옴
     */
    public String getCurrentWeather(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.openweathermap.org/data/2.5/weather")
                .queryParam("lat", lat)              // 위도
                .queryParam("lon", lon)              // 경도
                .queryParam("appid", apiKey)         // 내 API 키
                .queryParam("units", "metric")       // 섭씨(°C) 기준으로 받기
                .queryParam("lang", "kr")            // 한글로 받기
                .toUriString();

        // 요청해서 결과(JSON 문자열)를 그대로 리턴
        return restTemplate.getForObject(url, String.class);
    }

    /**
     * 현재 위치 기준의 공기 오염 정보 가져옴 (미세먼지 등)
     * 호출 예시: https://api.openweathermap.org/data/2.5/air_pollution?lat=...&lon=...
     */
    public String getAirPollution(double lat, double lon) {
        String url = UriComponentsBuilder.fromHttpUrl("https://api.openweathermap.org/data/2.5/air_pollution")
                .queryParam("lat", lat)
                .queryParam("lon", lon)
                .queryParam("appid", apiKey)
                .toUriString();

        return restTemplate.getForObject(url, String.class);
    }

    /**
     * 5일간 날씨 예보 (3시간 간격 데이터로 최대 40개 정도 옴)
     * 예보 정보는 날씨별 아이콘, 온도, 구름 등 다양하게 포함됨
     */
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

    public WeatherMessageDto getMatchedMessage(String weatherType, double feelsLike) {
        // DB에서 조건에 맞는 메시지 하나 가져오기
        return mainMapper.findByWeatherTypeAndTempRange(weatherType, feelsLike);
    }


    public String getCurrentWeatherType() {
        // 예시: 서울 위도/경도
        double lat = 37.5665;
        double lon = 126.9780;
        String res = getCurrentWeather(lat, lon);

        JSONObject json = new JSONObject(res);
        String description = json.getJSONArray("weather").getJSONObject(0).getString("description");

        // 날씨 상태 간단화 (맑음, 흐림, 비 등)
        if (description.contains("맑")) return "맑음";
        if (description.contains("흐") || description.contains("구름")) return "흐림";
        if (description.contains("비")) return "비";
        if (description.contains("눈")) return "눈";
        if (description.contains("천둥") || description.contains("번개")) return "천둥번개";

        return "기타";
    }

    public String getCurrentAirCondition() {
        double lat = 37.5665;
        double lon = 126.9780;
        String res = getAirPollution(lat, lon);

        JSONObject json = new JSONObject(res);
        double pm10 = json.getJSONArray("list").getJSONObject(0).getJSONObject("components").getDouble("pm10");

        if (pm10 <= 30) return "좋음";
        if (pm10 <= 80) return "보통";
        if (pm10 <= 150) return "나쁨";
        return "매우 나쁨";
    }

    // 체감 온도별 아이콘 매칭
    public FashionColorsDto getFashionRecommendation(String weatherType, double feelsLike) {
        FashionColorsDto dto = mainMapper.findFashionIcons(weatherType, feelsLike);
        if (dto == null || dto.getItemSuggestion() == null || dto.getItemSuggestion().isBlank()) {
            return null; // fallback 없음
        }

        List<String> items = Arrays.stream(dto.getItemSuggestion().split(","))
                                .map(String::trim)
                                .collect(Collectors.toList());
        dto.setItemSuggestionList(items);
        return dto;
    }

}
