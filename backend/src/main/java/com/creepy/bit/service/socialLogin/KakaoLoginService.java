package com.creepy.bit.service.sociallogin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.net.HttpURLConnection;
import java.io.OutputStreamWriter;
import java.io.BufferedWriter;
import java.io.InputStream;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class KakaoLoginService {

    @Value("${kakao.api_key}")
    private String kakaoApiKey;
    @Value("${kakao.redirect_uri}")
    private String kakaoRedirectUri;

    public Map<String, Object> kakaoLogin(String code) throws Exception {
        String accessToken = getAccessToken(code);
        return getUserInfo(accessToken);
    }

    public String getAccessToken(String code) throws Exception {

        // String token = "dummyToken"; // JWT 발급 로직 나중에 연결
        // return token;
        URL url = new URL("https://kauth.kakao.com/oauth/token");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setDoOutput(true); // POST 전송 가능 설정

        String params = "grant_type=authorization_code"
                      + "&client_id=" + kakaoApiKey
                      + "&redirect_uri=" + kakaoRedirectUri
                      + "&code=" + code;

        try (BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()))) {
            bw.write(params);
            bw.flush();
        }

        // 응답 받아서 파싱
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> response;
        try (InputStream is = conn.getInputStream()) {
            response = mapper.readValue(is, Map.class);
        }

        return (String) response.get("access_token");
    }

    public Map<String, Object> getUserInfo(String accessToken) throws Exception {
        URL url = new URL("https://kapi.kakao.com/v2/user/me");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);

        ObjectMapper mapper = new ObjectMapper();
        try (InputStream is = conn.getInputStream()) {
            return mapper.readValue(is, Map.class);
        }
    }

    /*
    public void kakaoLogout(String accessToken) throws Exception {
        URL url = new URL("https://kapi.kakao.com/v1/user/logout");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
        conn.getResponseCode(); // 로그아웃 실행
    }
    */
}