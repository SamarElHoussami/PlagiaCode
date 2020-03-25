import React, { Fragment, Component } from "react";
import { Nav, Navbar, Button, Form, FormControl} from 'react-bootstrap';

const NavBar = (props) => {
    if(props.loggedInStatus == "true") {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/dashboard">PlagiaCode</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/dashboard">DashBoard</Nav.Link>
                    <Nav.Link href="/courses">All Courses</Nav.Link>
                </Nav> 
                <Nav>
                    <Nav.Link href="/login"><div onClick={props.handleLogout}>Logout</div></Nav.Link>
                </Nav>
                
            </Navbar>
        );
    } else {
            return (
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/dashboard">PlagiaCode</Navbar.Brand>
                
                    <Nav className="justify-content-end" style={{width: "100%"}}>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
                </Navbar>
            );
    }
}

export default NavBar;