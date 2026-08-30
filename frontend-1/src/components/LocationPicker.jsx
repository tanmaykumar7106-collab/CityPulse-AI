import { useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

function LocationMarker({ position, onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return position ? <Marker position={position} /> : null;
}

function LocationPicker({ value, onChange }) {
  const defaultPosition = [25.4358, 81.8463];

  const markerPosition = value
    ? [value.latitude, value.longitude]
    : null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#062452]">
            Select Complaint Location
          </h3>

          <p className="text-sm text-slate-500">
            Click on the map to mark where the issue occurred.
          </p>
        </div>

        {value && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Location Selected
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={defaultPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="h-[350px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            position={markerPosition}
            onLocationSelect={onChange}
          />
        </MapContainer>
      </div>

      {value && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          <span className="font-medium">Latitude:</span>{" "}
          {value.latitude.toFixed(6)}

          <span className="ml-4 font-medium">
            Longitude:
          </span>{" "}
          {value.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
}

export default LocationPicker;