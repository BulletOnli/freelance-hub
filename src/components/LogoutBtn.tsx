import React from "react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/sessions";

const LogoutBtn = () => {
  return (
    <form action={logoutAction}>
      <Button>Logout</Button>
    </form>
  );
};

export default LogoutBtn;
