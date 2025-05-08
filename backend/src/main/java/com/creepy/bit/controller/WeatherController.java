package com.creepy.bit.controller;

import com.creepy.bit.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")  // 모든 날씨 관련 API는 이 경로(/api/weather)로 시작
@CrossOrigin(origins = "*")     // 프론트엔드(React 등)에서 호출 가능하게 CORS 허용
public class WeatherController {

    @Autowired
    private WeatherService weatherService;  // 실제 날씨 데이터를 가져오는 서비스

    /**
     * 현재 날씨 조회 API
     * - 위도(lat), 경도(lon)를 받아서 해당 위치의 날씨 정보를 가져옴
     * - 프론트에서 /api/weather/current?lat=...&lon=... 형태로 호출
     */
    @GetMapping("/current")
    public String current(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getCurrentWeather(lat, lon);
    }

    /**
     * 공기질(미세먼지, 초미세먼지 등) 조회 API
     * - 위도/경도 기반으로 해당 위치의 대기오염 정보 가져옴
     * - 예: /api/weather/air?lat=...&lon=...
     */
    @GetMapping("/air")
    public String air(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getAirPollution(lat, lon);
    }

    /**
     * 5일 예보 조회 API (3시간 간격 예보 포함)
     * - 위도/경도 기준으로, 앞으로 5일간의 날씨 예측 데이터를 가져옴
     * - 예: /api/weather/forecast?lat=...&lon=...
     */
    @GetMapping("/forecast")
    public String forecast(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getForecast(lat, lon);
    }
}
