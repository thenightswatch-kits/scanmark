import React, { useState } from 'react';
import {
  ChakraProvider,
  Input,
  Flex,
  Image,
  Card,
  CardBody,
  Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router'
import LOGO from './Emblem.png'
import axios from 'axios';

function Login() {

    const navigate = useNavigate()

    const [username, setName] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (event) => {
      //   const response = await axios.post('http://mobi.karunya.edu/api/auth/login',{username: username, password: password},{
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept',
      //     'Access-Control-Allow-Origin' : '*',
      //     'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      //   },
      //   withCredentials: true
      // })
      const response = await fetch(`/api/auth/login`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({username: username, password: password}),
        mode: "cors",
        credentials: 'include', 
      });
      const res = await response.json();
      console.log(response)
      navigate(0)
      };

  return (
    <ChakraProvider>
          <Flex h="100vh" bg='teal' align="center">
          <Card maxW='md' mx="auto" p={2}  align='center' >
            <CardBody align='center'>
                <Image src={LOGO} alt='logo'/>
                <Input type='text' placeholder='Username' my={2} onChange={(e)=>{setName(e.target.value)}}/>
                <Input type='password' placeholder='Password' my={2} onChange={(e)=>{setPassword(e.target.value)}}/>
                <Button colorScheme='teal' size='md' my={2} onClick={handleSubmit}>Login</Button>
            </CardBody>
          </Card>
          </Flex>
        </ChakraProvider>
  );
}

export default Login;