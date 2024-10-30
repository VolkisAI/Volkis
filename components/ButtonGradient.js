"use client";

import { Button } from "@/components/ui/button";

const ButtonGradient = ({ title = "Gradient Button", onClick = () => {} }) => {
  return (
    <Button 
      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
      onClick={onClick}
    >
      {title}
    </Button>
  );
};

export default ButtonGradient;
