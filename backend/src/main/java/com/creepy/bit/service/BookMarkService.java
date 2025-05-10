package com.creepy.bit.service;

import com.creepy.bit.domain.BookMarkDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookMarkService {

    @Autowired
    private MainMapper mainMapper;

    public void insertBookMark(BookMarkDto bookMarkDto) {
        mainMapper.insertBookMark(bookMarkDto);
    }

    public void deleteBookMark(int bookmarkId) {
        mainMapper.deleteBookMark(bookmarkId);
    }

    public List<BookMarkDto> getMyBookMarks(int userId) {
        return mainMapper.getMyBookMarks(userId);
    }
}
