package com.creepy.bit.service;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private MainMapper mainMapper;

    public boolean login(UserRequestDto userRequestDto) {
        int count = mainMapper.login(userRequestDto);
        return count == 1;  
    }

    public void signup(UserRequestDto userDto) {
        mainMapper.insertUser(userDto);
    }
}


