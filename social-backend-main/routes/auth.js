import express from "express";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
const auth = express.Router();
import "dotenv/config";
import bcrypt from "bcrypt";

//Register
auth.post("/register", async (req, res) => {
	try {
		const usernameExist = await UserModel.findOne({
			username: req.body.username,
		});
		const emailExist = await UserModel.findOne({ email: req.body.email });
		if (usernameExist) {
			return res.status(404).json("Username already exist");
		}
		if (emailExist) {
			return res.status(404).json("Email already exist");
		}

		//generate hashedPassword
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		//create new user with hasheddPassword

		const newUser = new UserModel({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});
		const user = await newUser.save();
		res.status(200).json("User account created");
	} catch (err) {
		return res.sendStatus(err).json("user already exist");
	}
});

//Login
auth.post("/login", async (req, res) => {
	try {
		//find user by email in mongoDB
		const user = await UserModel.findOne({ email: req.body.email });
		if (!user) {
			return res.status(404).json("Email not found!");
		}
		//compare password with hashedPassword
		const password = await bcrypt.compare(req.body.password, user.password);
		if (!password) {
			return res.status(404).json("Password is invalid");
		}
		//JWT
		if (user.password && user.email) {
			const token = jwt.sign(
				{ userId: user._id },
				process.env.JWT_SECRET,
				(err, token) => {
					res.status(200).send({ token, user: user._id });
				}
			);
			console.log(token);
		}
	} catch (err) {
		res.json(err);
	}
});
//Middleware for JWT
export const verifyToken = async (req, res, next) => {
	try {
		const authHeader = await req.headers["authorization"];
		const token = (await authHeader) && authHeader.split(" ")[1];

		if (token == null) return res.sendStatus(401);

		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET,
			(err, user) => {
				if (err) return res.sendStatus(403);
				req.user = user;
				next();
			}
		);
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
	}
};

export default auth;
