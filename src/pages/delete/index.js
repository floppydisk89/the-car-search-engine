import React, {useEffect} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import backendApi from '../../services/backend.api';
import Navigation from '../../components/navigation';
import {checkAccess} from '../../services/security';
import './styles.css';
import logo from '../../assets/logo.png';

export default function Delete(props) {

    const history = useHistory();

    const {id} = props.match.params;

    useEffect(()=>{
        const expire = checkAccess();
        if(sessionStorage.getItem('token') === null){
            history.push('/');
        }else if(!expire){
            history.push('/');
        }
    })

    async function deleteItem(){

        try{
            //deletes then goes back to progile
            let token = sessionStorage.getItem('token');
            await backendApi.delete(`/vehicles/${id}`, {
                headers:{
                    Authorization: token
                }}).then(() =>{
                    history.push('/profile');
                })

            }catch(err){
                history.push('/profile'); //if it fails to delete goes back to profile, the server could not be up or the user might intentionally changed the number
            }
    }

    return (
        <div>
            <Helmet>
                <title>Delete</title>
            </Helmet>

            <div className='headerDashboard'>
                <img src={logo} alt='logo' className='logo'/>
            </div>

            <div className='leftFrame deletePage'>
                    <Navigation className='deletePage'/>
            </div>

            <div className='mainFrame'>
                <div className='dialog'>

                    <div className='message'>
                        <span>This action can't be undone. Are you sure you want to delete this vehicle?</span>
                    </div>

                    <div className='deleteButtonGroup'>
                        <Link to='/profile' className='brickColor'>Go back</Link>
                        <button className='deleteButton' onClick={deleteItem}>Yes</button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}