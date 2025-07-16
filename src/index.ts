import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./util";
const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  //put zod validations here, hash the password

  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username: username,
      password: password,
    });

    res.json({
      message: "User signed up",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username,
    password,
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );

    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  const title=req.body.title;

  try{

    await ContentModel.create({
      link,
      type,
      title,
      //@ts-ignore
      userId: req.userId,
      tags: []
    })
  
    res.json({
      message: "Content added"
    })

  }catch(e){
    console.log(e);
  }

 
});

app.get("/api/v1/content",userMiddleware, async (req, res) => {

  //@ts-ignore
  const userId=req.userId;
  console.log(userId);
  const content=await ContentModel.find({
    userId: userId
  })

  res.json({
    content
  })
});

app.delete("/api/v1/content", userMiddleware, (req, res) => {});

app.post("/api/v1/brain/share", userMiddleware,async (req, res) => {

  const share = req.body.share;


  if(share){

    const existingLink=await LinkModel.findOne({
      //@ts-ignore
      userId: req.userId
    })

    console.log(existingLink);
    

    if(existingLink){
      res.json({
        hash: existingLink.hash
      })
      return;
    }

    const hash=random(10);
    console.log("value of hash" + hash);

    await LinkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash: hash
    })

    res.json({
      messaage: "/share/" + hash
    })
  } else {
    await LinkModel.deleteOne({
      //@ts-ignore
      userId: req.userId
    });

    res.json({
      message: "Remove Link"
    })
  }
});

app.get("/api/v1/brain/:shareLink",async (req, res) => {

  const hash = req.params.shareLink;

  const link= await LinkModel.findOne({
    hash
  })

  if(!link){
    res.status(411).json({
      message: "Sorry incorrect input"
    })
    return;
  }
  

  //UserId 
  const content=await ContentModel.find({
    userId: link.userId
  })

  //get User data
  const user=await UserModel.findOne({
    _id: link.userId
  })

  res.json({
    username: user?.username,
    content: content
  })
});


app.listen(3000);
