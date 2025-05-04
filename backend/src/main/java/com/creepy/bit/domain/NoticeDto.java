package com.creepy.bit.domain;

public class NoticeDto {
    private int noticeId;
    private String title;
    private String content;
    private String createdAt;

public int getNoticeId() {return noticeId; }
public void setNoticeId(int noticeId) {this.noticeId = noticeId;}

public String getTitle() {return title;}
public void setTitle(String title) {this.title = title;}

public String getContent() {return content;}
public void setContent(String content) {this.content = content;}

public String getCreatedAt() {return createdAt;}
public void setCreatedAt() {this.createdAt = createdAt;}

}
