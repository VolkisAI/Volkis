"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { ChevronDown, Flame, Gift, GraduationCap } from "lucide-react";

const ButtonPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Popover Button
          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-sm lg:max-w-2xl p-0">
        <Card>
          <div className="grid gap-4 p-4 lg:grid-cols-2">
            <PopoverItem
              icon={<Flame className="h-6 w-6 text-orange-600" />}
              title="Get Started"
              description="Loreum ipseum de la madre de papa"
              bgColor="bg-orange-500/20"
            />
            <PopoverItem
              icon={<Gift className="h-6 w-6 text-yellow-600" />}
              title="Rewards"
              description="Loreum ipseum de el papi de la mama"
              bgColor="bg-yellow-500/20"
            />
            <PopoverItem
              icon={<GraduationCap className="h-6 w-6 text-green-600" />}
              title="Academics"
              description="Loreum ipseum de la madre de papa"
              bgColor="bg-green-500/20"
            />
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

const PopoverItem = ({ icon, title, description, bgColor }) => (
  <div className="flex items-center gap-3 p-2 cursor-pointer rounded-lg hover:bg-accent transition-colors">
    <span className={`flex items-center justify-center w-12 h-12 shrink-0 rounded-lg ${bgColor}`}>
      {icon}
    </span>
    <div>
      <p className="font-bold">{title}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default ButtonPopover;
