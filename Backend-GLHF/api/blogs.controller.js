import BlogsDAO from '../dao/blogsDAO.js';

export default class BlogsController {

    static async apiGetBlogs(req, res, next) {
        const blogsPerPage = req.query.blogsPerPage ?
            parseInt(req.query.blogsPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}
        if (req.query.title) {
            filters.title = req.query.title;
        }

        const { blogsList, totalNumBlogs } = await
            BlogsDAO.getBlogs({ filters, page, blogsPerPage });
        
        let response = {
            blogs: blogsList,
            page: page,
            filters: filters,
            entries_per_page: blogsPerPage,
            total_results: totalNumBlogs,
        };
        res.json(response);
    }

    static async apiGetBlogById(req, res, next) {
        try {
            let id = req.params.id || {};
            let blog = await BlogsDAO.getBlogById(id);
            if (!blog) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(blog);
        } catch(e) {
            res.status(500).json({ error: e });
        }        
    }

    static async apiCreateBlog(req, res, next) {
        try {
            const blogContent = req.body.content;
            const blogTitle = req.body.title;
            const userId = req.body.user_id;
            const userName = req.body.user_name;
            const date = new Date();

            const blogResponse = await BlogsDAO.createBlog(blogTitle, blogContent, userId, userName, date);
            var { error } = blogResponse;
            if (error) {
                res.status(500).json({ error: "Unable to create the blog." });
            } else {
                res.json({ status: "success create" });
            }
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateBlog(req, res, next) {
        try {
            const blogId = req.body._id;
            const blogContent = req.body.content;
            const blogTitle = req.body.title;
            const userId = req.body.user_id;
            const date = new Date();

            const blogResponse = await BlogsDAO.updateBlog(blogId, blogTitle, blogContent, userId, date);
            var { error } = blogResponse;
            if (error) {
                res.status(500).json({ error });
            }

            if (blogResponse.modifiedCount === 0) {
                throw new Error ("Unable to update blog");
            }

            res.json({ status: "success update" });
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteBlog(req, res, next){
        try{

            const blogId = req.body._id;
            const userId = req.body.user_id;
            const blogResponse = await BlogsDAO.deleteBlog(
                blogId,
                userId
            );

            var {error} = blogResponse;
            if(error){
                res.status(500).json({error: "Unable to delete blog."});
            }else{
                res.json({status: "Delete success"});
                
            }
        } catch(e){
            res.status(500).json({error: e.message});
        }
    }
}