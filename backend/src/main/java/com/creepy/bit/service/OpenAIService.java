package com.creepy.bit.service;

import com.creepy.bit.config.OpenAIProperties;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenAIService {

    private final OpenAIProperties openAIProperties;

    @Autowired
    public OpenAIService(OpenAIProperties openAIProperties) {
        this.openAIProperties = openAIProperties;
    } 

    public String ask(String question) {
    String url = "https://api.openai.com/v1/chat/completions";
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(openAIProperties.getApiKey());

    // GPT에게 JSON 형식으로 응답하라고 지시!
    String prompt = String.format(
        "현재 위치가 '%s'야. 근처에서 추천할만한 장소 9개를 " +
        "아래 JSON 배열 형식으로 알려줘. 이름(한글로), 위도(latitude), 경도(longitude)만 포함해줘.\n\n" +
        "[\n" +
        "  { \"name\": \"장소이름\", \"latitude\": 위도, \"longitude\": 경도 },\n" +
        "  ... (총 9개)\n" +
        "]", question);
    System.out.println(prompt);
    Map<String, Object> body = new HashMap<>();
    body.put("model", "gpt-4-turbo");
    body.put("messages", List.of(
            Map.of("role", "system", "content", "You are a helpful assistant who only answers in JSON."),
            Map.of("role", "user", "content", prompt)
    ));
    body.put("max_tokens", 600);

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

    // content 추출
    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
    String content = (String) message.get("content");

    return content;  // JSON 형식의 문자열 그대로 반환!
}

}





