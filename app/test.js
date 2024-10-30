"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Test = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Button onClick={() => alert("Button clicked!")}>Test Button</Button>
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/300" alt="User Avatar" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  </div>
);

export default Test; 