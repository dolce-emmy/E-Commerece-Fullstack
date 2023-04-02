import {Schema, model} from "mongoose";

const imageSchema = new Schema({
    filename: {type: String, required: true},
    data: {type: Buffer, required: true},
    contentType: {type: String, required: false},
    userId:{type: Schema.Types.ObjectId, ref: "users", required: true}

})

const ImageCollection = model("images", imageSchema);

export default ImageCollection;
