package com.creepy.bit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creepy.bit.service.WeatherService;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*") // React 개발 서버와 통신 허용
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/current")
    public String current(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getCurrentWeather(lat, lon);
    }

    @GetMapping("/air")
    public String air(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getAirPollution(lat, lon);
    }

    @GetMapping("/forecast")
    public String forecast(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getForecast(lat, lon);
    }
}
