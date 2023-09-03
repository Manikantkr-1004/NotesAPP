import React, { useEffect, useState } from 'react'
import {Flex,Box, FormControl, InputGroup, Input,Button, SimpleGrid,Text, Textarea,Spinner, FormLabel, useToast, useDisclosure} from "@chakra-ui/react"
import { useSelector,useDispatch } from "react-redux";
import { notescreate, notesdelete, notesget, notesupdate } from '../Redux/NotesData/action';
import Cookies from "js-cookie"
import { NOTES_CREATE_SUCCESS, NOTES_DELETE_SUCCESS, NOTES_FAIL, NOTES_UPDATE_SUCCESS } from '../Redux/actionTypes';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
  import wallpaper from "../Pages/notes_wallpaper.jpg"

export function Notes() {

    const notesdata = useSelector((store)=> store.notesReducer.data);
    const loading = useSelector((store)=> store.notesReducer.loading);
    const create_loading = useSelector((store)=> store.notesReducer.create_loading);
    const update_loading = useSelector((store)=> store.notesReducer.update_loading);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const dispatch = useDispatch();
    const toast = useToast()
    let ram = Cookies.get('tokens');
    const [formdata,setFormdata] = useState({title:"",body:""});
    const [first,setFirst] = useState("");
    const [second,setSecond] = useState("")
    const [updateID,setUpdateID] = useState(0)

    useEffect(()=>{
        dispatch(notesget(ram));
        document.body.style.backgroundImage = `url(${wallpaper})`;
        document.body.style.backgroundRepeat = "no-repeat"
        document.body.style.backgroundSize = "cover"
    },[])

    const lightColors = ['#ff9999', '#d8ffac', '#abffdc', '#b6d6ff', '#e3b3ff6a', '#fcdc97', '#ff89ba'];

    const handleSubmit = (e)=>{
        e.preventDefault();

        dispatch(notescreate(formdata,ram)).then(res=>{
            dispatch({type:NOTES_CREATE_SUCCESS})
            toast({
                //title:"Notes has been created",
                title: `${res.data.msg}`,
                position:"bottom",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
              dispatch(notesget(ram))
              setFormdata({title:"",body:""})
        }).catch(err=>{
            dispatch({type:NOTES_FAIL})
            toast({
                // title:"Something went wrong!!",
                title: `${err.response.data.msg}`,
                position:"bottom",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        })
    }

    const handleDelete = (id)=>{
        dispatch(notesdelete(id,ram)).then((res)=>{
            dispatch({type:NOTES_DELETE_SUCCESS})
            toast({
                title: `${res.data.msg}`,
                position:"bottom",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
              dispatch(notesget(ram))
        }).catch((err)=>{
            dispatch({type:NOTES_FAIL})
            toast({
                title: `${err.response.data.msg}`,
                position:"bottom",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
        })
    }

    const openModaltoUpdate= (id)=>{
        let note = notesdata.find((item)=> item._id === id);
        setFirst(note.title);
        setSecond(note.body);
        setUpdateID(id)
        onOpen();
    }

    const handleUpdate = (updateID)=>{
        let data = {
            title : first,
            body: second
        }
        dispatch(notesupdate(data,updateID,ram)).then((res)=>{
            dispatch({type: NOTES_UPDATE_SUCCESS});
            onClose()
            toast({
                title: `${res.data.msg}`,
                position:"bottom",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
              dispatch(notesget(ram))
        }).catch((err)=>{
            dispatch({type:NOTES_FAIL})
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
        <Flex w="100%" display="block" mt="90px">

            <Text textAlign="center" fontWeight="bold" fontSize="24px" textShadow="1px 1px #fff" fontFamily="forte" mb="20px">Your All Notes</Text>

            {loading? <Box w="50px" m="auto" mt="150px" mb="150px">
                <Spinner
                thickness='4px'
                speed='0.65s'
                color='#ffa600'
                size='xl'
                />
            </Box> : 
            <SimpleGrid w="90%" m="auto" columns={{base:1,sm:2,md:3,lg:4,xl:4}} color="black" gap="20px">
            <Box bg="#ffe9ad" p="20px" borderRadius="10px" border="3px solid #ffbb00">
                <form onSubmit={handleSubmit}>
                    <FormControl>

                        <InputGroup>
                        <Input value={formdata.title} onChange={(e)=> setFormdata({...formdata,title:e.target.value})} border="1px solid black" type='text' placeholder="Enter Your Title" required/>
                        </InputGroup><br/>

                        <InputGroup>
                        <Textarea value={formdata.body} onChange={(e)=> setFormdata({...formdata,body:e.target.value})} border="1px solid black" type='text' placeholder="Enter Your Notes" required/>
                        </InputGroup><br/>

                        {create_loading? <Button _hover={{bg:"black"}} w="100%" bg="black" isLoading></Button> : <button style={{width:"100%"}} className='create'>Create New Notes...</button>}
                    </FormControl>
                </form>
            </Box>
            {
                notesdata?.map((item,index)=>(
                    <Box className='border' bg={lightColors[index%7]} p="20px" borderRadius="10px" border="2px dashed black">

                               <Input bg="none" border="none" outline="none" focusBorderColor="transparent" value={item.title} /><br/><br/>
                               <Textarea bg="none" border="none" outline="none" focusBorderColor="transparent" value={item.body} /><br/><br/>

                                <Flex w="97%" m="auto" justifyContent="space-between">
                                    <button onClick={()=> openModaltoUpdate(item._id)} className='button'>UPDATE</button>
                                    <button onClick={()=> handleDelete(item._id)} className='button'>DELETE</button>
                                </Flex>
                    </Box>
                ))
            }
            </SimpleGrid>}

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="xs"
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Update Note...</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input value={first} onChange={(e)=> setFirst(e.target.value)} required/>
                    </FormControl>

                    <FormControl mt={4}>
                    <FormLabel>Notes</FormLabel>
                    <Textarea value={second} onChange={(e)=> setSecond(e.target.value)} required/>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    {update_loading? <Button w="60%" colorScheme='blue' isLoading></Button> : <Button type='submit' onClick={()=> handleUpdate(updateID)} colorScheme='blue' mr={3}>
                    Confrim Update
                    </Button>}
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>

        </Flex>
    )
}
