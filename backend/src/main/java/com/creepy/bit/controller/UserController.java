package com.creepy.bit.controller;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.service.UserService;
import com.creepy.bit.service.MailService;
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
    private MailService mailService;

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
            System.out.println("권한: " + userData.getAuth());
            System.out.println("가입 날짜: " + userData.getcreatedAt());
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

    @PostMapping("/findId") // 이메일을 입력하고 제출하면 그에 맞는 아이디를 출력해주는거임
        public String findid(@RequestBody String email){
        String userId = userService.findId(email);  
            if (userId == null) {
            return "등록되지 않은 이메일입니다.";
        }   
        return userId;                             
    }

    @PostMapping("/findPasswd") // 이메일과 아이디가 일치하는 유저가 있다면 메일인증번호를 보냄
        public String findPasswd(@RequestBody UserRequestDto userDto){
        int result = userService.findPasswd(userDto);
        
        if (result == 0) {
            return "등록되지 않은 이메일입니다.";
        } else {
            return "비밀번호 찾기 성공!";
        }
    }

        @PostMapping("/changePasswd") // 이메일과 아이디가 메일 인증 받고 비번 바꿀때
            public String changePasswd(@RequestBody UserRequestDto userDto){
            userService.changePasswd(userDto);
            return "비밀번호 변경 완료!";
        
    }

        @PostMapping("/delete") // 대충 뭐 인증하고 아이디 삭제할때때
            public String deleteUser(@RequestBody String userId){
            userService.deleteUser(userId);
            return "아이디 삭제 완료!";
    }                               

        @PostMapping("/modify") // 대충 뭐 인증하고 이메일하고 비밀번호만 바꾸기 
            public String modifyUser(@RequestBody UserRequestDto userDto){
            userService.modifyUser(userDto);
            return "아이디 수정 완료!";
        
    }    

    public void RandomKey(){
		String key = Integer.toString( (int) Math.floor(Math.random()*90000)+10000);
	}

	 @PostMapping("/sendmloail")
        public String sendEmail(@RequestParam String email) {
        String authKey = mailService.createAuthKey();

        try {
            mailService.sendAuthMail(email, authKey);
            System.out.println("[/sendmail] 메일 전송 성공!");
            return authKey; // 인증번호 프론트에 바로 리턴
        } catch (MessagingException e) {
            e.printStackTrace();
            return "fail";
        }
    }


}