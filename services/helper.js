const bcrypt = require('bcrypt');
const status = {
    bad_request: 400,
    success: 200,
    Unauthorized: 401
}

const messages = {
    user_registered: 'User registered successfully',
    invalid_credential: 'Invalid Credentials',
    invalid_user: 'Invalid User',
    unAuthorized: 'Please Login to access this resource',

}

const invalidPathHandler = (req, res, next) => {
    // console.log(req.path)
    console.log('\x1b[31m', "{404 Error - We can't seem to find the page you're looking for.}")
    return res.status(404).json({ status: 404, msg: "We can't seem to find the page you're looking for.", error: true });
}

module.exports = {
    status,
    messages,
    invalidPathHandler
}

exports.passwordEncryption = async (password) => {
    if (password) {
        const salt = await bcrypt.genSalt();
        return bcrypt.hashSync(
            password.toString(),
            salt
        );
    }

    return false
}