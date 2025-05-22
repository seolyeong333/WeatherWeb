package com.creepy.bit.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JWTUtil {

    @Value("${jwt.secret}")  // application.yml에서 주입
    private String secret;

    private SecretKey secretKey;
    private final long expiration = 1000L * 60 * 60 * 24; // 1일

    @PostConstruct
    public void init() {
        // Base64 인코딩 → 256비트 이상의 SecretKey 생성
        byte[] keyBytes = Base64.getEncoder().encode(secret.getBytes());
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // 토큰 생성
    public String generateToken(String email, String nickname, String gender, String auth, int userId) {
        return Jwts.builder()
                .claim("userId", userId)
                .claim("nickname", nickname)
                .claim("gender", gender)
                .setSubject(email)
                .claim("auth", auth)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateSocialToken(String email, String nickname) {
        return Jwts.builder()
                .setSubject(email)
                .claim("nickname", nickname)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Claims 추출
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 개별 정보 추출

    public int getUserId(String token) {
    return (int) getClaims(token).get("userId");
    }

    public String getEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String getNickname(String token) {
        return (String) getClaims(token).get("nickname");
    }

    public String getGender(String token) {
        return (String) getClaims(token).get("gender");
    }

    public String getAuth(String token) {
        return (String) getClaims(token).get("auth");
    }
    
}
