import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from 'react-hot-toast'
import { verifyMail } from "../features/authSlice";

function OTPInput({ length = 6, onComplete, autoFocus = true }) {

    const [values, setValues] = useState(Array(length).fill(""));
    const inputsRef = useRef([]);

    const focusAt = (idx) => {
        if (idx >= 0 && idx < length) {
            inputsRef.current[idx]?.focus();
        }
    };

    const handleChange = (idx, e) => {
        const raw = e.target.value;
        const digit = raw.replace(/\D/g, "").slice(-1);

        setValues((prev) => {
            const next = [...prev];
            next[idx] = digit || "";
            const otpString = next.join("");
            if (otpString.length === length && !next.includes("")) {
                onComplete(otpString);
            }
            return next;
        });

        if (digit) {
            focusAt(idx + 1);
        }
    };

    const handleKeyDown = (idx, e) => {
        if (e.key === "Backspace" && !values[idx]) {
            focusAt(idx - 1);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        const next = paste.split("").concat(Array(length).fill("")).slice(0, length);
        setValues(next);
        if (next.join("").length === length && !next.includes("")) {
            onComplete(next.join(""));
        }
    };

    useEffect(() => {
        if (autoFocus) {
            focusAt(0);
        }
    }, [autoFocus]);



    return (
        <div className="flex items-center justify-center gap-3">
            {values.map((val, idx) => (
                <input
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    value={val}
                    onChange={(e) => handleChange(idx, e)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`OTP digit ${idx + 1}`}
                />
            ))}
        </div>
    );
}

const VerifyAccountOTP = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const username = searchParams.get("username");
    const dispatch = useDispatch();
    const [status, setStatus] = useState("loading");
    const { loading, error } = useSelector((state) => state.auth);
    const [otp, setOtp] = useState("");

    useEffect(() => {
        if (!email || !username) {
            toast.error("Please verify your email from given link in mail?");
            setStatus("error");
        }
    }, [email, username]);

    const verifyEmailSubmit = async () => {
        try {

            const result = await dispatch(verifyMail({ email, otp })).unwrap();
            toast.success(result?.message || "Mail Verified successfully!");
            setStatus("success");
            navigate(`/sign-in`);

        } catch (err) {
            console.log("Errr catch:", err);
            toast.error(err.message || "Verification failed");
        }
    };

    if (!email || !username) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-600 font-semibold">
                    Invalid verification link. Please check your email again.
                </p>
            </div>
        );
    }



    return (
        <section className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center">Verify your email</h1>
                <p className="text-center text-gray-500 mt-2">
                    Enter the 6-digit code we sent to your email
                </p>

                <div className="mt-6">
                    <OTPInput length={6} onComplete={(val) => setOtp(val)} />
                </div>

                <button
                    type="button"
                    onClick={verifyEmailSubmit}
                    disabled={otp.length !== 6}
                    className="mt-6 w-full py-3 rounded-xl bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                

                <p className="text-center text-sm text-gray-500 mt-4">
                    Didn't receive the code?{" "}
                    <button className="text-green-600 font-medium">Resend</button>
                </p>
            </div>
        </section>
    );
};

export default VerifyAccountOTP;
