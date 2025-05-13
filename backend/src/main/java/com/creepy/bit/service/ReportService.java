package com.creepy.bit.service;

import com.creepy.bit.domain.ReportDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private MainMapper mainMapper;

    // 🔸 1. 신고 추가
    public void insertReport(ReportDto reportDto) {
        mainMapper.insertReport(reportDto);
    }

    // 🔸 2. 사용자별 신고 목록
    public List<ReportDto> getReportsByUserId(int userId) {
        return mainMapper.selectReportsByUserId(userId);
    }

    // 🔸 3. 전체 신고 목록 (관리자)
    public List<ReportDto> getAllReports() {
        return mainMapper.selectAllReports();
    }

    // 🔸 4. 신고 상세 조회
    public ReportDto getReportById(int id) {
        return mainMapper.selectReportById(id);
    }

    // 🔸 5. 신고 상태 업데이트
    public boolean updateReportStatus(int id, String status) {
        return mainMapper.updateReportStatus(id, status) > 0;
    }
}
