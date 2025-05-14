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
        try {
            Map<String, Object> userInfo = kakaoService.kakaoLogin(code);
            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
            String email = (String) kakaoAccount.get("email");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            String nickname = (String) profile.get("nickname");

            // ✅ 자동 회원가입 (최초 로그인 시)
            if (userService.checkEmail(email) == 0) {
                UserRequestDto newUser = new UserRequestDto();
                newUser.setEmail(email);
                newUser.setPassword("1234");
                newUser.setNickname(nickname);
                newUser.setProvider("kakao");
                newUser.setAuth("USER");
                newUser.setGender(null);
                newUser.setBirthday(null);
                newUser.setProvider("kakao");
                userService.signup(newUser);
                System.out.println("🎉 자동 회원가입 완료: " + email);
            }

            // ✅ userId, auth 포함 JWT 발급
            UserRequestDto userData = userService.userData(email);
            String jwt = jwtUtil.generateToken(
                    String.valueOf(userData.getEmail()),
                    userData.getNickname(),
                    userData.getAuth(),
                    userData.getUserId()
            );

            // ✅ 프론트로 리디렉션
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

            // ✅ 자동 회원가입 (최초 로그인 시)
            if (userService.checkEmail(email) == 0) {
                UserRequestDto newUser = new UserRequestDto();
                newUser.setEmail(email);
                newUser.setPassword("1234");
                newUser.setNickname(name); // 구글 이름 사용
                newUser.setProvider("google");
                newUser.setAuth("USER");
                newUser.setGender(null);      // 또는 기본값 "unknown" 등
                newUser.setBirthday(null);      // 생일 미수집 시 null
                userService.signup(newUser);
                System.out.println("🎉 자동 회원가입 완료: " + email);
            }

            // ✅ userId, auth 포함 JWT 발급
            UserRequestDto userData = userService.userData(email);
            String jwt = jwtUtil.generateToken(
                    String.valueOf(userData.getEmail()),
                    userData.getNickname(),
                    userData.getAuth(),
                    userData.getUserId()
            );

            // ✅ 프론트로 리디렉션
            String redirectUrl = "http://localhost:5173/googleloginsuccess?token=" + jwt;
            response.sendRedirect(redirectUrl);

            System.out.println("✅ 구글 로그인 성공: " + email + " / " + name);
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