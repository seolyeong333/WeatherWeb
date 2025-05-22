USE weatherwebdb;

-- ==========================
-- 💥 기존 테이블 제거 (외래키 순서 고려)
-- ==========================
DROP TABLE IF EXISTS flagged_places;
DROP TABLE IF EXISTS weather_messages;
DROP TABLE IF EXISTS tarot_card_colors;
DROP TABLE IF EXISTS tarot_play_logs;
DROP TABLE IF EXISTS tarot_cards;
DROP TABLE IF EXISTS tarot_cards_category;
DROP TABLE IF EXISTS place_stats;
DROP TABLE IF EXISTS place_logs;
DROP TABLE IF EXISTS weather_logs;
DROP TABLE IF EXISTS fashion_colors;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS alarms;
DROP TABLE IF EXISTS opinions;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS users;

-- ==========================
-- 👤 [사용자 테이블]
-- 로그인, 회원정보, 소셜 연동, 권한 관리 등
-- ==========================
CREATE TABLE users (
  userId INT AUTO_INCREMENT PRIMARY KEY,                          -- 고유 사용자 ID
  email VARCHAR(100) NOT NULL UNIQUE,                             -- 이메일 (로그인 시 사용)
  password VARCHAR(255),                                          -- 비밀번호 (소셜 로그인은 NULL)
  nickname VARCHAR(50),                                  -- 사용자 닉네임
  gender ENUM('male','female') NOT NULL,                          -- 성별
  birthday DATE,                                                  -- 생년월일
  provider ENUM('local', 'kakao', 'google', 'naver') NOT NULL,    -- 로그인 제공자 구분
  auth ENUM('USER', 'ADMIN') DEFAULT 'USER',                      -- 권한 (일반 사용자 / 관리자)
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP                    -- 계정 생성일
);

-- ==========================
-- 🔖 [북마크 테이블]
-- 사용자가 찜한 장소 저장
-- ==========================
CREATE TABLE bookmarks (
  bookmarkId INT AUTO_INCREMENT PRIMARY KEY,                      -- 북마크 고유 ID
  userId INT NOT NULL,                                            -- 북마크한 사용자 ID
  placeId VARCHAR(100) NOT NULL,                                  -- 외부 API 기준 장소 ID
  placeName VARCHAR(100) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,                   -- 북마크 생성 시각
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE -- 사용자 삭제 시 자동 삭제
);

-- ==========================
-- 💬 [한줄평 테이블]
-- 사용자 의견 저장
-- ==========================
CREATE TABLE opinions (
  opinionId INT AUTO_INCREMENT PRIMARY KEY,                       -- 한줄평 고유 ID
  userId INT NOT NULL,                                            -- 작성자 ID
  placeId VARCHAR(100) NOT NULL,                                  -- 외부 API 기준 장소 ID
  placeName VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,                                          -- 한줄평 내용 
  rating INT NOT NULL,
  isPublic BOOLEAN DEFAULT TRUE,                                  -- 공개 여부
  likes INT DEFAULT 0,                                            -- 좋아요 수
  dislikes INT DEFAULT 0,                                         -- 싫어요 수
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,                   -- 작성 시각
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE -- 사용자 삭제 시 자동 삭제
);

-- ==========================
-- 🔔 [알림 설정 테이블]
-- 사용자 맞춤 조건 설정
-- ==========================
CREATE TABLE alarms (
  alarmId INT AUTO_INCREMENT PRIMARY KEY,                         -- 알림 고유 ID
  userId INT NOT NULL,                                            -- 알림을 설정한 사용자 ID
  conditionType ENUM('weather', 'air', 'both') NOT NULL,          -- 조건 유형 (날씨 / 미세먼지 / 둘 다)
  weatherCondition VARCHAR(50),                                   -- 날씨 조건 (예: 맑음, 흐림)
  airCondition VARCHAR(50),                                       -- 공기 조건 (예: 좋음, 나쁨)
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,                   -- 알림 설정 시간
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE -- 사용자 삭제 시 자동 삭제
);

-- ==========================   
-- 📢 [공지사항 테이블]
-- 관리자 공지 게시
-- ==========================
CREATE TABLE notices (
  noticeId INT AUTO_INCREMENT PRIMARY KEY,                        -- 공지 고유 ID
  title VARCHAR(100) NOT NULL,                                    -- 공지 제목
  content TEXT NOT NULL,                                          -- 공지 본문 내용
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP                    -- 등록 시간
);

-- ==========================
-- 🚨 [신고 테이블]
-- 사용자 신고 내용 저장
-- ==========================
CREATE TABLE reports (
  reportId INT AUTO_INCREMENT PRIMARY KEY,                        -- 신고 고유 ID
  userId INT NOT NULL,                                                  -- 신고자 ID
  targetId VARCHAR(100),                                                -- 신고 대상 (placeId 또는 opinionId)
  targetType ENUM("place","opinion") NOT NULL,
  placeName VARCHAR(100),
  content TEXT NOT NULL,                                                -- 신고 내용
  status ENUM('PENDING', 'RESOLVED') DEFAULT 'PENDING',           -- 신고 처리 상태
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,                   -- 신고 일자
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE -- 사용자 삭제 시 자동 삭제
);

-- ==========================
-- 👗 [의상 추천 테이블]
-- 체감 온도에 따른 추천 색상 및 아이템
-- ==========================
CREATE TABLE fashion_colors (
  id INT AUTO_INCREMENT PRIMARY KEY,                              -- 추천 ID
  weatherType VARCHAR(50) NOT NULL,                          -- 날씨 조건 (예: 맑음, 흐림)
  minTemp DECIMAL(4,2) NOT NULL,
  maxTemp DECIMAL(4,2) NOT NULL,
  colorCode VARCHAR(20),                                          -- 추천 색상 코드 (예: #5B8DEF)
  itemSuggestion VARCHAR(100)                                     -- 추천 아이템 (예: 롱패딩, 반팔)
);

-- ==========================
-- 🌤️ [날씨 캐시 테이블]
-- 외부 API에서 받아온 날씨 정보를 지역별로 저장
-- ==========================
CREATE TABLE weather_logs (
  weatherId INT AUTO_INCREMENT PRIMARY KEY,                       -- 날씨 캐시 고유 ID
  location VARCHAR(100),                                          -- 행정 지역명 (표시용)
  latitude DECIMAL(10,7) NOT NULL,                                -- 위도
  longitude DECIMAL(10,7) NOT NULL,                               -- 경도
  dateTime DATETIME NOT NULL,                                     -- 측정 시간
  weather VARCHAR(50),                                            -- 날씨 상태 (예: 흐림, 맑음)
  temperature DECIMAL(4,1),                                       -- 기온
  pm10 INT,                                                       -- 미세먼지 수치
  pm25 INT,                                                       -- 초미세먼지 수치
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP                    -- 저장 시간
);

-- ==========================
-- 📍 [장소 캐시 테이블]
-- 외부 API 장소 정보를 임시로 저장하여 캐싱
-- ==========================
CREATE TABLE place_logs (
  placeId VARCHAR(100) PRIMARY KEY,                               -- 외부 API 장소 ID
  name VARCHAR(100),                                              -- 장소명
  address TEXT,                                                   -- 장소 주소
  category VARCHAR(50),                                           -- 카테고리 (예: 음식점, 문화시설)
  latitude DECIMAL(10,7),                                         -- 위도
  longitude DECIMAL(10,7),                                        -- 경도
  lastFetched DATETIME DEFAULT CURRENT_TIMESTAMP                  -- 마지막 캐시 저장 시각
);

-- ==========================
-- 📊 [장소 통계 테이블]
-- 사용자의 활동(조회수, 추천 등)을 통계로 저장
-- ==========================
CREATE TABLE place_stats (
  placeId VARCHAR(100) PRIMARY KEY,                               -- 외부 API 장소 ID
  viewCount INT DEFAULT 0,                                        -- 조회 수
  bookmarkCount INT DEFAULT 0,                                    -- 북마크 수
  opinionCount INT DEFAULT 0,                                     -- 한줄평 수
  likeCount INT DEFAULT 0,                                        -- 추천 수
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP                    -- 수정 시각
             ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- 🃏 [타로 카테고리 테이블]
-- 타로 카드 분류 (예: 별자리, 식물, 탄생석)
-- ==========================
CREATE TABLE tarot_cards_category (
  categoryId INT AUTO_INCREMENT PRIMARY KEY,                      -- 카테고리 고유 ID
  categoryName VARCHAR(50) NOT NULL                               -- 카테고리 이름
);

-- ==========================
-- 🎴 [타로 카드 테이블]
-- 타로 카드 정보 저장 (카테고리 연결)
-- ==========================
CREATE TABLE tarot_cards (
  cardId INT AUTO_INCREMENT PRIMARY KEY,                          -- 타로 카드 고유 ID
  cardName VARCHAR(50) NOT NULL,                                  -- 타로 카드 이름
  description TEXT,                                               -- 타로 카드 설명
  categoryId INT NOT NULL,                                        -- 타로 카드 카테고리 ID
  FOREIGN KEY (categoryId) REFERENCES tarot_cards_category(categoryId)
    ON DELETE CASCADE                                             -- 카테고리 삭제 시 카드도 삭제
);

-- ==========================
-- 🎴 [타로 색 연동 테이블]
-- 타로 카드별 색 정보 저장 (타로 카드 연결)
-- ==========================

CREATE TABLE tarot_card_colors (
  colorId INT AUTO_INCREMENT PRIMARY KEY,
  cardId INT NOT NULL,
  colorName VARCHAR(20) NOT NULL,
  hexCode VARCHAR(10) NOT NULL,
  FOREIGN KEY (cardId) REFERENCES tarot_cards(cardId)
    ON DELETE CASCADE
);

-- ==========================
-- 📅 [타로 플레이 기록 테이블]
-- 유저가 어떤 타로를 언제 뽑았는지 저장 (하루 1번 제한)
-- ==========================
CREATE TABLE tarot_play_logs (
  playId INT AUTO_INCREMENT PRIMARY KEY,                          -- 기록 고유 ID
  userId INT NOT NULL,                                            -- 사용자 ID
  cardIds VARCHAR(20) NOT NULL,                                            -- 뽑은 타로 카드 ID
  cardColors VARCHAR(50) NOT NULL,
  isPlay DATE NOT NULL,                                           -- 플레이 날짜
  description TEXT NOT NULL,                                      -- 타로 설명
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
  );

-- ==========================
-- 📅 [날씨 한마디 테이블]
-- 예를 들어, 현재 기온이 9.5도이고, 날씨가 rain이면 5~10도 rain에 해당하는 멘트를 보여줍니다.
-- ==========================
CREATE TABLE weather_messages (
    weatherMessageId INT AUTO_INCREMENT PRIMARY KEY,
    weatherType VARCHAR(20) NOT NULL,
    minTemp DECIMAL(4,2) NOT NULL,
    maxTemp DECIMAL(4,2) NOT NULL,
    message TEXT NOT NULL,
    weatherFit VARCHAR(100) NOT NULL          -- AI 추천용 장소 카테고리 (ex: '카페', '야외', '전시회')
);
CREATE TABLE flagged_places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placeName VARCHAR(255) UNIQUE NOT NULL
);


-- 날씨 별 메세지 및 웨더핏 (수정 필요)
-- 맑음
INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
('맑음', -99.00, -18.61, '이례적인 한파에요. 역대 최저 기온인 오늘만큼은 외출은 피하고 따뜻한 실내에서 몸을 녹이는 걸 추천해요.', '따뜻한 실내,감성카페,미술관,백화점'),
('맑음', -18.60, 0.00, '추운 겨울 맑은 날이에요. 외출 시, 따뜻하게 입고 햇살을 즐겨보세요', '실외,공원,산책로,한강공원'),
('맑음', 0.01, 10.00, '쌀쌀하지만 맑은 날씨예요. 가볍게 산책해보는 건 어때요?', '실외,공원,한강공원,산책로,루프탑'),
('맑음', 10.01, 20.00, '산책하기 좋은 맑은 날! 야외활동에 최적의 날씨예요.', '실외,공원,한강공원,산책로,루프탑'),
('맑음', 20.01, 28.00, '햇살 가득한 하루! 어디든 나가고 싶은 날이에요.', '실외,공원,산책로,루프탑'),
('맑음', 28.01, 33.00, '덥지만 하늘은 맑아요. 물놀이나 그늘 아래 나들이는 괜찮겠어요.', '물놀이,수영장,워터파크,계곡'),
('맑음', 33.01, 99.00, '매우 더운 날이에요. 폭염에 주의하세요.', '실내,음식점,감성카페,영화관,미술관,서점');

-- 흐림
INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
('흐림', -99.00, -18.61, '이례적인 한파에요. 역대 최저 기온인 오늘만큼은 외출은 피하고 따뜻한 실내에서 몸을 녹이는 걸 추천해요.', '따뜻한 실내,감성카페,북카페,백화점'),
('흐림', -18.60, 0.00, '추운 흐린 날이에요. 따뜻한 실내 공간에서 시간을 보내보세요.', '따뜻한 실내,감성카페,미술관,백화점'),
('흐림', 0.01, 20.00, '흐린 날엔 감성적인 실내 카페나 영화관 데이트는 어때요?', '실외,카페,영화관,감성카페'),
('흐림', 20.01, 28.00, '햇살은 없지만 활동하기엔 괜찮은 날씨예요. 가까운 곳 산책도 좋아요.', '실외,공원,산책로,전망대'),
('흐림', 28.01, 33.00, '날씨도 흐리고 더운 오늘. 데이트는 실내에서 어때요?', '실내,카페,방탈출카페,영화관,백화점'),
('흐림', 33.01, 99.00, '매우 더운 날이에요. 폭염에 주의하세요.', '실내,감성카페,북카페,영화관,도서관');

-- 비
INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
('비', -99.00, 0.00, '춥고 비도 와요. 외출은 피하고 실내에서 따뜻하게 보내세요.', '따뜻한 실내,감성카페,미술관,백화점'),
('비', 0.01, 10.00, '비로 인해 유독 서늘하게 느껴지는 오늘 따뜻한 카페에서 여유를 즐겨보세요.', '따뜻한 실내,감성카페,북카페,방탈출카페,보드게임카페'),
('비', 10.01, 20.00, '비 오는 날엔 조용한 실내 전시나 북카페 추천드려요.', '실내,북카페,미술관,서점,도서관'),
('비', 20.01, 33.00, '더운 여름비엔 시원한 카페나 실내 쇼핑몰이 좋아요.', '실내,감성카페,북카페,백화점'),
('비', 33.01, 99.00, '매우 더운 날이에요. 폭염에 주의하세요.', '실내,카페,영화관');

-- 눈
INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
('눈', -99.00, 0.00, '눈 오는 매우 추운 날이에요. 외출 시 미끄럼 주의! 따뜻한 실내가 최고예요.', '따뜻한 실내,감성카페,미술관,백화점'),
('눈', 0.01, 10.00, '포근하게 내리는 눈, 따뜻한 카페에서 여유를 즐겨보세요.', '따뜻한 실내,감성카페,북카페'),
('눈', 10.01, 20.00, '날씨는 따뜻한데 눈이 오는 신기한 일이네요. 호랑이 아닌 용이 시집가나요? 야외에서 구경해보는 것도 좋을 것 같아요', '실외,공원,한강공원,산책로'),
('눈', 20.01, 99.00, '말도 안돼요. 지구가 망해가나봐요. 모두들 쓰레기라도 하나씩 주우세요.', '비상,대피소');

-- 이슬비
INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
('이슬비', -99.00, 0.00, '춥고 비도 와요. 외출은 피하고 실내에서 따뜻하게 보내세요.', '따뜻한 실내,감성카페,미술관,백화점,박물관'),
('이슬비', 0.01, 10.00, '비로 인해 유독 서늘하게 느껴지는 오늘 따뜻한 카페에서 여유를 즐겨보세요.', '따뜻한 실내,감성카페,북카페'),
('이슬비', 10.01, 20.00, '잔잔한 이슬비가 내리는 날이에요. 감성적인 실내 공간이 잘 어울려요.', '실내,감성카페,미술관,백화점'),
('이슬비', 20.01, 33.00, '더운 여름비엔 시원한 카페나 실내 쇼핑몰이 좋아요.', '실내,카페,감성카페,영화관,백화점'),
('이슬비', 33.01, 99.00, '비도 오고 매우 더운 날이에요. 폭염에 주의하세요.', '실내,카페,영화관');

-- 소나기
INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
('소나기', -99.00, 0.00, '춥고 비도 와요. 외출은 피하고 실내에서 따뜻하게 보내세요.', '따뜻한 실내,감성카페,미술관,백화점'),
('소나기', 0.01, 10.00, '비로 인해 유독 서늘하게 느껴지는 오늘 따뜻한 카페에서 여유를 즐겨보세요.', '따뜻한 실내,감성카페,북카페'),
('소나기', 10.01, 20.00, '날씨가 정말 좋은데 갑작스러운 소나기가 내릴 수 있으니 주의하세요.', '실내,카페,영화관,미술관,백화점'),
('소나기', 20.01, 28.00, '갑작스러운 소나기엔 실내 전시관이나 카페가 좋겠어요.', '실내,감성카페,북카페,미술관'),
('소나기', 28.01, 33.00, '비 예보도 있고 더운 오늘 데이트는 실내에서 어때요?', '실내,감성카페,영화관,미술관,백화점'),
('소나기', 33.01, 99.00, '비도 오고 매우 더운 날이에요. 폭염에 주의하세요.', '실내,카페,영화관');

-- 뇌우
INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
('뇌우', -99.00, 99.00, '천둥번개가 치는 위험한 날씨예요. 외출보단 실내에서 안전하게 머무르세요.', '실내,감성카페,미술관,백화점,찜질방');

INSERT INTO weather_messages (weatherType, minTemp, maxTemp, message, weatherFit) VALUES
-- 매우 추운 날 (영하 19도 이하)
('기타', -99.00, -18.61, '이례적인 한파예요. 오늘은 최대한 외출을 피하고 따뜻한 실내에서 휴식을 취해보세요.', '따뜻한 실내,감성카페,북카페,도서관'),
('기타', -18.60, 0.00, '춥고 우중충한 날씨엔 따뜻한 음료 한 잔과 실내 데이트가 제격이에요.', '감성카페,전시관,도서관,실내데이트'),
('기타', 0.01, 20.00, '어중간한 날씨엔 감성 카페나 영화관에서 조용한 시간을 보내는 것도 좋아요.', '감성카페,영화관,북카페,전시회'),
('기타', 20.01, 28.00, '무난한 날씨예요. 실내외 어디든 좋아요. 가볍게 산책하거나 가까운 명소를 둘러보세요.', '산책로,전망대,감성카페,소극장'),
('기타', 28.01, 33.00, '더운 날엔 시원한 실내에서 휴식을 취하는 것이 좋아요. 아이스크림 먹으러 카페 데이트는 어때요?', '실내카페,방탈출카페,북카페,쇼핑몰'),
('기타', 33.01, 99.00, '무더운 날씨예요. 폭염에 유의하고, 시원한 실내에서 여유를 즐기세요.', '백화점,도서관,감성카페,영화관,쇼핑몰');


-- 체감 온도별 추천 의상 아이콘
-- 맑음
INSERT INTO fashion_colors (weatherType, minTemp, maxTemp, itemSuggestion) VALUES
('맑음', -99.00, -18.61, '패딩, 기모 후드, 귀마개'),
('맑음', -18.60, 0.00, '패딩, 니트, 머플러'),
('맑음', 0.01, 10.00, '코트, 가디건, 스카프'),
('맑음', 10.01, 17.00, '셔츠, 면바지'),
('맑음', 17.01, 23.00, '얇은 셔츠, 청바지'),
('맑음', 23.01, 28.00, '반팔, 반바지, 샌들'),
('맑음', 28.01, 33.00, '린넨 셔츠, 반바지, 양산'),
('맑음', 33.01, 99.00, '민소매, 린넨 셔츠, 선글라스');

-- 흐림
INSERT INTO fashion_colors (weatherType, minTemp, maxTemp, itemSuggestion) VALUES
('흐림', -99.00, -18.61, '패딩, 기모 후드, 머플러'),
('흐림', -18.60, 0.00, '니트, 부츠, 장갑'),
('흐림', 0.01, 10.00, '코트, 가디건, 스카프'),
('흐림', 10.01, 17.00, '맨투맨, 청바지'),
('흐림', 17.01, 23.00, '얇은 셔츠, 가디건, 청바지'),
('흐림', 23.01, 28.00, '반팔, 면바지'),
('흐림', 28.01, 33.00, '얇은 셔츠, 반바지, 선크림'),
('흐림', 33.01, 99.00, '민소매, 린넨 셔츠, 선크림');

-- 비
INSERT INTO fashion_colors (weatherType, minTemp, maxTemp, itemSuggestion) VALUES
('비', -99.00, 0.00, '패딩, 부츠, 우산'),
('비', 0.01, 10.00, '코트, 니트, 우산'),
('비', 10.01, 17.00, '우비, 맨투맨, 면바지'),
('비', 17.01, 23.00, '얇은 니트, 가디건 우산'),
('비', 23.01, 33.00, '반팔, 샌들, 우산'),
('비', 33.01, 99.00, '민소매, 샌들, 우산');


-- 눈
INSERT INTO fashion_colors (weatherType, minTemp, maxTemp, itemSuggestion) VALUES
('눈', -99.00, -10.00, '패딩, 귀마개, 장갑'),
('눈', -9.99, 0.00, '코트, 머플러, 장갑'),
('눈', 0.01, 10.00, '니트, 청바지, 우산'),
('눈', 10.01, 99.00, '롱슬리브, 슬랙스, 우산');


-- 기타
INSERT INTO fashion_colors (weatherType, minTemp, maxTemp, itemSuggestion) VALUES
('기타', -99.00, -10.00, '패딩, 기모 후드, 머플러'),
('기타', -9.99, 0.00, '코트, 머플러, 장갑'),
('기타', 0.01, 10.00, '코트, 가디건, 스카프'),
('기타', 10.01, 18.00, '롱슬리브, 슬랙스, 양산'),
('기타', 18.01, 99.00, '반팔, 반바지, 선글라스');

-- 타로 운세
INSERT INTO tarot_cards_category (categoryId, categoryName)
VALUES
(1, '날씨 타로'),
(2, '별자리 타로'),
(3, '꽃 타로');

-- 날씨 타로
INSERT INTO tarot_cards (cardName, description, categoryId) VALUES
('Sun', '밝고 생기 있는 태양의 기운은 오늘의 시작에 활력을 줍니다. 따뜻함과 자신감을 상징합니다.', 1),
('Heavy Rain', '무거운 빗줄기는 감정을 해소하고 정화를 의미합니다. 내면의 치유와 휴식의 시간이 필요합니다.', 1),
('Light Snow', '가볍게 내리는 눈은 순수한 에너지와 조용한 행복을 상징합니다. 감성적 감수성을 키우는 날입니다.', 1),
('Thunderstorm', '천둥번개는 강한 에너지의 흐름을 의미합니다. 변화의 시기, 강렬한 결단과 전환을 뜻합니다.', 1),
('Hurricane', '혼란과 소용돌이 속에서도 중심을 잡는 힘이 필요합니다. 위기 속 통찰과 냉철함을 요구합니다.', 1),
('Clear Sky', '구름 없는 맑은 하늘은 평화와 자유를 상징합니다. 마음의 여유와 순수한 의도를 믿어보세요.', 1),
('Wind Rain', '바람과 비가 함께 하는 날은 복잡한 감정과 생각이 스치는 날입니다. 신중함이 필요합니다.', 1),
('Wind Thunder', '빠르게 지나가는 바람과 번개는 직관과 빠른 판단력을 의미합니다. 결단의 날입니다.', 1),
('Hail', '우박은 단단한 시련을 상징하며, 그 속에서도 끈기와 의지를 갖는 자세가 요구됩니다.', 1),
('Drizzle', '잔잔히 내리는 비는 차분함과 사색을 돕습니다. 여유롭고 부드러운 하루가 예상됩니다.', 1);

select*from tarot_cards;
INSERT INTO tarot_card_colors (cardId, colorName, hexCode) VALUES
(1, '옐로우', '#F6D850'),
(1, '오렌지', '#FF8A00'),
(2, '블루', '#3B61E2'),
(2, '실버', '#EEEEEE'),
(3, '화이트', '#FFFFFF'),
(3, '민트', '#B9EAD9'),
(4, '퍼플', '#8659D1'),
(4, '블랙', '#000000'),
(5, '그레이', '#9C9C9C'),
(5, '네이비', '#1C2C7C'),
(6, '스카이블루', '#BCE5F1'),
(6, '화이트', '#FFFFFF'),
(7, '민트', '#B9EAD9'),
(7, '그레이', '#9C9C9C'),
(8, '옐로우', '#F6D850'),
(8, '블랙', '#000000'),
(9, '브라운', '#836244'),
(9, '실버', '#EEEEEE'),
(10, '라벤더', '#D8C6F1'),
(10, '핑크', '#F9CCE1');

-- 별자리 타로 
INSERT INTO tarot_cards (cardName, description, categoryId) VALUES
('염소자리', '뿔과 진중한 느낌의 여신 (근면/현실적)', 2), -- 현실적이고 근면한 성향. 단단한 뿔을 가진 존재로 인내와 책임감을 상징.
('양자리', '불꽃 기운, 왕관/지팡이 (개척자/리더)', 2), -- 열정적이고 개척적인 불의 별자리. 리더십과 추진력을 상징.
('천칭자리', '평화적 제스처, 조화와 균형', 2), -- 조화와 균형을 추구하는 성향. 공정함과 우아함의 상징.
('쌍둥이자리', '다재다능하고 빠른 사고. 대화와 지성의 별자리.', 2), -- 다재다능하고 빠른 사고. 대화와 지성의 별자리.
('물고기자리', '직관과 상상력의 별자리. 감정적이고 예술적인 기질.', 2), -- 직관과 상상력의 별자리. 감정적이고 예술적인 기질.
('처녀자리', '섬세하고 분석적인 성향. 자연과 치유의 에너지를 상징.', 2), -- 섬세하고 분석적인 성향. 자연과 치유의 에너지를 상징.
('천칭자리', '균형과 조화를 중시하며 관계에 민감한 성향.', 2), -- 균형과 조화를 중시하며 관계에 민감한 성향.
('사자자리', '자신감과 카리스마 넘치는 리더. 태양처럼 빛나는 존재.', 2), -- 자신감과 카리스마 넘치는 리더. 태양처럼 빛나는 존재.
('전갈자리', '강렬한 감정과 신비로움. 변화를 상징하는 별자리.', 2), -- 강렬한 감정과 신비로움. 변화를 상징하는 별자리.
('물병자리', '혁신과 독창성의 별자리. 이상주의적이고 진보적인 성향.', 2), -- 혁신과 독창성의 별자리. 이상주의적이고 진보적인 성향
('궁수자리', '자유롭고 철학적인 탐구자. 활을 쏘는 자로 진리를 추구함.', 2), -- 자유롭고 철학적인 탐구자. 활을 쏘는 자로 진리를 추구함.
('황소자리', '안정과 감각을 중시하는 땅의 별자리. 우직함과 풍요를 상징.', 2); -- 안정과 감각을 중시하는 땅의 별자리. 우직함과 풍요를 상징.

INSERT INTO tarot_card_colors (cardId, colorName, hexCode) VALUES
-- 염소자리
(11, '브라운', '#836244'), (11, '블랙', '#000000'),
-- 양자리
(12, '골드', '#E4CD6C'), (12, '핑크', '#F9CCE1'),
-- 천칭자리
(13, '라벤더', '#D8C6F1'), (13, '스카이블루', '#BCE5F1'),
-- 쌍둥이자리
(14, '옐로우', '#F6D850'), (14, '카키', '#7A8450'),
-- 물고기자리
(15, '민트', '#B9EAD9'), (15, '그린', '#45A56B'),
-- 처녀자리
(16, '옐로우', '#F6D850'), (16, '베이지', '#E5DED3'),
-- 천칭자리 (중복 카드 ID)
(17, '라벤더', '#D8C6F1'), (17, '스카이블루', '#BCE5F1'),
-- 사자자리
(18, '골드', '#E4CD6C'), (18, '오렌지', '#FF8A00'),
-- 전갈자리
(19, '레드', '#E63B2E'), (19, '와인', '#803434'),
-- 물병자리
(20, '화이트', '#FFFFFF'), (20, '블루', '#3B61E2'),
-- 궁수자리
(21, '퍼플', '#8659D1'), (21, '네이비', '#1C2C7C'),
-- 황소자리
(22, '그린', '#45A56B'), (22, '스카이블루', '#BCE5F1');


SELECT * FROM weather_messages;
SELECT * FROM tarot_play_logs;
SELECT * FROM tarot_card_colors;
SELECT * FROM tarot_cards;
SELECT * FROM tarot_cards_category;
SELECT * FROM place_stats;
SELECT * FROM place_logs;
SELECT * FROM weather_logs;
SELECT * FROM fashion_colors;
SELECT * FROM reports;
SELECT * FROM notices;
SELECT * FROM alarms;
SELECT * FROM opinions;
SELECT * FROM bookmarks;
SELECT * FROM weather_messages;
SELECT * FROM users;



INSERT INTO users (
  email, password, nickname, gender, birthday, provider, auth
) VALUES (
  'j8428820@naver.com', '1234', '장준환', 'male', '2000-12-21', 'local', 'ADMIN'
);

INSERT INTO users (
  email, password, nickname, gender, birthday, provider, auth
) VALUES (
  '33qqpp@naver.com', '1234', '이설영', 'female', '2000-12-10', 'local', 'USER' 
);

INSERT INTO users (
  email, password, nickname, gender, birthday, provider, auth
) VALUES (
  'hmsdhk@naver.com', '123', '장준하', 'male', '2001-01-02', 'local', 'USER'
);

-- ==========================
-- 💬 [한줄평 테이블] 샘플 데이터
-- ==========================
INSERT INTO opinions (userId, placeId, placeName, content, rating, isPublic, createdAt) VALUES
-- 서초 우면산숲길
(2, '958369226', '서초 우면산숲길', '기대보다는 평범했어요. 특별한 점은 잘 모르겠네요.', 2, TRUE, NOW()),
(3, '958369226', '서초 우면산숲길', '생각보다 길이 짧아서 아쉬웠습니다.', 3, TRUE, NOW()),
-- 레드버튼 시네마강남점
(2, '920171764', '레드버튼 시네마강남점', '게임 종류는 많은데 관리가 조금 아쉬워요.', 3, TRUE, NOW()),
(3, '920171764', '레드버튼 시네마강남점', '인기 많은 곳이라 그런지 사람이 너무 많았어요.', 2, TRUE, NOW()),
-- 놀숲 강남교보타워점
(2, '894327405', '놀숲 강남교보타워점', '책 종류가 다양해서 좋았어요. 편안한 분위기입니다.', 4, TRUE, NOW()),
(3, '894327405', '놀숲 강남교보타워점', '시간 보내기 좋은 곳이지만, 음식 맛은 평범했어요.', 3, TRUE, NOW()),
-- 삼성각
(2, '8341060', '삼성각', '오래된 중국집 특유의 맛이 있어요. 나쁘지 않습니다.', 3, TRUE, NOW()),
(3, '8341060', '삼성각', '가격 대비 양이 조금 적은 느낌이었어요.', 2, TRUE, NOW()),
-- 딘타이펑 강남점
(2, '8279464', '딘타이펑 강남점', '역시 샤오롱바오는 맛있네요. 만족합니다.', 5, TRUE, NOW()),
(3, '8279464', '딘타이펑 강남점', '가격대가 좀 있지만 맛은 보장되는 곳이에요.', 4, TRUE, NOW()),
-- 초선과여포 본점
(2, '8097973', '초선과여포 본점', '양꼬치 맛집 인정! 잡내 없고 맛있어요.', 5, TRUE, NOW()),
(3, '8097973', '초선과여포 본점', '꿔바로우도 훌륭합니다. 술안주로 최고.', 4, TRUE, NOW()),
-- 조양관
(2, '8086138', '조양관', '분위기는 좋은데, 가격에 비해 맛은 평범했어요.', 3, TRUE, NOW()),
(3, '8086138', '조양관', '특별한 날 가기엔 좋지만, 자주 가기엔 부담스러운 가격.', 2, TRUE, NOW()),
-- 놀숲 강남역점
(2, '798713718', '놀숲 강남역점', '만화책 보며 쉬기에는 좋지만, 사람이 많아 좀 시끄러웠어요.', 3, TRUE, NOW()),
(3, '798713718', '놀숲 강남역점', '기대했던 것보다는 책 종류가 적어서 아쉬웠습니다.', 2, TRUE, NOW()),
-- 서리풀 악기거리
(2, '791238280', '서리풀 악기거리', '다양한 악기를 구경하는 재미가 있네요. 신기했어요.', 4, TRUE, NOW()),
(3, '791238280', '서리풀 악기거리', '악기에 관심 있다면 한번쯤 방문할 만합니다.', 3, TRUE, NOW()),
-- 청류벽
(2, '770095922', '청류벽', '평양냉면 맛이 아주 깔끔하고 좋았어요!', 5, TRUE, NOW()),
(3, '770095922', '청류벽', '만두도 맛있고, 전체적으로 만족스러운 식사였습니다.', 4, TRUE, NOW()),
-- 창업가거리
(2, '743156823', '창업가거리', '활기 넘치는 분위기는 좋은데, 딱히 볼거리는 없었어요.', 2, TRUE, NOW()),
(3, '743156823', '창업가거리', '지나가다 한번쯤 볼만하지만, 일부러 찾아갈 정도는 아닌 듯.', 1, TRUE, NOW()),
-- 매봉산
(2, '573013991', '매봉산', '가볍게 오르기 좋은 산입니다. 경치도 괜찮아요.', 4, TRUE, NOW()),
(3, '573013991', '매봉산', '등산로가 잘 되어 있어서 산책하기 좋았습니다.', 4, TRUE, NOW()),
-- 서울테마산책길 인재개발원 잣나무숲길
(2, '492950147', '서울테마산책길 인재개발원 잣나무숲길', '잣나무숲길 정말 최고예요! 공기가 다릅니다.', 5, TRUE, NOW()),
(3, '492950147', '서울테마산책길 인재개발원 잣나무숲길', '힐링하기 좋은 숨은 명소네요. 조용하고 아름다워요.', 5, TRUE, NOW()),
-- 키이스케이프 강남 더오름
(2, '400448256', '키이스케이프 강남 더오름', '문제 난이도가 너무 어려웠어요. 힌트를 많이 썼네요.', 2, TRUE, NOW()),
(3, '400448256', '키이스케이프 강남 더오름', '테마는 신선했지만, 전체적으로 조금 아쉬웠습니다.', 3, TRUE, NOW()),
-- 스타벅스 강남R점
(2, '35026031', '스타벅스 강남R점', '리저브 매장이라 특별한 커피를 맛볼 수 있어 좋아요.', 5, TRUE, NOW()),
(3, '35026031', '스타벅스 강남R점', '사람이 너무 많아서 자리가 없었어요. 커피는 맛있습니다.', 3, TRUE, NOW()),
-- 일일향 강남3호점
(2, '27504403', '일일향 강남3호점', '어향동고는 역시 맛있네요. 다른 메뉴는 평범했어요.', 4, TRUE, NOW()),
(3, '27504403', '일일향 강남3호점', '기대만큼은 아니었지만, 그래도 괜찮은 중식당입니다.', 3, TRUE, NOW()),
-- 쉼스토리
(2, '27464586', '쉼스토리', '정말 최악의 경험이었어요. 다시는 안 갈 겁니다.', 1, TRUE, NOW()),
(3, '27464586', '쉼스토리', '시설도 별로고, 책 관리도 잘 안되는 것 같아요.', 1, TRUE, NOW()),
-- 됐소 강남점
(2, '26573718', '됐소 강남점', '고기 질은 괜찮은데, 서비스가 좀 아쉬웠습니다.', 3, TRUE, NOW()),
(3, '26573718', '됐소 강남점', '가격 대비 그저 그랬어요. 특별한 맛은 아니네요.', 2, TRUE, NOW()),
-- 서울명예도로 무지개길
(2, '236287090', '서울명예도로 무지개길', '이름은 예쁜데, 실제로 가보니 별거 없었어요.', 2, TRUE, NOW()),
(3, '236287090', '서울명예도로 무지개길', '산책하기에는 나쁘지 않지만, 명예도로라는 이름에는 못 미치는 듯.', 3, TRUE, NOW()),
-- 알베르
(2, '22837049', '알베르', '커피 맛은 괜찮은데, 너무 시끄러워서 대화하기 힘들었어요.', 2, TRUE, NOW()),
(3, '22837049', '알베르', '분위기는 좋지만 사람이 너무 많고 가격도 비싼 편.', 2, TRUE, NOW()),
-- 노랑저고리 강남점
(2, '22716674', '노랑저고리 강남점', '한정식 구성이 알차고 맛있어요. 추천합니다.', 5, TRUE, NOW()),
(3, '22716674', '노랑저고리 강남점', '어른들 모시고 가기 좋은 고급스러운 분위기입니다.', 4, TRUE, NOW()),
-- 스머프매직포레스트
(2, '218343539', '스머프매직포레스트', '아이들이 좋아할 만한 곳이지만, 어른들은 좀 지루할 수 있어요.', 3, TRUE, NOW()),
(3, '218343539', '스머프매직포레스트', '생각보다 규모가 작아서 금방 둘러봤네요.', 2, TRUE, NOW()),
-- 서초명품화랑
(2, '20946680', '서초명품화랑', '기대 안 했는데 생각보다 볼 만한 작품들이 있었어요.', 4, TRUE, NOW()),
(3, '20946680', '서초명품화랑', '조용히 그림 감상하기 좋은 곳입니다.', 4, TRUE, NOW()),
-- 장꼬방
(2, '19232112', '장꼬방', '김치찌개가 정말 맛있어요! 인생 김치찌개 등극!', 5, TRUE, NOW()),
(3, '19232112', '장꼬방', '계란말이도 푸짐하고 맛있어서 꼭 같이 시켜야 해요.', 5, TRUE, NOW()),
-- 벌툰 엔틱 강남역점
(2, '1886791812', '벌툰 엔틱 강남역점', '인테리어는 예쁜데, 책 종류가 너무 없어요.', 2, TRUE, NOW()),
(3, '1886791812', '벌툰 엔틱 강남역점', '사진 찍기에는 좋지만, 만화카페로는 글쎄요...', 1, TRUE, NOW()),
-- 벌툰 파리지앵 강남본점
(2, '173009195', '벌툰 파리지앵 강남본점', '분위기만 좋고 나머지는 다 별로였어요.', 1, TRUE, NOW()),
(3, '173009195', '벌툰 파리지앵 강남본점', '다시는 방문하고 싶지 않은 곳입니다. 실망스러워요.', 1, TRUE, NOW()),
-- 토즈모임센터 강남역토즈타워점
(2, '17206019', '토즈모임센터 강남역토즈타워점', '시설은 깨끗하고 좋은데, 이용료가 조금 비싼 편이에요.', 3, TRUE, NOW()),
(3, '17206019', '토즈모임센터 강남역토즈타워점', '조용히 공부하거나 회의하기에 적합한 장소입니다.', 4, TRUE, NOW()),
-- 서리풀푸드트럭존
(2, '1677440989', '서리풀푸드트럭존', '다양한 음식을 맛볼 수 있어서 좋지만, 위생이 걱정돼요.', 2, TRUE, NOW()),
(3, '1677440989', '서리풀푸드트럭존', '가격도 비싸고 맛도 평범해서 실망했습니다.', 1, TRUE, NOW()),
-- 농민백암순대 강남직영점
(2, '16421356', '농민백암순대 강남직영점', '국밥은 역시 여기! 진한 국물 맛이 일품입니다.', 5, TRUE, NOW()),
(3, '16421356', '농민백암순대 강남직영점', '순대도 맛있고 양도 푸짐해요. 해장으로 최고!', 5, TRUE, NOW()),
-- 키이스케이프 강남점
(2, '1405262610', '키이스케이프 강남점', '탈출 실패! 너무 어려웠지만 재미있었어요.', 4, TRUE, NOW()),
(3, '1405262610', '키이스케이프 강남점', '스토리가 탄탄하고 몰입도가 높아서 시간 가는 줄 몰랐네요.', 5, TRUE, NOW()),
-- 큰물참치 강남점
(2, '13119179', '큰물참치 강남점', '참치 퀄리티는 좋지만, 가격이 너무 사악해요.', 3, TRUE, NOW()),
(3, '13119179', '큰물참치 강남점', '서비스는 좋았지만, 가성비는 떨어지는 것 같아요.', 2, TRUE, NOW()),
-- 을밀대 강남점
(2, '12418029', '을밀대 강남점', '역시 명불허전! 깔끔한 평양냉면 맛이 최고예요.', 5, TRUE, NOW()),
(3, '12418029', '을밀대 강남점', '녹두전도 바삭하고 고소해서 냉면과 잘 어울립니다.', 4, TRUE, NOW()),
-- 땀땀 본점
(2, '1238400864', '땀땀 본점', '곱창쌀국수 맛집! 매콤하고 중독성 있는 맛이에요.', 5, TRUE, NOW()),
(3, '1238400864', '땀땀 본점', '웨이팅은 길지만 기다린 보람이 있는 맛! 또 갈 거예요.', 5, TRUE, NOW()),
-- 레드버튼 강남2호점
(2, '1217878428', '레드버튼 강남2호점', '새로 생겨서 깨끗하고 좋지만, 게임 설명이 부족했어요.', 3, TRUE, NOW()),
(3, '1217878428', '레드버튼 강남2호점', '다른 지점보다 게임 종류가 적은 것 같아요.', 2, TRUE, NOW()),
-- 레드버튼 강남점
(2, '1211948676', '레드버튼 강남점', '친구들과 시간 보내기 좋은 곳! 게임 종류도 다양해요.', 4, TRUE, NOW()),
(3, '1211948676', '레드버튼 강남점', '언제 가도 즐거운 보드게임 천국입니다.', 5, TRUE, NOW()),
-- 서울명예도로 국기원길
(2, '1179049844', '서울명예도로 국기원길', '국기원까지 이어지는 길, 특별한 건 없지만 걷기 좋아요.', 3, TRUE, NOW()),
(3, '1179049844', '서울명예도로 국기원길', '조용하고 한적해서 산책하기에 나쁘지 않습니다.', 4, TRUE, NOW()),
-- 홈즈앤루팡 강남점
(2, '1159157170', '홈즈앤루팡 강남점', '방탈출과 보드게임을 같이 할 수 있어서 좋아요.', 4, TRUE, NOW()),
(3, '1159157170', '홈즈앤루팡 강남점', '테마도 다양하고 시설도 깔끔해서 만족스러웠습니다.', 5, TRUE, NOW()),
-- 메가박스 강남
(2, '10609442', '메가박스 강남', '영화관이 너무 추웠어요. 담요 필수입니다.', 2, TRUE, NOW()),
(3, '10609442', '메가박스 강남', '스크린은 큰데, 좌석 간격이 좁아서 불편했어요.', 1, TRUE, NOW()),
-- 양재천길
(2, '10567699', '양재천길', '사계절 언제가도 아름다운 산책로예요. 힐링 그 자체!', 5, TRUE, NOW()),
(3, '10567699', '양재천길', '자전거 타기에도 좋고, 그냥 걷기만 해도 기분 좋아지는 곳.', 5, TRUE, NOW()),
-- 고메램
(2, '1052874675', '고메램', '양갈비 맛집으로 유명한 이유가 있네요. 정말 맛있어요.', 5, TRUE, NOW()),
(3, '1052874675', '고메램', '분위기도 좋고 직원분들도 친절해서 만족스러운 식사였습니다.', 4, TRUE, NOW()),
-- 대려도
(2, '10252806', '대려도', '음식은 맛있는데, 서비스가 너무 불친절했어요.', 1, TRUE, NOW()),
(3, '10252806', '대려도', '가격에 비해 만족스럽지 못한 경험이었습니다.', 1, TRUE, NOW());


INSERT INTO bookmarks (userId, placeId, placeName) VALUES
(1, 'place_001', '스타벅스 강남역점'),
(1, 'place_002', '한강시민공원'),
(1, 'place_003', '롯데월드타워'),
(1, 'place_004', '서울숲'),
(1, 'place_005', '예술의전당'),
(1, 'place_006', 'CGV 용산아이파크몰'),
(1, 'place_007', '국립중앙박물관'),
(1, 'place_008', '더현대 서울'),
(1, 'place_009', '익선동 골목'),
(1, 'place_010', '노들섬');

INSERT INTO bookmarks (userId, placeId, placeName) VALUES
(2, 'place_011', '서울대입구역 카페거리'),
(2, 'place_012', '북서울 꿈의숲'),
(2, 'place_013', '남산서울타워'),
(2, 'place_014', '경복궁'),
(2, 'place_015', '홍대 걷고싶은거리'),
(2, 'place_016', '동대문디자인플라자'),
(2, 'place_017', '이태원 거리'),
(2, 'place_018', '광화문광장'),
(2, 'place_019', '코엑스 아쿠아리움'),
(2, 'place_020', '청계천');

INSERT INTO bookmarks (userId, placeId, placeName) VALUES
(3, 'place_021', '양재 시민의숲'),
(3, 'place_022', '반포한강공원'),
(3, 'place_023', '성수동 카페거리'),
(3, 'place_024', '망원시장'),
(3, 'place_025', '서울식물원'),
(3, 'place_026', 'DDP 디자인마켓'),
(3, 'place_027', '이화벽화마을'),
(3, 'place_028', '마포 석유비축기지'),
(3, 'place_029', '노들나루공원'),
(3, 'place_030', '서울 애니메이션센터');

-- userId 2 신고 (1건: opinionId, 1건: placeId)
INSERT INTO reports (userId, targetId, targetType, placeName, content, status, createdAt) VALUES
(2, '894327405', 'place', '놀숲 강남교보타워점', '시설 위생 상태가 좋지 않았습니다. 청결 점검이 필요해요.', 'PENDING', '2025-05-30 10:15:00'),
(2, '15', 'opinion', '알베르', '의견 내용이 과하게 부정적이에요. 허위 리뷰로 보입니다.', 'PENDING', '2025-05-30 11:05:00');

-- userId 3 신고 (1건: opinionId, 1건: placeId)
INSERT INTO reports (userId, targetId, targetType, placeName, content, status, createdAt) VALUES
(3, '8279464', 'place', '딘타이펑 강남점', '음식 알레르기 표기가 부족해요. 위험할 수 있습니다.', 'PENDING', '2025-05-30 13:20:00'),
(3, '12', 'opinion', '레드버튼 시네마강남점', '이용 경험과 전혀 다른 내용을 리뷰에 적은 것 같아요.', 'PENDING', '2025-05-30 14:10:00');
-- userId 2 추가 신고 (opinion + place)
INSERT INTO reports (userId, targetId, targetType, placeName, content, status, createdAt) VALUES
(2, '16421356', 'place', '농민백암순대 강남직영점', '음식 온도가 낮아 식중독 위험이 있을 수 있어요.', 'PENDING', '2025-05-30 15:00:00'),
(2, '14', 'opinion', '놀숲 강남교보타워점', '리뷰가 도배성으로 보입니다. 삭제 검토 바랍니다.', 'PENDING', '2025-05-30 15:40:00');

-- userId 3 추가 신고 (opinion + place)
INSERT INTO reports (userId, targetId, targetType, placeName, content, status, createdAt) VALUES
(3, '22837049', 'place', '알베르', '매장 내 소음이 너무 심해서 불쾌했습니다.', 'PENDING', '2025-05-30 16:10:00'),
(3, '11', 'opinion', '삼성각', '광고성으로 의심되는 리뷰입니다. 확인 부탁드립니다.', 'PENDING', '2025-05-30 16:30:00');



commit;