const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');


const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            {
                new: true,
            }
        );
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const liketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    console.log(loginUserId);
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    console.log(isLiked);
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    console.log(alreadyDisliked);

    // if someone has already disliked the blog, then remove the dislike
    if (alreadyDisliked) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        return res.json(updatedBlog);
    }

    // if someone has already liked the blog, then remove the like
    if (isLiked) {
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        return res.json(updatedBlog);
    }

    // Add like and set isLiked to true
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
        $push: { likes: loginUserId },
        isLiked: true,
    }, { new: true });

    res.json(updatedBlog);
});

const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    console.log(loginUserId);
    // find if the user has disliked the blog
    const isDisliked = blog?.isDisliked;
    console.log(isDisliked);
    // find if the user has liked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    console.log(alreadyLiked);

    if (alreadyLiked) {
        // Remove the like and set isLiked to false
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        return res.json(updatedBlog);
    }

    if (isDisliked) {
        // Remove the dislike and set isDisliked to false
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        return res.json(updatedBlog);
    }

    // Add dislike and set isDisliked to true
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
        $push: { dislikes: loginUserId },
        isDisliked: true,
    }, { new: true });

    res.json(updatedBlog);
});

module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    liketheBlog,
    disliketheBlog,
};