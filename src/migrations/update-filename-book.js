module.exports = {
    up: function(queryInterface, Sequelize) {
      // logic for transforming into the new state
      return queryInterface.addColumn( //addColumn là hàm thêm cột của sequelize
        'Books', //tên bảng
        'filename', //tên cột muốn thêm vào
       Sequelize.STRING //datatype của cột muốn thêm
      );
  
    },
    //nếu quá trình bị lỗi
    down: function(queryInterface, Sequelize) {
      // logic for reverting the changes
      return queryInterface.removeColumn(
        'Books',
        'completed'
      );
    }
  }