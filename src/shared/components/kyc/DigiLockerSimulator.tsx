"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui";

interface DigiLockerSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (kycData: { aadhaarNumber: string; verifiedName: string; dob: string; address: string; verifiedAt: string; }) => void;
}

export function DigiLockerSimulator({ isOpen, onClose, onSuccess }: DigiLockerSimulatorProps) {
  const [step, setStep] = useState<"aadhaar" | "otp" | "success">("aadhaar");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.length !== 12) {
      alert("Aadhaar must be 12 digits");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1200); // Simulate network latency
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456") {
      alert("Invalid OTP for sandbox mode. Use 123456.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      
      // Simulate real DigiLocker JSON response
      setTimeout(() => {
        onSuccess({
          aadhaarNumber: `********${aadhaar.slice(-4)}`,
          verifiedName: "MOCK USER NAME",
          dob: "1990-01-01",
          address: "123 Mock Street, Cyber City, IN",
          verifiedAt: new Date().toISOString()
        });
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#1b2f4f] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span className="font-semibold tracking-wide">DigiLocker Verification</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6">
          {step === "aadhaar" && (
            <form onSubmit={handleAadhaarSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Enter Aadhaar Number</h3>
                <p className="text-sm text-gray-500 mt-1">To fetch your documents securely</p>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000 0000 0000"
                  className="w-full text-center text-xl tracking-[0.2em] border-2 border-gray-200 rounded-lg p-3 focus:border-[#1b2f4f] focus:ring-1 focus:ring-[#1b2f4f] outline-none transition-all"
                  autoFocus
                />
              </div>
              <Button type="submit" variant="primary" className="w-full bg-[#1b2f4f] hover:bg-[#112036]" disabled={aadhaar.length !== 12 || isLoading}>
                {isLoading ? "Connecting to UIDAI..." : "Next"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Enter OTP</h3>
                <p className="text-sm text-gray-500 mt-1">OTP sent to Aadhaar registered mobile number</p>
                <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded mt-2 border border-blue-100">
                  <strong>Sandbox Mode:</strong> Use OTP <code>123456</code>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="******"
                  className="w-full text-center text-2xl tracking-[0.3em] border-2 border-gray-200 rounded-lg p-3 focus:border-[#1b2f4f] focus:ring-1 focus:ring-[#1b2f4f] outline-none transition-all"
                  autoFocus
                />
              </div>
              <Button type="submit" variant="primary" className="w-full bg-[#1b2f4f] hover:bg-[#112036]" disabled={otp.length !== 6 || isLoading}>
                {isLoading ? "Verifying..." : "Submit OTP"}
              </Button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Verification Successful</h3>
              <p className="text-sm text-gray-500 mt-2">Document fetched from DigiLocker.</p>
              <p className="text-xs text-gray-400 mt-1">Redirecting back...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
