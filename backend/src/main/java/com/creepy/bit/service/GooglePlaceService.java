package com.creepy.bit.service;

import org.json.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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
            // ✅ 2. Google Text Search API 호출
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

            // ✅ 3. API 결과 중 사진 있는 경우 우선 사용
            for (int i = 0; i < results.length(); i++) {
                JSONObject result = results.getJSONObject(i);
                JSONArray photos = result.optJSONArray("photos");
                if (photos != null && photos.length() > 0) {
                    String photoRef = photos.getJSONObject(0).getString("photo_reference");
                    String imageUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="
                            + photoRef + "&key=" + googleApiKey;
                    System.out.println("📷 API 이미지 URL: " + imageUrl);

                    // ✅ 캐시 저장 후 반환
                    imageCache.put(placeName, imageUrl);
                    return imageUrl;
                }
            }

            // ✅ 4. Selenium 크롤링 fallback
            System.out.println("📭 Google API에 사진 없음, Selenium으로 크롤링 시도");
            String imageUrl = crawlGoogleMapImageWithSelenium(placeName);
            imageCache.put(placeName, imageUrl);
            return imageUrl;

        } catch (Exception e) {
            e.printStackTrace();
            return DEFAULT_IMAGE_URL;
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