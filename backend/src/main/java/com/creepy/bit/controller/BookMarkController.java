package com.creepy.bit.controller;

import com.creepy.bit.domain.BookMarkDto;
import com.creepy.bit.util.JWTUtil;
import com.creepy.bit.service.BookMarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookMarkController {

    @Autowired
    private JWTUtil jwtUtil; 

    @Autowired
    private BookMarkService bookmarkService;

    // 북마크 추가
    @PostMapping
    public ResponseEntity<Map<String, Object>> insertBookMark( @RequestHeader("Authorization") String token, @RequestBody BookMarkDto bookMarkDto) {
        System.out.println("BookMarkController /{id} POST 호출");        
        try {
            String pureToken = token.replace("Bearer ", "");
            Integer userId = jwtUtil.getUserId(pureToken); // ✅ JWT에서 userId 추출

            bookMarkDto.setUserId(userId); // ✅ 강제 주입
            int savedId = bookmarkService.insertBookMark(bookMarkDto);

            return ResponseEntity.ok(Map.of("bookmarkId", savedId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "북마크 추가 실패"));
        }
    }



    // 북마크 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBookMark(@PathVariable int id) {
        System.out.println("BookMarkController /{id} DELETE 호출");        
        try {
            bookmarkService.deleteBookMark(id);
            return ResponseEntity.ok("북마크 삭제 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("북마크 삭제 실패");
        }
    }

    // 북마크 목록 조회 (userId 기반)
    @GetMapping
    public ResponseEntity<List<BookMarkDto>> getMyBookMarks(@RequestHeader("Authorization") String token) {
        System.out.println("BookMarkController GET 호출");

        // "Bearer " 접두사 제거
        String pureToken = token.replace("Bearer ", "");

        // JWT에서 userId 추출
        int userId = jwtUtil.getUserId(pureToken);

        List<BookMarkDto> list = bookmarkService.getMyBookMarks(userId);
        return ResponseEntity.ok(list);
    }

}
