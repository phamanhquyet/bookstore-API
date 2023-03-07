//kết nối với database sử dụng sequelize
//docs: https://sequelize.org/docs/v6/getting-started/

const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('store', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
    logging: false //trong qua trinh lam viec voi database sẽ sinh ra log, thuộc tính này giúp ẩn log đi tránh bị rối
});

/* const sequelize = new Sequelize('database', 'username', 'password', {
     host: 'localhost',
     dialect: 'mysql'
    });*/

/*
    database: tên database
    username: mặc định của mysql là root
    password: mặc định của mysql là null
    dialect: loại hệ quản trị
*/

//dialect: phương ngữ. 
const connectionDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectionDatabase()

//làm việc với sequelize cli
//docs: https://sequelize.org/docs/v6/other-topics/migrations