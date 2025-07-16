import mongoose, { Types,Schema, model } from "mongoose";

// const mongoose = require("mongoose");
// // const Schema = mongoose.Schema;
// const ObjectId = mongoose.Types.ObjectId;

mongoose.connect("mongodb+srv://jaiswalsudhanshu20:w4J93K3dfaEebq3m@cluster0.xy7jo.mongodb.net/brainly");

const contentTypes=['image','video','article','audio'];

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const tagSchema=new Schema({
  title: { type: String, required: true, unique: true }
});

const contentSchema=new Schema({
  link: {type: String, required: true},
  type: {type: String, enum: contentTypes, required: true},
  title: {type: String, required: true},
  tags: [{type: Types.ObjectId, ref:'Tag'}],
  userId: {type: Types.ObjectId, ref: 'User'}
});


const linkSchema=new Schema({
  hash: {type: String, required: true},
  userId: {type: Types.ObjectId, ref: 'User', required: true, unique: true},
});



export const ContentModel=model("Content",contentSchema);
export const UserModel=model("User",userSchema);
export const LinkModel=model("Links",linkSchema);
