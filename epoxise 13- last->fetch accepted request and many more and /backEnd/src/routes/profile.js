const express = require("express");
const userAuth = require("../midlewares/auth");
const { validateEditPrfileData } = require("../utils/validation");

const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user

    res.send(user)
  } catch (error) {
    res.status(400).send("something went wrong :- " + error.message)
  }

});


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

  try {
    if (!validateEditPrfileData(req)) {
      throw new Error("Invalid Edit Response")
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
    // console.log("loggedInUser",loggedInUser);
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile  updated Sucessfully`,
      data: loggedInUser
    })

    console.log("loggedInUser", loggedInUser);

  } catch (error) {
    res.status(400).send("Some thing went wrong :- " + error.message)
  }


})

module.exports = profileRouter;
