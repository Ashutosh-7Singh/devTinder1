const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    return { success: false, message: "Name is required", field: "name" };
  }

  if (!validator.isEmail(email)) {
    return { success: false, message: "Invalid email", field: "email" };
  }

  if (!validator.isStrongPassword(password)) {
    return {
      success: false,
      message: "Password is not strong",
      field: "password",
      passwordRules:
        "Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol",
    };
  }

  return { success: true };
};

module.exports = validateSignupData;








// const validator = require("validator");

// const validateSignUpData = (req) => {
//   const { firstName , lastName, emailId, password } = req.body ;

//   if (!firstName || !lastName) {
//     throw new Error("Name is not valid");
//   } else if (!validator.isEmail(emailId)) {
//     throw new Error("Email is not valid");
//   } else if (!validator.isStrongPassword(password)) {
//     throw new Error("Password  is not Strong");
//   }
// };

// module.exports = { validateSignUpData };
