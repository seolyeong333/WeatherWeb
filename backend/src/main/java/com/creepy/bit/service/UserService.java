package com.creepy.bit.service;

import com.creepy.bit.domain.UserRequestDto;
import com.creepy.bit.mapper.MainMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private MainMapper mainMapper;

    // 로그인  
    public boolean login(UserRequestDto userDto) {
        int count = mainMapper.login(userDto);   // 여기서 아디와 비번이 맞으면 1 아니면 0으로 출력
        return count == 1;  // 여기서 boolean으로 비교를 하는거임 (1==1)이면 TRUE, (0==1)이면 FALSE이기때문에 여기서 UserController로 날아감
    }

    // 회원가입  
    public void signup(UserRequestDto userDto) {
        mainMapper.insertUser(userDto);
    }

    // 회원정보조회
    public UserRequestDto userData(String email){
        UserRequestDto result = mainMapper.userData(email);
        return result;
    }

    // 이메일 중복 확인
    public int checkEmail(String email){
        int count = mainMapper.checkEmail(email);
        return count;
    }

    // 닉네임 중복 확인
    public int checkNickname(String nickname){
        int count = mainMapper.checkNickname(nickname);
        return count;
    }

    // 비밀번호 변경 
    public void changePasswd(UserRequestDto userDto){
        mainMapper.changePasswd(userDto);
    }

    // 회원정보 삭제 
    public void deleteUser(String email){
        mainMapper.deleteUser(email);
    }

    // 회원정보 수정
    public void modifyUser(UserRequestDto userDto){
        mainMapper.modifyUser(userDto);
    }


}