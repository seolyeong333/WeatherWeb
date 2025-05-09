package com.creepy.bit.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "openai")  // application.yml의 openai: api-key와 매칭됨
public class OpenAIProperties {

    private String apiKey;  // 변수명은 반드시 apiKey

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
