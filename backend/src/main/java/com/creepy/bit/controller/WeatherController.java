// ✅ WeatherController.java
// 역할: 프론트엔드 요청을 받아서 WeatherService를 호출하고, 결과를 API로 응답하는 컨트롤러

package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creepy.bit.service.WeatherService;

@RestController
@RequestMapping("/api/weather") // API 경로를 "/api/weather"로 통일
@CrossOrigin(origins = "*") // 모든 도메인에서 CORS 허용 (React 프론트에서 호출 가능하게)
public class WeatherController {

    @Autowired
    private WeatherService weatherService; // WeatherService 주입

    // 🌟 현재 날씨 데이터 요청을 처리하는 메소드
    @GetMapping("/current")
    public String current(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getCurrentWeather(lat, lon);
    }

    // 🌟 공기질 데이터 요청을 처리하는 메소드
    @GetMapping("/air")
    public String air(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getAirPollution(lat, lon);
    }

    // 🌟 5일 예보 데이터 요청을 처리하는 메소드
    @GetMapping("/forecast")
    public String forecast(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getForecast(lat, lon);
    }
}
