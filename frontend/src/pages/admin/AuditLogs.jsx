import { useDispatch, useSelector } from "react-redux";
import { getAuditLogs } from "../../features/adminSlice";
import { useEffect } from "react";
import { MdPendingActions } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { MdRestore } from "react-icons/md";

const actionMap = {
  DELETE_REQUESTED: {
    icon: <MdPendingActions className="text-yellow-500" />,
    text: "Delete requested",
  },
  DELETE_APPROVED: {
    icon: <MdDeleteForever className="text-red-600" />,
    text: "Deleted",
  },
  DELETE_REJECTED: {
    icon: <MdCancel className="text-orange-500" />,
    text: "Delete request rejected",
  },
  RESTORED: {
    icon: <MdRestore className="text-green-600" />,
    text: "Restored",
  },
};



const AuditLogs = () => {
  const dispatch = useDispatch();
  const { auditLogs = [] } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getAuditLogs());
  }, [dispatch]);

  return (
    <div className="sm:p-5 p-3">
      <h1 className="text-2xl font-semibold mb-4">Audit Logs</h1>

      <ul className="bg-white rounded shadow divide-y">
        {auditLogs.length === 0 && (
          <li className="p-3 text-sm text-gray-500">
            No audit logs found
          </li>
        )}

        {/* {auditLogs.map((log) => {
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
        })} */}

        {auditLogs.map((log) => {
          const meta = actionMap[log.action] || {};
          const date = new Date(log.createdAt).toLocaleString();

          return (
            <li key={log._id} className="p-3 text-sm flex flex-col sm:flex-row gap-2">
              <span className="text-xl">{meta.icon || "ℹ️"}</span>
              <div>
                <p>
                  <b className="">Requested</b> on <b>{log.targetType}</b> by{" "}
                  <b>{log.performedBy?.username || log.performedBy}</b>
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
