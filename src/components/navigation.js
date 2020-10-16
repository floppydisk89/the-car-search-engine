import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {FileText, Search, Plus, LogOut} from 'react-feather';
import './navigation.css';

export default function Navigation(props) {

    const history =  useHistory();

    function logout(){
        sessionStorage.setItem('token', null);
        history.push('/');
    }
    
    return (
        <div>
                <div className='navigation'>
                    <ul>
                        <li className='tooltip'>
                            <Link to='/profile'>
                                <FileText size={30} color='#ef5e15'/>
                            </Link>
                            <span className="tooltiptext">Profile</span>
                        </li>
                        <li className='tooltip'>
                            <Link to='/search'> 
                                <Search size={30} color='#ef5e15'/>
                            </Link>
                            <span className="tooltiptext">Search vehicles</span>
                        </li>
                        <li className='tooltip'>
                            <Link to='/add'> 
                                <Plus className='iconHover' size={30} color='#ef5e15'/>
                            </Link>
                            <span className="tooltiptext">Add vehicle</span>
                        </li>
                        <li className='tooltip' onClick={logout}>
                                <LogOut className='iconHover' size={30} color='#ef5e15'/>
                                <span className="tooltiptext">Logout</span>
                        </li>
                    </ul>
                </div>
       </div>       
    );
}