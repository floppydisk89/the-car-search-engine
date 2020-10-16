import jwt from 'jsonwebtoken';

export const checkAccess = () =>{
    let decodedToken=jwt.decode(sessionStorage.getItem('token'), {complete: true});
    let dateNow = new Date();
    if(decodedToken === null){
        //
    }else{
        return Boolean(decodedToken.payload.exp < dateNow.getTime());
    }
}