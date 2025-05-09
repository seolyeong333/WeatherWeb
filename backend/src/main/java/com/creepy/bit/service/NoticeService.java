package com.creepy.bit.service;

import com.creepy.bit.domain.NoticeDto;
import com.creepy.bit.mapper.MainMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List; 

@Service
public class NoticeService {

    @Autowired
    private MainMapper mainMapper;

    public Page<NoticeDto> getAllNotices(PageRequest pageRequest) {
    List<NoticeDto> allNotices = mainMapper.getAllNotices(); // 전체 조회
    int start = (int) pageRequest.getOffset();
    int end = Math.min((start + pageRequest.getPageSize()), allNotices.size());
    List<NoticeDto> paged = allNotices.subList(start, end);

    return new PageImpl<>(paged, pageRequest, allNotices.size());
}

    // 특정 공지 조회
    public NoticeDto getNoticeById(int noticeId) {
        return mainMapper.getNoticeById(noticeId);
    }

    // 공지 등록
    public void insertNotice(NoticeDto noticeDto) {
        mainMapper.insertNotice(noticeDto);
    }

    // 공지 수정
    public void updateNotice(NoticeDto noticeDto) {
        mainMapper.updateNotice(noticeDto);
    }

    // 공지 삭제
    public void deleteNotice(int noticeId) {
        mainMapper.deleteNotice(noticeId);
    }


}