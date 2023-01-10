import React, { useState, useEffect, useCallback } from 'react';
import BlogDataService from "../services/blog.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import moment from 'moment';
import './Blog.css';
import '../styles.css';

const BlogsList = ({user}) => {
    const [blogs, setBlogs] = useState([]);
    const [blogTitles, setBlogTitles] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(0);
    const [currentSearchMode, setCurrentSearchMode] = useState("");

    const retrieveBlogs = useCallback(() => {
        setCurrentSearchMode("");
        BlogDataService.getAll(currentPage)
            .then(response => {
                setBlogs(response.data.blogs);
                setCurrentPage(response.data.page);
                setEntriesPerPage(response.data.entries_per_page);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentPage]);

    const retrieveBlogTitles = useCallback(() => {
        BlogDataService.getAll(currentPage)
            .then(response => {
                setBlogTitles(response.data.blogs.map(x=>x.title));
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentPage]);

    const find = useCallback((query, by) => {
        BlogDataService.find(query, by, currentPage)
            .then(response => {
                setBlogs(response.data.blogs);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentPage]);

    const findByTitle = useCallback(() => {
        console.log(searchTitle);
        setCurrentSearchMode("findByTitle");
        find(searchTitle, "title");
        
    }, [find, searchTitle]);

    const retrieveNextPage = useCallback(() => {
        if (currentSearchMode === "findByTitle") {
            findByTitle();
        } else {
            retrieveBlogs();
        }
    }, [currentSearchMode, findByTitle, retrieveBlogs]);
    
    const deleteBlog = (_id, index) => {
        var data = {
            _id: _id,
            user_id: user.googleId
        }
    
        BlogDataService.deleteBlog(data)
          .then(response => {
            setBlogs((prevState) => {
              prevState.splice(index, 1);
              return([...prevState])
            })
          })
          .catch(e => {
              console.log(e);
          });
    }

    useEffect(() => {
        setCurrentPage(0);
    }, [currentSearchMode]);

    useEffect(() => {
        retrieveNextPage();
    }, [currentPage, retrieveNextPage]);

    useEffect(() => {
        retrieveBlogTitles(currentPage);
    }, [currentPage, retrieveBlogTitles]);

    const onChangeSearchTitle = (e, values) => {
        setSearchTitle(values);
        console.log(values);
    }

    const ellipsify = (str) => {
        if (str.length > 480) {
            return (str.substring(0, 480) + "...");
        }
        else {
            return str;
        }
    }

    return (
        <div className="App">
            <header class="masthead" style={{backgroundImage: "url('/images/home-bg.jpg')"}}>
                <div class="container position-relative px-4 px-lg-5">
                    <div class="row gx-4 gx-lg-5 justify-content-center">
                        <div class="col-md-10 col-lg-8 col-xl-7">
                            <div class="site-heading">
                                <h1>Blogs</h1>
                                <span class="subheading">Share Your Adventures</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Container className="main-container">
                <div class="container px-4 px-lg-5">
                    <div class="row gx-4 gx-lg-5 justify-content-center">
                        <div class="col-md-10 col-lg-8 col-xl-7"></div>
                            <Form>
                                <Row>
                                    <div style={{display:'flex', flexDirection:'row', padding:'10px'}}>
                                        <Autocomplete
                                            disablePortal
                                            options={blogTitles}
                                            getOptionLabel={option => typeof option === 'string' ? option : option.label}
                                            sx={{ width: 300 }}
                                            value={searchTitle}
                                            onInputChange={onChangeSearchTitle}
                                            renderInput={(params) => <TextField {...params} label="Search by title" />}
                                        > 
                                        </Autocomplete>
                                        <Button
                                            variant='primary'
                                            type="button"
                                            onClick={findByTitle}
                                            style={{display: 'inline'}}
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                            {blogs.map((blog, index) => {
                                return(
                                    <Row key={blog._id}>
                                        <div class="post-preview">
                                            <a href={"/blogs/" + blog._id}>
                                                <h2 class="post-title">{blog.title}</h2>
                                                <h3 class="post-subtitle">{ellipsify(blog.content)}</h3>
                                            </a>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <h class="post-meta" style={{paddingTop: '2px'}}>
                                                    Posted by {blog.user_name} on {moment(blog.date).format("Do MMMM YYYY")}
                                                </h>
                                                { user && user.googleId === blog.user_id ? 
                                                <u>
                                                    <h style={{height: '50px', color: 'red'}} onClick={() => {deleteBlog(blog._id, index);}}>Delete</h>
                                                </u>
                                                : null }
                                            </div>
                                            
                                        </div>
                                    </Row>
                                ) 
                            })}
                        </div>
                    </div>
                <br/>
                Showing page: { currentPage + 1 } { }
                <Button variant="link" onClick={() => { setCurrentPage(currentPage + 1)} }>
                    Get next { entriesPerPage } results
                </Button>
            </Container>
        </div>
    )
}


export default BlogsList;