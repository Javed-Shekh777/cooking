import { useDispatch, useSelector } from "react-redux";
import { fetchDeleteRequests, updateDeleteRequestStatus } from "../../features/recipeSlice";
import { useEffect } from "react";

const AdminDeleteRequests = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((s) => s.recipe);

  useEffect(() => {
    dispatch(fetchDeleteRequests());
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Delete Requests</h2>

      {requests.map((req) => (
        <div
          key={req._id}
          className="border p-4 rounded mb-3 flex justify-between"
        >
          <div>
            <p className="font-semibold">{req.itemType}</p>

            <p className="text-sm text-gray-600">{req.reason}</p>

            <p className="text-xs text-gray-400">
              Requested by: {req.requestedBy.username}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                dispatch(updateDeleteRequestStatus({
                  requestId: req._id,
                  status: "APPROVED"
                }))
              }
              className="bg-green-600 h-[35px] text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() =>
                dispatch(updateDeleteRequestStatus({
                  requestId: req._id,
                  status: "REJECTED"
                }))
              }
              className="bg-red-600 h-[35px] text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


export default AdminDeleteRequests;