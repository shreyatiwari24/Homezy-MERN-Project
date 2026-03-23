import useNotifications from "./useNotifications";

const Notifications = () => {

  const { notifications } = useNotifications();

  return (

    <div className="max-w-3xl mx-auto mt-28 p-6">

      <h1 className="text-2xl font-bold mb-6">
        Notifications
      </h1>

      {notifications.length === 0 && (
        <p className="text-gray-500">
          No notifications
        </p>
      )}

      {notifications.map((n) => (

        <div
          key={n._id}
          className="border-b py-4"
        >

          <h3 className="font-semibold">
            {n.title}
          </h3>

          <p className="text-gray-600">
            {n.message}
          </p>

        </div>

      ))}

    </div>

  );
};

export default Notifications;