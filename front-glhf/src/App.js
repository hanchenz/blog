import { useState, useEffect, useCallback } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar'
import Login from './components/Login';
import Logout from './components/Logout';
import BlogsList from "./components/BlogsList";
import './App.css';
import CreateBlog from './components/CreateBlog';
import Blog from './components/Blog';
import AddComment from './components/AddComment';
import './styles.css';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        setUser(loginData);
      } else {
        localStorage.setItem("login", null);
      }
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App" >
        <Navbar bg="dark" expand="sm" sticky="top" variant="dark" >
          <Container className="container-fluid">
          <Navbar.Brand class="navbar-brand" href="/">
            BLOGS
          </Navbar.Brand>
          <Navbar.Toggle class="navbar-toggler" aria-controls="basic-navbar-nav">Menu</Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav" >
            <Nav className="ml-auto">
              <Nav.Link class="nav-item" as={Link}  to={"/blogs"}>
                Home
              </Nav.Link>
            </Nav>
            { user ? <Nav className="ml-auto"><Nav.Link as={Link} to={"/create"}>Create</Nav.Link></Nav> : null}
          </Navbar.Collapse>
          { user ? (<Logout setUser={setUser}/>) : (<Login setUser={setUser}/>)}
          </Container>
        </Navbar>

        <Routes>
          <Route exact path={"/"} element={<BlogsList user={ user }/>}/>
          <Route exact path={"/blogs"} element={<BlogsList user={ user }/>}/>
          <Route exact path={'/create'} element={<CreateBlog user={ user }/>}/>
          <Route path={"/blogs/:id/"} element={<Blog user={ user }/>}/>
          <Route path={"/blogs/:id/edit"} element={<CreateBlog user={ user }/>}/>
          <Route path={"/blogs/:id/comment"} element={<AddComment user={ user }/>}/>
        </Routes>
      </div>
      <div class="small text-center text-muted fst-italic">&copy; Team-GLHF</div>
    </GoogleOAuthProvider>
  );
}

export default App;