//đây là file cấu hình 1 con server

import express from 'express'
import cors from 'cors'
require('dotenv').config();
import initRoutes from './src/routes';
require('./connection_database')

const app = express();
//sử dụng app.use() để thêm vào các middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET','POST','PUT','DELETE'], 
}));
//đọc dữ liệu gửi lên server từ client
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

initRoutes(app);

const PORT = process.env.PORT || 8888;
const listener = app.listen(PORT, () => {
    console.log(`Server is running on the port ` +  PORT);
})
