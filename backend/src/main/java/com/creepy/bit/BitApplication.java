package com.creepy.bit; // 이 패키지 선언은 사용자님의 프로젝트에 맞게 되어 있어야 합니다.

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration; // 👈 [추가된 import]
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = ErrorMvcAutoConfiguration.class) // 👈 [수정된 부분] ErrorMvcAutoConfiguration 제외
@EnableAsync
@EnableScheduling
public class BitApplication extends SpringBootServletInitializer { // SpringBootServletInitializer 상속은 유지

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BitApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(BitApplication.class, args);
    }

}