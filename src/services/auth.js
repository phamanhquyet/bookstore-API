import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { notAuthorized } from '../middlewares/handle_errors';

//hàm băm mật khẩu giúp tăng tính bảo mật
const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}



export const register = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: hashPassword(password)
            }
        })
        //response ở đây được trả về ở dạng mảng
        const accessToken = response[1]
            ? jwt.sign({
                id: response[0].id,
                email: response[0].email,
                role_code: response[0].role_code,
            },
                process.env.JWT_SECRET,
                { expiresIn: "5s" }
            )
            : null
            //mã hóa id, email và role_code ra thành token, để phục vụ cho việc phân quyền 

            //JWT_SECRET_REFRESH_TOKEN
            const refreshToken = response[1]
            ? jwt.sign({
                id: response[0].id,
            },
                process.env.JWT_SECRET_REFRESH_TOKEN,
                { expiresIn: "15d" }
            )
            : null
        
        resolve({
            error: response[1] ? 0 : 1,
            message: response[1] ? 'Register successfully' : 'Email is already registered',
            'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
            'refresh_token': refreshToken
        })
        if(refreshToken){
            await db.User.update({
                refresh_token: refreshToken
            },{
                where: {id: response[0].id}
            })
        }
    } catch (error) {
        reject(error)
    }
})

export const login = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { email },
            raw: true
        })
        //với raw: true thì sẽ không lấy dữ liệu trả về là 1 instance của sequelize và ngược lại
        
        //kiểm tra xem kết quả client gửi lên có khớp với data trong db hay không
        //nếu response là null, isChecked = null, nếu không thì thực hiện so sánh password
        const isChecked = response && bcrypt.compareSync(password, response.password)
        //mã hóa id, email và role_code ra thành token, để phục vụ cho việc phân quyền 
        const accessToken = isChecked ? jwt.sign({
                id: response.id,
                email: response.email,
                role_code: response.role_code,
            },
                process.env.JWT_SECRET,
                { expiresIn: "5s" }
            )
            : null
        //JWT_SECRET_REFRESH_TOKEN
        const refreshToken = isChecked
        ? jwt.sign({
            id: response.id,
        },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "15d" }
        )
        : null
        resolve({
            //kiểm tra dựa trên token
            error: accessToken ? 0 : 1,
            message: accessToken ? 'Login successfully' : response ? 'Password is wrong' : 'Email is not signed up',
            //Nếu không có token thì chuyển sang check response, nếu có response thì có nghĩa là password đã sai, ngược lại thì email sai.
            'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
            //Bearer Token. 
            //Thường được gọi là Token authentication. 
            //Đây là một hình thức xác thực HTTP liên quan đến token có tên là Bearer token. 
            //Như tên mô tả Bearer Token cấp quyền truy cập cho người dùng khi có token hợp lệ.
            'refresh_token': refreshToken
        })
        if(refreshToken){
            await db.User.update({
                refresh_token: refreshToken
            },{
                where: {id: response.id}
            })
        }
    } catch (error) {
        reject(error)
    }
})

export const refreshToken = (refresh_token) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne(
            {
                where: { refresh_token }
            }
        )
        if(response){
            jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => { 
                if(err) 
                    resolve({
                        error: 1,
                        message: 'Refresh token expired. Require login again'
                    })
                else {
                    const accessToken = jwt.sign({
                        id: response.id,
                        email: response.email,
                        role_code: response.role_code,
                    },
                        process.env.JWT_SECRET,
                        { expiresIn: "2d" }
                    )
                    resolve({
                        error: accessToken ? 0 : 1 ,
                        message: accessToken ? 'ok' : 'Fail to generate new access token.',
                        'access_token': accessToken ? `Bearer ${accessToken}` : accessToken,
                        'refresh_token': refresh_token 
                    })
                }
                    
            })
        }
    } catch (error) {
        reject(error)
    }
})