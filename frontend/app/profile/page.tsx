import React from "react";

import ChangePassword from "./ChangePassword";
import NotificationPreferences from "./NotificationPreferences";

const page = () => {
  return (
    <div className="flex flex-col gap-10 p-5">
      <ChangePassword />
      <NotificationPreferences />
    </div>
  );
};

export default page;
