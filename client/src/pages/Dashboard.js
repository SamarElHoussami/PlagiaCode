import React, { Component } from 'react';
import ErrorPage from './ErrorPage' //TODO: implement error page

class Dashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            user: props.history.location.state
        }
        
        console.log(props.history.location.state);
    }

    render() {
        const notAuthorized = (
            <ErrorPage/>
        )
        return (
            <p>Dashboard</p>
        )
    }
}

export default Dashboard;
