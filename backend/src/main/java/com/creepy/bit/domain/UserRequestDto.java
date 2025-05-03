package com.creepy.bit.domain;
import java.time.LocalDate;

public class UserRequestDto {
    private int userId;
    private String email;
    private String password;
    private String nickname;
    private String gender;
    private LocalDate birthday;
    private String provider; 
    private String auth; 
    private String createdAt; 

    // Getter, Setter
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    
    public String getAuth() { return auth; }
    public void setAuth(String auth) { this.auth = auth; }
    
    public String getcreatedAt() { return createdAt; }
    public void setcreatedAt(String createdAt) { this.createdAt = createdAt; }
}
