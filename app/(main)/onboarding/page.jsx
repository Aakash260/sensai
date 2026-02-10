import React from "react";
import OnBoardingForm from "./_components/onboarding-form";
import { industries } from "@/data/industries";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
const OnBoarding = async () => {
  const { isBoarded } = await getUserOnboardingStatus();
  if (isBoarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnBoardingForm industries={industries} />
    </main>
  );
};

export default OnBoarding;
