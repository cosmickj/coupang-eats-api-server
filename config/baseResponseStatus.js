module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    /*** Request error ***/
    // 회원가입 API
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력하세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2002, "message":"이메일을 올바르게 입력해주세요." },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2003, "message":"이메일을 30자리 미만으로 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력하세요." },
    SIGNUP_PASSWORD_ERROR_TYPE_1 : { "isSuccess": false, "code": 2005, "message":"비밀번호는 영문/숫자/특수문자 2가지 이상 조합(8~20자)으로 입력해주세요." },
    SIGNUP_PASSWORD_ERROR_TYPE_2: { "isSuccess": false, "code": 2006, "message":"비밀번호에서 아이디(이메일)을 제외하고 입력해주세요." },
    // SIGNUP_PASSWORD_ERROR_TYPE_3: { "isSuccess": false, "code": 2007 "message":"비밀번호에서 3개 이상 연속되거나 동일한 문자/숫자를 제외하고 입력해주세요." },
    SIGNUP_NAME_EMPTY : { "isSuccess": false, "code": 2008, "message":"이름을 정확히 입력해주세요" },
    SIGNUP_PHONE_NUMBER_EMPTY : { "isSuccess": false, "code": 2009, "message":"휴대폰 번호를 정확하게 입력하세요." },
    SIGNUP_PHONE_NUMBER_LENGTH : { "isSuccess": false, "code": 2010, "message":"휴대폰 번호 11자리를 입력하세요." },

    // 로그인 API
    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2011, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2012, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2013, "message":"아이디는 이메일주소 형식으로 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2014, "message": "비밀번호를 입력 해주세요." },

    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2015, "message": "유저 아이디 값을 확인해주세요" },

    // 결제수단(신용/체크) 추가 API
    CARD_BODY_INPUT_EMPTY : { "isSuccess": false, "code": 2016, "message": "필요한 BODY값 6개를 모두 입력해주세요."},
    CARD_CARDNUMBER_ERROR_TYPE : { "isSuccess": false, "code": 2017, "message": "카드 번호 숫자 16자리를 정확하게 입력해주세요."},
    CARD_CVCNUMBER_ERROR_TYPE : { "isSuccess": false, "code": 2018, "message": "CVC 번호 숫자 3자리를 정확하게 입력해주세요."},
    CARD_EXPIRYDATE_ERROR_TYPE : { "isSuccess": false, "code": 2019, "message": "유효기간 숫자 2자리를 정확하게 입력해주세요.(ex. 08, 12)"},

    /*** Response error ***/
    // 회원가입 API
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"이미 가입된 이메일 주소입니다. 다른 이메일을 입력하여 주세요." },
    SIGNUP_REDUNDANT_PHONE_NUMBER : { "isSuccess": false, "code": 3002, "message":"이미 가입된 휴대폰 번호입니다." },

    // 로그인 API
    SIGNIN_INFORMATION_WRONG : { "isSuccess": false, "code": 3003, "message": "입력하신 아이디 또는 비밀번호가 일치하지 않습니다." },

    // 매장 조회 API
    STORE_NOT_EXIST : { "isSuccess": false, "code": 3004, "message": "존재하지 않는 매장의 ID를 입력하였습니다."},

    //메뉴 조회 API
    MENU_NOT_EXIST : { "isSuccess": false, "code": 3005, "message": "존재하지 않는 메뉴의 ID를 입력하였습니다."},

    // 카트 담기 API
    CART_STOREID_UNMATCHED : { "isSuccess": false, "code": 3006, "message": "같은 가게의 메뉴만 담을 수 있습니다."},

    // 카트 새로 담기 API
    CART_STOREID_MATCHED : { "isSuccess": false, "code": 3007, "message": "같은 가게의 메뉴입니다."},

    // 결제수단(계좌이체) 추가 API
    BANK_ACCOUNT_HOST_UNMATCHED : { "isSuccess": false, "code": 3008, "message": "본인 명의의 계좌만 등록할 수 있습니다."},
    BANK_ACCOUNT_REDUNDANT : { "isSuccess": false, "code": 3009, "message": "이미 등록되어 있는 계좌입니다."},

    // 결제수단(계좌이체) 삭제 API
    BANK_PAYMENTBANKID_UNMATCHED : { "isSuccess": false, "code": 3010, "message": "본인 명의의 계좌만 삭제할 수 있습니다."},
    BANK_PAYMENTBANKID_NOT_EXIST : { "isSuccess": false, "code": 3011, "message": "이미 삭제된 결제수단(계좌이체) Id입니다."},

    // 결제수단(신용/체크) 추가 API
    CARD_PAYMENT_REDUNDANT : { "isSuccess": false, "code": 3012, "message": "이미 등록되어 있는 신용/체크 카드입니다."},

    // 결제수단(신용/체크) 삭제 API
    CARD_PAYMENDCARDID_UNMATCHED : { "isSuccess": false, "code": 3013, "message": "본인 명의의 신용/체크 카드만 삭제할 수 있습니다."},
    CARD_PAYMENDCARDID_NOT_EXIST : { "isSuccess": false, "code": 3014, "message": "이미 삭제된 결제수단(신용/체크)) Id입니다."},

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
