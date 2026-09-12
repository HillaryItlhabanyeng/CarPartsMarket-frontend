import "./OTPPage.css";

function OTPPage() {
  return (
    <div className="OTP-container">
      {/* <img src="/logo-BW.png" alt="UniTrade Logo" className="logo" /> */}
      <div className="OTP-card">
        <h1>OTP Verification</h1>
        <p>Please enter the OTP that was sent to you via email. If you have not received it within 30 seconds, then click RESEND</p>

        <div className="otp-inputs">
          <input type="text" maxLength={1} inputMode="numeric" />
          <input type="text" maxLength={1} inputMode="numeric" />
          <input type="text" maxLength={1} inputMode="numeric" />
          <input type="text" maxLength={1} inputMode="numeric" />
        </div>

        <div className="otpResend">Din't recieve a code? <a href="#"><span style={{ color: "blue", textDecoration: "underline" }}>RESEND</span></a></div>
        <button type="submit" className="otpsubmit-button">
          Verify
        </button>
        <button type="button" className="otpcancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
}
export default OTPPage;