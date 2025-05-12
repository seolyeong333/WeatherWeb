package com.creepy.bit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.json.*;

@Service
public class GooglePlaceService {

    @Value("${google.api-key}")
    private String googleApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // 기본 이미지 URL
    private static final String DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

    public String getPlaceImageUrl(String placeName, double lat, double lon) {
        System.out.println("GooglePlaceService 호출");
        try {
            // 1️⃣ Text Search API로 place_id + photo_reference 검색
            String searchUrl = UriComponentsBuilder
                    .fromHttpUrl("https://maps.googleapis.com/maps/api/place/textsearch/json")
                    .queryParam("query", placeName)
                    .queryParam("location", lat + "," + lon)
                    .queryParam("radius", 500)
                    .queryParam("key", googleApiKey)
                    .toUriString();
            System.out.println("🛰️ Google 검색 URL: " + searchUrl);

            ResponseEntity<String> searchResponse = restTemplate.getForEntity(searchUrl, String.class);
            JSONObject searchJson = new JSONObject(searchResponse.getBody());
            JSONArray results = searchJson.getJSONArray("results");

            System.out.println("🔁 Google 검색 결과 개수: " + results.length());

            if (results.length() == 0) return DEFAULT_IMAGE_URL;

            // 2️⃣ 결과 중 photo가 있는 첫 번째 장소 사용
            for (int i = 0; i < results.length(); i++) {
                JSONObject result = results.getJSONObject(i);
                JSONArray photos = result.optJSONArray("photos");
                if (photos != null && photos.length() > 0) {
                    String photoRef = photos.getJSONObject(0).getString("photo_reference");
                    String imageUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="
                            + photoRef + "&key=" + googleApiKey;
                    System.out.println("📷 최종 이미지 URL: " + imageUrl);
                    return imageUrl;
                }
            }

            // 📭 사진 있는 결과가 하나도 없으면 기본 이미지 반환
            return DEFAULT_IMAGE_URL;

        } catch (Exception e) {
            e.printStackTrace();
            return DEFAULT_IMAGE_URL;
        }
    }
}
