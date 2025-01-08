import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Map from "./Map";
import { io } from "socket.io-client";
import L from "leaflet"; // Import Leaflet to define custom icons

// Define icons for connection types
const wifiIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/18608/18608742.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const cellularIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/13304/13304074.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const bluetoothIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2778/2778576.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const iconsMap = {
  wifi: wifiIcon,
  cellular: cellularIcon,
  bluetooth: bluetoothIcon,
};

const socket = io("ws://localhost:3001");

function App() {
  const [events, setEvents] = useState([]); // Array of events
  const [connected, setConnected] = useState(false); // Connection status
  const [filterType, setFilterType] = useState("all"); // Current filter type
  const mapRef = useRef(null); // Reference to the Map component

  // Filtered events based on filter type
  const filteredEvents = events.filter((event) =>
    filterType === "all" ? true : event.connection_type === filterType
  );

  // Initialize WebSocket listeners
  useEffect(() => {
    const handleNewEvent = (event) => {
      event.icon = iconsMap[event.connection_type] || wifiIcon; // Default to wifiIcon if type is unknown
      setEvents((prevEvents) => {
        const updatedEvents = [event, ...prevEvents];
        // Automatically focus the map on the new event
        if (mapRef.current) {
          const { latitude, longitude } = event;
          mapRef.current.flyTo([latitude, longitude], 13);
        }
        return updatedEvents;
      });
    };

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("new_event", handleNewEvent);
    socket.on("connection_status", (status) => console.log("Connection Status: ", status));

    // Cleanup socket listeners
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_event", handleNewEvent);
      socket.off("connection_status");
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setFilterType={setFilterType} filterType={filterType} />
      <main style={{ marginLeft: 250, padding: 20 }}>
        <Map events={filteredEvents} connected={connected} ref={mapRef} />
      </main>
    </div>
  );
}

export default App;
