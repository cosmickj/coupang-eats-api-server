const response = ({isSuccess, code, message}, result) => {
   return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        result: result
   }
  };

const errResponse = ({isSuccess, code, message}, result) => {
  return {
      isSuccess: isSuccess,
      code: code,
      message: message,
      result: result
    }
};
  
module.exports = { response, errResponse };