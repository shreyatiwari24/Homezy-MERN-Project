const BookingTabs = ({ filter, setFilter }) => {
  const tabs = ["all", "pending", "accepted", "rejected", "completed"];

  return (
   <div className="flex gap-3">
      {tabs.map((tab) => (
        <button
          type="button"   
          key={tab}
          onClick={() => setFilter(tab)}
          className={`px-4 py-2 rounded-lg capitalize ${
            filter === tab
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default BookingTabs;
