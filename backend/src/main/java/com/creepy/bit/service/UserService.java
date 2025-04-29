package com.creepy.bit.service;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private MainMapper mainMapper;

    public boolean login(UserRequestDto userDto) {
        int count = mainMapper.login(userDto);   // 여기서 아디와 비번이 맞으면 1 아니면 0으로 출력
        return count == 1;  // 여기서 boolean으로 비교를 하는거임 (1==1)이면 TRUE, (0==1)이면 FALSE이기때문에 여기서 UserController로 날아감
    }

    public void signup(UserRequestDto userDto) {
        mainMapper.insertUser(userDto);
    }

    public UserRequestDto userData(String userId){
        UserRequestDto result = mainMapper.userData(userId);
        return result;
    }

    public int checkId(String userId){
        int count = mainMapper.checkId(userId);
        return count;
    }

    public int checkEmail(String email){
        int count = mainMapper.checkEmail(email);
        return count;
    }
    public int checkNickname(String nickname){
        int count = mainMapper.checkNickname(nickname);
        return count;
    }

    public String findId(String email){
        String result = mainMapper.findId(email);
        return result;
    }
    
    public int findPasswd(UserRequestDto userDto){
    int count = mainMapper.findPasswd(userDto);
    return count;

}
    public void changePasswd(UserRequestDto userDto){
        mainMapper.changePasswd(userDto);
    }

    public void deleteUser(String userId){
        mainMapper.deleteUser(userId);
    }

    public void modifyUser(UserRequestDto userDto){
        mainMapper.modifyUser(userDto);
    }



}


