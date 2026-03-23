import { useState, useContext } from "react";
import MapSelector from "./MapSelector";
import { LocationContext } from "../../context/LocationContext";

const LocationModal = ({ close, onConfirm }) => {

  const { updateLocation } = useContext(LocationContext);

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  /* ================= GEO DETECT ================= */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords([lng, lat]);
        await fetchAddress(lat, lng);
        setLoading(false);
      },
      () => {
        alert("Location access denied");
        setLoading(false);
      }
    );
  };

  /* ================= REVERSE GEOCODE ================= */
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setAddress({
        city:
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "",
        area:
          data.address.suburb ||
          data.address.neighbourhood ||
          data.address.county ||
          data.address.state_district ||
          data.address.state ||
          "Unknown Area",
        pincode: data.address.postcode || ""
      });
    } catch (err) {
      console.error("Reverse geocode error:", err);
    }
  };

  /* ================= SEARCH ================= */
  const searchLocation = async (value) => {
    setQuery(value);
    if (!value) { setResults([]); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const selectSearchResult = async (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setCoords([lng, lat]);
    setResults([]);
    setQuery(place.display_name);
    await fetchAddress(lat, lng);
  };

  /* ================= CONFIRM ================= */
  const handleConfirm = () => {
    if (!coords || coords.length !== 2) {
      alert("Please select a location on the map first");
      return;
    }

    const [lng, lat] = coords;

    const locationData = {
      coordinates: [lng, lat],
      lng,                        // ✅ explicit fields for easy reading
      lat,
      city:    address?.city    || "",
      area:    address?.area    || "",
      pincode: address?.pincode || ""
    };

    // ✅ 1. Write to localStorage (for page refresh recovery)
    localStorage.setItem("location", JSON.stringify(locationData));

    // ✅ 2. Update context (for other parts of the app that use it)
    updateLocation(locationData);

    // ✅ 3. Pass data directly to parent via callback — zero async timing issues
    if (onConfirm) onConfirm(locationData);

    close();
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📍 Select Location</h2>
          <button onClick={close} className="text-gray-500 hover:text-black text-xl">✕</button>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search area, city..."
            value={query}
            onChange={(e) => searchLocation(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm"
          />
          {results.length > 0 && (
            <div className="absolute bg-white border w-full mt-1 rounded-lg max-h-48 overflow-y-auto shadow-lg z-10">
              {results.map((r, i) => (
                <div
                  key={i}
                  onClick={() => selectSearchResult(r)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                >
                  {r.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DETECT BUTTON */}
        <button
          onClick={detectLocation}
          disabled={loading}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Detecting…" : "📍 Use Current Location"}
        </button>

        {/* MAP */}
        <div className="mt-4 rounded-xl overflow-hidden border">
          <MapSelector
            setCoords={async (c) => {
              setCoords(c);
              await fetchAddress(c[1], c[0]);
            }}
          />
        </div>

        {/* ADDRESS PREVIEW */}
        {address && (
          <div className="mt-3 text-sm text-gray-700 bg-green-50 border border-green-200 p-3 rounded-lg">
            ✓ {address.area}, {address.city} — {address.pincode}
          </div>
        )}

        {/* CONFIRM */}
        <button
          onClick={handleConfirm}
          disabled={!coords}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          ✓ Confirm Location
        </button>

      </div>
    </div>
  );
};

export default LocationModal;