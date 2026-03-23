import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProviderEditService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:5000/api/services/my-services`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const service = res.data.find((s) => s._id === id);

    if (service) {
      setForm({
        name: service.name,
        description: service.description,
        price: service.price
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.patch(
      `http://localhost:5000/api/services/${id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Service updated. It may require re-approval.");
    navigate("/provider/services");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Edit Service</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default ProviderEditService;
