import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceLogDto {
    private String placeId;
    private String name;
    private String address;
    private String category;
    private double latitude;
    private double longitude;
    private String lastFetched;
}
