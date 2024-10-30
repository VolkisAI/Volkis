/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { createClient } from "@/libs/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import config from "@/config";

const ButtonSignin = ({ text = "Get started", extraStyle }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSignin = () => {
    if (user) {
      router.push(config.auth.callbackUrl);
    } else {
      router.push(config.auth.loginUrl);
    }
  };

  if (loading) {
    return (
      <Button variant="outline" className="animate-pulse">
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <Link href={config.auth.callbackUrl}>
        <Button variant="outline" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            {user?.user_metadata?.avatar_url ? (
              <AvatarImage
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata?.name || "User"}
              />
            ) : (
              <AvatarFallback>
                {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <span>
            {user.user_metadata?.name || user.email?.split("@")[0] || "Account"}
          </span>
        </Button>
      </Link>
    );
  }

  return (
    <Button onClick={handleSignin} className={extraStyle}>
      {text}
    </Button>
  );
};

export default ButtonSignin;
