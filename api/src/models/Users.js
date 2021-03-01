import Sequelize from 'sequelize';
import db from '$config/db';
import {
    hashPassword,
    comparePassword
} from "$libs/bcrypt";

const Users = db.define(
    'users',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    message: 'Correo ingresado no es válido'
                },
                notEmpty: {
                    message: 'Ingrese un email',
                },
            },
            unique: {
                args: true,
                message: 'Email ya registrado'
            },
        },
        password: {
            type: Sequelize.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    message: 'Ingrese un Password'
                },
            },
        }, //TODO: ADD USERNAME TO USE IN URL PARAMETER
        fullname: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    message: 'Ingrese un nombre'
                },
                is: {
                    args: /^[a-zA-Z]{3,35}(?: [a-zA-Z]+){0,3}$/,
                    message: 'Nombre con caracteres inválidos'
                }
            }
        },
        activated: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        suscriptionTime: {
            type: Sequelize.DATE,
            defaultValue: null
        },

        activatedToken: Sequelize.STRING,
        activatedTokenExpiration: Sequelize.DATE,

        recoveryToken: Sequelize.STRING,
        recoveryTokenExpiration: Sequelize.DATE,

        create_at: {
            type: Sequelize.DATE,
            defaultValue: Date.now
        }
        //TODO: Add auth_level, = 1 for general users, = 2 for admins. 
    },
    {
        hooks: {
            async beforeCreate(users) {
                users.password = await hashPassword(users.password);
            }
        }
    }
);

Users.prototype.verifyPassword = function (password) {

    return comparePassword(password, this.password)
};

Users.prototype.hashPassword = async function(password){

    const hashedPassword = hashPassword(password);

    return hashedPassword;
};

export default Users;