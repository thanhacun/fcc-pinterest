import mongoose, { Schema } from 'mongoose';

const Image = new Schema({
    _uploader: {type: Schema.Types.ObjectId, ref: 'User'},
    imgUrl: String,
    imgDes: String
});

export default mongoose.model('Image', Image);