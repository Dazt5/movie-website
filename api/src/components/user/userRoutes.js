import { Router } from 'express';
import { authUser } from '$middlewares/authUser'

import {
    findUser
} from './userController'

const router = Router();

router.get('/user/:id', //TODO: CHANGE PARAMETER TO USERNAME
    authUser,          
    findUser
);


export default router;