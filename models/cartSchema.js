import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model if you have one
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
       
    }],
    totalPrice: {
        type: Number,
        // required: true
    }
});

const cartModel = mongoose.model('Cart', cartSchema);

export default cartModel;