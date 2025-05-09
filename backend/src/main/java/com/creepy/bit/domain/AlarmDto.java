import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlarmDto {
    private int alarmId;
    private int userId;
    private String conditionType;
    private String weatherCondition;
    private String airCondition;
    private String createdAt;
}
