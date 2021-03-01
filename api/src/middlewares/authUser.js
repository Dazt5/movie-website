import dotenv from 'dotenv';
import Users from '$models/Users'
import { decodeToken, verifyToken } from '$libs/authToken'

dotenv.config();

/*Verify Token*/
const authUser = async (req, res, next) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(401)
            .json({
                message: 'No poseé autenticación válida'
            });
    }

    const token = authHeader.split(' ')[1];

    let tokenVerified;

    try {

        tokenVerified = verifyToken(token);

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(500).json({
                message: 'Su sesión ha expirado, vuelva a iniciar sesión'
            });

        } else {
            return res.status(500).json({
                message: 'Ha ocurrido un error inesperado'
            });
        }
    }

    if (!tokenVerified) {
        return res.status(500).json({
            message: 'Ha ocurrido un error inesperado'
        });
    }

    const { email } = decodeToken(token);

    const userToken = await Users.findOne
        ({
            where: {
                email
            },
        });

    res.locals.user = userToken;

    if (!userToken) {
        return res.status(404).json({
            message: 'El token recibido no está asociado a ninguna cuenta.'
        });
    }

    if (userToken.activated == 0) {
        return res.status(401).json({
            message: 'La cuenta ingresada no está activada.'
        });
    }

    next();
}

export {
    authUser
};