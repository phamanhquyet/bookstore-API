import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
import { isCreatorOrAdmin } from '../middlewares/verify_role'
import uploadCloud from '../middlewares/uploader';
const router = express.Router()
//public routes
router.get('/', controllers.getBooks)

//private routes
router.use(verifyToken)
router.use(isCreatorOrAdmin)
router.post('/', uploadCloud.single('image'),controllers.createNewBook)
//image là key của biến chứa file ảnh (trong database)
router.put('/', uploadCloud.single('image'),controllers.updateBook)

//khi gọi api hàm xóa, bắt buộc phải truyền vào mảng, do đã được thiết lập trong Joi
//ví dụ:
//http://localhost:5000/api/v1/book?name=book&bids[0]=dsdsdsds&bids[1]
router.delete('/', controllers.deleteBook)
module.exports = router