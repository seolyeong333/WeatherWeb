package com.creepy.bit.config;

import com.creepy.bit.interceptor.JwtAuthInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final JwtAuthInterceptor jwtAuthInterceptor;

    // 생성자 주입
    public WebConfig(JwtAuthInterceptor jwtAuthInterceptor) {
        this.jwtAuthInterceptor = jwtAuthInterceptor;
    }

    // CORS 설정
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns("http://localhost:5173") // 프론트엔드 URL
                        .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    // 인터셉터 등록
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtAuthInterceptor)
                .addPathPatterns("/api/**")           // 이 경로 아래 모든 API에 인증 필터
                .excludePathPatterns("/api/users/login/**", "/api/users", "/api/public/**","/api/ai/**","/api/weather/**","/api/kakao/**","/api/users/email/**","/api/crawl/**","/api/google/**"); // 로그인, 회원가입 등 제외
    }
}

