import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EmailVerifiedPage from "./EmailVerifiedPage";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { verifyMail } from "../features/authSlice";
import toast from "react-hot-toast";

export default function VerifyHandler() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const dispatch = useDispatch();
    const [status, setStatus] = useState("loading");
    const { loading, error } = useSelector((state) => state.auth);

    // "loading" | "success" | "error"

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const result = await dispatch(verifyMail({ email, token })).unwrap();
                toast.success(result?.message || "Mail Verified successfully!");
                setStatus("success");
            } catch (err) {
                console.log("Errr catch:", err);
                toast.error(err.message || "Verification failed");
            }
        };

        if (email && token) {
            verifyEmail();
        } else {
            setStatus("error");
        }
    }, [email, token]);

    if (loading === true) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Verifying your email...
            </div>
        );
    }

    if (status === "success") {
        return <EmailVerifiedPage />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-red-200 rounded-xl shadow-lg p-8 text-center max-w-md"
            >
                <h1 className="text-2xl font-semibold text-red-700">Verification Failed</h1>
                <p className="mt-3 text-gray-500">
                    Your verification link is invalid or expired. Please request a new one.
                </p>
            </motion.div>
        </div>
    );
}
