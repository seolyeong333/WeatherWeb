package com.creepy.bit.service.admin;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    @Autowired
    private MainMapper mainMapper;

    public List<UserRequestDto> getAllUsers() {
        return mainMapper.selectAllUsers();
    }
}
