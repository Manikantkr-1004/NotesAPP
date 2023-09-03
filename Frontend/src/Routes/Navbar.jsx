import React from 'react'
import {Flex, Text,Button,useToast,Box,MenuButton,Menu,MenuList,MenuItem} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'
import { NavLink } from 'react-router-dom'
import {useNavigate} from "react-router-dom"
import Cookies from "js-cookie"
import axios from "axios";


export function Navbar() {

    const navigate = useNavigate();
    const toast = useToast()
    let ram = Cookies.get('tokens')
    let kam = Cookies.get('username')

    let goodname = kam?.split(" ").map((item)=>{
        return item[0].toUpperCase()
    })


    const styles = {
        color:"#ffa600",
        textDecoration:"none",
        fontWeight:"1000",
        textShadow:"1px 1px 1px #a34900"
    }
    const styles1 = {
        color:"black",
        textDecoration:"none",
        fontWeight:"500",
    }

    const handleLoggedout = ()=>{
        axios.post("https://notesapi-s8kb.onrender.com/users/logout",{token: `${ram}`},{
            headers: {
                Authorization: `Bearer ${ram}`
            }
        })
        .then(res=>{
            toast({
                title: `${res.data.msg}`,
                position:"bottom",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
              Cookies.remove("tokens");
              Cookies.remove("username");
              window.location.reload();
        }).catch(err=>{
            console.log(err);
            toast({
                title: `${err.response.data.msg}` || `Something went Wrong, Try again!!`,
                position:"bottom",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        })
    }
    

    return (
        <Flex justifyContent="space-between" background="transparent" backdropFilter="blur(40px)" color="black" 
        position="fixed" top="0" width="100%" height="50px" alignItems="center" p={{base:"0px 10px",sm:"0px 10px",md:"0px 30px 0px 60px",lg:"0px 30px 0px 60px",xl:"0px 30px 0px 60px"}}
        boxShadow="rgba(0, 0, 0, 0.664) 0px 3px 8px" zIndex="9999">
            <Text _hover={{cursor:"pointer"}} onClick={()=> navigate("/")} fontFamily="showcard gothic" fontWeight="bold" fontSize="25px" color="#ffa600" textShadow="2px 2px #141414">Notes App</Text>
            <Flex display={{base:"none",sm:"none",md:"flex",lg:"flex",xl:"flex"}} width="450px" justifyContent="space-between" alignItems="center">
                <NavLink style={({isActive})=>{ return isActive? styles : styles1}} to="/">Home</NavLink>
                {!ram && <NavLink style={({isActive})=>{ return isActive? styles : styles1}} to="/login">Login</NavLink>}
                {!ram && <NavLink style={({isActive})=>{ return isActive? styles : styles1}} to="/signup">Signup</NavLink>}
                <NavLink style={({isActive})=>{ return isActive? styles : styles1}} to="/notes">My Notes</NavLink>
                {ram && <Text color="#ffa600" fontWeight="500">Hi, {kam}</Text>}
                {ram && <Button onClick={handleLoggedout} bg="#ffa600" color="#fff" borderBottom="1px solid black" borderRight="1px solid black" _hover={{border:"none"}} fontWeight="bold" display="block">Logout</Button>}
            </Flex>
            <Flex display={{base:"flex",sm:"flex",md:"none",lg:"none",xl:"none"}}>
            <Box>
                    <Menu>
                        <MenuButton fontWeight="bold" color="white" bg="blue" p={ram? "6px":"4px 10px 7px 10px"} borderRadius="50%">
                            {ram? goodname: <HamburgerIcon color="white" boxSize={5} />}
                        </MenuButton>
                        <MenuList>
                            {kam && <MenuItem color="blue" fontWeight="500">Hi, {kam}</MenuItem>}
                            {!kam && <MenuItem color="blue" fontWeight="500">Welcome to Notes App</MenuItem>}
                            <MenuItem fontWeight="500" onClick={()=> navigate("/")}>Home</MenuItem>
                            <MenuItem fontWeight="500" onClick={()=> navigate("/notes")}>My Notes</MenuItem>
                            {!ram && <MenuItem color="green" fontWeight="500" onClick={()=> navigate("/login")}>Login/Signup</MenuItem>}
                            {ram && <MenuItem color="red" fontWeight="500" onClick={handleLoggedout}>Logout</MenuItem>}
                        </MenuList>
                    </Menu>
                </Box>
            </Flex>
        </Flex>
    )
}
