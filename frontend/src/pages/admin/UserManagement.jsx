import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getUsers, blockUnblockUser } from "../../features/adminSlice";

const ManageUsers = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.admin);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [providerFilter, setProviderFilter] = useState("");
    const [verifiedFilter, setVerifiedFilter] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await dispatch(getUsers()).unwrap();
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtering logic
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole = roleFilter ? user.role === roleFilter : true;
        const matchesProvider = providerFilter ? user.provider === providerFilter : true;
        const matchesVerified =
            verifiedFilter !== ""
                ? user.isVerified === (verifiedFilter === "true")
                : true;

        return matchesSearch && matchesRole && matchesProvider && matchesVerified;
    });


    const handleBlockUnblock = async (id, type) => {
        try {
            const res = await dispatch(blockUnblockUser(id)).unwrap();
            toast.success(res.message);
        } catch (error) {
            toast.error(error.message);
        }
    }



    return (
        <div className="p-4 h-full my-5">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

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
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border rounded"
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="chef">Chef</option>
                    <option value="admin">Admin</option>
                </select>

                <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="px-3 py-2 border rounded"
                >
                    <option value="">All Providers</option>
                    <option value="local">Local</option>
                    <option value="google">Google</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="apple">Apple</option>
                    <option value="microsoft">Microsoft</option>
                </select>

                <select
                    value={verifiedFilter}
                    onChange={(e) => setVerifiedFilter(e.target.value)}
                    className="px-3 py-2 border rounded"
                >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                </select>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto h-full hidden md:block  ">
                <table className="min-w-full bg-white shadow rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Provider</th>
                            <th className="px-4 py-2 text-left">Verified</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="border-t">
                                <td className="px-4 py-2">{user.fullName}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.role}</td>
                                <td className="px-4 py-2">{user.provider}</td>
                                <td className="px-4 py-2">
                                    {user.isVerified ? "✅" : "❌"}
                                </td>
                                <td className="px-4 py-2">

                                    <select
                                        value={user?.isBlocked === false ? "Unblocked" : "Blocked"}
                                        onChange={(e) => handleBlockUnblock(user?._id, e.target.value)}
                                        className="px-3 py-2 bg-slate-50 rounded"
                                    >
                                        <option value="Unblocked">Unblock</option>
                                        <option value="Blocked">Block</option>
                                    </select>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden mt-6">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="bg-white shadow rounded-lg p-4 flex flex-col"
                    >
                        <h4 className="font-semibold text-gray-800">{user.fullName}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm">Role: {user.role}</p>
                        <p className="text-sm">Provider: {user.provider}</p>
                        <p className="text-sm">
                            Verified: {user.isVerified ? "✅" : "❌"}
                        </p>
                        <div className="mt-2 flex space-x-3">
                            {/* <button className="text-blue-600 hover:underline text-sm">
                                View
                            </button>
                            <button className="text-red-600 hover:underline text-sm">
                                Block
                            </button> */}

                            <select
                                value={user?.isBlocked === false ? "Unblocked" : "Blocked"}
                                onChange={(e) => handleBlockUnblock(user?._id, e.target.value)}
                                className="px-3 py-2 bg-slate-50 rounded"
                            >
                                <option value="Unblocked">Unblock</option>
                                <option value="Blocked">Block</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ManageUsers;
