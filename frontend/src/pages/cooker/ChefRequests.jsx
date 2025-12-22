import { useDispatch, useSelector } from "react-redux";
import { getAllRequests } from "../../features/adminSlice";
import { useEffect } from "react";

const ChefRequests = () => {
    const dispatch = useDispatch();
    const { requests } = useSelector((s) => s.admin);

    console.log("All reuest", requests);
    useEffect(() => {
        dispatch(getAllRequests());
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Requests</h2>

            {requests.map((req) => (
                <div
                    key={req._id}
                    className="border p-4 rounded mb-3 flex justify-between"
                >
                    <div>
                        <p className="font-semibold">{req.itemType}</p>

                        <p className="text-sm text-gray-600">{req.reason}</p>


                    </div>

                    <button

                        className={`${req?.status ==="APPROVED"?"bg-green-600":"bg-yellow-600"} h-[35px] text-white px-3 py-1 rounded`}
                    >
                        {req.status}
                    </button>


                </div>
            ))}
        </div>
    );
};


export default ChefRequests;


