import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TarotCardDto {
    private int tarotId;
    private String name;
    private String description;
    private String imageUrl;
    private String associatedColor;
    private int categoryId;
}

