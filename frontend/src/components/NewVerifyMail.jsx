import { useState } from "react";
import OtpInput from "./OtpInput";
import toast  from "react-hot-toast";
import "./otpModal.css";
import { RxCross2 } from 'react-icons/rx'
import { useDispatch } from "react-redux";
import { mailChange } from "../features/authSlice";

const NewVerifyMail = ({ endpoint, onSuccess, onClose }) => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const submitHandler = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            toast.error("Enter valid OTP");
            return;
        }

        try {
            setLoading(true);
            const res = await dispatch(mailChange({ otp: code })).unwrap();
            toast.success(res.message || "Verified successfully");
            onSuccess?.();
            onClose?.();
        } catch (err) {
            console.log(err);
            // toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-overlay">
            <div className="otp-modal">
                <h2>Verify OTP</h2>

                <OtpInput otp={otp} setOtp={setOtp} />

                <button
                    className="otp-btn"
                    onClick={submitHandler}
                    disabled={loading}
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>

                {onClose && (
                    <button className="otp-close" onClick={onClose}>
                        <RxCross2 />
                    </button>
                )}
            </div>
        </div>
    );
};

export default NewVerifyMail;
