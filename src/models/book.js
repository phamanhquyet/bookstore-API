'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // định nghĩa liên kết từ bảng Book đến bảng Category
      //khi đứng ở Book có thể thông qua khóa ngoại là category_code để lấy thông tin tương ứng từ bảng Category
      Book.belongsTo(models.Category, { foreignKey: 'category_code', targetKey: 'code', as: 'categoryData' })
    }
  }
  Book.init({
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    available: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    category_code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};