package com.creepy.bit.controller;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.service.UserService;
import com.creepy.bit.service.MailService;
import com.creepy.bit.domain.EmailAuth;
import com.creepy.bit.util.JWTUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

import java.time.Duration;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private MailService mailService;
    @Autowired private JWTUtil jwtUtil;

    private Map<String, EmailAuth> authStore = new HashMap<>();

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequestDto userDto) {
        System.out.println("UserController POST /login 호출");
        if (userService.login(userDto)) {
            UserRequestDto userData = userService.userData(userDto.getEmail());
            String token = jwtUtil.generateToken(
                    String.valueOf(userData.getEmail()),
                    userData.getNickname(),
                    userData.getAuth(), 
                    userData.getUserId()
            );

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "userId", userData.getUserId(),
                    "nickname", userData.getNickname(),
                    "auth", userData.getAuth()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
    }

    // 비밀번호 확인 (정보 수정 or 탈퇴 시 사용)
    @PostMapping("/check-password")
    public ResponseEntity<String> checkPassword(@RequestBody UserRequestDto userDto, HttpServletRequest request) {
        System.out.println("UserController POST /check-password 호출");

        // JWT 토큰 검증은 이미 로그인되어 있어야 하므로 생략하거나 로그용으로만 사용
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            System.out.println("토큰검증실패");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
        System.out.println("email: " + userDto.getEmail());
        System.out.println("password: " + userDto.getPassword());

        // 그냥 login() 호출해서 이메일+비밀번호 일치 여부 확인
        if (userService.login(userDto)) {
            System.out.println("로그인 성공");
            return ResponseEntity.ok("비밀번호 확인 완료");
        } else {
            System.out.println("로그인 실패");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

    // 회원가입
    @PostMapping("")
    public ResponseEntity<Map<String, String>> signup(@RequestBody UserRequestDto userDto) {
        System.out.println("UserController POST 호출");

        Map<String, String> response = new HashMap<>();

        // 이메일 중복 체크
        if (userService.checkEmail(userDto.getEmail()) > 0) {
            response.put("error", "이미 사용 중인 이메일입니다.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // 닉네임 중복 체크
        if (userService.checkNickname(userDto.getNickname()) > 0) {
            response.put("error", "이미 사용 중인 닉네임입니다.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // 회원가입 처리
        userService.signup(userDto);
        response.put("message", "회원가입 성공");

        return ResponseEntity.ok(response);
    }

    // 회원정보 조회
    @GetMapping("/info")
    public ResponseEntity<UserRequestDto> getUserInfo(HttpServletRequest request) {
        System.out.println("UserController GET /info 호출");

        // 1️⃣ 헤더에서 토큰 추출
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7); // "Bearer " 제외

        // 2️⃣ 토큰에서 이메일 추출
        String email = jwtUtil.getEmail(token);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3️⃣ 이메일로 사용자 정보 조회
        UserRequestDto user = userService.userData(email);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    // 비밀번호 찾기 → 인증메일 전송
    @PostMapping("/password/reset")
    public ResponseEntity<String> sendResetPasswordMail(@RequestBody UserRequestDto userDto) {
        System.out.println("UserController POST /password/reset 호출");
        if (userService.checkEmail(userDto.getEmail()) == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이메일이 없습니다.");
        }
        return ResponseEntity.ok("메일로 인증번호가 전송되었습니다.");
    }

    // 비밀번호 변경
    @PatchMapping("/password")
    public ResponseEntity<String> changePassword(@RequestBody UserRequestDto userDto) {
        System.out.println("UserController PATCH /password 호출");
        System.out.println(userDto.getEmail());
        System.out.println(userDto.getPassword());
        userService.changePasswd(userDto);
        return ResponseEntity.ok("비밀번호 변경 완료!");
    }

    // 회원정보 수정 (이메일, 비번 등)
    @PatchMapping("")
    public ResponseEntity<String> modifyUser(@RequestBody UserRequestDto userDto) {
        System.out.println("UserController PATCH 호출");
        userService.modifyUser(userDto);
        return ResponseEntity.ok("회원정보 수정 완료!");
    }

    // 회원 탈퇴
    @DeleteMapping("")
    public ResponseEntity<String> deleteUser(@RequestBody UserRequestDto userDto) {
        System.out.println("UserController DELETE 호출");
        System.out.println(userDto.getEmail());
        if (userService.login(userDto)) {
            userService.deleteUser(userDto.getEmail());
            return ResponseEntity.ok("탈퇴 완료");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

    // 이메일 인증코드 발송
    @PostMapping("/email/auth")
    public ResponseEntity<String> sendEmailAuthCode(@RequestBody Map<String, String> request) {
        System.out.println("UserController POST /email/auth 호출");
        String email = request.get("email");
        String type = request.get("type"); 
        String authKey = mailService.createAuthKey();

        if ("signup".equals(type)) {    // 회원가입 시 
            if (userService.checkEmail(email) > 0) {
                System.out.println("이메일 중복이다~");
                return ResponseEntity.status(HttpStatus.CONFLICT).body("duplicate");    // 회원가입은 중복이면 안되니까 duplicate 넘김
            }
        } else if ("reset".equals(type)) { // 비밀번호 초기화 시 
            if (userService.checkEmail(email) == 0) {
                System.out.println("이메일 없다~");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("notFound");    // 비밀번호 찾기는 중복이어야 하니까 notFound 넘김 
            }
        }

        try {
            mailService.sendAuthMail(email, authKey);
            authStore.put(email, new EmailAuth(authKey));
            return ResponseEntity.ok("보냈지롱"); // 프론트에서 비교용
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail");
        }
    }

    // 이메일 인증번호 입력 받을 시 확인하는 코드
    @PostMapping("/email/verify")
    public ResponseEntity<String> verifyEmailAuthCode(@RequestBody Map<String, String> request) {
        System.out.println("UserController POST /email/verify 호출");

        String email = request.get("email");
        String userCode = request.get("authKey");

        EmailAuth auth = authStore.get(email); // Map 또는 DB 조회
    
        if (auth == null || !auth.getAuthKey().equals(userCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 인증코드입니다.");
        }

        if (Duration.between(auth.getCreatedAt(), LocalDateTime.now()).toMinutes() > 5) { //제한시간 있음
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 시간이 만료되었습니다.");
        }

        return ResponseEntity.ok("인증 성공");
    }
}