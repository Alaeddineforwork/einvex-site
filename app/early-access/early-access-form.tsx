"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type FormValues = {
  name: string;
  email: string;
  phoneNumber: string;
  interestType: string;
  message: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  interestType: "Investor",
  message: "",
};

export default function EarlyAccessForm() {
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
      const response = await fetch("/api/early-access", {
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
        result.message || "Thanks, your request has been submitted successfully."
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
    <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="field-label">
          Full Name
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
          Email Address
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

      <div>
        <label htmlFor="phoneNumber" className="field-label">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          placeholder="+212 6XX XXX XXX"
          className="field-control"
          value={formValues.phoneNumber}
          onChange={handleChange}
          autoComplete="tel"
          required
        />
      </div>

      <div>
        <label htmlFor="interestType" className="field-label">
          I am interested as
        </label>
        <select
          id="interestType"
          name="interestType"
          className="field-control"
          value={formValues.interestType}
          onChange={handleChange}
          required
        >
          <option>Investor</option>
          <option>Retail User</option>
          <option>Partner</option>
          <option>Just Curious</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="field-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell us what interests you about EinveX"
          rows={5}
          className="field-control"
          value={formValues.message}
          onChange={handleChange}
          required
        />
      </div>

      {successMessage ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-500 sm:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Request Early Access"}
      </button>
    </form>
  );
}
