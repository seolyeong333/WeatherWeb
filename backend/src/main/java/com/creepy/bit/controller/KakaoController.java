package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creepy.bit.service.KakaoService;

@RestController
@RequestMapping("/api/kakao")  // API 시작 경로
@CrossOrigin(origins = "*")    // CORS 허용 (프론트엔드 React에서 호출 가능하게)
public class KakaoController {

    @Autowired
    private KakaoService kakaoService;  // KakaoService 주입

    // GET 요청: /api/kakao/region?lat={위도}&lon={경도}
    @GetMapping("/region")
    public String getRegionName(@RequestParam double lat, @RequestParam double lon) {
        return kakaoService.getRegionName(lat, lon);
    }
}
