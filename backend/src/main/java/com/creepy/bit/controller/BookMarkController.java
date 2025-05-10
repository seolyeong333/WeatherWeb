package com.creepy.bit.controller;

import com.creepy.bit.domain.BookMarkDto;
import com.creepy.bit.service.BookMarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookMarkController {

    @Autowired
    private BookMarkService bookmarkService;

    // 북마크 추가
    @PostMapping
    public ResponseEntity<String> addBookMark(@RequestBody BookMarkDto bookMarkDto) {
        try {
            bookmarkService.insertBookMark(bookMarkDto);
            return ResponseEntity.ok("북마크 추가 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("북마크 추가 실패");
        }
    }

    // 북마크 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBookMark(@PathVariable int id) {
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
    public ResponseEntity<List<BookMarkDto>> getMyBookMarks(@RequestParam int userId) {
        List<BookMarkDto> list = bookmarkService.getMyBookMarks(userId);
        return ResponseEntity.ok(list);
    }
}
