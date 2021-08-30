// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email
                FROM user
                WHERE email = ? AND status = 'ACTIVE';
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// 휴대폰 번호로 회원 조회
async function selectUserPhoneNumber(connection, phoneNumber) {
  const selectUserPhoneNumberQuery = `
                SELECT email
                FROM user 
                WHERE phoneNumber = ? AND status = 'ACTIVE';
                `;
  const [phoneNumberRows] = await connection.query(selectUserPhoneNumberQuery, phoneNumber)
  return phoneNumberRows
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO user (email, password, name, phoneNumber)
        VALUES (?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 로그인 체크
async function selectUserInfo(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT userId, email, password
        FROM user
        WHERE email = ? AND password = ? AND status = 'ACTIVE';`;
  const selectUserPasswordRow = await connection.query(selectUserPasswordQuery, selectUserPasswordParams);

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
// async function selectUserAccount(connection, email) {
//   const selectUserAccountQuery = `
//         SELECT status, id
//         FROM UserInfo 
//         WHERE email = ?;`;
//   const selectUserAccountRow = await connection.query(
//       selectUserAccountQuery,
//       email
//   );
//   return selectUserAccountRow[0];
// }

// async function updateUserInfo(connection, id, nickname) {
//   const updateUserQuery = `
//   UPDATE UserInfo 
//   SET nickname = ?
//   WHERE id = ?;`;
//   const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
//   return updateUserRow[0];
// }

module.exports = {
  selectUserEmail,
  selectUserPhoneNumber,
  insertUserInfo,
  selectUserInfo,
  // selectUserAccount,
  // updateUserInfo,
};
