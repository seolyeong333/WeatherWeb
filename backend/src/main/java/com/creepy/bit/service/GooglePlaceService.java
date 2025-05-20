package com.creepy.bit.service;

import org.json.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.net.URLEncoder;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.chrome.ChromeDriver;

@Service
public class GooglePlaceService {

    @Value("${googlemap.api-key}")
    private String googleApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ 장소 이름 → 이미지 URL 캐시
    private final Map<String, String> imageCache = new ConcurrentHashMap<>();

    // 기본 이미지 URL
    private static final String DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

        public String getPlaceImageUrl(String placeName, double lat, double lon) {
    System.out.println("GooglePlaceService 호출");

    // ✅ 1. 캐시 먼저 확인
    if (imageCache.containsKey(placeName)) {
        System.out.println("🟡 캐시 HIT: " + placeName);
        return imageCache.get(placeName);
    }
    System.out.println("🔵 캐시 MISS: " + placeName);

    try {
        // ✅ 2. FindPlaceFromText → place_id 얻기
        String findPlaceUrl = UriComponentsBuilder
                .fromHttpUrl("https://maps.googleapis.com/maps/api/place/findplacefromtext/json")
                .queryParam("input", placeName)
                .queryParam("inputtype", "textquery")
                .queryParam("locationbias", "circle:5000@" + lat + "," + lon)
                .queryParam("fields", "place_id")
                .queryParam("key", googleApiKey)
                .toUriString();

        System.out.println("🔍 FindPlaceFromText URL: " + findPlaceUrl);

        ResponseEntity<String> response = restTemplate.getForEntity(findPlaceUrl, String.class);
        JSONObject json = new JSONObject(response.getBody());
        JSONArray candidates = json.getJSONArray("candidates");
/*
        if (candidates.length() == 0) {
            System.out.println("❌ 후보 없음 (place_id 못 찾음)");
            return crawlGoogleMapImageWithSelenium(placeName); // fallback
        }
*/
// 임시 방편 이라는거
        if (candidates == null || candidates.length() == 0) {
            System.out.println("❌ 후보 없음 (place_id 못 찾음)");
            return DEFAULT_IMAGE_URL; // 또는 fallback 이미지 크롤링
        }

        String placeId = candidates.getJSONObject(0).getString("place_id");
        System.out.println("✅ 찾은 place_id: " + placeId);

        // ✅ 3. Place Details 호출 → photo_reference 얻기
        String detailsUrl = UriComponentsBuilder
                .fromHttpUrl("https://maps.googleapis.com/maps/api/place/details/json")
                .queryParam("place_id", placeId)
                .queryParam("fields", "photo")
                .queryParam("key", googleApiKey)
                .toUriString();

        System.out.println("📡 Place Details URL: " + detailsUrl);

        ResponseEntity<String> detailsResponse = restTemplate.getForEntity(detailsUrl, String.class);
        JSONObject detailsJson = new JSONObject(detailsResponse.getBody());
        JSONObject result = detailsJson.optJSONObject("result");

        if (result != null) {
            JSONArray photos = result.optJSONArray("photos");
            if (photos != null && photos.length() > 0) {
                String photoRef = photos.getJSONObject(0).getString("photo_reference");
                String imageUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
                        photoRef + "&key=" + googleApiKey;

                System.out.println("📷 API 이미지 URL: " + imageUrl);
                imageCache.put(placeName, imageUrl);
                return imageUrl;
            }
        }
/*
        System.out.println("⚠️ 사진 없음 → Selenium fallback");
        String imageUrl = crawlGoogleMapImageWithSelenium(placeName);
        imageCache.put(placeName, imageUrl);
        return imageUrl;
*/
        return DEFAULT_IMAGE_URL;

    } catch (Exception e) {
        System.out.println("❗ 이미지 조회 중 오류 발생");
        e.printStackTrace();
        return DEFAULT_IMAGE_URL;
    }
}

      public double getPlaceRating(String placeName, double lat, double lon) {
    try {
        
        String encodedName = URLEncoder.encode(placeName, StandardCharsets.UTF_8);

        String findPlaceUrl = UriComponentsBuilder
                .fromHttpUrl("https://maps.googleapis.com/maps/api/place/findplacefromtext/json")
                .queryParam("input", encodedName)
                .queryParam("inputtype", "textquery")
                .queryParam("locationbias", "circle:5000@" + lat + "," + lon)
                .queryParam("fields", "place_id")
                .queryParam("key", googleApiKey)
                .toUriString();

        System.out.println("🔍 FindPlaceFromText URL: " + findPlaceUrl);

        ResponseEntity<String> response = restTemplate.getForEntity(findPlaceUrl, String.class);
        JSONObject json = new JSONObject(response.getBody());
        JSONArray candidates = json.optJSONArray("candidates");

        if (candidates == null || candidates.length() == 0) {
            System.out.println("❌ 후보 없음 (place_id 못 찾음)");
            return 0.0;
        }

        String placeId = candidates.getJSONObject(0).getString("place_id");
        System.out.println("✅ 찾은 place_id: " + placeId);

        // 2️⃣ Place Details API 호출 - 평점 가져오기
        String detailsUrl = UriComponentsBuilder
                .fromHttpUrl("https://maps.googleapis.com/maps/api/place/details/json")
                .queryParam("place_id", placeId)
                .queryParam("fields", "rating")
                .queryParam("key", googleApiKey)
                .toUriString();

        System.out.println("📡 Place Details URL: " + detailsUrl);

        ResponseEntity<String> detailsResponse = restTemplate.getForEntity(detailsUrl, String.class);
        JSONObject detailsJson = new JSONObject(detailsResponse.getBody());

        JSONObject result = detailsJson.optJSONObject("result");
        if (result != null && result.has("rating")) {
            double rating = result.getDouble("rating");
            System.out.println("🌟 평점: " + rating);
            return rating;
        } else {
            System.out.println("⚠️ 평점 없음");
            return 0.0;
        }

    } catch (Exception e) {
        System.out.println("❗ 평점 조회 중 오류 발생");
        e.printStackTrace();
        return 0.0;
    }
}
    // ✅ 셀레니움 크롤링 함수
    public String crawlGoogleMapImageWithSelenium(String placeName) {
        System.out.println("📸 Selenium 이미지 크롤링 시작");

        try {
            // ✅ 크롬 드라이버 경로 지정
            System.setProperty("webdriver.chrome.driver", "C:/tools/chromedriver/chromedriver.exe");

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");

            WebDriver driver = new ChromeDriver(options);

            String searchUrl = "https://www.google.com/maps/search/" + URLEncoder.encode(placeName, "UTF-8");
            driver.get(searchUrl);

            Thread.sleep(3000); // 렌더링 대기

            WebElement img = driver.findElement(By.cssSelector("img[src^='https://lh3.googleusercontent.com']"));
            String imageUrl = img.getAttribute("src");

            System.out.println("✅ 크롤링된 이미지 URL: " + imageUrl);
            driver.quit();
            return imageUrl;

        } catch (Exception e) {
            e.printStackTrace();
            return DEFAULT_IMAGE_URL;
        }
    }


}