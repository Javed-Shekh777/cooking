const AdminRecipes = () => {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">All Recipes</h1>

            <table className="w-full bg-white rounded shadow">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="p-3">Title</th>
                        <th>Chef</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="border-t">
                        <td className="p-3">Butter Chicken</td>
                        <td>chef_john</td>
                        <td>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                                Active
                            </span>
                        </td>
                        <td className="flex gap-2 p-3">
                            <button className="text-red-600">Delete</button>
                            <button className="text-blue-600">Restore</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="text-xs text-gray-500 mt-3">
                ⚠ Recipes are soft-deleted. Permanent deletion is restricted.
            </p>
        </div>
    );
};

export default AdminRecipes;
