import { useDispatch, useSelector } from "react-redux";
import { updateDeleteRequestStatus } from "../../features/recipeSlice";
import { useEffect } from "react";
import { getAllRequests, rejectRequest, approveRequest } from "../../features/adminSlice";
import { useState } from "react";
import toast from 'react-hot-toast'




const AdminAllRquests = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((s) => s.admin);

  console.log("All reuest", requests);
  useEffect(() => {
    dispatch(getAllRequests());
  }, []);

  const [search, setSearch] = useState("");
  const [itemTypeFilter, setitemTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filtering logic
  const filteredRequest = requests.filter((req) => {
    const matchesSearch = req.requestedBy?.username.toLowerCase().includes(search.toLowerCase())

    const matchesItemType = itemTypeFilter ? req.itemType === itemTypeFilter : true;
    const matchesStatus =
      statusFilter !== ""
        ? req.status === (statusFilter === "true")
        : true;

    return matchesSearch && matchesItemType && matchesStatus;
  });

  const requestChange = async (id, status, type,approve) => {
    try {

      let res;

      if (status === "REJECTED") {
        res = await dispatch(
          rejectRequest(id)
        ).unwrap();
      }

      if (status === "APPROVED") {
        res = await dispatch(
          approveRequest({ id, type,approve })
        ).unwrap();
      }




      toast.success(res?.message || "Status Changed");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };



  return (
    <div className="p-3">
      <h2 className="text-2xl font-bold mb-4">Delete Requests</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, username, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={itemTypeFilter}
          onChange={(e) => setitemTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Type</option>
          <option value="RECIPE">Recipe</option>
          <option value="CATEGORY">Category</option>
          <option value="USER">User</option>
        </select>



        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">All</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {filteredRequest.map((req) => (
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

          {req?.status === "PENDING" ? (
            <div className="flex gap-2">
              <button
                onClick={() => requestChange(req.itemId, "APPROVED", req?.itemType,true)}
                className="bg-green-600 h-[35px] text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => requestChange(req._id, "REJECTED")}
                className="bg-red-600 h-[35px] text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          ) : req?.status === "APPROVED" ? (
            <button
              type="button"
              className="bg-green-600 h-[35px] text-white px-3 py-1 rounded"
            >
              Approved
            </button>
          ) : req?.status === "REJECTED" ? (
            <button
              type="button"
              className="bg-red-600 h-[35px] text-white px-3 py-1 rounded"
            >
              Rejected
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};


export default AdminAllRquests;