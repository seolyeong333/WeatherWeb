package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.creepy.bit.domain.KakaoMapDto;
import com.creepy.bit.service.GooglePlaceService;

@RestController
@RequestMapping("/api/google")  // 이 컨트롤러의 API는 "/api/google"로 시작됨
public class GooglePlaceController {

    @Autowired
    private GooglePlaceService googlePlaceService;  // 위치 조회 로직을 처리할 서비스

    @GetMapping("/image")
    public String getPlaceImage(@RequestParam String name, @RequestParam double lat, @RequestParam double lon) {
        System.out.println("GooglePlaceController /image GET 호출");
        return googlePlaceService.getPlaceImageUrl(name, lat, lon);
    }


}
