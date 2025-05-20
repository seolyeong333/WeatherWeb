package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creepy.bit.service.GooglePlaceService;

@RestController
@RequestMapping("/api/google")  // 이 컨트롤러는 "/api/google"로 시작하는 요청을 처리함
public class GooglePlaceController {

    @Autowired
    private GooglePlaceService googlePlaceService;  // 장소 이미지 관련 서비스

    // 장소 이름과 좌표(lat, lon)를 받아 대표 이미지 URL 반환
    @GetMapping("/image")
    public String getPlaceImage(@RequestParam String name, @RequestParam double lat, @RequestParam double lon) {
        return googlePlaceService.getPlaceImageUrl(name, lat, lon);
    }
}
