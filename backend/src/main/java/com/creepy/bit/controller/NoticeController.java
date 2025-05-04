package com.creepy.bit.controller;

import com.creepy.bit.domain.NoticeDto;
import com.creepy.bit.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;



    // 공지 전체 조회 + 페이징
    @GetMapping("")
    public ResponseEntity<Page<NoticeDto>> getAllNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("공지사항 조회 중");
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<NoticeDto> notices = noticeService.getAllNotices(pageRequest);
        return ResponseEntity.ok(notices);
    }

    // 공지 자세히 보기 
    @GetMapping("/{id}")
    public ResponseEntity<NoticeDto> getNotice(@PathVariable int id) {
        NoticeDto notice = noticeService.getNoticeById(id);
        return notice != null
                ? ResponseEntity.ok(notice)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // 공지 등록
    @PostMapping
    public ResponseEntity<String> insertNotice(@RequestBody NoticeDto noticeDto) {
        try {
            noticeService.insertNotice(noticeDto);
            return ResponseEntity.ok("공지 등록 완료!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("공지 등록 실패");
        }
    }

    // 공지 수정
    @PatchMapping("/{id}")
    public ResponseEntity<String> updateNotice(@PathVariable int id, @RequestBody NoticeDto noticeDto){
        noticeDto.setNoticeId(id);  // id를 DTO에 세팅
        noticeService.updateNotice(noticeDto);
        return ResponseEntity.ok("수정 완료");
    }


    // 공지 삭제 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable int id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok("삭제 완료");
    }




}
