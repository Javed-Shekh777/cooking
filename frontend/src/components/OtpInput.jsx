import { useRef } from "react";

const OtpInput = ({ otp, setOtp, length = 6 }) => {
    const inputs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (index < length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }} >
            {otp.map((digit, i) => (
                <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleBackspace(e, i)}
                    style={{
                        width: "45px",
                        height: "45px",
                        fontSize: "20px",
                        textAlign: "center",
                    }}
                    className="border rounded"
                />
            ))}
        </div>
    );
};

export default OtpInput;
