package com.creepy.bit.service;

import com.creepy.bit.config.OpenAIProperties;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.*;

@Service
public class OpenAIService {

    private final OpenAIProperties openAIProperties;

    @Autowired
    public OpenAIService(OpenAIProperties openAIProperties) {
        this.openAIProperties = openAIProperties;
    }

    // 장소 추천용
    public String askPlace(String location, String category) {
        String prompt = String.format(
            "현재 위도 경도가 '%s'야. 내 근처에(멀어도 반경 2KM이내) '%s' 카테고리에 해당하는 장소(프랜차이즈 아닌 곳) 9개를 카카오맵에서 확인해서 " +
            "아래 JSON 배열 형식으로 알려줘. 이름(한글로), 위도(latitude), 경도(longitude)만 포함해줘.\n\n" +
            "[\n  { \"name\": \"장소이름\", \"latitude\": 위도, \"longitude\": 경도 },\n ...\n]", location, category
        );

        return callOpenAI(prompt);
    }

    // 타로 결과 해석용
    public String askTarot(List<Map<String, Object>> selectedCardsInfo) {
    StringBuilder builder = new StringBuilder();
    builder.append("당신은 감성적인 타로 마스터야.\n");
    builder.append("사용자가 뽑은 카드 3장은 다음과 같아:\n");

    for (Map<String, Object> card : selectedCardsInfo) {
        String name = (String) card.get("cardName");
        String desc = (String) card.get("description");
        List<Map<String, String>> colors = (List<Map<String, String>>) card.get("colors");

        builder.append(String.format("「%s」 - %s\n", name, desc));

        if (colors != null && !colors.isEmpty()) {
            String colorList = colors.stream()
                .map(color -> color.get("colorName"))
                .reduce((a, b) -> a + ", " + b)
                .orElse("");
            builder.append(String.format(" 연관된 색상: %s\n", colorList));
        }
    }

    builder.append("\n이 카드들을 종합해서 오늘 하루를 위한 감성적이고 통합적인 운세 메시지를 한 문단으로 한국어로 써줘.");

    System.out.println(builder.toString());

    return callOpenAI(builder.toString());
}


    // GPT 호출 공통 로직 분리
   private String callOpenAI(String prompt) {
    String url = "https://api.openai.com/v1/chat/completions";
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
     String apiKey = openAIProperties.getApiKey();
    System.out.println("🔑 현재 API 키: " + apiKey);  
  
    headers.setBearerAuth(openAIProperties.getApiKey());

    Map<String, Object> body = new HashMap<>();
    body.put("model", "gpt-3.5-turbo");
    body.put("messages", List.of(
        Map.of("role", "system", "content", "You are a helpful assistant."),
        Map.of("role", "user", "content", prompt)
    ));
    body.put("max_tokens", 600);

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
    RestTemplate restTemplate = new RestTemplate();

    try {
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");

    } catch (HttpClientErrorException.TooManyRequests e) {
        System.err.println("❗ OpenAI 요청 초과: " + e.getMessage());
        return "⚠️ OpenAI 요청량이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    } catch (HttpClientErrorException e) {
        System.err.println("❗ OpenAI 클라이언트 오류: " + e.getMessage());
        return "❌ OpenAI 오류 발생: " + e.getStatusCode();
    } catch (Exception e) {
        e.printStackTrace();
        return "🚨 서버 내부 오류가 발생했습니다.";
    }
}

}
