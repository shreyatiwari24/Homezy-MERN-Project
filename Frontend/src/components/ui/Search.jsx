import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Search() {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  const search = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    axios.get("http://localhost:5000/api/services")
      .then((res) => {
        setServices(res.data);
      });
  }, []);

  useEffect(() => {
    const results = services.filter(service =>
      service.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredServices(results);
  }, [search, services]);

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">
        Search Results for "{search}"
      </h2>

      {filteredServices.length === 0 ? (
        <p>No services found</p>
      ) : (
        filteredServices.map((service) => (
          <div key={service._id} className="border p-3 mb-3 rounded">
            {service.name}
          </div>
        ))
      )}

    </div>
  );
}

export default Search;