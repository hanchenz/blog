import express from 'express';
import BlogsController from './blogs.controller.js';
import CommentsController from './comments.controller.js';

const router = express.Router();

router.route("/").get(BlogsController.apiGetBlogs);
router.route("/id/:id").get(BlogsController.apiGetBlogById);
router.route("/create").post(BlogsController.apiCreateBlog);
router.route("/update").put(BlogsController.apiUpdateBlog);
router.route("/delete").delete(BlogsController.apiDeleteBlog);

router.route("/comment").post(CommentsController.apiPostComment);
router.route("/comment").put(CommentsController.apiUpdateComment);
router.route("/comment").delete(CommentsController.apiDeleteComment);
export default router;