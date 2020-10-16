import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import backendApi from '../../services/backend.api';
import Navigation from '../../components/navigation';
import {checkAccess} from '../../services/security';
import './styles.css';
import brickyardLogo from '../../assets/logo.png';

export default function Edit(props) {

    const history = useHistory();


    const {id} = props.match.params;
    
    
    const [msg, setMsg] = useState('');
    const [msgFail, setMsgFail] = useState('')
    const [disabled, setDisabled] = useState();

    const [merk, setMerk] = useState(''); //brand
    const [handelsbenaming, setHandelsbenaming] = useState('') //commercial name
    const [eerste_kleur, setEerste_kleur] = useState('') //color
    const [catalogusprijs, setCatalogusprijs] = useState('') //price
    const [voertuigsoort, setVoertuigsoort] = useState(''); //type
    const [aantal_zitplaatsen, setAantal_zitplaatsen] = useState('');//seats
    const [vehicleImg, setVehicleImg] = useState('');


    useEffect(()=>{
        const expire = checkAccess();
        if(sessionStorage.getItem('token') === null){
            history.push('/');
        }else if(!expire){
            history.push('/');
        }
          async function exec(){

            //on page load gets the vehicle details and loads them to the form
            try{
              
                let token = sessionStorage.getItem('token');
                await backendApi.get(`/vehicles/${id}`, {
              
                    headers:{
                        Authorization: token
                    }}).then(response =>{

                        setMerk(response.data.merk);
                        setHandelsbenaming(response.data.handelsbenaming);
                        setEerste_kleur(response.data.eerste_kleur);
                        setCatalogusprijs(response.data.catalogusprijs === null ? '' : response.data.catalogusprijs);
                        setVoertuigsoort(response.data.voertuigsoort);
                        response.data.aantal_zitplaatsen === null ? setAantal_zitplaatsen(0) : setAantal_zitplaatsen(response.data.aantal_zitplaatsen);//if no seats default is 0
                        setVehicleImg(response.data.image_url);

                    })
                    
                }catch(err){

                    history.push('/');//if it fails to delete goes back to profile, the server could not be up or the user might intentionally changed the number
                
                }
                
          }

          exec();

        }, [history, id]);

        async function editVehicle(e){

            e.preventDefault();//we don't want when submited to reload the page
            setMsgFail('')//cleans fail message
            setMsg('');//cleans success message
            setDisabled(true);//disables form

            try{

                //sends all data to the API
                let token = sessionStorage.getItem('token');
                await backendApi.put(`/vehicles/${id}`,{
                    vehicle:{
                        merk: merk,
                        handelsbenaming: handelsbenaming,
                        eerste_kleur: eerste_kleur,
                        catalogusprijs: catalogusprijs,
                        voertuigsoort: voertuigsoort,
                        aantal_zitplaatsen: aantal_zitplaatsen
                    }
                } ,{
                    headers:{
                        Authorization: token
                    }});

                    setDisabled(false)//unlocks form
                    setMsg('Success.')//show success message

                }catch(err){

                    setMsgFail('Unable to save.');//sets up fail message
                    setDisabled(false)//unlocks form

                }
        }
        

    return (
        <div>
            <Helmet>
                <title>Edit - Brickyard</title>
            </Helmet>

            <div className='headerDashboard'>
                <img src={brickyardLogo} alt='Brickyard' className='brickyardLogo'/>
            </div>
            
            <div className='mainFrame'>
                <div className='leftFrame'>
                    <Navigation/>
                </div>
                
                <div className='rightFrame'>
                    <div className='panel editPanel'>
                        <div className='container'>
                        <h1>Vehicle Editing</h1>
                            {
                                merk ?
                                <form onSubmit={editVehicle} className='editForm'>
                                <table>
                                <tbody>
                                <tr>
                                    <td><b>Brand</b> </td>
                                    <td><input value={merk} onChange={e => setMerk(e.target.value)} className='editInput' minLength='1' maxLength='25' disabled={disabled}></input></td>
                                </tr>
                                <tr>
                                    <td><b>Commercial Name</b></td>
                                    <td><input value={handelsbenaming} onChange={e => setHandelsbenaming(e.target.value)} className='editInput' minLength='1' maxLength='25' disabled={disabled}></input></td>
                                </tr>
                                <tr>
                                    <td><b>Color</b></td>
                                    <td><input value={eerste_kleur} onChange={e => setEerste_kleur(e.target.value)} className='editInput' min='2' maxLength='25'disabled={disabled}></input></td>
                                </tr>
                                <tr>
                                    <td><b>Price(€)</b></td>
                                    <td><input value={catalogusprijs === null ? '' :  catalogusprijs} onChange={e => setCatalogusprijs(e.target.value)} className='editInput' maxLength='8' disabled={disabled}></input></td>
                                </tr>
                                <tr>
                                    <td><b>Type</b></td>
                                    <td><input value={voertuigsoort === null? '' : voertuigsoort} onChange={e => setVoertuigsoort(e.target.value)} className='editInput' maxLength='20' disabled={disabled}></input></td>
                                </tr>
                                <tr>
                                    <td><b>Seats</b></td>
                                    <td><input value={aantal_zitplaatsen} onChange={e => setAantal_zitplaatsen(e.target.value)} className='editInput' maxLength='2' disabled={disabled}></input></td>
                                </tr>
                                <tr>
                                    <td></td>
                                <td className='mobileSave'><button className='saveButton'>Save</button> <span className='successColor'>{msg}</span>{msgFail}</td>
                                </tr>
                                </tbody>
                            </table>
                            <img src={vehicleImg === null ? 'https://exatoseguros.pt/wp-content/themes/consultix/images/no-image-found-360x250.png' : vehicleImg} alt='' className='vehicleImg editVehicleImg'/>
                            </form>
                                : 'Loading..'
                            }
                        </div>
                    </div>
                    
                </div>
            </div>
            
            
        </div>
    );
}