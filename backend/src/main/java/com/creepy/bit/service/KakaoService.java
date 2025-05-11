package com.creepy.bit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONObject;

import com.creepy.bit.domain.KakaoMapDto;

@Service
public class KakaoService {

    // application.properties에 설정된 카카오 REST API 키
    @Value("${kakaomap.rest-api-key}")
    private String kakaoApiKey;

    // HTTP 요청 보낼 때 사용하는 도구 (Spring 기본 제공)
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 위도(lat), 경도(lon)를 받아서 → 카카오 API를 통해 지역명(행정구역명)을 가져온다.
     * 예: 37.5665, 126.9780 → "서울특별시 중구 명동"
     */
    public String getRegionName(double lat, double lon) {
        // Kakao API 호출용 URL 만들기 (x=경도, y=위도 순서임)
        String url = UriComponentsBuilder
                .fromHttpUrl("https://dapi.kakao.com/v2/local/geo/coord2regioncode.json")
                .queryParam("x", lon)
                .queryParam("y", lat)
                .toUriString();

        // 요청 헤더에 인증 정보 넣기 (필수)
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);  // KakaoAK 붙여야 함

        // 본문 없이 헤더만 포함된 요청 객체 생성
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 실제 요청 날리기 (GET 방식)
        // - 응답은 그냥 문자열로 받아둔다 (JSON 그대로)
        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, String.class
        );

        // 결과 본문 리턴 (JSON 텍스트)
        return response.getBody();
    }

    public List<KakaoMapDto> searchPlacesByCategory(double lat, double lon, String categoryCode) {
            String url = "https://dapi.kakao.com/v2/local/search/category.json" +
                        "?category_group_code=" + categoryCode +
                        "&x=" + lon + "&y=" + lat + "&radius=2000";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoApiKey);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class
            );

            JSONObject json = new JSONObject(response.getBody());
            JSONArray documents = json.getJSONArray("documents");

            List<KakaoMapDto> result = new ArrayList<>();
            for (int i = 0; i < documents.length(); i++) {
                JSONObject doc = documents.getJSONObject(i);
                result.add(new KakaoMapDto(
                    doc.getString("id"),
                    doc.getString("place_name"),
                    doc.getString("category_name"),
                    doc.getString("category_group_code"),
                    doc.getString("category_group_name"),
                    doc.optString("phone", ""),
                    doc.getString("address_name"),
                    doc.optString("road_address_name", ""),
                    doc.getString("x"),
                    doc.getString("y"),
                    doc.optString("place_url", ""),
                    doc.optString("distance", "")
                ));
            }

        return result;
    }


}
