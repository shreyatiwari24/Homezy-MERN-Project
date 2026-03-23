import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [location, setLocation] = useState(null);
  const [needsLocation, setNeedsLocation] = useState(false);

  /* ================= HELPERS ================= */

  const isCustomer = user?.roles?.includes("customer");

  // ✅ provider during REGISTRATION has no user yet — treat as allowed
  const isProvider = user?.roles?.includes("provider");

  const isValidLocation = (loc) => {
    return (
      loc &&
      (
        (Array.isArray(loc.coordinates) && loc.coordinates.length === 2) ||
        (typeof loc.pincode === "string" && loc.pincode.trim() !== "")
      )
    );
  };

  /* ================= LOAD LOCATION ================= */

  useEffect(() => {
    if (!user) {
      setLocation(null);
      setNeedsLocation(false);
      return;
    }

    if (isCustomer) {
      try {
        const stored = localStorage.getItem("location");

        if (stored) {
          const parsed = JSON.parse(stored);

          if (isValidLocation(parsed)) {
            setLocation(parsed);
            setNeedsLocation(false);
          } else {
            localStorage.removeItem("location");
            setNeedsLocation(true);
          }
        } else {
          setNeedsLocation(true);
        }

      } catch (error) {
        console.error("Location parse error:", error);
        localStorage.removeItem("location");
        setNeedsLocation(true);
      }

    } else {
      // provider/admin → no persistent location needed in context
      setLocation(null);
      setNeedsLocation(false);
    }

  }, [user]);

  /* ================= UPDATE LOCATION ================= */

  const updateLocation = (loc) => {

    // ✅ FIX: Allow providers AND unauthenticated users (registration flow)
    // Old code blocked anyone who wasn't a customer — breaking provider registration
    if (user && !isCustomer && !isProvider) return;

    if (!isValidLocation(loc)) {
      console.warn("Invalid location format:", loc);
      return;
    }

    const cleanLocation = {
      coordinates: loc.coordinates || null,
      lng:     loc.lng     || (loc.coordinates?.[0] ?? null), // ✅ preserve lng/lat
      lat:     loc.lat     || (loc.coordinates?.[1] ?? null), // ✅ so ProviderRegister can read them
      pincode: loc.pincode || "",
      city:    loc.city    || "",
      area:    loc.area    || ""
    };

    setLocation(cleanLocation);

    localStorage.setItem("location", JSON.stringify(cleanLocation));
window.dispatchEvent(new Event("locationChanged"));
    setNeedsLocation(false);

    // trigger refresh for services
    
  };

  /* ================= CLEAR LOCATION ================= */

  const clearLocation = () => {
    setLocation(null);
    localStorage.removeItem("location");
    localStorage.removeItem("locationPromptShown");
    setNeedsLocation(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        updateLocation,
        needsLocation,
        clearLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};