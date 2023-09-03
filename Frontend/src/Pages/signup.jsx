import React, { useState } from 'react'
import {Button, Flex, FormControl, FormHelperText, FormLabel, Input, InputGroup,InputRightElement,Text,useToast } from "@chakra-ui/react"
import {useNavigate,Navigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import { usersignup } from '../Redux/UserData/action';
import { USER_FAIL, USER_SIGNUP_SUCCESS } from '../Redux/actionTypes';
import Cookies from "js-cookie"
import { useEffect } from 'react';
import wallpaper from "../Pages/notes_wallpaper.jpg"

export function Signup() {

    const [formdata,setFormData] = useState({
        username:"",
        email:"",
        pass:""
    })

    let ram = Cookies.get('tokens')
    let kam = Cookies.get('username')

    const [show,setShow] = useState(false);
    const [error,setError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((store)=> store.userReducer.loading)
    const toast = useToast()
    useEffect(()=>{
        document.body.style.backgroundImage = `url(${wallpaper})`;
        document.body.style.backgroundRepeat = "no-repeat"
        document.body.style.backgroundSize = "cover"
    },[])

    const handleSubmit = (e)=>{
        e.preventDefault();

        if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(formdata.pass))){
            setError(true);
            return;
        }
        setError(false);
        dispatch(usersignup(formdata)).then(res=>{
            dispatch({type: USER_SIGNUP_SUCCESS})
            setFormData({username:"",email:"",pass:""})
                toast({
                    title: `${res.data.msg}`,
                    position:"bottom",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  })
                  setTimeout(() => {
                    navigate("/login")
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
        <Flex mt="110px" mb="100px">
            <form onSubmit={handleSubmit} style={{width:"350px",margin:"auto",padding:"20px",borderRadius:"20px"}}>
                <Text color="#ffa600"  textShadow="1px 1px #000" fontWeight="bold" fontSize="20px" fontFamily="stencil" letterSpacing="1px" textAlign="center" >Create Account</Text><br/>
                <FormControl isRequired color="black">

                    <FormLabel>Enter Your Name</FormLabel>
                    <InputGroup>
                    <Input value={formdata.username} onChange={(e)=> setFormData({...formdata,username:e.target.value})} type='text' border="1px solid black" placeholder='Enter Your Full Name' required/>
                    </InputGroup><br/>

                    <FormLabel>Enter Your Email</FormLabel>
                    <InputGroup>
                    <Input value={formdata.email} onChange={(e)=> setFormData({...formdata,email:e.target.value.toLowerCase()})} type='email' border="1px solid black" placeholder='Enter Your Email' required/>
                    </InputGroup><br/>

                    <FormLabel>Enter Your Password</FormLabel>
                    <InputGroup>
                    <InputRightElement fontWeight="bold" fontSize="13px" color="blue" _hover={{cursor:"pointer"}} onClick={()=> setShow(!show)}>{show? "Hide":"Show"}</InputRightElement>
                    <Input value={formdata.pass} onChange={(e)=> setFormData({...formdata,pass:e.target.value})} border={error?"1px solid red":"1px solid black"} type={show? "text":"password"} placeholder='Enter Your Password' required/>
                    </InputGroup>
                    <FormHelperText color={error?"red":"black"}>🔒Password must be atleast 8 Characters, and contains one UpperCase, one LowerCase, One Number and One Special Chracter.</FormHelperText><br/>

                    {loading? <Button w="100%" bg="#ffa600" isLoading></Button>:<Button color="white" w="100%" bg="#ffa600" _hover={{bg:"#ffa600"}} type='submit' mb="5px">Create Account...</Button>}

                </FormControl>
                <Text color="black" textAlign="center" fontWeight="500">Registered User? <span onClick={()=> navigate("/login")} style={{color:"#ffa600",cursor:"pointer"}}>Login</span></Text>
            </form>
        </Flex>
    )
}
