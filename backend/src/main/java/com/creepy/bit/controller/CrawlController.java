package com.creepy.bit.controller;

import com.creepy.bit.service.OnTheLookCrawlerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/crawl") // 모든 크롤링 요청은 이 경로로 시작
public class CrawlController {

    @Autowired
    private OnTheLookCrawlerService onTheLookCrawlerService;

    /**
     * [GET] /api/crawl/onthelook
     * 프론트에서 색상, 성별, 종류(상의/하의) 정보를 쿼리로 넘기면
     * 해당 조건에 맞는 코디 이미지들을 크롤링해서 비동기로 반환해줌
     *
     * @param color  색상 이름 (예: "핑크")
     * @param gender 성별 ("MEN" 또는 "WOMEN"), 기본값은 "MEN"
     * @param type   종류 ("상의" 또는 "하의"), 기본값은 "상의"
     * @return 크롤링된 이미지 URL 리스트 (비동기 처리)
     */
    @GetMapping("/onthelook")
    public CompletableFuture<List<String>> getOnTheLookImages(
            @RequestParam String color,
            @RequestParam(defaultValue = "MEN") String gender,
            @RequestParam(defaultValue = "상의") String type
    ) {
        return onTheLookCrawlerService.crawlFiltered(color, gender, type);
    }
}
