
import Profile from "../models/profile.model.js";

import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
export  const activeCheck = async (req,res) =>{
    return res.status(200).json({message: "running "});
};
export const createPost = async(req,res)=>{
    const {token} = req.body;
    try{
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"Usr not found "});
        const post = new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file!=undefined?req.file.filename:"",
            fileType:req.file!=undefined?req.file.mimetype.split("/")[1]:""  // here si some difference between the tut and min eimplementatin 


        });
        await post.save();
        return res.status(200).json({message:"post created"});

    }catch(err){
        return res.status(500).json({message:err.message})

    }
};

export const getAllPosts = async(req,res)=>{
    try{
        const posts = await Post.find().populate("userId","name username email profilePicture");
        return res.json({posts});

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

export const deletePost = async(req,res)=>{
    try{
        const {token, post_id}= req.body;
        const user = await User.findOne({token})
                    .select("_id");
        if(!user) return res.status(404).json({message:"User not found"});
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"post not found "});

        }
        if (post.userId.toString()!==user._id.toString()){
            return res.status(401).json({message:"user unauthorized"});

        };
        await Post.deleteOne({_id:post_id});
        return res.json({message:"Post deleted"});

    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

export const commentPost = async(req,res)=>{
    const {token , post_id, commentBody }=req.body;
    try{
        const user = await User.findOne({token  }).select("_id");
        if(!user) return res.status(400).json({message:"user not found"});
        const post = await Post.findOne({
                _id:post_id
        });
        if(!post){
            return res.status(404).json({message:"Post not found"});
        };
        const comment = new Comment({
            userId:user._id,
            postId:post_id,
            body:commentBody
        });
        await comment.save();   
        return res.status(200).json({message:"Comment Added"});

    }catch(err){
        res.status(500).json({message:error.message});
    }
};
// here is the query on the post_id (sligthdiff in approach )

export const get_comments_by_post = async(req,res)=>{
    const { post_id } = req.query;
   

    try{
        const post = await Post.findById(post_id);

        if(!post){
            return res.status(404).json({
                message:"Post not found"
            });
        }

        const comments = await Comment.find({
            postId: post_id
        }).populate("userId","username name");

        return res.json({ comments });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export const delete_comment_of_user = async(req,res)=>{
    const { token , comment_id}= req.body;

    try{
        const user = await User.findOne({token}).select("_id");
        if(!user)return res.status(404).json({message:"user not found"});
         
        const comment = await Comment.findOne({"_id":comment_id});
        if(!comment) return res.status(404).json({message:"comment not found "});
        if(comment.userId.toString()!==user._id.toString()){
            return res.status(401).json({message:"Unauthorized"});
        };
        await Comment.deleteOne({"_id":comment._id});
        return res.json({message:"Comment Deleted"});

    }catch(error){
        res.status(500).json({message:error.message});
    }
};
export const increment_likes = async(req,res)=>{  // doubt on passingthe token here and one like each user for each post 
    const {post_id}= req.body;
    try{

        const post = await Post.findOne({_id:post_id});
        if(!post) return res.status(404).json({message:"message not found "});
        post.likes= post.likes+1;
        await post.save();
        return res.json({message:"Likes Incremented"});
    }catch(error){  
        res.status(500).json({message:error.message});
    }
}
