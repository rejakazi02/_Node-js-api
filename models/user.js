const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        },
        gender: {
            type: String,
            required: true
        },
        // username: {
        //     type: String,
        //     required: false
        // },
        // profileImg: {
        //     type: String
        // },
        password: {
            type: String,
            required: true
        },
        carts: [{
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }],
        checkouts: [{
            type: Schema.Types.ObjectId,
            ref: 'Checkout'
        }]
        // isPhoneVerified: {
        //     type: Boolean,
        //     required: true
        // },
        // registrationAt: {
        //     type: Date,
        //     required: true
        // },
        // hasAccess: {
        //     type: Boolean,
        //     required: true
        // }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('User', userSchema);
