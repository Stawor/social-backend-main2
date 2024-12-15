import mongoose from "mongoose";
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema(
	{
		id: {
			type: ObjectId,
		},
		userId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
		},
		desc: {
			type: String,
			max: 500,
		},
		likes: {
			type: Array,
			default: [],
		},
		comments: {
			type: Array,
			default: [],
		},

		img: String,
	},
	{ timestamps: true }
);

const PostModel = mongoose.model("Posts", PostSchema);

export default PostModel;
