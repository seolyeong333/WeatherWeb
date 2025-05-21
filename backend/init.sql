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
  userId INT NOT NULL,                                           		 -- 신고자 ID
  targetId VARCHAR(100),                                        		  -- 신고 대상 (placeId 또는 opinionId)
  targetType ENUM("place","opinion") NOT NULL,
  placeName VARCHAR(100),
  content TEXT NOT NULL,                                        		  -- 신고 내용
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
  weatherType VARCHAR(50) NOT NULL,                      	 -- 날씨 조건 (예: 맑음, 흐림)
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

SELECT COUNT(*) from fashion_colors WHERE weatherType is NULL;
  
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
  'hmsdhk@naver.com', '123', '장준하', 'male', '2001-01-02', 'local', 'USER'
);

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

        SELECT * FROM tarot_play_logs
        WHERE userId = 1 AND isPlay = CURDATE();

commit;