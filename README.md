## 👋인사잘해팀 : HR(human resources)
### 프로젝트 소개
![인사잘해](https://media.discordapp.net/attachments/1303967846027755560/1316651649569132595/2024-12-12_3.23.22.png?ex=675bd2e7&is=675a8167&hm=eaf69c79a2c4b9311af7fc45d8d98b58633597eed4e75d7c6e4225e7b45b4f91&=&format=webp&quality=lossless&width=883&height=295)
> 인사 및 근태 관리를 통합한 사내 HR ERP 프로그램!

본 프로젝트는 사내 인사 및 근태 관리를 효율화하기 위해 개발된 HR ERP 시스템입니다.
직원들은 사내 채팅, 휴가 신청, 출퇴근 기록, 게시판 활용, 급여 확인 등을 하나의 플랫폼에서 손쉽게 처리할 수 있습니다.
관리자들은 직원 정보 및 근태를 체계적으로 관리할 수 있어 업무 생산성이 향상됩니다.

[인사잘해](http://34.47.90.224:3000/)

**접속 가능한 계정**
- 이상해 사원
  - **ID** : 20241216
  - **PW** : 123123123
  

- 이종현 인사관리자
  - **ID** : 20241203
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
![ERD](https://github.com/user-attachments/assets/ef15cc51-089b-45a7-b704-e8ffe7cad939)

---

### 📌주요 기능
##### 홈
![hr-handlers_10](/uploads/5df10ef9a1d9656df9426fd17570c0f0/hr-handlers_10.png)

##### 사원
![hr-handlers_11](/uploads/24f7d7faff86bc1816fbef7bb70a9905/hr-handlers_11.png)
![hr-handlers_12](/uploads/f44ad89dc51e191336aec4eb9b41c131/hr-handlers_12.png)

##### 근태
![hr-handlers_14](/uploads/044ffe42a4dca1675c6f85818f5b5ce4/hr-handlers_14.png)

##### 일정
![hr-handlers_16](/uploads/c12f644c1ba6dd5439d154ccae9dfe4e/hr-handlers_16.png)

##### 휴가
![hr-handlers_15](/uploads/5ce354b1da20c284867ecb266f3b4d5c/hr-handlers_15.png)

##### 게시판
![hr-handlers_17](/uploads/b4f1099f094ed07bbc68cf6336c4c5c4/hr-handlers_17.png)
![hr-handlers_18](/uploads/15d2cdec2928799fd5b49cef752dfd33/hr-handlers_18.png)
![hr-handlers_19](/uploads/0de69facb6f0db972a68ae06023d2ca5/hr-handlers_19.png)

##### 메신저
![hr-handlers_13](/uploads/6412eb338426f22c78a915231904e039/hr-handlers_13.png)

##### 급여
![hr-handlers_20](/uploads/52685a2fed9bcdc8c95bbf62436d8e91/hr-handlers_20.png)
![hr-handlers_21](/uploads/2dccde247ddfb746f6f715c4c73aae24/hr-handlers_21.png)

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
