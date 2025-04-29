package com.creepy.bit.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    // 인증키 생성
    public String createAuthKey() {
        Random random = new Random();
        int number = random.nextInt(90000) + 10000; // 10000 ~ 99999
        return String.valueOf(number);
    }

    // 메일 보내기
    public void sendAuthMail(String email, String authKey) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("socialquizwebsite@gmail.com");
        helper.setTo(email);
        helper.setSubject("소셜 퀴즈 웹사이트 이메일 인증");
        String content = "<h1>인증코드:</h1><h2>" + authKey + "</h2>";
        helper.setText(content, true);

        mailSender.send(message);
    }
}
