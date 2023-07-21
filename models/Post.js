const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema= new Schema({
    
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        require: require
    },
    body: {
        type: String,
        require: true
    },
    file: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }


});


module.exports=mongoose.model('posts',PostSchema);