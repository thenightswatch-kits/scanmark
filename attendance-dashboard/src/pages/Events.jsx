import React, { useEffect, useState } from 'react'
import { SidebarContent, MobileNav } from '../components/Sidebar'
import {
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Tfoot,
  Td,
  Box,
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


const Events = () => {


  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const disclosure2 = useDisclosure();

  const handleCreate = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: "cors",
      withCredentials: 'true',
      body: JSON.stringify({
        name: name,
        description: desc,
        active: true
      })
    });
    console.log(response)

    navigate(0)
  };

  const [evnt, setEvents] = useState([]);
  const navigate = useNavigate();

  const handleView = (data) => {
    navigate(`/event-details/${data.id}`)
  };

  const handleStatus = async(data) => {
    console.log(data)
    const response = await fetch('/api/event/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: "cors",
      withCredentials: 'true',
      body: JSON.stringify({
        id: data.id,
      })
    });
    console.log(response)
    navigate(0)
  }

  useEffect(() => {
    const getEvents = async () => {
      const response = await fetch('/api/event', {
        headers: { 'Content-Type': 'application/json' },
        mode: "cors",
        credentials: 'include',
      });
      const res = await response.json();
      setEvents(res)
      console.log(res)
    }
    getEvents();
  }, [])

  const { isOpen, onOpen, onClose } = useDisclosure()

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
                  <Th>Event Name</Th>
                  <Th>Description</Th>
                  <Th isNumeric width='5%'></Th>
                  <Th isNumeric width='5%'></Th>
                </Tr>
              </Thead>
              <Tbody>
                {evnt.slice().reverse().map((data) => (
                  <Tr>
                    <Td>{data.name}</Td>
                    <Td>{data.description}</Td>
                    <Td isNumeric>{data.active ? <Button colorScheme='red' variant='outline' onClick={()=>handleStatus(data)}>Stop</Button> : <Button colorScheme='blue' variant='outline' onClick={()=>handleStatus(data)}>Start</Button>}</Td>
                    <Td isNumeric><Button colorScheme='blue' onClick={() => handleView(data)}>View</Button></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box position="fixed" bottom={7} right={7} zIndex={10}>
        <Button colorScheme="blue" size="lg" boxShadow="lg" onClick={disclosure2.onOpen}>
          + Create Event
        </Button>
      </Box>
      <Modal isOpen={disclosure2.isOpen} onClose={disclosure2.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Name</FormLabel>
              <Input placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input placeholder='Description' onChange={(e) => { setDesc(e.target.value) }} />
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

export default Events