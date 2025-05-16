package com.creepy.bit.scheduler;

import com.creepy.bit.domain.AlarmDto;
import com.creepy.bit.service.AlarmService;
import com.creepy.bit.service.WeatherService;
import com.creepy.bit.service.MailService;
import com.creepy.bit.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;

import java.util.List;

@Component
public class AlarmScheduler {

    @Autowired
    private AlarmService alarmService;

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService; 

    @Async
    @EventListener(ApplicationReadyEvent.class)
    public void runOnceAfterDelay() {
        try {
            System.out.println("⏳ 서버 실행 완료. 10초 후 알람 체크 예정...");
            Thread.sleep(10_000); // 10초 대기 (10000ms)
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("🚀 서버 실행 후 10초 경과 → 알람 체크 1회 실행");
        checkAlarms();
    }

    // 🕐 매 1시간마다 실행
    @Scheduled(cron = "0 0 * * * *")
    public void runEveryHour() {
        System.out.println("⏰ 1시간마다 알람 체크 실행");
        checkAlarms();
    }

    public void checkAlarms() {
        System.out.println("🔔 알람 조건 검사 시작");
        System.out.println("AlarmScheduler 호출");

        // 1. 모든 알람 불러오기
        List<AlarmDto> alarmList = alarmService.getAllAlarms();

        // 2. 현재 날씨 및 공기질 정보
        String currentWeather = weatherService.getCurrentWeatherType(); // 예: 맑음, 흐림
        String currentAir = weatherService.getCurrentAirCondition();    // 예: 좋음, 보통

        System.out.println("현재 날씨 상태: " + currentWeather);
        System.out.println("현재 공기 상태: " + currentAir);

        for (AlarmDto alarm : alarmList) {
            boolean weatherMatch = true;
            boolean airMatch = true;

            String weatherResult = "해당하지 않음";
            String airResult = "해당하지 않음";

            // 날씨 조건 검사
            if (!"air".equals(alarm.getConditionType())) {
                weatherMatch = alarm.getWeatherCondition() != null &&
                               alarm.getWeatherCondition().contains(currentWeather);
                weatherResult = weatherMatch ? "해당함" : "해당하지 않음";
            }

            // 공기 조건 검사
            if (!"weather".equals(alarm.getConditionType())) {
                airMatch = alarm.getAirCondition() != null &&
                           alarm.getAirCondition().equals(currentAir);
                airResult = airMatch ? "해당함" : "해당하지 않음";
            }

            System.out.println("▶ 사용자 ID: " + alarm.getUserId());
            System.out.println("  - 조건 유형: " + alarm.getConditionType());
            System.out.println("  - 설정된 날씨 조건: " + alarm.getWeatherCondition() + " → " + weatherResult);
            System.out.println("  - 설정된 공기 조건: " + alarm.getAirCondition() + " → " + airResult);

            if (weatherMatch && airMatch) {
                System.out.println("✅ [알림 발송] 조건 일치! 이메일 전송 시도");

                String to = userService.getEmailByUserId(alarm.getUserId());

                if (to == null || to.isEmpty()) {
                    System.out.println("⚠️ 이메일 없음 → userId=" + alarm.getUserId());
                    continue;
                }

                String subject = "[날씨 알림] 설정하신 조건에 맞는 날씨가 도착했어요!";
                String content = """
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <h2 style='color:#5B8DEF;'>🌤️ 날씨 알림 도착!</h2>
                        <p>현재 날씨는 <strong>%s</strong>, 공기질은 <strong>%s</strong>입니다.</p>
                        <p>회원님이 설정한 조건과 일치하여 알려드립니다 ☺️</p>
                    </div>
                """.formatted(currentWeather, currentAir);

                try {
                    mailService.sendGeneralMail(to, subject, content);  // 🔁 일반 메시지 전송용 메서드로 변경
                    System.out.println("📨 이메일 전송 완료 → " + to);
                } catch (MessagingException e) {
                    System.out.println("❌ 이메일 전송 실패: " + e.getMessage());
                }


            } else {
                System.out.println("❌ [알림 미발송] 조건 불일치");
            }

            System.out.println("-------------------------------------------");
        }
    }
}
