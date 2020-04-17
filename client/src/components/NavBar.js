import React, { Fragment, Component } from "react";
import { Nav, Navbar, Button, Form, FormControl} from 'react-bootstrap';

const NavBar = (props) => {
    if(props.loggedInStatus == "true") {
        return (
            <Navbar collapseOnSelect bg="light" variant="light">
                <Navbar.Brand href="/dashboard">PlagiaCode</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/dashboard" eventKey="1">DashBoard</Nav.Link>
                        <Nav.Link href="/courses" eventKey="2">All Courses</Nav.Link>
                    </Nav> 
                    <Nav>
                        <Nav.Link href="/login" eventKey="3"><div onClick={props.handleLogout}>Logout</div></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                
            </Navbar>
        );
    } else {
            return (
                <Navbar bg="light" variant="light">
                    <Navbar.Brand href="/dashboard">PlagiaCode</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="justify-content-end" style={{width: "100%"}}>
                                <Nav.Link href="/login">Login</Nav.Link>
                                <Nav.Link href="/register">Register</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            );
    }
}

export default NavBar;