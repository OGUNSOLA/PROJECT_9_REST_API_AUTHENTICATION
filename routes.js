/** @format */

const express = require("express");
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const authenticateUser = require("./middleWare/auth-user");
const asyncHandler = require("./middleWare/asyncHandler");

// USER ROUTE

// get a single user
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: { id: req.currentUser.id },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.status(200).json(user);
  })
);

// create a user
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (error) {
      if (error) {
        if (
          error.name === "SequelizeUniqueConstraintError" ||
          error.name === "SequelizeValidationError"
        ) {
          const errors = error.errors.map((error) => error.message);

          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
    }
  })
);

// COURSES ROUTE

// get all courses with their associated users
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const users = await Course.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(users);
    res.status(200).end();
  })
);

// get a single course with id
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const user = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(user);
    res.status(200).end();
  })
);

// create a course
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      let newCourse = {
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        userId: req.currentUser.id,
      };

      await Course.create(newCourse).then((newlyCreated) => {
        res
          .status(201)
          .location("/courses/" + newlyCreated.id)
          .end();
      });
    } catch (error) {
      if (error) {
        if (
          error.name === "SequelizeUniqueConstraintError" ||
          error.name === "SequelizeValidationError"
        ) {
          const errors = error.errors.map((error) => error.message);

          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
    }
  })
);

// edit s course
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (course) {
        if (req.currentUser.id === course.userId) {
          if (req.body.title !== "" && req.body.description !== "") {
            course.update(req.body);
            console.log("updated");
            res.status(204).json({
              message: "Course update successful",
            });
          } else {
            res
              .status(400)
              .json({ message: " Title and description are required" });
          }
        } else {
          res.status(403).json({ message: "Acess denied" });
        }
      }
    } catch (error) {
      if (error) {
        if (
          error.name === "SequelizeUniqueConstraintError" ||
          error.name === "SequelizeValidationError"
        ) {
          const errors = error.errors.map((error) => error.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
    }
  })
);

// delete a course

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (req.currentUser.id === course.userId) {
        course.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({ message: "You are not the course owner" });
      }
    } catch (error) {
      if (error) {
        if (
          error.name === "SequelizeUniqueConstraintError" ||
          error.name === "SequelizeValidationError"
        ) {
          const errors = error.errors.map((error) => error.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
    }
  })
);

module.exports = router;
