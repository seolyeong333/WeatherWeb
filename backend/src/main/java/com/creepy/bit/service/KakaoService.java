package com.creepy.bit.service;

import com.creepy.bit.domain.KakaoMapDto;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

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

    public KakaoMapDto getPlaceById(String placeId) {
    String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + placeId;

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "KakaoAK " + kakaoApiKey);

    HttpEntity<String> entity = new HttpEntity<>(headers);

    ResponseEntity<String> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        entity,
        String.class
    );

    JSONObject json = new JSONObject(response.getBody());
    JSONArray documents = json.getJSONArray("documents");

    if (documents.length() == 0) {
        return null; // 장소 없음
    }

    JSONObject obj = documents.getJSONObject(0); // 첫 번째 장소 정보

    // 모든 필드를 추출해서 생성자에 넘겨줌
    return new KakaoMapDto(
        obj.getString("id"),
        obj.getString("place_name"),
        obj.optString("category_name", ""),
        obj.optString("category_group_code", ""),
        obj.optString("category_group_name", ""),
        obj.optString("phone", ""),
        obj.optString("address_name", ""),
        obj.optString("road_address_name", ""),
        obj.getString("x"),
        obj.getString("y"),
        obj.optString("place_url", ""),
        obj.optString("distance", "")
    );
}



    public List<KakaoMapDto> searchPlacesByCategory(double lat, double lon, String categoryCode, String keyword) {
    String url;

    if (keyword != null && !keyword.isBlank()) {
        // 🔍 키워드 기반 검색
        url = UriComponentsBuilder
                .fromHttpUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
                .queryParam("query", keyword)
                .queryParam("x", lon)
                .queryParam("y", lat)
                .queryParam("radius", 2000)
                .build()
                .toUriString();
    } else {
        // 📂 카테고리 기반 검색
        url = UriComponentsBuilder
                .fromHttpUrl("https://dapi.kakao.com/v2/local/search/category.json")
                .queryParam("category_group_code", categoryCode)
                .queryParam("x", lon)
                .queryParam("y", lat)
                .queryParam("radius", 2000)
                .build()
                .toUriString();
    }

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "KakaoAK " + kakaoApiKey);
    HttpEntity<Void> entity = new HttpEntity<>(headers);

    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    JSONObject json = new JSONObject(response.getBody());
    JSONArray documents = json.getJSONArray("documents");

    List<KakaoMapDto> result = new ArrayList<>();
    for (int i = 0; i < documents.length(); i++) {
        JSONObject doc = documents.getJSONObject(i);
        result.add(new KakaoMapDto(
                doc.getString("id"),
                doc.getString("place_name"),
                doc.getString("category_name"),
                doc.optString("category_group_code", ""),
                doc.optString("category_group_name", ""),
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

    public KakaoMapDto getPlaceByIds(String placeId) {
    // MyBatis 또는 직접 Kakao API 호출해서 처리 가능

        // MyBatis를 통한 DB 저장 방식이 아니라면, 아래처럼 Kakao API 직접 호출
        String url = UriComponentsBuilder.fromHttpUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
            .queryParam("query", placeId) // placeId가 아닌 placeName일 경우 적절히 변경 필요
            .build().toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        JSONObject json = new JSONObject(response.getBody());
        JSONArray documents = json.getJSONArray("documents");

        if (documents.length() == 0) return null;

        JSONObject doc = documents.getJSONObject(0);

        return new KakaoMapDto(
            doc.getString("id"),
            doc.getString("place_name"),
            doc.getString("category_name"),
            doc.optString("category_group_code", null),
            doc.optString("category_group_name", null),
            doc.optString("phone", null),
            doc.getString("address_name"),
            doc.optString("road_address_name", null),
            doc.getString("x"),
            doc.getString("y"),
            doc.getString("place_url"),
            doc.optString("distance", null)
        );
    }

}
