import dotenv from 'dotenv';

dotenv.config();

import { sign, decode, verify } from 'jsonwebtoken';

const SECRETKEY = process.env.ENCRYPTKEY;

const getToken = async (email) => {

    const token = sign({ email },
        SECRETKEY,
        { expiresIn: '10d' });

    return token;
}

const decodeToken = (token) => {

    var tokenDecoded = decode(token,
        { complete: true }
    );

    return tokenDecoded.payload;

}

const verifyToken = (token) => {


    return verify(token, SECRETKEY);

}

export {
    getToken,
    decodeToken,
    verifyToken
}