"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/libs/supabase/client";
import apiClient from "@/libs/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { ChevronDown, LogOut, CreditCard } from "lucide-react";

const ButtonAccount = () => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleBilling = async () => {
    setIsLoading(true);
    try {
      const { url } = await apiClient.post("/stripe/create-portal", {
        returnUrl: window.location.href,
      });
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user?.user_metadata?.avatar_url}
              alt="Profile picture"
              className="w-6 h-6 rounded-full shrink-0"
              referrerPolicy="no-referrer"
              width={24}
              height={24}
            />
          ) : (
            <span className="w-6 h-6 bg-secondary flex justify-center items-center rounded-full shrink-0 capitalize">
              {user?.email?.charAt(0)}
            </span>
          )}
          {user?.user_metadata?.name || user?.email?.split("@")[0] || "Account"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        <Card className="bg-background">
          <div className="grid gap-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleBilling}
            >
              <CreditCard className="h-4 w-4" />
              Billing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonAccount;
