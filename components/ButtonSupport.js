"use client";

import { Button } from "@/components/ui/button";
import config from "@/config";

const ButtonSupport = ({ text = "Support", extraStyle }) => {
  const handleSupport = () => {
    if (config.mailgun.supportEmail) {
      window.location.href = `mailto:${config.mailgun.supportEmail}`;
    }
  };

  return (
    <Button 
      onClick={handleSupport} 
      variant="outline"
      className={extraStyle}
    >
      {text}
    </Button>
  );
};

export default ButtonSupport;
