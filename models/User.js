const { mongoose, Schema, model } = require("mongoose")
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/auth')

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
    },
}, { timestamps: true });


userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const salt = randomBytes(16).toString('hex'); // Corrected to 'hex'

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    next();
})

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error('user not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHashPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedHashPassword) {
        throw new Error('incorrect password');
    }

    const token = createTokenForUser(user)
    return token;
})

const USER = model("user", userSchema)

module.exports = USER;