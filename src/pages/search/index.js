import React, {useState,useEffect} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {Trash2, Edit, X} from 'react-feather';

import backendApi from '../../services/backend.api';
import Navigation from '../../components/navigation';
import {checkAccess} from '../../services/security';
import brickyardLogo from '../../assets/logo.png';
import loading from '../../assets/loading-orange.gif';
import './styles.css';


export default function Search() {

    const history = useHistory();

    const [licensePlate, setLicensePlate] = useState('');//license plate from form
    const [isDisabled, setIsDisabled] = useState(false);//disables form
    const [isLoading, setIsLoading] = useState('none');//sets loading
    const [isSuccess, setIsSuccess] = useState('none');//sets success message
    const [isFail, setIsFailure] = useState('none');//sets failure message


    const [data, setData] = useState();//fetched data is saved into this place
    
    useEffect(()=>{
        const expire = checkAccess();
        if(sessionStorage.getItem('token') === null){
            history.push('/');
        }else if(!expire){
            history.push('/');
        }
    })

    async function findVehicle(e){

        e.preventDefault();//we don't want when submited to reload the page
        setIsFailure('none');//hides failure message
        setIsSuccess('none');//hides success message
        setIsLoading('block');//shows loading
        setIsDisabled(true);//disables form
        
        try{

            //fetch data related to a license plate
            let token = sessionStorage.getItem('token');
            await backendApi.get(`/vehicles/search/${licensePlate}`, {
                headers:{
                    Authorization: token
                }}).then(response =>{

                    setData(response.data);//saves data
                    response.data === null ? setIsFailure('block') : setIsFailure('none');//when api returns null because there is no such plate it shows a failure message
                
                })

                setIsLoading('none');//hides loading
                setIsSuccess('block');//Shows success message
                setIsDisabled(false);//unlocks form

            }catch(err){

                setIsLoading('none');//hides loading
                setIsFailure('block');//show fail message
                setIsDisabled(false);//unlocks form

            }
    }


    return (
        <div>
            <Helmet>
                <title>Search - Brickyard</title>
            </Helmet>

            <div className='headerDashboard'>
                <img src={brickyardLogo} alt='Brickyard' className='brickyardLogo'/>
            </div>
            
            <div className='mainFrame'>

                <div className='leftFrame'>
                    <Navigation/>
                </div>

                <div className='rightFrame'>
                    <div className='panel addPanel'>
                        <div className='container'>

                        <div className='addForm'>
                            <h1>Search a vehicle</h1>

                                <form onSubmit={findVehicle}>
                                  <input placeholder='Example: XXAAXX' className='editInput' value={licensePlate} onChange={e => setLicensePlate(e.target.value)} disabled={isDisabled} minLength='6' maxLength='6'></input>
                                  <button className='addButton'>Find</button>
                                </form>

                        </div>

                        <div className='addMessageContainer' style={{display: isLoading}}>
                            <p className='smallTitle'>Fetching vehicle data</p>
                            <img src={loading} alt='' className='addLoading'/>
                        </div>

                        <div className='addMessageContainer' style={{display: isSuccess}}>
                            {
                                data ? 
                                <div className='itemVehicle search' key={Math.random()}>
                                        <div className='vehicleImgContainer'>
                                            <img src={data.image_url === null ? 'https://exatoseguros.pt/wp-content/themes/consultix/images/no-image-found-360x250.png' : data.image_url} alt='' className='vehicleImg'/>
                                        </div>
                                        <div className='vehicleInfoContainer softShadow'>
                                            <div className='info'>
                                            <table className='searchTable'>
                                                <tbody>
                                                <tr>
                                                    <td><b>License plate:</b> {data.license_plate}</td>
                                                    <td><b>Brand: </b> {data.merk}</td>
                                                    <td><b>Co. name:</b> {data.handelsbenaming}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Type: </b>{data.voertuigsoort === null ? 'unkown': data.voertuigsoort}</td>
                                                    <td><b>Color: </b>{data.eerste_kleur}</td>
                                                    <td><b>Seats: </b>{data.aantal_zitplaatsen === null ? 'unkown': data.aantal_zitplaatsen}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Price: </b>{data.catalogusprijs === null ? 'unkown' : data.catalogusprijs}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className='listButtonGroup'>
                                                <div className='listButton'>
                                                    <Link to={`/edit/${data.id}`}>
                                                        <Edit color='#00c853' size={28}/>
                                                    </Link>
                                                </div>
                                                <div className='listButton'>
                                                    <Link to={`/delete/${data.id}`}>
                                                        <Trash2 color='#f44336' size={28}/>
                                                    </Link>
                                                </div>
                                            </div>
                                            </div>
                                            </div>
                                        </div>
                                        : ''}

                        </div>

                        <div className='addMessageContainer' style={{display: isFail}}>
                            <p className='smallTitle'>No such license plate associated to your account.</p>
                            <X className='failColor' size={50}/>
                        </div>

                        </div>
                    </div>
                    
                </div>
            </div>
            
            
        </div>
    );
}