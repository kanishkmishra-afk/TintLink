import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    targetUrl:{
        type: String,
        required: true
    },
    clicks:{
        type: Number,
        default: 0
    },
    last_clickedAt:{
        type: Date,
        default: null
    }
},{ timestamps: true });

const Link = mongoose.model('Link', linkSchema);

export default Link;