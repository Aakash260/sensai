import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { getIndustryInsights } from "@/actions/dashboard";
import React from "react";
import DashboardView from "./_components/dashboard-view";
const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  const insight = await getIndustryInsights();
 
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return (
    <div className="container mx-auto">
      <DashboardView insight={insight} />
    </div>
  );
};

export default IndustryInsightPage;
