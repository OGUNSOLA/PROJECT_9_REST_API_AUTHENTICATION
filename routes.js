/** @format */

const express = require("express");
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  };
}

// USER ROUTE
router.get(
  "/user",
  asyncHandler(async (req, res) => {
    const Route = "Route";
    const user = await User.findAll();
    res.json({ user });
  })
);

router.post(
  "/user",
  asyncHandler(async (req, res) => {
    console.log(req.body);
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
    res.status(201).location("/").end();
  })
);

router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const user = await Course.findByPk(req.params.id);
    res.json(user);
    res.status(200).end();
  })
);

router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const user = await Course.findByPk(req.params.id);
    res.json(user);
    res.status(200).end();
  })
);

module.exports = router;
