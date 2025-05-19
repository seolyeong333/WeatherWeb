package com.creepy.bit.service;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OnTheLookCrawlerService {

    // 크롤링 결과 캐시 유지 시간 (10분)
    private static final long CACHE_EXPIRE_MS = 1000 * 60 * 10;

    // [key: color:gender:type] 형태로 캐싱 (동시성 처리 위해 ConcurrentHashMap 사용)
    private final Map<String, CachedResult> cacheMap = new ConcurrentHashMap<>();

    // 이미지 결과와 시간 저장용 record
    private record CachedResult(List<String> images, long timestamp) {}

    /**
     * 프론트에서 보낸 색상, 성별, 상/하의 정보를 바탕으로
     * 셀레니움으로 온더룩 사이트에서 이미지 리스트를 크롤링해서 반환
     * - 캐시가 존재하면 캐시 데이터 반환
     * - 없거나 만료되었으면 새로 크롤링
     *
     * @param color  색상 이름 (예: "핑크")
     * @param gender 성별 ("MEN" or "WOMEN")
     * @param type   상의/하의 ("상의" or "하의")
     * @return       이미지 URL 목록 (비동기 방식)
     */
    @Async
    public CompletableFuture<List<String>> crawlFiltered(String color, String gender, String type) {
        String cacheKey = color + ":" + gender + ":" + type;
        long now = System.currentTimeMillis();

        // 캐시에 있고, 아직 유효하면 그대로 반환
        if (cacheMap.containsKey(cacheKey)) {
            CachedResult cached = cacheMap.get(cacheKey);
            if (now - cached.timestamp < CACHE_EXPIRE_MS) {
                System.out.println("✅ [CACHE HIT] " + cacheKey);
                return CompletableFuture.completedFuture(cached.images);
            }
        }

        // 크롬 드라이버 위치 설정 (우분투 환경에 맞게 수정)
        System.setProperty("webdriver.chrome.driver", "C:\\tools\\chromedriver\\chromedriver.exe"); // 윈도우 경로 주석 처리
        // System.setProperty("webdriver.chrome.driver", "/usr/local/bin/chromedriver"); // 👈 우분투 경로로 변경

        // 크롬 실행 옵션 (백그라운드 모드 - 리눅스 서버 환경에서는 headless가 필수)
        ChromeOptions options = new ChromeOptions();
        options.addArguments(
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox", // 루트 사용자가 아닌 경우 또는 Docker 환경에서 필요할 수 있음
            "--disable-dev-shm-usage", // 공유 메모리 문제 방지
            "--window-size=1920,1080", // 가상 윈도우 크기 설정
            "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36" // 일반적인 User-Agent 설정 (버전은 실제 크롬 버전에 맞춰주면 좋음)
        );

        WebDriver driver = null; // try-finally 블록을 위해 외부에 선언
        List<String> imageUrls = new ArrayList<>();

        try {
            System.out.println("🚀 크롤링 시작: " + cacheKey); // 크롤링 시작 로그 추가
            driver = new ChromeDriver(options); // try 블록 안에서 WebDriver 인스턴스 생성

            // 필터에 따라 URL 인코딩 처리
            String categoryKor = type.equals("상의") ? "%EC%83%81%EC%9D%98" : "%ED%95%98%EC%9D%98"; // 상의/하의
            String colorKor = URLEncoder.encode(color, StandardCharsets.UTF_8); // 색상
            String genderCode = gender.equals("MEN") ? "%22MEN%22" : "%22WOMEN%22"; // 성별

            // 온더룩 검색 URL 조합
            String url = String.format(
                "https://onthelook.co.kr/search/result?q=%s&t=post&f={\"gender\":[%s],\"height\":[],\"weight\":[],\"price\":[1000,200000],\"selectedCategory\":\"\",\"selectedSubCategory\":\"\",\"item\":[],\"tpo\":[],\"season\":[],\"mood\":[],\"color\":[\"%s\"],\"randomMood\":\"false\",\"bodyType\":[]}\u0026vt=2\u0026st=POPULAR_STYLE\u0026from=result-intro",
                categoryKor, genderCode, colorKor
            );
            System.out.println("Crawling URL: " + url); // 실제 접속 URL 로그 추가

            driver.get(url);

            // 이미지 태그가 로딩될 때까지 대기 (WebDriverWait 사용)
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15)); // 대기 시간 15초로 늘림
            wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("img.hhcWFz"), 0)); // 하나 이상의 이미지가 로드될 때까지
            // 또는 특정 요소가 확실히 존재하면: wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("img.hhcWFz")));

            // 원하는 이미지 태그들 수집
            List<WebElement> images = driver.findElements(By.cssSelector("img.hhcWFz"));
            for (WebElement img : images) {
                String src = img.getAttribute("src");
                if (src != null && !src.isEmpty()) { // src가 null이거나 비어있지 않은 경우만 추가
                    imageUrls.add(src);
                }
            }

            System.out.println("✅ 크롤링 완료: " + cacheKey + " (" + imageUrls.size() + "개)");

            // 캐시에 저장 (결과가 있을 때만)
            if (!imageUrls.isEmpty()) {
                cacheMap.put(cacheKey, new CachedResult(imageUrls, now));
            }

        } catch (Exception e) {
            System.err.println("❌ 크롤링 중 예외 발생 (" + cacheKey + "): " + e.getMessage()); // 어떤 조건에서 예외가 발생했는지 알 수 있도록 cacheKey 포함
            // e.printStackTrace(); // 필요하다면 전체 스택 트레이스 출력
        } finally {
            if (driver != null) {
                driver.quit(); // WebDriver 종료 (예외 발생 여부와 관계없이 항상 실행)
            }
        }

        return CompletableFuture.completedFuture(imageUrls);
    }
}