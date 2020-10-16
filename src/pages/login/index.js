import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Typist from 'react-typist';

import backendApi from '../../services/backend.api';
import logo from '../../assets/logo.png';
import ecoCar from '../../assets/eco-car.svg';
import loading from '../../assets/loading-white.gif';
import './styles.css';

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visibility, setVisibility] = useState('none')//loading ring visibility
    const history = useHistory();

    async function handleLogin(e){

        e.preventDefault();//we don't want when submited to reload the page
        setVisibility('initial');//show loading ring

        try{

            //validates data on the backend
            const result = await backendApi.post('/auth/login', {
                email,
                password
            });

            if(result.data.auth_token){
                //if success saves to session storage the token, another good method would be HTTP only cookie where no external app can get into
                sessionStorage.setItem('token', result.data.auth_token);
                history.push('/profile');
            }
            
        }catch(err){

            setVisibility('none');//hides loading ring
            alert('The login details are incorrect. Please check if you have a valid login.');
        
        }

    }

    return (
        <div>
            <Helmet>
                <title>Login</title>
            </Helmet>

            <div className='header'>
                <img src={logo} alt='logo' className='logo'/>
            </div>
            
            <div className='mainFrame'>

                <div className='loginFrame'>

                    <h3 className='brickColor mediumTitle spacer50'>Welcome back!</h3>
                
                    <form onSubmit={handleLogin}>
                        <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' type='email' minLength='5' required/>
                        <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' type='password' minLength='4' required/>
                        <button className='actionButton spacer20'>Login<img src={loading} alt='' className='loginLoading' style={{display: visibility}}/></button>
                    </form>
                
                </div>
                
                <Typist renderMsg={true}>
                    Mobility from start to finish
                </Typist>
            
                <img src={ecoCar} alt='Car' className='loginCar'/>

            </div>
            
            
        </div>
    );
}