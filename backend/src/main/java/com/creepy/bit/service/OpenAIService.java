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

   public String ask(String location, String category) {
    String url = "https://api.openai.com/v1/chat/completions";
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(openAIProperties.getApiKey());
    // GPT에게 JSON 형식으로 응답하라고 지시!
    String prompt = String.format(
        "현재 위도 경도가 '%s'야. 내 근처에(멀어도 반경 2KM이내) '%s' 카테고리에 해당하는 장소(프랜차이즈 아닌 곳) 9개를 카카오맵에서 확인해서 " +
        "아래 JSON 배열 형식으로 알려줘. 이름(한글로), 위도(latitude), 경도(longitude)만 포함해줘.\n\n" +
        "[\n" +
        "  { \"name\": \"장소이름\", \"latitude\": 위도, \"longitude\": 경도 },\n" +
        "  ... (총 9개)\n" +
        "]", location, category);
    
    System.out.println("프롬프트 전송:\n" + prompt);

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

    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
    System.out.println("OpenAIService "+(String) message.get("content"));
    return (String) message.get("content");
}

}





