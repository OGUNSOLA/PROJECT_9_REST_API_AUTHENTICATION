/** @format */

const user = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("basic-auth");
const { User } = require("../models");

// Middleware to authenticate the request using Basic Auth.
const authenticateUser = async (req, res, next) => {
  let message; // Store the message to display
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });

    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);

      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );
        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        // if not auticated
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      // if user doesnt exist
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};

module.exports = authenticateUser;
