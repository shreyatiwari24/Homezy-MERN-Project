import { useEffect, useState } from "react";
import axios from "axios";

function CustomerSavedProviders() {

  const [providers, setProviders] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:5000/api/customer/saved-providers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => {
      setProviders(res.data.providers);
    });

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">
        Saved Providers
      </h2>

      {providers.length === 0 ? (
        <p>No saved providers</p>
      ) : (
        providers.map(provider => (

          <div
            key={provider._id}
            className="border p-4 mb-3 rounded"
          >
            <h3 className="font-semibold">
              {provider.name}
            </h3>

            <p>{provider.email}</p>

          </div>

        ))
      )}

    </div>

  );
}

export default CustomerSavedProviders;