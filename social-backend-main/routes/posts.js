import express from "express";
const router = express.Router();
import PostModel from "../models/Posts.js";
import UserModel from "../models/User.js";
import { verifyToken } from "./auth.js";

//create a post
router.post("/", async (req, res) => {
	const newPost = new PostModel(req.body);
	try {
		if (req.body.userId == null) {
			return;
		}
		const savePost = newPost.save();
		res.status(200).json("Post Created");
	} catch (err) {
		res.status(500).json(err);
	}
});
//update a post

router.put("/:id", async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (post.userId === req.body.id) {
			await post.updateOne({ $set: req.body });
			res.status(200).json("Post have been updated");
		} else {
			res.status(403).json("You can update only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//delete a post
router.delete("/:id/:user", async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (post.userId === req.params.user) {
			await post.deleteOne();
			res.status(200).json("Post have been deleted");
		} else {
			res.status(403).json("You can delete only your post");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
// like or dislike a post
router.put("/:id/like", async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("liked");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json("disliked");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// get post
router.get("/:id", verifyToken, async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		res.status(200).json("");
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/timeline/:id", verifyToken, async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id);
		const userPosts = await PostModel.find({ userId: user._id });
		res.status(200).json({ userPosts });
	} catch (err) {
		res.status(500).json(err);
	}
});
// get timeline posts
router.get("/timeline/all/:id", verifyToken, async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id);
		const userPosts = await PostModel.find({ userId: user._id });
		const friendPosts = await Promise.all(
			user.followins.map((friendId) => {
				return PostModel.find({ userId: friendId });
			})
		);
		res.json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put("/comment/:postId/:userId", async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.postId);
		const userId = req.params.userId;
		await post.updateOne({
			$push: { comments: { comment: req.body.comment, userId: userId } },
		});
		res.status(200).json("ok");
	} catch (err) {
		res.status(500).json(err);
	}
});
export default router;
