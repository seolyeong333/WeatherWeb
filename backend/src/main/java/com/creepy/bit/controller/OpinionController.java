package com.creepy.bit.controller;

import com.creepy.bit.util.JWTUtil;
import com.creepy.bit.domain.OpinionDto;
import com.creepy.bit.service.OpinionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/opinions")
public class OpinionController {

    @Autowired
    private JWTUtil jwtUtil; 

    @Autowired
    private OpinionService opinionService;

    // 🔹 한줄평 작성
    @PostMapping
    public ResponseEntity<String> addOpinion(HttpServletRequest request,
                                            @RequestBody OpinionDto opinionDto) {
        System.out.println("OpinionController POST 호출");

        try {
            // 1️⃣ 토큰에서 Bearer 제거 후 추출
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("인증 실패: 토큰 없음");
            }
            String token = authHeader.substring(7);

            // 2️⃣ JWT에서 userId 추출
            int userId = jwtUtil.getUserId(token);  // ✅ 여기서 userId 추출
            opinionDto.setUserId(userId);           // ✅ opinionDto에 주입

            // 3️⃣ DB 저장
            opinionService.insertOpinion(opinionDto);
            return ResponseEntity.ok("작성 완료");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("작성 실패");
        }
    }

    // 🔹 장소(placeId) 기반 한줄평 전체 조회
    @GetMapping("/place")
    public ResponseEntity<List<OpinionDto>> getOpinionsByPlace(@RequestParam String placeId) {
        System.out.println("OpinionController GET /place 호출");        
        List<OpinionDto> list = opinionService.getOpinionsByPlaceId(placeId);
        return ResponseEntity.ok(list);
    }

    // 🔹 한줄평 목록 조회 (userId 기반)
    @GetMapping
    public ResponseEntity<List<OpinionDto>> getMyOpinions(@RequestParam int userId) {
        System.out.println("OpinionController GET 호출");        
        List<OpinionDto> list = opinionService.getMyOpinions(userId);
        return ResponseEntity.ok(list);
    }

    // 🔹 좋아요 추가
    @PatchMapping("/{id}/like")
    public ResponseEntity<String> likeOpinion(@PathVariable int id) {
        System.out.println("OpinionController PATCH /{id}/like 호출");        
        try {
            opinionService.increaseLikes(id);
            return ResponseEntity.ok("좋아요 반영");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("좋아요 실패");
        }
    }

    // 🔹 싫어요 추가
    @PatchMapping("/{id}/dislike")
    public ResponseEntity<String> dislikeOpinion(@PathVariable int id) {
        System.out.println("OpinionController PATCH /{id}/dislike 호출");        
        try {
            opinionService.increaseDislikes(id);
            return ResponseEntity.ok("싫어요 반영");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("싫어요 실패");
        }
    }

    // 🔹 한줄평 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOpinion(@PathVariable int id) {
    System.out.println("OpinionController DELETE /{id} 호출");        
        try {
            opinionService.deleteOpinion(id);
            return ResponseEntity.ok("삭제 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("삭제 실패");
        }
    }

    @GetMapping("/rating")
    public ResponseEntity<Double> getAverageRating(@RequestParam String placeId) {
        System.out.println("OpinionController GET /rating 호출");
        try {
            Double avg = opinionService.getAverageRatingByPlaceId(placeId);
            return ResponseEntity.ok(avg != null ? avg : 0.0);  // null 처리
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(0.0);
        }
    }




}
