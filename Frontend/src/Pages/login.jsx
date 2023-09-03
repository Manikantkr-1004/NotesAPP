import React, { useState } from 'react'
import {Button, Flex, FormControl, FormLabel, Input, InputGroup,InputRightElement,Text,useToast } from "@chakra-ui/react"
import {useNavigate,Navigate, useLocation} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import { userlogin } from '../Redux/UserData/action';
import { USER_FAIL, USER_LOGIN_SUCCESS } from '../Redux/actionTypes';
import Cookies from "js-cookie"
import { useEffect } from 'react';
import wallpaper from "../Pages/notes_wallpaper.jpg"

export function Login() {

    const [formdata,setFormData] = useState({
        email:"",
        pass:""
    })
    let ram = Cookies.get('tokens')
    let kam = Cookies.get('username')

    const [show,setShow] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((store)=> store.userReducer.loading)
    const toast = useToast()
    const location = useLocation();

    useEffect(()=>{
        document.body.style.backgroundImage = `url(${wallpaper})`;
        document.body.style.backgroundRepeat = "no-repeat"
        document.body.style.backgroundSize = "cover"
    },[])

    const handleSubmit = (e)=>{
        e.preventDefault();

        dispatch(userlogin(formdata)).then(res=>{
            dispatch({type: USER_LOGIN_SUCCESS})
            setFormData({email:"",pass:""})
                toast({
                    title: `${res.data.msg}`,
                    position:"bottom",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  })
                Cookies.set('username',`${res.data.name}`,{expires:2})
                Cookies.set('tokens',`${res.data.token}`,{expires:2})

                setTimeout(() => {
                    if(location.state===null){
                        navigate("/")
                    }else{
                        navigate(`${location.state}`)
                    }
                }, 3000);
        }).catch(err=>{
            dispatch({type: USER_FAIL})
            toast({
                title: `${err.response.data.msg}` || `Something went Wrong, Try again!!`,
                position:"bottom",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        })
    }

    if(kam || ram){
        return <Navigate to="/" />
    }
    

    return (
        <Flex mt="150px" mb="100px">
            <form onSubmit={handleSubmit} style={{width:"350px",margin:"auto",padding:"20px",borderRadius:"20px"}}>
                <Text color="#ffa600" textShadow="1px 1px #000" fontWeight="bold" fontSize="20px" fontFamily="stencil" letterSpacing="1px" textAlign="center" >Login Account</Text><br/>
                <FormControl isRequired color="black">

                    <FormLabel>Enter Your Email</FormLabel>
                    <InputGroup>
                    <Input value={formdata.email} onChange={(e)=> setFormData({...formdata,email:e.target.value.toLowerCase()})} type='email' border="1px solid black" placeholder='Enter Your Email' required/>
                    </InputGroup><br/>

                    <FormLabel>Enter Your Password</FormLabel>
                    <InputGroup>
                    <InputRightElement fontWeight="bold" fontSize="13px" color="blue" _hover={{cursor:"pointer"}} onClick={()=> setShow(!show)}>{show? "Hide":"Show"}</InputRightElement>
                    <Input value={formdata.pass} onChange={(e)=> setFormData({...formdata,pass:e.target.value})} border="1px solid black" type={show? "text":"password"} placeholder='Enter Your Password' required/>
                    </InputGroup><br/>

                    {loading? <Button w="100%" bg="#ffa600" isLoading></Button>:<Button w="100%" bg="#ffa600" _hover={{bg:"#ffa600"}} type='submit' mb="10px">Login</Button>}

                </FormControl>
                <Text color="black" textAlign="center" fontWeight="500">New User? <span onClick={()=> navigate("/signup")} style={{color:"#ffa600",cursor:"pointer"}}>Create Account</span></Text>
            </form>
        </Flex>
    )
}
