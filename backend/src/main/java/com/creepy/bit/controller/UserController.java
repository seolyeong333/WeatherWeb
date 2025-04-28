package com.creepy.bit.controller;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

// @RestController API 요청 받는 곳

@RestController
@RequestMapping("/api/auth")
public class UserController {
    
@Autowired
    private UserService userService;

    @PostMapping("/login")
   public ResponseEntity<String> login(@RequestBody UserRequestDto userDto) {   // ResponseEntity 사용 해야 HTTP 처리랑 "body"둘다 처리 가능
        boolean loginSuccess = userService.login(userDto);
        System.out.println("로그인 요청 받음:");
        System.out.println("아이디: " + userDto.getUserId());
        System.out.println("비밀번호: " + userDto.getPassword());

        if (loginSuccess) {
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }

    @PostMapping("/signup")
    public String signup(@RequestBody UserRequestDto userDto) {
        System.out.println("회원가입 요청 받음:");
        System.out.println("아이디: " + userDto.getUserId());
        System.out.println("비밀번호: " + userDto.getPassword());
        System.out.println("닉네임: " + userDto.getNickname());
        System.out.println("성별: " + userDto.getGender());
        userService.signup(userDto);
        return "회원가입 성공";
    }

    
}
