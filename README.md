# Counpang Eats API server
쿠팡 이츠 API 서버 설계(for 라이징테스트)

# 2021-08-14
- EC2 인스턴스 생성
    - Nginx 서버 설치
    - 22, 80, 443번 포트 방화벽 및 보안 그룹 설정
    - API 서버 템플릿 Git 클론
        - git access token (21.08.13 부터 비밀번호 대신 사용)
    - SWAP 메모리 할당
        - [AWS EC2 프리티어에서 메모리 부족현상 해결방법](https://sundries-in-myidea.tistory.com/102)
- npm 설치
    - nodemon 설치 및 설정
    - 3000번 포트 방화벽 및 보안 그룹 설정
- SSL 설정
    - [How To Secure Nginx with Let's Encrypt on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)

# 2021-08-15
- dev 서버 도메인 생성 및 등록
    - SSL 설정 완료
- RDS 생성 및 연결

# 2021-08-16
- API 명세서 공유
    - [구글 스프레드 - API 명세서 쿠팡이츠B](https://docs.google.com/spreadsheets/d/10rweviPboyHs9YBqAhjhbYWCdO2VhGejhtV1mAKaTig/edit?usp=sharing)
- ERD 설계하기
- 회원가입, 로그인 API 빌드 완료

# 2021-08-17
- ERD 수정(피드백 반영)

# 2021-08-18
- ERD 수정(피드백 반영)
- API 리스트업 완료
- store, storeType, storeTypeRelation 테이블 더미 데이터 입력

# 2021-08-19
- dev, prod 서버 분기 에러사항 수정
- AWS S3 버킷 생성
    - 퍼블릭 읽기 권한 설정
- menu, review, storeImage, storeImageRelation 테이블 더미 데이터 입력
- 메인화면 API 빌드 fin

# 2021-08-20
- menu, menuCategory, menuCategoryRelation, menuImage, menuImageRelation, menuOption, menuOptionCategory, review, reviewImage 테이블 더미 데이터 입력
- 매장 조회 API 빌드 ing

# 2021-08-21
- 매장 조회 API, 메뉴 조회 API 빌드 fin

# 2021-08-22
- 카테고리별 매장 조회 API 빌드 ing

# 2021-08-23
- 카트에 메뉴 담기 API 빌드 ing

# 2021-08-24
- 카트에 메뉴 담기 API 빌드 fin
- 카트 새로 담기 API 빌드 fin
- 카트 조회 API 빌드 ing
    - 쿠폰 테이블 수정 및 더미 데이터 입력

# 2021-08-25
- 카트 조회 API 빌드 fin
- 결제관리 조회 API 빌드 fin
- 결제수단(계좌이체) 추가 API 빌드 fin
- 결제수단(계좌이체) 삭제 API 빌드 fin

# 2021-08-26
- 주문하기, 주문내역 조회, 매장리뷰 조회 API 빌드 fin