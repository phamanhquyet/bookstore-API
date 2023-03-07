//dinh nghia cac api (crud) lien quan den user
import * as controllers from '../controllers';
import express from 'express';


const router = express.Router()


router.get('/',controllers.insertData)

export default router