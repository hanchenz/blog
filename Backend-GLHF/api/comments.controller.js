import CommentsDAO from '../dao/commentsDAO.js'

export default class CommentsController {
    static async apiPostComment(req, res, next) {
        try {
            const blogId = req.body.blog_id;
            const comment = req.body.comment;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            }

            const date = new Date();

            const commentResponse = await CommentsDAO.addComment(
                blogId,
                userInfo,
                comment,
                date
            );

            var {error} = commentResponse;
            console.log(error);
            if(error) {
                res.status(500).json({error: "Unable to post comment"});
            } else {
                res.json({status: "success"});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    static async apiUpdateComment(req, res, next) {
        try {
            const commentId = req.body.comment_id;
            const comment = req.body.comment;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            }
            const date = new Date();
            const commentResponse = await CommentsDAO.updateComment(commentId, comment, userInfo, date);
            if (commentResponse.modifiedCount !== 1) {
                throw new Error();
            }
            var { error } = commentResponse;
            if (error) {
                res.status(500).json({error: "Unable to update comment."});
            } else {
                res.json({status: "success update"});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    }

    static async apiDeleteComment(req, res, next) {
        try {
            const commentId = req.body.comment_id;
            const userId = req.body.user_id;
            const commentResponse = await CommentsDAO.deleteComment(commentId, userId);
            var {error} = commentResponse;
            console.log(error);
            if(error) {
                res.status(500).json({error: "Unable to delete comment."});
            } else {
                res.json({status: "success delete"});
            }
        } catch(e) {
            res.status(500).json({error: e.message});
        }        
    }
}