import React from "react";

import ChangePassword from "./ChangePassword";
import NotificationPreferences from "./NotificationPreferences";

const page = () => {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full py-4 sm:py-8">
      <ChangePassword />
      <NotificationPreferences />
    </div>
  );
};

export default page;
