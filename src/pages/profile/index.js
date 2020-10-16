import React, {useState, useEffect} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {Trash2, Edit} from 'react-feather';

import backendApi from '../../services/backend.api';
import Navigation from '../../components/navigation';
import {checkAccess} from '../../services/security';
import './styles.css';
import brickyardLogo from '../../assets/logo.png';

export default function Profile() {

    const history = useHistory();


    const [data, setData] = useState();
    const [results, setResults] = useState('');

    let vehicleImage = '';
    let vehicleSeats = 0;
    let vehicleType = '';
    let vehicleCalalogPrice = 0;

    useEffect(()=>{
        const expire = checkAccess();
        if(sessionStorage.getItem('token') === null){
            history.push('/');
        }else if(!expire){
            history.push('/');
        }
          async function exec(){
    
            try{
                
                //Gets vehicles
                let token = sessionStorage.getItem('token');
                await backendApi.get('/vehicles', {
                    headers:{
                        Authorization: token
                    }}).then(response =>{

                        setData(response.data);//saves the data fetch
                        setResults('Found ' + response.data.length + ' results. ')//shows amount of results

                    })

                }catch(err){

                    //if error fething data time to loggout and clear the access.
                    sessionStorage.setItem('token', null);
                    history.push('/');

                }
                
          }
          exec();
        }, [history]);

    return (
        <div>
            <Helmet>
                <title>Profile - Brickyard</title>
            </Helmet>

            <div className='headerDashboard'>
                <img src={brickyardLogo} alt='Brickyard' className='brickyardLogo'/>
            </div>
            
            <div className='mainFrame'>

                <div className='leftFrame'>
                    <Navigation/>
                </div>

                <div className='rightFrame'>
                    <div className='panel'>
                        <div className='container'>

                            <h3 className='mediumTitle'>All your registred vehicles</h3>
                            
                            <div className='resultsNumber'>
                                <span>{results}</span>
                            </div>
                        
                            {   //gets each object in each array position and prints ist data
                                data ?
                                data.map((anObjectMapped, index) => {

                                    //in case some data is missing it automaticaly sets it as unkown
                                    anObjectMapped.image_url === null ? vehicleImage = 'https://exatoseguros.pt/wp-content/themes/consultix/images/no-image-found-360x250.png' : vehicleImage = anObjectMapped.image_url;
                                    
                                    let tempType = anObjectMapped.voertuigsoort;
                                    anObjectMapped.voertuigsoort === null ? vehicleType = 'unkown': vehicleType = tempType;

                                    let tempSeats = anObjectMapped.aantal_zitplaatsen;
                                    anObjectMapped.aantal_zitplaatsen === null || anObjectMapped.aantal_zitplaatsen === 0 ? vehicleSeats = 'unkown': vehicleSeats = tempSeats;

                                    let tempPrice = '€'+anObjectMapped.catalogusprijs;
                                    anObjectMapped.catalogusprijs === null ? vehicleCalalogPrice = 'unkown': vehicleCalalogPrice = tempPrice;

                                    return(
                                    <div className='itemVehicle' key={Math.random()}>
                                        <div className='vehicleImgContainer'>
                                            <img src={vehicleImage} alt='' className='vehicleImg'/>
                                        </div>
                                        <div className='vehicleInfoContainer softShadow'>
                                            <div className='info'>
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td><b>License plate:</b> {anObjectMapped.license_plate}</td>
                                                    <td><b>Brand: </b> {anObjectMapped.merk}</td>
                                                    <td><b>Co. name:</b> {anObjectMapped.handelsbenaming}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Type: </b>{vehicleType}</td>
                                                    <td><b>Color: </b>{anObjectMapped.eerste_kleur}</td>
                                                    <td><b>Seats: </b>{vehicleSeats}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Price: </b>{vehicleCalalogPrice}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className='listButtonGroup'>
                                                <div className='listButton'>
                                                    <Link to={`/edit/${anObjectMapped.id}`}>
                                                        <Edit color='#00c853' size={28}/>
                                                    </Link>
                                                </div>
                                                <div className='listButton'>
                                                    <Link to={`/delete/${anObjectMapped.id}`}>
                                                        <Trash2 color='#f44336' size={28}/>
                                                    </Link>
                                                </div>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                   )
                                }) : ''
                            }
                        </div>  
                    </div>
                    
                </div>
            </div>
            
            
        </div>
    );
}