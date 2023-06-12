const db = require('../database')
const Schema = db.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Schema.Types.Decimal128,
        required: true,
    }
});

const ProductModel = db.model('products', ProductSchema)

// const PRODUCTS = [
//     {
//         name: 'Demo',
//         price: 130
//     }
// ]

// ProductModel.create(PRODUCTS)
// (async () => {
//     await ProductModel.sync({ alter: true }).then(() => {
//         console.log('User Table created successfully')
//     }).catch((error) => {
//         console.error('Unable to create table : ', error);
//     });
// })()

module.exports = ProductModel;