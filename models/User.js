const db = require('../database')
const { passwordEncryption } = require('../services/helper');

// const userModel = db.define('users', {
//     name: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//         unique: true
//     },
//     mobile: {
//         type: DataTypes.BIGINT(10),
//         allowNull: false,
//         unique: true,
//         validate: {
//             min: 1000000000,
//             max: 9999999999
//         }
//     },
//     password: {
//         type: DataTypes.STRING(255),
//         allowNull: false
//     },
//     createdAt: {
//         field: "created_at",
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
//     updatedAt: {
//         field: "updated_at",
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
//     deletedAt: {
//         field: "deleted_at",
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
// }, {
//     timestamps: true,
//     paranoid: true,
//     hooks: {
//         beforeCreate: async (user) => {
//             if (user.password) {
//                 const salt = await bcrypt.genSalt();
//                 user.password = bcrypt.hashSync(
//                     user.password.toString(),
//                     salt
//                 );
//             }
//         }
//     }
// });


const userSchema = new db.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    mobile: {
        type: String,
        required: true
    },
    //     createdAt: String,
    //     updatedAt: String,
    //     tz: {
    //         type: String,
    //         default: 'Asia/Kolkata'
    //     }
    // }, {
    //     timestamps: {
    //         currentTime: () => formatInTimeZone(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy hh:mm:ss')
    //     }
});

// userSchema.plugin(timestamp)
userSchema.index({ 'email': 1, 'deletedAt': 1 }, { unique: true });

userSchema.pre('save', async function (next) {
    const user = this
    if (!user.isModified("password")) return next();

    console.log(user.password)
    if (user.password) {
        user.password = await passwordEncryption(user.password)
    }
})

userSchema.pre('updateOne', async function (next) {
    const user = this

    console.log(user?._update?.password)
    if (user?._update?.password) {
        user._update.password = await passwordEncryption(user?._update?.password)
    }
})

const userModel = db.model('users', userSchema)

// (async () => {
//     await userModel.sync({ alter: true }).then(() => {
//         console.log('User Table created successfully')
//     }).catch((error) => {
//         console.error('Unable to create table : ', error);
//     });
// })()

module.exports = userModel;