import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

/* ===============================
   CUSTOM MARKER ICON
================================ */

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

/* ===============================
   RECENTER MAP WHEN POSITION CHANGES
================================ */

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position]);

  return null;
};

/* ===============================
   MAP CLICK HANDLER
================================ */

const MapClick = ({ setPosition, setCoords }) => {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);
      setCoords([lng, lat]);
    },
  });

  return null;
};

/* ===============================
   MAIN COMPONENT
================================ */

const MapSelector = ({ setCoords }) => {
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default Delhi

  /* ===============================
     GET CURRENT LOCATION ON LOAD
  =============================== */

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setCoords([lng, lat]);
      },
      () => {
        console.log("Using default location");
      }
    );
  }, []);

  /* ===============================
     LOCATE BUTTON
  =============================== */

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setPosition([lat, lng]);
      setCoords([lng, lat]);
    });
  };

  /* ===============================
     DRAGGABLE MARKER
  =============================== */

  const eventHandlers = {
    dragend(e) {
      const marker = e.target;
      const latlng = marker.getLatLng();

      setPosition([latlng.lat, latlng.lng]);
      setCoords([latlng.lng, latlng.lat]);
    },
  };

  return (
    <div className="relative">
      {/* LOCATE BUTTON */}
      <button
        onClick={locateMe}
        className="absolute top-3 right-3 z-[1000] bg-white shadow-md px-3 py-1 rounded-lg text-sm hover:bg-gray-100"
      >
        📍 Locate Me
      </button>

      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "400px", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RecenterMap position={position} />

        <MapClick
          setPosition={setPosition}
          setCoords={setCoords}
        />

        <Marker
          position={position}
          draggable={true}
          eventHandlers={eventHandlers}
          icon={customIcon}
        />
      </MapContainer>
    </div>
  );
};

export default MapSelector;