const userModel = require("../models/User")
const { status, messages } = require("../services/helper")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserProductModel = require("../models/UserProduct")
const ProductModel = require("../models/Product")

exports.register = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body

        // const user = new userModel({
        //     name,
        //     email,
        //     mobile,
        //     password
        // });

        const user = await userModel.create({
            name,
            email,
            mobile,
            password
        });

        return res.status(status?.success).json({
            error: false,
            msg: messages?.user_registered,
            data: { userId: user?.id }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(status?.bad_request).json({
            error: true,
            msg: err
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const userExist = await userModel.findOne({
            email: email
        }) || {};
        // console.log(userExist)
        if (Object.keys(userExist).length === 0) {
            return res.status(status?.bad_request).json({
                error: true,
                msg: messages?.invalid_credential
            })
        }

        const passwordCheck = await bcrypt.compare(password.toString(), userExist?.password.toString());

        if (!passwordCheck) {
            return res.status(status?.bad_request).json({
                error: true,
                msg: messages?.invalid_credential
            })
        }

        const token = jwt.sign({
            id: userExist?.id,
            name: userExist?.name,
            mobile: userExist?.mobile
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE
        })

        return res.status(status?.success).json({
            error: false,
            data: {
                id: userExist?.id,
                token
            }
        })

    } catch (err) {
        console.log(err)
        return res.status(status?.bad_request).json({
            error: true,
            msg: err
        })
    }
}

exports.getUserInfo = async (req, res, next) => {
    try {
        const { userId } = req.userInfo || {}

        const user = await userModel.findById(userId) || {}

        if (Object.keys(user).length === 0) {
            return res.status(status?.bad_request).json({
                error: true,
                msg: messages?.invalid_user
            })
        }

        return res.status(status?.success).json({
            error: false,
            data: {
                name: user?.name,
                email: user?.email,
                mobile: user?.mobile
            }
        })
    }
    catch (err) {
        console.log(err)
        return res.status(status?.bad_request).json({
            error: true,
            msg: err
        })
    }
}

exports.userUpdate = async (req, res, next) => {
    try {
        const { userId } = req.userInfo || {}
        const user = await userModel.updateOne({ _id: userId }, {
            name: req.body.name,
            password: req.body?.password
        }) || {}

        if (user?.modifiedCount) {
            return res.status(status?.success).json({
                error: false,
                msg: 'User Updated Successfully'
            })
        }

        return res.status(status?.bad_request).json({
            error: true,
            msg: messages?.invalid_user
        })
    }
    catch (err) {
        console.log(err)
        return res.status(status?.bad_request).json({
            error: true,
            msg: err
        })
    }
}

exports.userDelete = async (req, res, next) => {
    try {
        const { userId } = req.userInfo || {}
        const user = await userModel.softDelete(userId) || {}

        if (user?.error) {
            return res.status(status?.bad_request).json({
                error: true,
                msg: messages?.invalid_user
            })
        }

        return res.status(status?.success).json({
            error: false,
            msg: 'User Deleted Successfully'
        })

    }
    catch (err) {
        console.log(err)
        return res.status(status?.bad_request).json({
            error: true,
            msg: err
        })
    }
}

exports.addProduct = async (req, res, next) => {
    try {
        const { userId } = req.userInfo || {}

        const { product_id, quantity } = req?.body

        const productById = await UserProductModel.findOneAndUpdate({
            user_id: userId,
            product_id: product_id
        }, { quantity });

        if (productById){
            return res.status(status?.success).json({
                error: false,
                msg: 'Product Added successfully'
            })
        }

        const product = new UserProductModel({
            user_id: userId,
            product_id,
            quantity
        })

        await product.save()

        // const products = await UserProductModel.findById(product?._id).populate('product_id');

        // console.log(products)

        return res.status(status?.success).json({
            error: false,
            msg: 'Product Added successfully'
        })
    }
    catch (err) {
        console.log(err)
        return res.status(status?.bad_request).json({
            error: true,
            msg: err
        })
    }
}