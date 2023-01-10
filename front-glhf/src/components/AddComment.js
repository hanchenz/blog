import React, { Fragment, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import BlogDataService from '../services/blog';

const AddComment = ({ user }) => {
    const navigate = useNavigate();
    let params = useParams();
    let location = useLocation();
    
    let editing = location.state ? true : false;
    let initialCommentState = "";

    const [comment, setComment] = useState(initialCommentState);

    const onChangeComment = e => {
        const comment = e.target.value;
        setComment(comment);
    };

    const saveComment = e => {
        var data = {
            comment: comment,
            name: user.name,
            user_id: user.googleId,
            blog_id: params.id
        };

        if(editing) {
            console.log(location.state.currentComment);
            data = {
                comment_id: location.state.currentComment._id,
                comment: comment,
                name: user.name,
                user_id: user.googleId,
            };
            BlogDataService.updateComment(data)
            .then(response => {
                navigate("/blogs/" + params.id);
            })
            .catch(e => {
                console.log(e);
            });
        } else {
            BlogDataService.createComment(data)
            .then(response => {
                navigate("/blogs/" + params.id);
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
                    <Form.Label><h1>{ editing ? "Edit the" : "Create a" } Comment</h1></Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        required
                        comment={ comment }
                        onChange={ onChangeComment }
                        defaultValue={ editing ? location.state.currentComment.comment : "" }
                        />
                </Form.Group>
                <Button variant="primary" onClick={ saveComment }>
                    Submit
                </Button>
            </Form>
        </Container>
    )
};

export default AddComment;