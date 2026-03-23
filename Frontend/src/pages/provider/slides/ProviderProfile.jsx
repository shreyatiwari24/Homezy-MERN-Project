import { useEffect, useState } from "react";
import API from "../../../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ProviderProfile = () => {

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH PROFILE
  =============================== */

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const res =
        await API.get("/provider/profile");

      setProfile(res.data.profile);

    } catch (err) {

      toast.error(
        "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     INPUT CHANGE
  =============================== */

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]:
        e.target.value,
    });

  };

  /* ===============================
     UPDATE PROFILE
  =============================== */

  const updateProfile = async () => {

    try {

      const res =
        await API.put(
          "/provider",
          profile
        );

      setProfile(
        res.data.profile
      );

      toast.success(
        "Profile Updated"
      );

      setEditing(false);

    } catch (err) {

      toast.error(
        "Update failed"
      );

    }

  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <p className="p-8">
        Profile not found
      </p>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Provider Profile
        </h1>

        <button
          onClick={() =>
            setEditing(!editing)
          }
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          {editing
            ? "Cancel"
            : "Edit Profile"}
        </button>

      </div>

      {/* PROFILE CARD */}

      <motion.div
        className="
        bg-white
        rounded-3xl
        shadow
        p-8
        space-y-6
        "
      >

        {/* USER INFO */}

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            label="Name"
            name="name"
            value={
              profile.user?.name
            }
            editing={editing}
            onChange={handleChange}
          />

          <Input
            label="Email"
            value={
              profile.user?.email
            }
          />

          <Input
            label="Phone"
            name="phone"
            value={profile.phone}
            editing={editing}
            onChange={handleChange}
          />

          <Input
            label="Category"
            name="category"
            value={
              profile.category
            }
            editing={editing}
            onChange={handleChange}
          />

          <Input
            label="Experience"
            name="experience"
            value={
              profile.experience
            }
            editing={editing}
            onChange={handleChange}
          />

          <Input
            label="Service Rate"
            name="rate"
            value={profile.rate}
            editing={editing}
            onChange={handleChange}
          />

          <Input
            label="City"
            name="city"
            value={profile.city}
            editing={editing}
            onChange={handleChange}
          />

        </div>

        {/* BIO */}

        <div>

          <label className="text-sm text-gray-500">
            Bio
          </label>

          {editing ? (

            <textarea
              name="bio"
              value={
                profile.bio || ""
              }
              onChange={
                handleChange
              }
              className="w-full border rounded-lg p-3 mt-2"
            />

          ) : (

            <p className="mt-2">
              {profile.bio ||
                "No bio added"}
            </p>

          )}

        </div>

        {/* SAVE BUTTON */}

        {editing && (

          <button
            onClick={updateProfile}
            className="
            bg-green-600
            text-white
            px-6
            py-3
            rounded-lg
            "
          >
            Save Changes
          </button>

        )}

      </motion.div>

    </div>
  );
};

/* ===============================
   INPUT COMPONENT
================================ */

const Input = ({
  label,
  value,
  name,
  editing,
  onChange,
}) => (

  <div>

    <label className="text-sm text-gray-500">
      {label}
    </label>

    {editing && name ? (

      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded-lg p-3 mt-1"
      />

    ) : (

      <p className="mt-2 font-medium">
        {value || "—"}
      </p>

    )}

  </div>

);

export default ProviderProfile;