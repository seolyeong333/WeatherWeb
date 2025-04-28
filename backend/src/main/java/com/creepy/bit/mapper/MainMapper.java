// MyBatis XML 매핑 파일 (.xml)에 연결될 Java 인터페이스
 package com.creepy.bit.mapper;

import com.creepy.bit.domain.UserRequestDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MainMapper {
    void insertUser(UserRequestDto userDto);
    int login(UserRequestDto userRequestDto);

}
