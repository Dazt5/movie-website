import { Router } from 'express';

import {
    validateUserData,
    preventExistEmail,
    signUp,
    validateLogin,
    login,
    sendActivateToken,
    activateAccount,
    sendRecoveryToken,
    recoveryPassword
} from './authController';

const router = Router();

router.post('/signup',
    validateUserData,
    preventExistEmail,
    signUp
);

router.post('/login',
    validateLogin,
    login
);

//if first token expired, resend the email.
router.post('/activate/',
    sendActivateToken
);

router.get('/activate/:token',
    activateAccount
);

router.post('/recovery/',
    sendRecoveryToken

);

router.post('/recovery/:token',
    recoveryPassword
);


export default router;