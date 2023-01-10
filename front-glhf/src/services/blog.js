import axios from "axios";

class BlogDataService {

    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs?page=${page}`);
    }

    find(query, by="title", page=0){
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs?${by}=${query}&page=${page}`);
    }

    createBlog(data) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs/create`, data)
    }

    updateBlog(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs/update`, data);
    }

    deleteBlog(data){
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs/delete`, {data});
    }

    getBlogById(blogId) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs/id/${blogId}`);
    }

    deleteComment(data) {
        return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs/comment`, { data: data });
    }

    updateComment(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs/comment`, data)
    }

    createComment(data) {
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/blogs/comment`, data)
    }
}

export default new BlogDataService();