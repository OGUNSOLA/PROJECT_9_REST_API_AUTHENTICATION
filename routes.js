/** @format */

const express = require("express");
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const authenticateUser = require("./middleWare/auth-user");
const asyncHandler = require("./middleWare/asyncHandler");
const tryCatch = require("./middleWare/tryCatch");

// USER ROUTE
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

    res.json(user);
  })
);

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      User.create(req.body);
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
    });
    res.json(users);
    res.status(200).end();
  })
);

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
    });
    res.json(user);
    res.status(200).end();
  })
);

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

router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      console.log(req.body);

      if (req.body.title !== "" && req.body.description !== "") {
        course.update(req.body);
        res.json(course);
        res.status(204);
      } else {
        res.json({ message: " Title and description are required" });
        res.status(400);
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
        res.json({ message: "You are not the course owner" });
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
