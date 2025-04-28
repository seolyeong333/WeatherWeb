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
        System.out.println("로그인 요청");
        System.out.println("아이디: " + userDto.getUserId());
        System.out.println("비밀번호: " + userDto.getPassword());
  
        if (loginSuccess) {
            UserRequestDto userData = userService.userData(userDto.getUserId());
            System.out.println("아이디: " + userData.getUserId());
            System.out.println("이메일: " + userData.getEmail());
            System.out.println("비밀번호: " + userData.getPassword());
            System.out.println("닉네임: " + userData.getNickname());
            System.out.println("성별: " + userData.getGender());
            System.out.println("제공자(provider): " + userData.getProvider());
            System.out.println(userService.checkId(userDto.getUserId()));
            System.out.println(userService.checkEmail(userData.getEmail()));
            System.out.println(userService.checkNickname(userData.getNickname()));
            System.out.println(userService.findId(userData.getEmail()));
            System.out.println(userService.findPasswd(userData));

            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
        }
    }

    @PostMapping("/signup")
    public String signup(@RequestBody UserRequestDto userDto) {
        System.out.println("회원가입 요청");
        System.out.println("아이디: " + userDto.getUserId());
        System.out.println("비밀번호: " + userDto.getPassword());
        System.out.println("닉네임: " + userDto.getNickname());
        System.out.println("성별: " + userDto.getGender());
        userService.signup(userDto);
        return "회원가입 성공";
    }

  




}
