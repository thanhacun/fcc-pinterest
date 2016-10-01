
import mongoose, { Schema } from 'mongoose';
require('mongoose-type-url');

const User = new Schema({
  //_id: {type: Schema.Types.ObjectId},
  twitter: {
    id: String,
    displayName: String,
    username: String,
  },
  nbrClicks: {
    clicks: Number,
  },
  imgLinks: [{imgUrl: mongoose.SchemaTypes.Url, imgDes: String, like: {type: Number, default: 0}, uploaded: {type: Date, default: Date.now}}]
});

export default mongoose.model('User', User);
