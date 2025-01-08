import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Map from "./Map";
import { io } from "socket.io-client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"; // Date-fns adapter

const socket = io("ws://localhost:3001");

function App() {
  const [events, setEvents] = useState([]); // Array of events
  const [filterEvents, setFilterEvents] = useState([]); // Filtered events
  const [filterType, setFilterType] = useState("all"); // Current filter type
  const [dateRange, setDateRange] = useState([null, null]); // Date range filter
  const [connected, setConnected] = useState(false); // Connection status
  const mapRef = useRef(null); // Reference to the MapContainer

  // Handle new events and WebSocket connection
  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("new_event", (event) => {
      setEvents((prevEvents) => {
        const updatedEvents = [event, ...prevEvents];
        applyFilter(updatedEvents, filterType, dateRange);
        return updatedEvents;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_event");
    };
  }, [filterType, dateRange]);

  // Apply filter to events
  const applyFilter = (allEvents, type, range) => {
    const [start, end] = range;

    const filtered = allEvents.filter((event) => {
      const matchesType = type === "all" || event.type === type;
      const matchesDate =
        (!start || new Date(event.timestamp) >= start) &&
        (!end || new Date(event.timestamp) <= end);
      return matchesType && matchesDate;
    });

    setFilterEvents(filtered);
  };

  // Update filtered events when filterType or dateRange changes
  useEffect(() => {
    applyFilter(events, filterType, dateRange);
  }, [filterType, dateRange, events]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}> {/* Provide localization context */}
      <div style={{ display: "flex" }}>
        <Sidebar
          setFilterType={setFilterType}
          filterType={filterType}
          setDateRange={setDateRange}
          dateRange={dateRange}
        />
        <main style={{ marginLeft: 250, padding: 20 }}>
          <Map events={filterEvents} connected={connected} ref={mapRef} />
        </main>
      </div>
    </LocalizationProvider>
  );
}

export default App;
