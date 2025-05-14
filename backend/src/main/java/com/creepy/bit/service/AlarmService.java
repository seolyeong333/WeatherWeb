package com.creepy.bit.service;

import com.creepy.bit.domain.AlarmDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlarmService {

    @Autowired
    private MainMapper mainMapper;

    public void insertAlarm(AlarmDto alarmDto) {
        mainMapper.insertAlarm(alarmDto);
    }

    public List<AlarmDto> getAlarmsByUser(int userId) {
        return mainMapper.selectAlarmsByUserId(userId);
    }
    
    public List<AlarmDto> getAllAlarms() {
    return mainMapper.selectAll();
    }

    public void deleteAlarm(int alarmId) {
        mainMapper.deleteAlarm(alarmId);
    }

    public void updateAlarm(int alarmId, String conditionType, String value) {
        mainMapper.updateAlarm(alarmId, conditionType, value);
    }
}
