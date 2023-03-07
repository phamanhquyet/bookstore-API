//dinh nghia cac api (crud) lien quan den user
import * as controllers from '../controllers';
import express from 'express';
import verifyToken from '../middlewares/verfy_token';
import { isAdmin } from '../middlewares/verify_role';

const router = express.Router();

router.use(verifyToken);
router.get('/', controllers.getCurrent);

module.exports = router;
