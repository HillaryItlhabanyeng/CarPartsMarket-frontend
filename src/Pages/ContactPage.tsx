import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import "./Contactpage.css";
import {
    FaMapPin, FaClock, FaEnvelope, FaPhone
} from "react-icons/fa";
import Footer from "../Components/Footer";
import { sendContactMessage } from "../api/reviewService";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContactMessage(form);
      setForm({ fullName: "", email: "", subject: "", message: "" });
      setStatus("sent");
    } catch (err) {
      setErrorMsg(
        axios.isAxiosError(err) && typeof err.response?.data === "string"
          ? err.response.data
          : "Could not send your message. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <div className="ct-page">

      <div className="ut-page-header">
        <Navbar />
      </div>

      <section className="ct-heading">
        <h1>CONTACT US</h1>
        <p>
          We'll like to hear from you! Reach out to us
          <br />
          for any question, feedback or support
        </p>
      </section>

      {/* Content */}
      <section className="ct-content">
        <div className="ct-card">
          <h3>SEND US A MESSAGE</h3>
          <form onSubmit={handleSubmit} className="ct-form">
            <label className="ct-field">
              <span className="ct-field-icon"></span>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
              />
            </label>

            <label className="ct-field">
              <span className="ct-field-icon"></span>
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            <label className="ct-field">
              <span className="ct-field-icon"></span>
              <input
                type="text"
                name="subject"
                required
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
              />
            </label>

            <label className="ct-field ct-field-textarea">
              <span className="ct-field-icon"></span>
              <textarea
                name="message"
                required
                placeholder="Your message"
                rows={5}
                value={form.message}
                onChange={handleChange}
              />
            </label>

            {status === "sent" && (
              <p role="status" style={{ color: "#1e7e34", margin: 0 }}>
                Thanks! Your message has been sent. We'll reply by email.
              </p>
            )}
            {status === "error" && (
              <p role="alert" style={{ color: "#c0392b", margin: 0 }}>{errorMsg}</p>
            )}

            <button type="submit" className="ct-submit" disabled={status === "sending"}>
              <span></span> {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="ct-card">
          <h3>CONTACT INFORMATION</h3>

          <div className="ct-info-row">
            <span className="ct-info-icon"><FaMapPin/></span>
            <div>
              <strong>Address</strong>
              <p>
                Cape Peninsula University of Technology
                <br />
                District Six Campus, Cape Town, 7925
              </p>
            </div>
          </div>

          <div className="ct-info-row">
            <span className="ct-info-icon"><FaEnvelope/></span>
            <div>
              <strong>Email</strong>
              <p>Support@unitrade.co.za</p>
            </div>
          </div>

          <div className="ct-info-row">
            <span className="ct-info-icon"><FaPhone/></span>
            <div>
              <strong>Phone</strong>
              <p>+27 21 489 1397</p>
            </div>
          </div>

          <div className="ct-info-row">
            <span className="ct-info-icon"><FaClock/></span>
            <div>
              <strong>Hours</strong>
              <p>
                Monday - Friday: 08:00-17:00
                <br />
                Saturday - Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help banner */}
      <section className="ct-help-banner">
        <span className="ct-help-icon">🎧</span>
        <div>
          <strong>Need Help quickly?</strong>
          <p>
            Check out our <a href="#">FAQs</a> OR contact{" "}
            <a href="mailto:support@unitrade.co.za">support@unitrade.co.za</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

