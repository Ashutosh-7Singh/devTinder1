const validator = require("validator");

const validateSignupData = (req) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
      throw new Error("Name is not valid");
    } else if (firstName.length < 4 || firstName.length > 50) {
      throw new Error("First shold be 4-50 charachter");
    } else if (!validator.isEmail(emailId)) {
      throw new Error(" Email is not valid  ");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not Strong");
    }
  } catch (error) {
    throw new Error("Something went Wrong:- " + error.message);
  }
};

module.exports = validateSignupData;
