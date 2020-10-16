import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {Check, X} from 'react-feather';

import backendApi from '../../services/backend.api';
import rdwApi from '../../services/rdw.api';
import googleApi from '../../services/googleSearch.api';
import Navigation from '../../components/navigation';
import {checkAccess} from '../../services/security';
import logo from '../../assets/logo.png';
import loading from '../../assets/loading-orange.gif';
import './styles.css';


export default function Add() {

    const history = useHistory();

    const [licensePlate, setLicensePlate] = useState(''); //loaded license plate from the form
    const [isDisabled, setIsDisabled] = useState(false); //lock the form when it is processing something
    const [isLoading, setIsLoading] = useState('none'); //shows loading
    const [isSuccess, setIsSuccess] = useState('none'); //show sucessful message
    const [isFail, setIsFail] = useState('none'); //shows failure message
    const [failMsg, setFailMsg] = useState(''); //defines failure message (reason)

    let data = ''; //in this case this is the appropriate type of variable to store our results

    let carImage = '' //car image
    let googleQueryTerm = ''; //binded google query term

    useEffect(()=>{
        const expire = checkAccess();
        if(sessionStorage.getItem('token') === null){
            history.push('/');
        }else if(!expire){
            history.push('/');
        }
    })

    async function findVehicle(e){

        e.preventDefault(); //we don't want when submited to reload the page
        setIsFail('none');//hides message
        setIsSuccess('none');//hides message
        setIsLoading('block');//shows loading
        setIsDisabled(true);//disables form

        try{

            await rdwApi.get(`m9d7-ebf2.json?kenteken=${licensePlate}`).then(response =>{
                    data = response.data[0]; //saves the data
                    googleQueryTerm = response.data[0].handelsbenaming+ ' ' + response.data[0].merk; //makes google query term
                })

                try{

                    //bellow is how we shouldn't store API keys, it should be done in the backend, it this case it has to be stored directly here
                    await googleApi.get(`/v1?q=${googleQueryTerm}&cx=c5091d055804a6cf7&num=1&key=AIzaSyA4OR1G1KPgVuezmv0WzEMPgFhFX1qzfBg`).then(response =>{   
                        carImage = response.data.items[0].pagemap.cse_thumbnail[0].src; //gets car picture
                        })
                    
                    }catch(err){
                        //we don't want to desplay and error here
                    }

                    try{

                        //time to post our data
                        let token = sessionStorage.getItem('token');
                        await backendApi.post('/vehicles/',{
                            vehicle:{
                                merk: data.merk,
                                handelsbenaming: data.handelsbenaming,
                                eerste_kleur: data.eerste_kleur,
                                voertuigsoort: data.voertuigsoort,
                                license_plate: licensePlate,
                                image_url: carImage
                            }
                        } ,{
                            headers:{
                                Authorization: token
                            }});

                            setIsLoading('none');//hides loading
                            setIsSuccess('block');//shows success
                            setIsDisabled(false);//unlocks the form

                        }catch(err){

                            setIsLoading('none');//hides loading
                            setFailMsg('The current license is already registred.')//sets failure message
                            setIsFail('block');//shows failure message
                            setIsDisabled(false)//unlocks the form
                        }

            }catch(err){
                setIsLoading('none');//hides loading
                setFailMsg('The current license plate is not valid.')//sets failure message
                setIsFail('block');//
                setIsDisabled(false);//unlocks the form
            }
    }


    return (
        <div>
            <Helmet>
                <title>Edit</title>
            </Helmet>

            <div className='headerDashboard'>
                <img src={logo} alt='logo' className='logo'/>
            </div>
            
            <div className='mainFrame'>

                <div className='leftFrame'>
                    <Navigation/>
                </div>

                <div className='rightFrame'>
                    <div className='panel addPanel'>
                        <div className='container'>

                        <div className='addForm'>
                            <h1>Add a vehicle</h1>
                            <p>Insert a vehicle license plate in order to import all its details to your profile listing.</p>
                                <form onSubmit={findVehicle}>
                                <input placeholder='Example: XXAAXX' className='editInput' value={licensePlate} onChange={e => setLicensePlate(e.target.value)} disabled={isDisabled} minLength='6' maxLength='6'></input>
                                <button className='addButton'>Find & Add</button>
                            </form>
                        </div>

                        <div className='addMessageContainer' style={{display: isLoading}}>
                            <p className='smallTitle'>Fetching vehicle data</p>
                            <img src={loading} alt='' className='addLoading'/>
                        </div>

                        <div className='addMessageContainer' style={{display: isSuccess}}>
                            <p className='smallTitle'>Success</p>
                            <Check className='successColor' size={50}/>
                        </div>

                        <div className='addMessageContainer' style={{display: isFail}}>
                            <p className='smallTitle'>{failMsg}</p>
                            <X className='failColor' size={50}/>
                        </div>
                        
                        </div>
                    </div>
                    
                </div>
            </div>
            
            
        </div>
    );
}