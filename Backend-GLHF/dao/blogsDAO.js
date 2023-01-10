import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let blogs;

export default class BlogsDAO {
    
    static async injectDB(conn) {
        if (blogs) {
            return;
        }
        try {
            blogs = await conn.db(process.env.BLOG_NS).collection('blog');
        } catch(e) {
            console.error(`Unable to establish connection handle in blogsDAO: ${e}`);
        }
    }

    static async getBlogs({
        filters = null,
        page = 0,
        blogsPerPage = 20,
    } = {}) {
        let query;
        
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters["title"]}};
            }
        }
        let cursor;
        try {
            cursor = await blogs.find(query)
                                .limit(blogsPerPage)
                                .skip(blogsPerPage * page);
            const blogsList = await cursor.toArray();
            const totalNumBlogs = await blogs.countDocuments(query);
            return {blogsList, totalNumBlogs};
        } catch(e) {
            console.error(`Unable to issue find command, ${e}`);
            return { blogsList: [], totalNumBlogs: 0};
        }
    }

    static async getBlogById(blogId) {
        try {
            return await blogs.aggregate([
                {
                    $match: {
                        _id: new ObjectId(blogId),
                    }
                },
                {
                    $lookup: {
                        from: 'comment',
                        localField: '_id',
                        foreignField: 'blog_id',
                        as: 'comments',
                    }
                }
            ]).next();
        } catch(e) {
            console.error(`Something went wrong in getBlogById: ${e}`);
            throw e;
        }
    }

    static async createBlog(title, content, userId, userName, date) {
        try {
            const blogObj = {
                title: title,
                content: content,
                user_id: userId,
                user_name: userName,
                date: date
            };
            return await blogs.insertOne(blogObj);
        } catch(e) {
            console.error(`Unable to create blog: ${e}`);
            return { error: e };
        }
    }

    static async updateBlog(blogId, newTitle, newContent, userId, newDate) {
        try {
            const updateResponse = await blogs.updateOne(
                { _id: ObjectId(blogId), user_id: userId }, 
                { $set: { title: newTitle, content: newContent, date: newDate } }
            );
            return updateResponse;
        } catch(e) {
            console.error(`Unable to update blog: ${e}`);
            return { error: e };
        }       
    }

    static async deleteBlog(blogId, user){
        try{
            const filter = {
                _id: ObjectId(blogId),
                user_id: user}
            return await blogs.deleteOne({
                _id: ObjectId(blogId),
                user_id: user});
        }
        catch(e) {
            console.error(`Unable to delete blog: ${e}`)
            return {error: e};
        }
    }
}