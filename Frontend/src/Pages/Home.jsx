import { Flex, Image, Text ,Button} from '@chakra-ui/react'
import React from 'react'
import {useNavigate} from "react-router-dom"
import notes from "../Pages/notes.gif"
import { useEffect } from 'react';
import wallpaper from "../Pages/notes_wallpaper.jpg"

export function Home() {

    const navigate = useNavigate();
    useEffect(()=>{
        document.body.style.backgroundImage = `url(${wallpaper})`;
        document.body.style.backgroundRepeat = "no-repeat"
        document.body.style.backgroundSize = "cover"
    },[])
    
    return (
        <Flex display="block" w={{base:"90%",sm:"80%",md:"400px",lg:"400px",xl:"400px"}} m="auto" mt="130px" mb="40px">
                <Text mb="0px" fontFamily="jokerman" fontSize="40px" textAlign="center" fontWeight="bold">This is Notes App</Text>
                <Text mt="15px" fontFamily="GillSans-Bold" fontSize="20px" textAlign="center">Create & Save Your Notes</Text>
                <Image w="50%" m="auto" display="block" src={notes} alt="notes" />
                <Button onClick={()=> navigate("/notes")} _hover={{bg:"#FC9D93",color:"#F03F42"}} boxShadow="#313131 0px 3px 8px" w="95%" display="block" margin="auto" fontWeight="bold" color="#fff" bg="#ff5a48" border="none" p="10px 0px">See Your Notes...</Button>
        </Flex>
        
    )
}
