package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creepy.bit.service.KakaoService;

@RestController
@RequestMapping("/api/kakao")  // 이 컨트롤러의 API는 "/api/kakao"로 시작됨
@CrossOrigin(origins = "*")    // 프론트엔드(React)에서 요청 가능하게 CORS 허용
public class KakaoController {

    @Autowired
    private KakaoService kakaoService;  // 위치 조회 로직을 처리할 서비스

    /**
     * 위도/경도를 받아서 → 해당 위치의 행정구역명(예: 서울 강남구 역삼동 등)을 반환
     * 
     * 요청 예시:
     *  GET /api/kakao/region?lat=37.4979&lon=127.0276
     * 
     * @param lat 위도
     * @param lon 경도
     * @return 해당 좌표의 지역명 (카카오 API 응답 결과 그대로 문자열 반환)
     */
    @GetMapping("/region")
    public String getRegionName(@RequestParam double lat, @RequestParam double lon) {
        // 실질적인 API 호출은 KakaoService가 처리
        return kakaoService.getRegionName(lat, lon);
    }
}
