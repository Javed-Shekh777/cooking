import { useState } from "react";
import { useDispatch } from "react-redux";
import { requestDelete } from "../features/recipeSlice";
import toast from "react-hot-toast";

export default function DeletionRequestForm({ onClose, id, type = "" }) {
    const [itemId, setItemId] = useState(id || null);
    const [itemType, setItemType] = useState(type || "RECIPE");
    const [reason, setReason] = useState("");
    const [formError, sertFormError] = useState({ name: "", value: "" });
    const dispatch = useDispatch();

    const submitHanlder = async (e) => {
        e.preventDefault();

        if (!itemId) return onClose();
        if (!itemType) return onClose();
        if (!reason) return sertFormError({ name: "reason", value: "Message is requred." });

        try {
            const res = await dispatch(
                requestDelete({
                    id: itemId,
                    itemType,
                    reason
                })
            ).unwrap();
            onClose();
            console.log(itemId, itemType, reason);
            toast.success(res.message);

        } catch (error) {
            console.log(error);
            toast.error(error.message);

        }



    }



    return (
        <form onSubmit={submitHanlder} id="deletionRequestForm" className="p-6">
            <h3 className="text-lg font-semibold mb-2">Request {type === "RECIPE" ? "Recipe" : "Category"} Deletion</h3>

            <p className="text-sm text-gray-600 mb-4">
                Once submitted, this {type === "RECIPE" ? "recipe" : "category"} will remain visible until admin approves.
            </p>

            <textarea
                placeholder="Reason for deletion (required)"
                className="w-full border p-2 rounded"
                rows={3}
                name="Reason"
                onChange={(e) => setReason(e.target.value)}
            />
            {formError.name === "reason" && <p className="text-xs text-red-500">{formError.value}</p>}

            <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">
                    Submit Request
                </button>
            </div>
        </form>

    );
}