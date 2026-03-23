import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../api/axios";

const SubCategoryPage = () => {

  const { category } = useParams();
  const navigate = useNavigate();

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchSubCategories = async () => {

      try {

        setLoading(true);

        const res = await API.get(`/categories/${category}/subcategories`);

        setSubcategories(res.data || []);

      } catch (error) {

        console.error("Error fetching subcategories:", error);

      } finally {

        setLoading(false);

      }

    };

    if (category) {
      fetchSubCategories();
    }

  }, [category]);

  return (

    <div className="pt-32 px-10 min-h-screen bg-gray-50">

      {/* Title */}

      <h1 className="text-3xl font-bold capitalize mb-10">
        {category} Services
      </h1>

      {/* Loading */}

      {loading && (
        <p className="text-gray-500">Loading subcategories...</p>
      )}

      {/* No Data */}

      {!loading && subcategories.length === 0 && (
        <p className="text-gray-500">No subcategories found</p>
      )}

      {/* Grid */}

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

        {subcategories.map((sub) => (

          <div
            key={sub._id}
            onClick={() =>
              navigate(`/services/${category}?subcategory=${sub.slug}`)
            }
            className="bg-white p-8 rounded-xl shadow hover:shadow-xl cursor-pointer transition hover:-translate-y-1"
          >

            <h3 className="text-lg font-semibold">
              {sub.name}
            </h3>

          </div>

        ))}

      </div>

    </div>
  );

};

export default SubCategoryPage;