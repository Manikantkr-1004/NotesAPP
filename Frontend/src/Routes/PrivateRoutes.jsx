import React from 'react'
import Cookies from "js-cookie"
import {Navigate, useLocation} from "react-router-dom"

export function PrivateRoutes({children}) {

    let ram = Cookies.get('tokens')
    let kam = Cookies.get('username');
    const location = useLocation();

    if(!ram && !kam){
        return <Navigate to="/login" state={location.pathname} replace={true} />
    }
    

    return children;
}
