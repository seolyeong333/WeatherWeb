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
import jakarta.mail.MessagingException;

// @RestController API 요청 받는 곳

@RestController
@RequestMapping("/api/auth")
public class UserController {
    
@Autowired
    private UserService userService;
    
@Autowired   
    private MailService mailService;

    @PostMapping("/login")
   public ResponseEntity<String> login(@RequestBody UserRequestDto userDto) {   // ResponseEntity 사용 해야 HTTP 처리랑 "body"둘다 처리 가능
        boolean loginSuccess = userService.login(userDto);
        System.out.println("로그인 요청");
        System.out.println("아이디: " + userDto.getEmail());
        System.out.println("비밀번호: " + userDto.getPassword());
  
        if (loginSuccess) {
            UserRequestDto userData = userService.userData(userDto.getEmail());
            System.out.println("아이디: " + userData.getUserId());
            System.out.println("이메일: " + userData.getEmail());
            System.out.println("비밀번호: " + userData.getPassword());
            System.out.println("닉네임: " + userData.getNickname());
            System.out.println("성별: " + userData.getGender());
            System.out.println("생일: " + userData.getBirthday());
            System.out.println("제공자(provider): " + userData.getProvider());
            System.out.println("권한: " + userData.getAuth());
            System.out.println("가입 날짜: " + userData.getcreatedAt());
            System.out.println(userService.checkEmail(userData.getEmail()));
            System.out.println(userService.checkNickname(userData.getNickname()));
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

    @PostMapping("/findPasswd") // 이메일과 아이디가 일치하는 유저가 있다면 메일인증번호를 보냄
        public String findPasswd(@RequestBody UserRequestDto userDto){
        int result = userService.checkEmail(userDto.getEmail());
        
        if (result == 0) {
            return "이메일이 없습니다. 다시 한번 확인해주세요.";
        } else {
            return "메일로 인증번호가 전송되었습니다.";
        }
    }

        @PostMapping("/changePasswd") // 이메일과 아이디가 메일 인증 받고 비번 바꿀때
            public String changePasswd(@RequestBody UserRequestDto userDto){
            userService.changePasswd(userDto);
            return "비밀번호 변경 완료!";    
    }
    
        @PostMapping("/delete") // 대충 뭐 인증하고 아이디 삭제할때때
            public String deleteUser(@RequestBody UserRequestDto userDto) {
            if (userService.login(userDto)) {
                userService.deleteUser(userDto.getEmail());
                return "아이디 삭제 완료!";
            } else {
                return "비밀번호가 일치하지 않습니다.";
            }
        }

        @PostMapping("/modify") // 대충 뭐 인증하고 이메일하고 비밀번호만 바꾸기 
            public String modifyUser(@RequestBody UserRequestDto userDto){
            userService.modifyUser(userDto);
            return "아이디 수정 완료!";
    }    

    public void RandomKey(){
		String key = Integer.toString( (int) Math.floor(Math.random()*90000)+10000);
	}

	 @PostMapping("/sendmail")  // 메일보내고 받는거 까지 하는거임 
        public String sendEmail(@RequestParam String email) {
        System.out.println("메일전송 요청");
        String authKey = mailService.createAuthKey();

        try {
            mailService.sendAuthMail(email, authKey);
            System.out.println("[/sendmail] 메일 전송 성공!");
            return authKey; // 인증번호 프론트에 바로 리턴 그리고 그 받은 값을 기반으로 비교해서 프런트에서 처리함
        } catch (MessagingException e) {
            e.printStackTrace();
            return "fail";
        }
    }
}