import React, { useState, useEffect } from 'react';
import BlogDataService from "../services/blog";
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import './Blog.css';
import '../styles.css';

const Blog = ({ user }) => {
  
  let params = useParams();

  const [blog, setBlog] = useState({
    id: null,
    title: "",
    content: "",
    user_name: "",
    date: "",
    comments: []
  });

  const deleteComment = (comment, index) => {
    let data = {
      user_id: user.googleId,
      comment_id: comment._id,
    }
    BlogDataService.deleteComment(data)
    .then(response => {
      setBlog((prevState) => {
        prevState.comments.splice(index, 1);
        return ({
          ...prevState
        })
      });
    })
    .catch(e => {
      console.log(e);
    })
  }

  useEffect(() => {
    const getBlog = id => {
      BlogDataService.getBlogById(id).then(response => {
        setBlog(response.data);
        console.log(response.data);
      })
      .catch(e => {
          console.log(e);
      })}
    getBlog(params.id);
  }, [params.id]);

  return (
      <div>
        <header class="masthead" style={{backgroundImage: "url('/images/post-bg.jpg')"}}>
            <div class="container position-relative px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7">
                        <div class="post-heading">
                            <h1>{blog.title}</h1>
                            <span class="meta">
                              Posted by {blog.user_name} on {moment(blog.date).format("Do MMMM YYYY")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <article class="mb-4">
            <div class="container px-4 px-lg-5">
                <div class="row gx-4 gx-lg-5 justify-content-center">
                    <div class="col-md-10 col-lg-8 col-xl-7" style={{whiteSpace: "pre-wrap"}}>
                      {blog.content}
                    </div>
                    <div class="col-md-10 col-lg-8 col-xl-7">
                    
                    {
                    user && user.googleId === blog.user_id &&
                    <div >
                      <u>
                        <small style={{fontStyle: 'underline'}}>
                          <Link to={{pathname: "/blogs/" + blog._id + "/edit"}} state={{currentBlog: blog}}>Edit</Link>
                        </small>
                      </u>
                    </div>
                    }
                    <hr/>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1>Comments</h1>
                    {
                    user &&
                        <Link to={"/blogs/" + params.id + "/comment"}>
                          <Button variant='primary' class='btn btn-success btn-sm' >
                          Add a comment
                          </Button>
                        </Link>
                    }
                    </div>
                    <br/>
                    {
                      blog.comments.map((comment, index) => {
                        return (
                          <div className='d-flex'>
                            <div className='flex-shrink-0 commentsText'>
                              <br/>
                              <Card>
                                <Card.Header>
                                  <span class="meta" style={{fontSize: '17px'}}>
                                    Posted by {comment.name} on {moment(comment.date).format("Do MMMM YYYY")}
                                  </span>
                                  {
                                  user && user.googleId === comment.user_id &&
                                  <div style={{float: 'right'}}>
                                    <button style={{marginRight:'10px', width: '50px', height: '35px'}}><Link to={{pathname: "/blogs/" + params.id + "/comment"}} state= {{currentComment: comment}}>Edit</Link></button>
                                    <button style={{width: '73px', height: '35px'}} onClick={() => {deleteComment(comment, index);}}>Delete</button>                         
                                  </div>
                                  }
                                </Card.Header>
                                <Card.Body>
                                  <h>{comment.comment}</h>
                                </Card.Body>
                              </Card>
                            </div>
                          </div>
                        )
                      })
                    }
                    </div>
                </div>
            </div>
        </article>
        
      </div>
  )
}

export default Blog;