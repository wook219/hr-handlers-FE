## 👋인사잘해팀 : HR(human resources)
### 프로젝트 소개
![image](https://github.com/user-attachments/assets/34b114df-05ae-4017-bb3e-d6ac14b4d4d5)
> > 인사 및 근태 관리를 통합한 사내 HR 프로그램!

본 프로젝트는 사내 인사 및 근태 관리를 효율화하기 위해 개발된 HR 시스템입니다.
직원들은 사내 채팅, 휴가 신청, 출퇴근 기록, 게시판 활용, 급여 확인 등을 하나의 플랫폼에서 손쉽게 처리할 수 있습니다.
관리자들은 직원 정보 및 근태를 체계적으로 관리할 수 있어 업무 생산성이 향상됩니다.

[인사잘해](http://34.47.90.224:3000/)

**접속 가능한 계정**
- 이상해 사원
  - **ID** : 20241216
  - **PW** : 123123123

---

### API 문서
**Swagger-UI** : http://34.47.90.224:8080/swagger-ui/index.html

---

### 개발 기간
- 2024.11.18 ~ 2024.12.13

---

### 팀원 소개
| 이름 (Name) | 역할 (Role)  | 담당 도메인 (Domain) | 
  |-----------|------------|-----------------|
| 정현        | 팀장 (Leader) | 사원              | 
| 한현        | 팀원 (Member) | 메신저             | 
| 이서율       | 팀원 (Member) | 게시판             |  
| 송진욱       | 팀원 (Member) | 근태/휴가/일정        | 
| 김준수       | 팀원 (Member) | 급여              | 

---

### 기술 스택
- **Frontend** : React, Bootstrap, HTML, CSS, Javascript
- **Backend** : Java, JPA, Spring Boot, Spring Security, JWT, Websocket, STOMP, MyBatis, QueryDSL
- **Storage** : AWS S3, MariaDB
- **Deployment**: GCP, Nginx

---

### 와이어프레임
![와이어프레임](https://github.com/user-attachments/assets/794f6b45-ce24-4aec-a9ec-80a0aacc2d6e)

---

### ERD
![image](https://github.com/user-attachments/assets/c3b5e352-7591-4778-a042-db73e43aef90)

---

### 📌주요 기능
##### 홈
![image](https://github.com/user-attachments/assets/868a609d-e744-48ad-8adb-5ee42b6a1ebd)

##### 사원
![image](https://github.com/user-attachments/assets/b2149608-9bb1-4bca-8a50-7066808f4177)
![image](https://github.com/user-attachments/assets/90ffbd4d-cea5-422e-8c15-c7cb2dc79feb)

##### 근태
![image](https://github.com/user-attachments/assets/96b65b87-e90b-48b4-b256-1007a78d12fa)

##### 일정
![image](https://github.com/user-attachments/assets/6d90abcc-bda4-4761-a308-28b2dd5d747a)

##### 휴가
![image](https://github.com/user-attachments/assets/cdd28d10-149e-436b-afe5-19bc809bd881)

##### 게시판
![image](https://github.com/user-attachments/assets/68044344-9c15-4121-a0c8-0f586ac588dc)
![image](https://github.com/user-attachments/assets/0fe04880-0a20-40eb-aeb0-050066edc17f)
![image](https://github.com/user-attachments/assets/51349c9d-2cdf-4e7f-a9d8-3236c63d0a36)

##### 메신저
![image](https://github.com/user-attachments/assets/ecd52cd4-b4c4-45b2-9500-4ec87f855016)

##### 급여
![image](https://github.com/user-attachments/assets/f12cb504-4483-46db-954c-292af0d9d071)
![image](https://github.com/user-attachments/assets/426406ea-b09c-459b-8809-105d704df95a)
---

### 🚨트러블슈팅
#### 출근/퇴근 시간이 서버시간과 다르게 9시간전으로 저장되는 이슈 
**시도해본 것**
1. Nginx 서버 시간 UTC -> KST 타임존 변경 
  
   - 서버 시간은 변경 되었지만, 동일한 문제 발생

2. 데이터 베이스 시간 변경 
   - 변경 시 오류가 없던 다른 도메인 시간대가 9시간 전으로 변경 되는 다른 문제 발생

**해결 방법**

시간대를 저장하는 Service 부분에 명시적으로 한국시간을 설정해주는 코드로 변경
`LocalDateTime.now(ZoneId.of("Asia/Seoul"))`
