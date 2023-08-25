import React, { useState, useRef, useEffect } from 'react'
import Map, { GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const AttendanceMap = () => {

    return (
        <div style={{ width: '50vw', height: '50vh' }}>
            <Map
                mapboxAccessToken="pk.eyJ1Ijoicm9ubWNyZWEiLCJhIjoiY2wyenk5ajg0MWs1djNqbXYyZXB0cGZncyJ9.dJZO5C3CDPXYQLJmNAZ10A"
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 3.5,
                }}
                mapStyle="mapbox://styles/ronmcrea/cll7zsad500mp01pb827kdr58"
            >
                <GeolocateControl
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                />
            </Map>
        </div>
    )
}

export default AttendanceMap