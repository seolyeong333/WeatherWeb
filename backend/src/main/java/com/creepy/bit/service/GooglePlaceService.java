package com.creepy.bit.service;

import org.jsoup.Jsoup;
import org.jsoup.Connection;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GooglePlaceService {

    // 장소 이름 → 이미지 URL 캐시 (메모리 기반)
    private final Map<String, String> imageCache = new ConcurrentHashMap<>();

    private static final String DEFAULT_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

    // 장소 이름을 받아 이미지 URL을 반환
    public String getPlaceImageUrl(String placeName, double lat, double lon) {
        // 캐시에 있으면 바로 반환
        if (imageCache.containsKey(placeName)) {
            return imageCache.get(placeName);
        }

        // 없으면 크롤링 시도
        String imageUrl = crawlGoogleImageWithJsoup(placeName);
        imageCache.put(placeName, imageUrl);
        return imageUrl;
    }

    // Google 이미지 검색에서 첫 번째 이미지를 가져오는 크롤링 함수
    public String crawlGoogleImageWithJsoup(String placeName) {
        try {
            // 구글 이미지 검색 URL 구성
            String query = URLEncoder.encode(placeName + " 이미지", StandardCharsets.UTF_8);
            String url = "https://www.google.com/search?q=" + query + "&tbm=isch";

            // 브라우저처럼 요청하기 위한 User-Agent 설정
            Connection connection = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(5000);

            // HTML 파싱
            Document doc = connection.get();

            // 첫 번째 진짜 이미지 선택 (0번은 구글 로고일 가능성)
            Element img = doc.select("img").get(1);
            return img.attr("src");

        } catch (Exception e) {
            e.printStackTrace();
            return DEFAULT_IMAGE_URL;
        }
    }
}
