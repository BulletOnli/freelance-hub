import React from "react";
import { logout } from "../_actions/action";
import { Button } from "@/components/ui/button";

const LogoutBtn = () => {
  return (
    <form action={logout}>
      <Button>Logout</Button>
    </form>
  );
};

export default LogoutBtn;
