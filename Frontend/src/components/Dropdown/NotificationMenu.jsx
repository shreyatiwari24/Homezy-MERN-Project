import useNotifications from "../Common/useNotifications";

const NotificationMenu = () => {

  const { notifications = [] } = useNotifications();

  return (

    <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border z-50">

      {/* Header */}

      <div className="flex justify-between items-center px-4 py-3 border-b">

        <h3 className="font-semibold">
          Notifications
        </h3>

        <button className="text-sm text-blue-600 hover:underline">
          Mark all read
        </button>

      </div>

      {/* Notifications */}

      <div className="max-h-80 overflow-y-auto">

        {notifications.length === 0 && (

          <p className="text-gray-500 text-sm p-4">
            No notifications
          </p>

        )}

        {notifications.map((n) => (

          <div
            key={n._id}
            className={`flex gap-3 p-4 border-b hover:bg-gray-50 cursor-pointer
              ${!n.isRead ? "bg-blue-50" : ""}
            `}
          >

            {/* Avatar */}

            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              N
            </div>

            {/* Content */}

            <div className="flex-1">

              <p className="text-sm font-medium">
                {n.title}
              </p>

              <p className="text-sm text-gray-600">
                {n.message}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="p-3 text-center border-t">

        <a
          href="/notifications"
          className="text-sm text-blue-600 hover:underline"
        >
          View all notifications
        </a>

      </div>

    </div>

  );

};

export default NotificationMenu;