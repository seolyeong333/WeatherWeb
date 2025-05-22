package com.creepy.bit.controller;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.service.sociallogin.KakaoLoginService;
import com.creepy.bit.service.sociallogin.GoogleLoginService;
import com.creepy.bit.service.sociallogin.NaverLoginService;
import com.creepy.bit.service.UserService;
import com.creepy.bit.util.JWTUtil;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;
import java.time.LocalDate;
import java.net.URLEncoder;

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

    @Autowired
    private UserService userService;

    @GetMapping("/kakao")
    public void kakaoLogin(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        System.out.println("SocialLoginController /kakao GET 호출");
        try {
            Map<String, Object> userInfo = kakaoService.kakaoLogin(code);
            System.out.println("🔍 카카오 응답 전체: " + userInfo);
            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            String email = (String) kakaoAccount.get("email");
            String nickname = (String) profile.get("nickname");

            // ✅ 자동 회원가입 (최초 로그인 시)
            if (userService.checkEmail(email) == 0) {
                String redirectUrl = "http://localhost:5173/"
                    + "?mode=socialSignup"
                    + "&email=" + URLEncoder.encode(email, "UTF-8")
                    + "&nickname=" + URLEncoder.encode(nickname, "UTF-8")
                    + "&provider=kakao";
                response.sendRedirect(redirectUrl);
                return;

            }

            // ✅ userId, auth 포함 JWT 발급
            UserRequestDto userData = userService.userData(email);
            String jwt = jwtUtil.generateToken(
                    String.valueOf(userData.getEmail()),
                    userData.getNickname(),
                    userData.getGender(),
                    userData.getAuth(),
                    userData.getUserId()
            );

            // ✅ 프론트로 리디렉션
            String redirectUrl = "http://localhost:5173?token=" + jwt;
            response.sendRedirect(redirectUrl);

            System.out.println("✅ 카카오 로그인 성공: " + email + " / " + nickname);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "카카오 로그인 실패");
        }
    }

    @GetMapping("/google")
    public void googleLogin(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
                System.out.println("SocialLoginController /google GET 호출");
        try {
            Map<String, Object> userInfo = googleService.googleLogin(code);
            System.out.println("🔍 구글 응답 전체: " + userInfo);
            String email = (String) userInfo.get("email");
            String nickname = (String) userInfo.get("name");

            // ✅ 자동 회원가입 (최초 로그인 시)
            if (userService.checkEmail(email) == 0) {
                // 최초 로그인 → 추가 정보 입력 페이지로 리디렉션
                String redirectUrl = "http://localhost:5173/"
                + "?mode=socialSignup"
                + "&email=" + URLEncoder.encode(email, "UTF-8")
                + "&nickname=" + URLEncoder.encode(nickname, "UTF-8")
                + "&provider=google";
                response.sendRedirect(redirectUrl);
                return;
            }


            // ✅ userId, auth 포함 JWT 발급
            UserRequestDto userData = userService.userData(email);
            String jwt = jwtUtil.generateToken(
                    String.valueOf(userData.getEmail()),
                    userData.getNickname(),
                    userData.getGender(),
                    userData.getAuth(),
                    userData.getUserId()
            );

            // ✅ 프론트로 리디렉션
            String redirectUrl = "http://localhost:5173?token=" + jwt;
            response.sendRedirect(redirectUrl);

            System.out.println("✅ 구글 로그인 성공: " + email + " / " + nickname);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "구글 로그인 실패");
        }
    }


    @GetMapping("/naver")
    public void naverLogin(@RequestParam("code") String code, @RequestParam("state") String state, HttpServletResponse response) throws IOException {
        System.out.println("SocialLoginController /naver GET 호출");
        try {
            Map<String, Object> userInfo = naverService.naverLogin(code, state);
            System.out.println("🔍 네이버 응답 전체: " + userInfo);

            String email = (String) userInfo.get("email");
            String nickname = (String) userInfo.get("name");
            String genderRaw = (String) userInfo.get("gender");      // "M" 또는 "F"
            String birthyear = (String) userInfo.get("birthyear");  // e.g., 2001
            String birthday = (String) userInfo.get("birthday");    // e.g., 01-02

            String gender = null;
            if ("M".equals(genderRaw)) gender = "male";
            else if ("F".equals(genderRaw)) gender = "female";
            
            // ✅ 생일 변환
            LocalDate fullBirthday = null;
            try {
                if (birthyear != null && birthday != null) {
                    String fullBirthdayStr = birthyear + "-" + birthday; // e.g., 2001-01-02
                    fullBirthday = LocalDate.parse(fullBirthdayStr);
                }
            } catch (Exception e) {
                System.out.println("❗ 생일 변환 실패: " + e.getMessage());
            }

            // ✅ 자동 회원가입 (최초 로그인 시)
            if (userService.checkEmail(email) == 0) {
                String redirectUrl = "http://localhost:5173/"
                + "?mode=socialSignup"
                + "&email=" + URLEncoder.encode(email, "UTF-8")
                + "&nickname=" + URLEncoder.encode(nickname, "UTF-8")
                + "&provider=naver";
                response.sendRedirect(redirectUrl);
                return;
            }


            // ✅ JWT 발급
            UserRequestDto userData = userService.userData(email);
            String jwt = jwtUtil.generateToken(
                    userData.getEmail(),
                    userData.getNickname(),
                    userData.getGender(),
                    userData.getAuth(),
                    userData.getUserId()
            );

            // ✅ 리디렉션
            String redirectUrl = "http://localhost:5173?token=" + jwt;
            response.sendRedirect(redirectUrl);

            System.out.println("✅ 네이버 로그인 성공: " + email + " / " + nickname);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "네이버 로그인 실패");
        }
    }


}