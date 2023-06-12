const db = require('../database');
const ProductModel = require('./Product');
const userModel = require('./User');
const Schema = db.Schema;

const UserProductSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModel
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: ProductModel,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    // products: {
    //     type: [{
    //         _id: false,
    //         product_id: {
    //             type: Schema.Types.ObjectId,
    //             ref: ProductModel,
    //             required: true
    //         },
    //         quantity: {
    //             type: Number,
    //             required: true,
    //             default: 1
    //         }
    //     }]
    // }
});

UserProductSchema.index({ 'user_id': 1, 'product_id': 1 }, { unique: true });

const UserProductModel = db.model('user_products', UserProductSchema)

module.exports = UserProductModel;