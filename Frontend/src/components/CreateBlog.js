import React, { useState } from 'react';
import BlogDataService from '../services/blog.js';
import { useNavigate, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import './Blog.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const CreateBlog = ({ user }) => {
    const navigate = useNavigate();
    let location = useLocation();
    let editing = location.state ? true : false;
    let initialBlogState = {
        title: "",
        content: "",
        date: new Date(),
        user_id: user.googleId,
        user_name: user.name
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Submit your blog
        </Tooltip>
      );

    const [blog, setBlog] = useState(initialBlogState);

    const onChangeBlogTitle = e => {
        const blogTitle = e.target.value;
        blog.title = blogTitle;
        setBlog(blog);
    }

    const onChangeBlogContent = e => {
        const blogContent = e.target.value;
        blog.content = blogContent;
        setBlog(blog);
    };

    const saveBlog = e => {
        var data = {
            title: blog.title,
            content: blog.content,
            user_name: user.name,
            user_id: user.googleId,
        };

        if (editing) {
            data._id = location.state.currentBlog._id;
            BlogDataService.updateBlog(data)
            .then(response => {
                navigate("/blogs/");
            })
            .catch(e => {
                console.log(e);
            });
        } else {
            BlogDataService.createBlog(data)
            .then(response => {
                navigate("/blogs/");
            })
            .catch(e => {
                console.log(e);
            });
        }
    };

    return (
        <Container className="main-container">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label><h1>{ editing ? "Edit" : "Create" } a Blog</h1></Form.Label>
                    <br/>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        rows={1}
                        required
                        title={ blog.title }
                        onChange={ onChangeBlogTitle }
                        defaultValue={ editing ? location.state.currentBlog.title : "" }
                    />
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        rows={8}
                        required
                        content={ blog.content }
                        onChange={ onChangeBlogContent }
                        defaultValue={ editing ? location.state.currentBlog.content : "" }
                    />
                </Form.Group>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                    >
                    <Button variant="primary" onClick={ saveBlog }>
                        Submit
                    </Button>
                </OverlayTrigger>
            </Form>
        </Container>
    )
};

export default CreateBlog;