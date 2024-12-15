import mongoose from "mongoose";
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
	{
		id: {
			type: ObjectId,
		},
		username: {
			type: String,
			require: true,
			min: 3,
			max: 20,
			unique: true,
		},
		email: {
			type: String,
			require: true,
			min: 3,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			require: true,
			min: 6,
		},
		profilePicture: {
			type: String,
			default: "",
		},
		coverPicture: {
			type: String,
			default: "",
		},

		followers: {
			type: Array,
		},
		followins: {
			type: Array,
		},
	},
	{ timestamps: true }
);

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
