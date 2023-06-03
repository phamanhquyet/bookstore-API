import jwt, { TokenExpiredError } from "jsonwebtoken";
import { notAuthorized } from "./handle_errors"
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if(!token) return notAuthorized('Require authorization', res)
    const accessToken = token.split(' ')[1] //vì token ở dạng bearer, nên phải chém nó ra thành mảng, lấy ở vị trí thứ 1
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if(err){
            const isChecked = err instanceof TokenExpiredError 
            if(!isChecked) return notAuthorized('Access token invalid', res, isChecked)
            if(isChecked) return notAuthorized('Access token expired', res, isChecked)
        }
        
        req.user = user
        next()
    })
}

export default verifyToken