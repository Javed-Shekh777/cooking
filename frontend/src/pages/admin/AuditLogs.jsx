import { useDispatch, useSelector } from "react-redux";
import { fetchAuditLogs } from "../../features/recipeSlice";
import { useEffect } from "react";

const actionMap = {
  DELETE_REQUESTED: {
    icon: "🟡",
    text: "Delete requested"
  },
  DELETE_APPROVED: {
    icon: "🔴",
    text: "Deleted"
  },
  DELETE_REJECTED: {
    icon: "⚠️",
    text: "Delete request rejected"
  },
  RESTORED: {
    icon: "🟢",
    text: "Restored"
  }
};


const AuditLogs = () => {
  const dispatch = useDispatch();
  const { auditLog = [] } = useSelector((s) => s.recipe);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Audit Logs</h1>

      <ul className="bg-white rounded shadow divide-y">
        {auditLog.length === 0 && (
          <li className="p-3 text-sm text-gray-500">
            No audit logs found
          </li>
        )}

        {auditLog.map((log) => {
          const meta = actionMap[log.action] || {};
          const date = new Date(log.createdAt).toLocaleString();

          return (
            <li key={log._id} className="p-3 text-sm flex gap-2">
              <span>{meta.icon || "ℹ️"}</span>
              <div>
                <p>
                  <b>{meta.text}</b> on{" "}
                  <b>{log.targetType}</b> by{" "}
                  <b>{log.performedBy?.username}</b>
                </p>
                <p className="text-xs text-gray-500">{date}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AuditLogs;
