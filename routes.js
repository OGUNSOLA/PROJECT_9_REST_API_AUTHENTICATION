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
      "First Name": user.firstName,
      "Last name:": user.lastName,
      Username: user.emailAddress,
      id: user.id,
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
  authenticateUser,
  asyncHandler(async (req, res) => {
    let newCourse = {
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded,
      userId: req.currentUser.id,
    };

    await Course.create(newCourse).then((newlyCreated) => {
      res.status(201);
      //   res.location("/courses" + newlyCreated.id);
      res.setHeader("Location", `/course/${newlyCreated.id}`);
    });
  })
);

router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    course.update(req.body);
    res.json(course);
    res.status(204);
  })
);

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
