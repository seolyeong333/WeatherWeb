package com.creepy.bit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class PlaceController {

    private static final String GOOGLE_API_KEY = "AIzaSyCTjxPRBodBLksY88osqePKnyndE4bwarI";

    @GetMapping("/places")
    public ResponseEntity<String> getNearbyPlaces(
            @RequestParam double lat,
            @RequestParam double lon) {

        String url = String.format(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
            "?location=%f,%f&radius=2000&language=ko&key=%s",
            lat, lon, GOOGLE_API_KEY
        );

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(url, String.class);

        return ResponseEntity.ok(response);
    }
}
