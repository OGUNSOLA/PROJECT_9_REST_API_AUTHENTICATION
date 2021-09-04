/** @format */

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notEmpty: {
        //     msg: "Book title is required",
        //   },
        // },
      },
      description: {
        type: DataTypes.TEXT,
        // allowNull: false,
        // validate: {
        //   notEmpty: {
        //     msg: "Author name is required",
        //   },
        // },
      },
      estimatedTime: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notEmpty: {
        //     msg: "Author name is required",
        //   },
        // },
      },

      materialsNeeded: {
        type: DataTypes.STRING,
        // allowNull: false,
        // validate: {
        //   notEmpty: {
        //     msg: "Author name is required",
        //   },
        // },
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: "user",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return Course;
};

// title (String)
// description (Text)
// estimatedTime (String)
// materialsNeeded (String)
// userId (created in the model associations with the foreignKey property, and equals the id from the Users table)
