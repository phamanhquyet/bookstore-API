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
module.exports = router