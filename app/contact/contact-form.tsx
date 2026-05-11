"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type ContactReason =
  | "General inquiry"
  | "Partnership"
  | "Investor interest"
  | "Feedback"
  | "Other";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  reason: ContactReason;
  message: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  reason: "General inquiry",
  message: "",
};

const reasons: ContactReason[] = [
  "General inquiry",
  "Partnership",
  "Investor interest",
  "Feedback",
  "Other",
];

export default function ContactForm() {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      setSuccessMessage(
        result.message || "Thanks, your message has been received."
      );
      setFormValues(initialValues);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            className="field-control"
            value={formValues.name}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="field-control"
            value={formValues.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="phone" className="field-label">
            Phone number <span style={{ color: "var(--text-mute)" }}>(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+212 6XX XXX XXX"
            className="field-control"
            value={formValues.phone}
            onChange={handleChange}
            autoComplete="tel"
          />
        </div>

        <div>
          <label htmlFor="reason" className="field-label">
            Reason for contact
          </label>
          <select
            id="reason"
            name="reason"
            className="field-control"
            value={formValues.reason}
            onChange={handleChange}
            required
          >
            {reasons.map((reason) => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell us how we can help."
          rows={6}
          className="field-control"
          value={formValues.message}
          onChange={handleChange}
          required
        />
      </div>

      {successMessage ? (
        <p className="rounded-lg border px-4 py-3 text-sm" style={{
          borderColor: "rgba(34,197,94,0.30)",
          background: "rgba(34,197,94,0.12)",
          color: "#86efac",
        }}>
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-lg border px-4 py-3 text-sm" style={{
          borderColor: "rgba(239,68,68,0.30)",
          background: "rgba(239,68,68,0.12)",
          color: "#fca5a5",
        }}>
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn-primary min-h-11 w-full sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
