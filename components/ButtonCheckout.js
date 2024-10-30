"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import apiClient from "@/libs/api";
import config from "@/config";

const ButtonCheckout = ({ priceId, mode = "payment" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post("/stripe/create-checkout", {
        priceId,
        mode,
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      });
      window.location.href = res.url;
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Button 
      className="w-full" 
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          Get {config.appName}
        </>
      )}
    </Button>
  );
};

export default ButtonCheckout;
