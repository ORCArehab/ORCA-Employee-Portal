"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Phone, Navigation } from "lucide-react";
import type { FacilityPin } from "@/lib/facilityPins";

// A branded pin (navy drop with a gold center) as an inline SVG, so there's
// no dependency on Leaflet's default marker images, which bundlers don't
// resolve automatically.
const pinIcon = L.divIcon({
  className: "",
  html: `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10.2 12.2 22.6 13.3 23.7a1 1 0 0 0 1.4 0C15.8 36.6 28 24.2 28 14 28 6.3 21.7 0 14 0z" fill="#0f2a4a"/>
    <circle cx="14" cy="14" r="6" fill="#f2b705"/>
  </svg>`,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -34],
});

function FitBounds({ pins }: { pins: FacilityPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length === 0) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
  }, [map, pins]);
  return null;
}

function directionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function FacilityMap({ pins }: { pins: FacilityPin[] }) {
  if (pins.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-2xl border border-border bg-surface text-sm text-muted-foreground">
        No facility locations could be mapped right now.
      </div>
    );
  }

  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-border shadow-sm sm:h-[480px]">
      <MapContainer
        center={[pins[0].lat, pins[0].lng]}
        zoom={10}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds pins={pins} />
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
            <Popup>
              <div className="min-w-[180px]">
                <p className="text-sm font-semibold text-orca-navy-900">{pin.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{pin.address}</p>
                <div className="mt-2 flex flex-col gap-1 text-xs">
                  {pin.phone ? (
                    <a href={`tel:${pin.phone}`} className="inline-flex items-center gap-1 text-orca-navy-700 hover:text-orca-navy-900">
                      <Phone className="h-3 w-3" aria-hidden="true" /> {pin.phone}
                    </a>
                  ) : null}
                  <a
                    href={directionsUrl(pin.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orca-navy-700 hover:text-orca-navy-900"
                  >
                    <Navigation className="h-3 w-3" aria-hidden="true" /> Get directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
