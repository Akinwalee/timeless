"use client";

import { useState, type FormEvent } from "react";
import styles from "./WaitlistSection.module.css";

const GOOGLE_APPS_SCRIPT_WEBHOOK_URL = "";

export default function WaitlistSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    const originalText = submitButton.textContent;

    setSubmitting(true);
    submitButton.textContent = "Joining...";
    submitButton.disabled = true;

    const formData = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;
    formData.createdAt = new Date().toISOString();

    try {
      if (GOOGLE_APPS_SCRIPT_WEBHOOK_URL) {
        await fetch(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        console.log("Waitlist submission:", formData);
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      setSubmitting(false);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="waitlist"
      className="bg-brand-off-white py-[var(--section-padding)] text-brand-black max-[920px]:py-[var(--section-padding-mobile)]"
      aria-labelledby="waitlist-title"
    >
      <div className="container grid items-start gap-20 md:grid-cols-[minmax(0,0.9fr)_minmax(380px,0.8fr)] max-[920px]:grid-cols-1 max-[920px]:gap-[42px]">
        {/* ── Left column: Copy ── */}
        <div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.22em] text-[#525252]">
            Join the Waitlist
          </div>
          <h2
            id="waitlist-title"
            className="mt-4 max-w-[700px] text-[clamp(44px,7vw,106px)] font-black uppercase leading-[0.88] tracking-[-0.08em]"
          >
            First access starts here.
          </h2>
          <p className="mt-7 max-w-[720px] text-[18px] text-[#525252]">
            Be first to know when the first Timeless drop goes live. Email and
            WhatsApp updates will be used for launch notices only.
          </p>
        </div>

        {/* ── Right column: Form Card ── */}
        <div className={styles.formCard}>
          {!submitted ? (
            <div>
              <h3 className="mb-2 text-[18px] font-black uppercase tracking-[-0.04em]">
                Join the Timeless Waitlist
              </h3>
              <p className="mb-7 text-[14px] text-brand-muted">
                Submit your details to get early access to the first drop.
              </p>

              <form className="grid gap-3.5" onSubmit={handleSubmit}>
                <input
                  className={styles.field}
                  type="text"
                  name="name"
                  placeholder="Full name"
                  required
                />
                <input
                  className={styles.field}
                  type="email"
                  name="email"
                  placeholder="Email address"
                  required
                />
                <input
                  className={styles.field}
                  type="tel"
                  name="whatsapp"
                  placeholder="WhatsApp number"
                  required
                />
                <select
                  className={styles.selectField}
                  name="size"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Preferred size
                  </option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
                <button
                  className="btn mt-2 w-full"
                  type="submit"
                  disabled={submitting}
                >
                  Join Waitlist
                </button>
              </form>

              <p className="mt-4 text-[12px] text-brand-muted-2">
                No spam. Only launch updates and first drop details.
              </p>
            </div>
          ) : (
            <div className={styles.successMessage} role="status" aria-live="polite">
              <h3 className="mb-2.5 text-[28px] font-black uppercase leading-none tracking-[-0.06em]">
                You are in.
              </h3>
              <p className="text-[14px] text-brand-muted">
                First access starts here. Watch your email and WhatsApp for
                launch updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
