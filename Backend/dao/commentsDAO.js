import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let comments;

export default class CommentsDAO {
    static async injectDB(conn) {
        if(comments) {
            return;
        }
        try {
            comments = await conn.db(process.env.BLOG_NS).collection('comment');
        } catch(e) {
            console.error(`Unable to connect in CommentsDAO: ${e}`);
        }
    }

    static async addComment(blogId, user, comment, date) {
        try {
            const commentDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                comment: comment,
                blog_id: ObjectId(blogId)
            }
            return await comments.insertOne(commentDoc);
        } catch(e) {
            console.error(`Unable to post comment: ${e}`);
            return {error: e};
        }
    }

    static async updateComment(commentId, newComment, user, newDate) {
        try {
            return await comments.updateOne({
                _id: ObjectId(commentId),
                name: user.name,
                user_id: user._id
            }, {
                $set: {
                    comment: newComment,
                    date: newDate
                }
            });
        } catch(e) {
            console.error(`Unable to update comment: ${e}`);
            return {error: e};
        }       
    }

    static async deleteComment(commentId, userId) {
        try {
            return await comments.deleteOne({
                _id: ObjectId(commentId),
                user_id: userId
            });
        } catch(e) {
            console.error(`Unable to delete comment: ${e}`);
            return {error: e};
        }
    }
}