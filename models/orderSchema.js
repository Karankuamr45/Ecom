import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to the Product model if you have one
            required: true,
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model if you have one
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    contact: {
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel
