import { compare, genSalt, hash } from 'bcrypt'

const hashPassword = async (password) => {

    const salt = await genSalt(10);

    const hashedPassword = await hash(password, salt);

    return hashedPassword;
}

const comparePassword = async (password, savedPassword) => {

    return compare(password,savedPassword);

}

export{
    hashPassword,
    comparePassword
}