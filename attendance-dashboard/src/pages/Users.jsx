import React, { useState, useEffect } from 'react'
import { SidebarWithHeader } from '../components/Sidebar'

import { SidebarContent, MobileNav } from '../components/Sidebar'
import {
    Box,
    useColorModeValue,
    Drawer,
    DrawerContent,
    useDisclosure,
    Table,
    TableContainer,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    FormControl,
    FormLabel,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Users = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const disclosure2 = useDisclosure();

    const navigate = useNavigate()

    const [user, setUser] = useState([]);
    const [username, setUsername] = useState();
    const [name, setName] = useState();
    const [pass, setPass] = useState();

    const handleCreate = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: "cors",
            withCredentials: 'true',
            body: JSON.stringify({
                username: username,
                name: name,
                password: pass,
            })
        });
        console.log(response)

        navigate(0)
    };
    const handleDelete = async (username) => {
        const response = await fetch('/api/auth/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: "cors",
            withCredentials: 'true',
            body: JSON.stringify({
                username: username,
            })
        });
        navigate(0)
    };

    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch('/api/auth', {
                headers: { 'Content-Type': 'application/json' },
                mode: "cors",
                withCredentials: 'true',
            });
            const res = await response.json();
            setUser(res)
            console.log(res)
        }
        getUsers();
    }, [])

    return (
        <div>
            <Box minH="100vh" bg={useColorModeValue('white.100', 'white.900')}>
                <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full">
                    <DrawerContent>
                        <SidebarContent onClose={onClose} />
                    </DrawerContent>
                </Drawer>
                {/* mobilenav */}
                <MobileNav onOpen={onOpen} />
                <Box ml={{ base: 0, md: 60 }} p="4">
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Register No.</Th>
                                    <Th isNumeric width='5%'></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {user.map((data) => (
                                    <Tr>
                                        <Td>{data.name}</Td>
                                        <Td>{data.username}</Td>
                                        <Td isNumeric><Button colorScheme='red' onClick={()=>{handleDelete(data.username)}}>Delete</Button></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Box position="fixed" bottom={7} right={7} zIndex={10}>
                <Button colorScheme="blue" size="lg" boxShadow="lg" onClick={disclosure2.onOpen}>
                    + Add User
                </Button>
            </Box>
            <Modal isOpen={disclosure2.isOpen} onClose={disclosure2.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Register No.</FormLabel>
                            <Input placeholder='First name' onChange={(e) => { setUsername(e.target.value) }} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Name</FormLabel>
                            <Input placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input placeholder='Password' onChange={(e) => { setPass(e.target.value) }} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreate}>
                            Create
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Users