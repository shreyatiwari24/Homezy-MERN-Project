import { useEffect, useState } from "react";
import API from "../../../api/axios";

function CustomerSavedProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedProviders();
  }, []);

  const fetchSavedProviders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/customer/saved-providers");
      setProviders(res.data.providers || res.data || []);
    } catch (err) {
      console.error("Failed to fetch saved providers", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading saved providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-blue-400 to-blue-500" />
        <div className="relative mt-2">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">Saved Providers</h1>
          <p className="text-gray-500 text-sm">Your favorite service professionals in one place.</p>
        </div>
      </div>

      {/* ── PROVIDERS LIST ── */}
      {providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-gray-600 font-bold">No saved providers</p>
          <p className="text-gray-400 text-sm mt-1">You haven't saved any professionals yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-orange-200 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ background: "linear-gradient(135deg, #F97316, #3B82F6)" }}>
                {provider.name?.[0]?.toUpperCase() || "P"}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {provider.name}
                </h3>
                <p className="text-sm text-gray-500">{provider.email}</p>
                {provider.profile?.category && (
                   <span className="inline-block mt-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-600">
                     {provider.profile.category}
                   </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default CustomerSavedProviders;