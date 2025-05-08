import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceStatDto {
    private String placeId;
    private int viewCount;
    private int bookmarkCount;
    private int opinionCount;
    private int likeCount;
    private String updatedAt;
}
