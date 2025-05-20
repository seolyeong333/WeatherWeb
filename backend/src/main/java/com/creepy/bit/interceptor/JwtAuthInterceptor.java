package com.creepy.bit.interceptor;

import com.creepy.bit.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    private final JWTUtil jwtUtil;

    public JwtAuthInterceptor(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");

            if (jwtUtil.validateToken(token)) {
                int userId = jwtUtil.getUserId(token);
                String email = jwtUtil.getEmail(token);
                String nickname = jwtUtil.getNickname(token);
                String auth = jwtUtil.getAuth(token);

                request.setAttribute("userId", userId);
                request.setAttribute("email", email);
                request.setAttribute("nickname", nickname);
                request.setAttribute("auth", auth);

                return true; // 통과
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Unauthorized");
        return false; // 인증 실패 시 차단
    }
}
