// MyBatis XML 매핑 파일 (.xml)에 연결될 Java 인터페이스
 package com.creepy.bit.mapper;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.domain.NoticeDto;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MainMapper {

    // USER

    // 로그인 (email + password 확인)
    int login(UserRequestDto userDto);

    // 회원가입 (insert)
    void insertUser(UserRequestDto userDto);

    // 아이디로 회원 조회
    UserRequestDto userData(String email);

    // 이메일 중복 체크
    int checkEmail(String email);

    // 닉네임 중복 체크
    int checkNickname(String nickname);

    // 비밀번호 변경
    void changePasswd(UserRequestDto userDto);

    // 회원 탈퇴
    void deleteUser(String email);

    // 회원 정보 수정 (비밀번호 + 이메일 수정)
    void modifyUser(UserRequestDto userDto);

    // Notice

    List<NoticeDto> getAllNotices();

    // 공지 ID로 조회
    NoticeDto getNoticeById(int noticeId);

    // 공지 등록
    void insertNotice(NoticeDto notice);

    // 공지 수정
    void updateNotice(NoticeDto notice);

    // 공지 삭제
    void deleteNotice(int noticeId);
}