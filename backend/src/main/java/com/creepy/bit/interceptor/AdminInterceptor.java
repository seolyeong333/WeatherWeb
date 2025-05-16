package com.creepy.bit.interceptor;

import com.creepy.bit.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminInterceptor implements HandlerInterceptor {

    private final JWTUtil jwtUtil;

    public AdminInterceptor(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");

            if (jwtUtil.validateToken(token)) {
                String auth = jwtUtil.getAuth(token); // ex) "admin" or "user"
                if ("admin".equals(auth)) {
                    return true; // ✅ 관리자 권한만 통과
                }
            }
        }

        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
        response.getWriter().write("Forbidden: 관리자 권한 필요");
        return false;
    }
}
