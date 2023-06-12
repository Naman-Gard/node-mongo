const jwt = require("jsonwebtoken");
const { messages, status } = require("../services/helper");
const userModel = require("../models/User");

const auth = async (req, res, next) => {
    const token = req.headers['authorization']
    if (!token)
        return res.status(status?.Unauthorized).send({ msg: messages?.unAuthorized, error: true });
    jwt.verify(token.split(' ')[1] || '', process.env.ACCESS_TOKEN_SECRET, async function (err, decoded) {
        if (err) {
            console.log(err)
            return res.status(status?.Unauthorized).send({ msg: messages?.unAuthorized, error: true });
        }
        else {

            const user = await userModel.findById(decoded.id) || {}

            if (Object.keys(user).length === 0) {
                return res.status(status?.Unauthorized).send({ msg: messages?.unAuthorized, error: true });
            }

            req.userInfo = {
                userId: decoded.id
            }
            next();
        }
    });
}

module.exports = auth