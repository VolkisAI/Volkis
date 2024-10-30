"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import apiClient from "@/libs/api";

const ButtonLead = ({ extraStyle }) => {
  const inputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post("/lead", { email });
      toast.success("Thanks for joining the waitlist!");
      inputRef.current.blur();
      setEmail("");
      setIsDisabled(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={`w-full max-w-xs space-y-3 ${extraStyle ? extraStyle : ""}`}
      onSubmit={handleSubmit}
    >
      <Input
        required
        type="email"
        value={email}
        ref={inputRef}
        autoComplete="email"
        placeholder="tom@cruise.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={isDisabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Join waitlist"
        )}
      </Button>
    </form>
  );
};

export default ButtonLead;
