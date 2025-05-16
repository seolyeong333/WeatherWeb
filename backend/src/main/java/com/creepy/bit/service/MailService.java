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

        helper.setFrom("WeatherWeb@gmail.com");
        helper.setTo(email);
        helper.setSubject("WeatherWeb 이메일 인증");
        String content = """
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                <h2 style="color: #5B8DEF;">WeatherWeb 이메일 인증</h2>
                <p>아래 인증코드를 입력하여 이메일 인증을 완료해 주세요.</p>
                <div style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">
                    인증코드: <span style="color: #5B8DEF;">%s</span>
                </div>
                <p style="color: #999; font-size: 12px;">본 인증코드는 5분 동안만 유효합니다.</p>
            </div>
        """.formatted(authKey);


        helper.setText(content, true);
        mailSender.send(message);
    }
    
    public void sendGeneralMail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("WeatherWeb@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // HTML 여부 true 설정

        mailSender.send(message);
    }

    
}




