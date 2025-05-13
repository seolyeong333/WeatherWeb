package com.creepy.bit.controller;

import com.creepy.bit.service.sociallogin.KakaoLoginService;
import com.creepy.bit.service.sociallogin.GoogleLoginService;
import com.creepy.bit.service.sociallogin.NaverLoginService;
import com.creepy.bit.util.JWTUtil;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/users/login")
public class SocialLoginController {

    @Autowired
    private KakaoLoginService kakaoService;
    @Autowired
    private GoogleLoginService googleService;
    @Autowired
    private NaverLoginService naverService;

    @Autowired
    private JWTUtil jwtUtil;

    @GetMapping("/kakao")
    public void kakaoLogin(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        try {
            Map<String, Object> userInfo = kakaoService.kakaoLogin(code);
            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
            String email = (String) kakaoAccount.get("email");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            String nickname = (String) profile.get("nickname");

            // JWT 발급
            String jwt = jwtUtil.generateSocialToken(email, nickname);

            // 프론트엔드로 리디렉션 (성공 페이지로)
            String redirectUrl = "http://localhost:5173/kakaologinsuccess?token=" + jwt;
            response.sendRedirect(redirectUrl);

            System.out.println("✅ 카카오 로그인 성공: " + email + " / " + nickname);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "카카오 로그인 실패");
        }
    }

    @GetMapping("/google")
    public void googleLogin(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        try {
            Map<String, Object> userInfo = googleService.googleLogin(code);
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");

            String jwt = jwtUtil.generateSocialToken(email, name);
            String redirectUrl = "http://localhost:5173/googleloginsuccess?token=" + jwt;

            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "구글 로그인 실패");
        }
    }

    @GetMapping("/naver")
    public void naverLogin(@RequestParam("code") String code,
                           @RequestParam("state") String state,
                           HttpServletResponse response) throws IOException {
        try {
            Map<String, Object> userInfo = naverService.naverLogin(code, state);
            String email = (String) userInfo.get("email");
            String nickname = (String) userInfo.get("nickname");

            String jwt = jwtUtil.generateSocialToken(email, nickname);
            String redirectUrl = "http://localhost:5173/naverloginsuccess?token=" + jwt;

            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "네이버 로그인 실패");
        }
    }
}