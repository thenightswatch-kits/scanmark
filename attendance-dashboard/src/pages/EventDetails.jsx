import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
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
  Heading,
} from '@chakra-ui/react'
import Map, { GeolocateControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl';
import generatePDF from '../services/ReportGen';
import { Popup } from 'react-map-gl'

const EventDetails = () => {
  const { id } = useParams();
  const [date, setDate] = useState([]);
  const [longitude, setLongitude] = useState(76.7426);
  const [latitude, setLatitude] = useState(10.9378);
  const [event, setEvent] = useState([]);

  const [popupInfo, setPopupInfo] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`/api/attend?id=${id}`, {
        headers: { 'Content-Type': 'application/json' },
        mode: "cors",
        credentials: 'include'
      });
      const res = await response.json();
      const uniqueRollNumbers = new Set(); // Set to keep track of unique roll numbers
      const filteredData = res
        .filter(item => (item.rollnumber.includes('URK') || item.rollnumber.includes('PRK')) && !item.rollnumber.includes('Repeater')) // Include 'URK' and 'PRK', and exclude 'Repeater'
        .filter(item => {
          if (!uniqueRollNumbers.has(item.rollnumber)) {
            uniqueRollNumbers.add(item.rollnumber);
            return true; // Include only if the roll number is unique
          }
          return false; // Exclude if the roll number is already seen
        })
        .map(item => {
          const { _id, submitted_at, recorded_at, rollnumber, device, location, username, event_id } = item;
          const formattedRecordedAt = new Date(recorded_at).toLocaleString();
          const formattedDate = new Date(recorded_at).toLocaleDateString();
          const formattedTime = new Date(recorded_at).toLocaleTimeString();
          return {
            recorded_at: formattedRecordedAt,
            rollnumber: rollnumber.replace("]C1",""),
            deviceName: device.name,
            brand: device.brand,
            model: device.model,
            location: { latitude: location.latitude, longitude: location.longitude },
            username: username,
            event:event_id
          };
        });
      setDate(filteredData)
      console.log("Date", res);
    }
    const getEvent = async () => {
      const response = await fetch(`/api/event?id=${id}`, {
        headers: { 'Content-Type': 'application/json' },
        mode: "cors",
        credentials: 'include'
      });
      const res = await response.json();
      setEvent(res)
      console.log("Event", res);
    }
    getEvent();
    getData();
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
          <Heading>{event[0] ? event[0].name : ""}</Heading>
          <div style={{ width: '100%', height: '50vh' }}>
            <Map
              mapboxAccessToken="pk.eyJ1Ijoicm9ubWNyZWEiLCJhIjoiY2wyenk5ajg0MWs1djNqbXYyZXB0cGZncyJ9.dJZO5C3CDPXYQLJmNAZ10A"
              initialViewState={{
                longitude: longitude,
                latitude: latitude,
                zoom: 15.5,
              }}
              width='100%'
              height='100%'
              mapStyle="mapbox://styles/ronmcrea/cll7zsad500mp01pb827kdr58"
            >
              <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
              />
              {date.map((data) => (
              <>
                <Marker longitude={data.location.longitude} latitude={data.location.latitude} color="red" anchor="bottom" onClick={e => { e.originalEvent.stopPropagation(); setPopupInfo(data) }} />
              </>
              ))}
              {popupInfo && (
                <Popup
                  anchor="top"
                  longitude={popupInfo.location.longitude}
                  latitude={popupInfo.location.latitude}
                  onClose={() => setPopupInfo(null)}
                >
                  <div>
                    Register No.: {popupInfo.rollnumber}<br></br>
                    Marked by: {popupInfo.username}
                  </div>
                </Popup>
              )}
            </Map>
          </div>
          <div style={{padding:5, flex:1, justifyContent:'flex-end'}}>
          <Button onClick={()=>generatePDF(date)}>Download Report</Button>
          </div>
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Register No.</Th>
                  <Th>Date & Time</Th>
                  <Th isNumeric>Marked By</Th>
                </Tr>
              </Thead>
              <Tbody>
                {date.map((e) => (
                  <Tr>
                    <Td>{e.rollnumber}</Td>
                    <Td>{e.recorded_at}</Td>
                    <Td isNumeric>{e.username}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  )
}

export default EventDetails