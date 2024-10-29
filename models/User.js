import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
        }
    }
})

User.prototype.checkPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password)
}

export default User