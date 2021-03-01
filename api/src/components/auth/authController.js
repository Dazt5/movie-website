import {
    validateEmail,
    validateNames,
    validatePassword
} from '$helpers/validate';

import { getToken } from '$libs/authToken'
import { randomBytes } from 'crypto'

import Sequelize from 'sequelize'
const Op = Sequelize.Op;
import Users from '$models/Users';


const validateUserData = (req, res, next) => {

    const { email, fullname, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({
            message: 'Debe ingresar un email válido'
        });

    } else if (!validateNames(fullname)) {
        return res.status(400).json({
            message: 'Debe ingresar un nombre válido'
        });

    } else if (!validatePassword(password)) {
        return res.status(400).json({
            message: 'La password es invalida'
        });
    }

    next();
}

const preventExistEmail = async (req, res, next) => {

    const { email } = req.body;

    const user = await Users.findAll({
        where: {
            email
        }
    })

    if (!user.length) return next();

    return res.status(400).json({
        message: 'El email ya está registrado'
    });
}


const signUp = async (req, res) => {

    const { email, password, fullname } = req.body

    try {

        const user = await Users.create({
            email,
            password,
            fullname
        });

        user.activatedToken = randomBytes(20).toString('hex');
        user.activatedTokenExpiration = Date.now() + (3600 * 1000 * 24);

        await user.save();

        //TODO: SEND EMAIL TO CONFIRMATION ACCOUNT

        return res.status(200).json({
            message: 'Usuario creado satisfactoriamente'
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: 'Ha ocurrido un error inesperado'
        });
    }

}

const validateLogin = (req, res, next) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'Debe ingresar un email'

        });

    } else if (!password) {

        return res.status(400).json({
            message: 'Debe ingresar una contraseña'

        });
    }

    next();

}

const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await Users.findOne({
            where: {
                email
            }
        });

        //Not user exist
        if (!user) {
            return res.status(400).json({
                message: 'Contraseña o Email incorrectos'
            });
        }

        const verifyPassword = await user.verifyPassword(password);

        //wrong password
        if (!verifyPassword) {
            return res.status(400).json({
                message: 'Contraseña o Email incorrectos'
            });
        }

        //User not activated
        if (user.activated === 0) {
            return res.status(401).json({
                message: 'Su cuenta no está activada'
            });
        }

        const token = await getToken(user.email);

        return res.status(200).json({
            message: 'Inicio de sesión satisfactorio',
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

/* ACTIVATE ACCOUNT */

const sendActivateToken = async (req, res) => {

    const { email } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({
            message: 'El email ingresado no es válido'
        });
    }

    try {
        const user = await Users.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'El email ingresado no está registrado'
            });
        }

        if (user.activated == 1) {
            return res.status(401).json({
                message: 'La cuenta ya se encuentra activada.'
            });
        }

        user.activatedToken = randomBytes(20).toString('hex');
        user.activatedTokenExpiration = Date.now() + (1800 * 1000 * 24);

        await user.save();

        //TODO: RE-SEND CONFIRMATION EMAIL

        return res.status(200).json({
            message: 'El correo ha sido reenviando, revise su bandeja de entrada.'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Ha ocurrido un error inesperado.'
        });
    }
}

const activateAccount = async (req, res) => {

    const { token } = req.params;

    try {
        const user = await Users.findOne({
            where: {
                activatedToken: token,
                activatedTokenExpiration: {
                    [Op.gte]: Date.now(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({
                message: 'Token inválido o expirado, solicitelo de nuevo'
            });
        }

        user.activated = 1;
        user.activatedToken = null;
        user.activatedTokenExpiration = null;

        await user.save();

        return res.status(200).json({
            message: 'Cuenta activada satisfactoriamente'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

/* PASSWORD RECOVERY */

const sendRecoveryToken = async (req, res) => {

    const { email } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({
            message: 'El Email ingresado es inválido'
        });
    }
    try {
        const user = await Users.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'El email ingresado no está registrado'
            });
        }

        user.recoveryToken = randomBytes(20).toString('hex');
        user.recoveryTokenExpiration = Date.now() + (1800 * 1000 * 24);

        await user.save();

        //TODO: SEND EMAIL TO RECOVER PASSWORD

        return res.status(200).json({
            message: 'Se ha envíado el email correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

const recoveryPassword = async (req, res) => {

    const { token } = req.params;

    const { password } = req.body;

    if (!validatePassword(password)) {
        return res.status(400).json({
            message: 'Password ingresada no es válida.'
        });
    }

    const user = await Users.findOne({
        where: {
            recoveryToken: token,
            recoveryTokenExpiration: {
                [Op.gte]: Date.now(),
            },
        },
    });

    if (!user) {
        return res.status(404).json({
            message: 'Token inválido o expirado, solicitelo de nuevo.'
        });
    }

    //Hash new password
    const hashedPassword = await user.hashPassword(password);

    user.password = hashedPassword;

    user.recoveryToken = null;
    user.recoveryTokenExpiration = null;

    await user.save();

    return res.status(200).json({
        message: 'Contraseña recuperada correctamente'
    });
}

export {
    validateUserData,
    preventExistEmail,
    signUp,
    validateLogin,
    login,
    activateAccount,
    sendActivateToken,
    sendRecoveryToken,
    recoveryPassword
}