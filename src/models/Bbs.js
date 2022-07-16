import mongoose from "mongoose";

const bbsSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, maxlength:80 },
    text: { type: String, required: true, trim: true, maxlength:1000 },
    createdAt: { type: Date, required: true, default: Date.now },
    meta: {
        views: {type: Number, default: 0 },
        rating: {type: Number, default: 0 },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const Bbs = mongoose.model("Bbs", bbsSchema);
export default Bbs;