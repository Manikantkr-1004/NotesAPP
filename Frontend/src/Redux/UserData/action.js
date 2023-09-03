import { USER_LOADING } from "../actionTypes";
import axios from "axios"


export const usersignup = (data)=> (dispatch)=>{
    dispatch({type: USER_LOADING});

    return axios.post("https://notesapi-s8kb.onrender.com/users/register",data)
}

export const userlogin = (data)=> (dispatch)=>{
    dispatch({type: USER_LOADING});

    return axios.post("https://notesapi-s8kb.onrender.com/users/login",data)
}