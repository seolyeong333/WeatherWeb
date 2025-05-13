package com.creepy.bit.service;

import com.creepy.bit.domain.OpinionDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpinionService {

    @Autowired
    private MainMapper mainMapper;

    // 한줄평 작성
    public void insertOpinion(OpinionDto opinionDto) {
        mainMapper.insertOpinion(opinionDto);
    }

    // 장소 기반 한줄평 목록
    public List<OpinionDto> getOpinionsByPlaceId(String placeId) {
    return mainMapper.getOpinionsByPlaceId(placeId);
    }


    // 한줄평 리스트
    public List<OpinionDto> getMyOpinions(int userId) {
        return mainMapper.getMyOpinions(userId);
    }

    // 좋아요
    public void increaseLikes(int opinionId) {
        mainMapper.increaseLikes(opinionId);
    }

    // 싫어요
    public void increaseDislikes(int opinionId) {
        mainMapper.increaseDislikes(opinionId);
    }

    // 한줄평 삭제
    public void deleteOpinion(int opinionId) {
        mainMapper.deleteOpinion(opinionId);
    }
}
