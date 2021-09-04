/** @format */

const express = require("express");
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const authenticateUser = require("./middleWare/auth-user");
const asyncHandler = require("./middleWare/asyncHandler");

// USER ROUTE
router.get(
  "/user",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.json({
      name: user.firstName,
      username: user.emailAddress,
    });
  })
);

router.post(
  "/user",
  asyncHandler(async (req, res) => {
    await User.create(req.body);
    res.status(201).location("/").end();
  })
);

// COURSES ROUTE
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const users = await Course.findAll();
    res.json(users);
    res.status(200).end();
  })
);

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const user = await Course.findByPk(req.params.id);
    res.json(user);
    res.status(200).end();
  })
);

router.post(
  "/courses",
  asyncHandler(async (req, res) => {
    await Course.create(req.body);
    res.status(201).location("/").end();
  })
);

router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const user = await Course.findByPk(req.params.id);
    await user.update(req.body);
    res.json(user);
    res.status(200).end();
  })
);

router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const user = await Course.findByPk(req.params.id);
    user.destroy();

    res.status(200).end();
  })
);

module.exports = router;
