// MyBatis XML 매핑 파일 (.xml)에 연결될 Java 인터페이스
 package com.creepy.bit.mapper;

import com.creepy.bit.domain.AlarmDto;
import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.domain.NoticeDto;
import com.creepy.bit.domain.BookMarkDto;
import com.creepy.bit.domain.ReportDto;
import com.creepy.bit.domain.OpinionDto;
import com.creepy.bit.domain.WeatherMessageDto;

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
    // 공지 전체 조회
    List<NoticeDto> getAllNotices();

    // 공지 ID로 조회
    NoticeDto getNoticeById(int noticeId);

    // 공지 등록
    void insertNotice(NoticeDto notice);

    // 공지 수정
    void updateNotice(NoticeDto notice);

    // 공지 삭제
    void deleteNotice(int noticeId);

    // BookMark
    // 내 북마크 조회 
    List<BookMarkDto> getMyBookMarks(int userId);

    // 북마크 추가
    void insertBookMark(BookMarkDto dto);

    // 북마크 삭제
    void deleteBookMark(int bookmarkId);

    // Opinion
    // 내 한줄평 조회
    List<OpinionDto> getMyOpinions(int userId);

    // 장소 기준 한줄평 조회
    List<OpinionDto> getOpinionsByPlaceId(String placeId);

    // 한줄평 작성
    void insertOpinion(OpinionDto opinionDto);

    // 한줄평 삭제
    void deleteOpinion(int opinionId);
    
    // 좋아요
    void increaseLikes(int opinionId);

    // 싫어요
    void increaseDislikes(int opinionId);


    // Alarm
    // 알림 추가 
    void insertAlarm(AlarmDto alarmDto);

    // 내 알림 목록 
    List<AlarmDto> selectAlarmsByUserId(int userId);

    // 알림 삭제
    void deleteAlarm(int alarmId);
    
    // 알림 수정
    void updateAlarm(int alarmId, String conditionType, String value);

    // Report
    // 신고 
    void insertReport(ReportDto reportDto);

    // 내 신고 목록 (사용자 기준)
    List<ReportDto> selectReportsByUserId(int userId);

    // 전체 사용자 신고 목록 (관리자 기준)
    List<ReportDto> selectAllReports();

    // 신고 자세히 보기 
    ReportDto selectReportById(int id);

    // 신고 처리상태 변경 
    int updateReportStatus(int id, String status);

    WeatherMessageDto findByWeatherTypeAndTempRange(String weatherType, double feelsLike);

}
