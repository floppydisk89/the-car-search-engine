import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

/* Page imports */
import Login from './pages/login/index';
import Profile from './pages/profile/index';
import Search from './pages/search/index';
import Delete from './pages/delete/index';
import Edit from './pages/edit/index';
import Add from './pages/add/index';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login}/>
                <Route path='/profile' component={Profile}/>
                <Route path='/search' component={Search}/>
                <Route path='/delete/:id' component={Delete}/>
                <Route path='/edit/:id' component={Edit}/>
                <Route path='/add' component={Add}/>
            </Switch>
        </BrowserRouter>
    );
}