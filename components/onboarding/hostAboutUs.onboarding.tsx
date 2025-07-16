"use client";
import React from "react";
import CButton from "../common/buttons/button";
import { ButtonType } from "../common/buttons/interface";
import { useRouter } from "next/router";

const OnboardingAboutUsHost = () => {
  const router = useRouter();
  return (
    <div className="text-center text-primary min-h-full sm:px-12 max-w-3xl flex flex-col justify-between">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
        DISCOVER TALENT.
        <br />
        RUN EVENTS EFFORTLESSLY.
      </h1>

      <div className="text-base sm:text-lg text-white flex flex-col gap-4 text-start">
        <p>
          <strong className="text-primary text-md">
            Book faster. Book smarter.
          </strong>
          <br />
          Post gigs or send invites, manage talent, and finalize bookings in
          just a few clicks.
        </p>

        <p>
          <strong className="text-primary">
            Find the right artist, instantly.
          </strong>
          <br />
          Filter by genre, location, budget, or vibe — no more digging through
          DMs.
        </p>

        <p>
          <strong className="text-primary">Plan professionally.</strong>
          <br />
          Streamline negotiations, contracts, and payments with built-in tools.
        </p>

        <p>
          <strong className="text-primary">Collaborate with ease.</strong>
          <br />
          Add co-hosts, assign planners, and coordinate together in real time.
        </p>

        <p>
          <strong className="text-primary">Scale your brand.</strong>
          <br />
          Use analytics, email campaigns, and GrooveLocale to grow your audience
          and impact.
        </p>
      </div>

      <CButton
        variant={ButtonType.Primary}
        children="Continue"
        className="w-full"
        onClick={() => router.push("/onboarding/host/venue-type")}
      />
    </div>
  );
};

export default OnboardingAboutUsHost;
