//app/timesheet/page.js

import createTimesheet from "@/actions/actions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserTimesheetData from "@/components/UserTimesheetData";
import { redirect } from "next/navigation";
import TimesheetForm from "./TimesheetForm";
import RotaList from "@/components/RotaList";

export const metadata = {
  title: "Timesheet page",
  description: "Simple timesheet app for Deerpark staffs",
};

const TimesheetPage = async ({ searchParams }) => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login?post_login_redirect_url=/timesheet");
  }

  const user = await getUser();
  const username = user
    ? `${user.given_name || ""} ${user.family_name || ""}`.trim() || user.email
    : "Unknown";

  const handleSubmit = async (formData) => {
    "use server";
    await createTimesheet(formData);
    redirect("/timesheet");
  };

  return (
    <main className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-slate-800 mb-4">
              Timesheet Entry
            </h1>
            <TimesheetForm onSubmit={handleSubmit} username={username} />
          </div>

          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-slate-800 mb-4">
              Your Timesheet Data
            </h1>
            <UserTimesheetData username={username} />
          </div>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-slate-800 mb-4">
            Rota List
          </h1>
          <RotaList userRole="basic" />
        </div>
      </div>
    </main>
  );
};

export default TimesheetPage;
