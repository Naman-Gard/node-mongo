const { check, validationResult, checkSchema } = require('express-validator')
const { status } = require('../services/helper')


// exports.registerValidation = () => {
//     return [
//         check('dob').notEmpty({ ignore_whitespace: true }).withMessage('DOB is required')
//             .isDate({ format: 'dd/MM/yyyy', delimiters: ['/', '-'], strictMode: false }).withMessage('Invalid Format')
//     ]
// }

exports.registerValidation = () => {
    const registerSchema = {
        dob: {
            notEmpty: {
                options: { ignore_whitespace: true },
                errorMessage: 'DOB is Required'
            },
            isDate: {
                options: { format: 'yyyy/mm/dd', delimiters: ['/', '-'], strictMode: false },
                errorMessage: 'DOB: Invalid Format, valid format is yyyy/mm/dd'
            },
            custom: {
                options: (value) => {
                    return new Date(value).getTime() > new Date().getTime()
                },
                errorMessage: 'Past Dates are not allowed'
            }
        }
    }
    return checkSchema(registerSchema)
}

exports.validate = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }

    const tempErrors = errors.array().map(err => err?.msg)
    return res.status(status?.bad_request).json({
        msg: tempErrors[0],
        error: true
    })
}