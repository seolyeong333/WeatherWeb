package com.creepy.bit.service.admin;

import com.creepy.bit.domain.ReportDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminReportService {

    private final MainMapper mainMapper;

    public AdminReportService(MainMapper mainMapper) {
        this.mainMapper = mainMapper;
    }

    // 장소 신고 반환
    public List<ReportDto> getPlaceReports() {
        return mainMapper.selectPlaceReports();
    }
    // 한줄평 신고 반환
    public List<ReportDto> getOpinionReports() {
        return mainMapper.selectOpinionReports();
    }

    // 신고 상태(PENDING → RESOLVED 등) 변경
    public void updateReportStatus(int reportId, String status) {
        mainMapper.updateReportStatus(reportId, status);
    }

    // 신고 삭제 처리
    public void deleteOpinionAndResolveReport(int opinionId, int reportId) {
        mainMapper.updateOpinionContent(opinionId, "관리자가 삭제한 한줄평입니다.");
        mainMapper.updateReportStatus(reportId, "RESOLVED");
    }

    // 장소 신고 경고 처리
    public void flagPlace(String placeName) {
        mainMapper.insertFlaggedPlace(placeName); // 1. 장소 경고 등록
        mainMapper.updatePlaceReportStatus(placeName); // 2. 해당 장소 신고 상태 RESOLVED로 일괄 변경
    }

    public boolean isPlaceFlagged(String placeName) {
        return mainMapper.isPlaceFlagged(placeName) > 0;
    }



}
