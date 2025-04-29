package com.creepy.bit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class KakaoService {

    @Value("${kakao.rest-api-key}")  // application.properties에 등록된 키를 불러옴
    private String kakaoApiKey;

    private final RestTemplate restTemplate = new RestTemplate();  // HTTP 요청 보내는 객체

    // 위도(lat)와 경도(lon)를 받아 한글 지역명을 가져오는 메소드
    public String getRegionName(double lat, double lon) {
        // 카카오맵 Reverse Geocoding URL 생성
        String url = UriComponentsBuilder.fromHttpUrl("https://dapi.kakao.com/v2/local/geo/coord2regioncode.json")
                .queryParam("x", lon)  // 카카오는 경도(x), 위도(y) 순서
                .queryParam("y", lat)
                .toUriString();

        // Authorization 헤더 세팅
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // GET 요청 보내기 (헤더 포함)
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        // 결과 JSON 문자열로 반환
        return response.getBody();
    }
}