"use client";

import { createClient } from "@/libs/supabase/client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Crisp } from "crisp-sdk-web";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import config from "@/config";

const CrispChat = () => {
  const pathname = usePathname();
  const supabase = createClient();
  const [data, setData] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setData({ user });
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (config?.crisp?.id) {
      Crisp.configure(config.crisp.id);

      if (
        config.crisp.onlyShowOnRoutes &&
        !config.crisp.onlyShowOnRoutes?.includes(pathname)
      ) {
        Crisp.chat.hide();
        Crisp.chat.onChatClosed(() => {
          Crisp.chat.hide();
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (data?.user && config?.crisp?.id) {
      Crisp.session.setData({ userId: data.user?.id });
    }
  }, [data]);

  return null;
};

const LayoutClient = ({ children }) => {
  return (
    <>
      <NextTopLoader color={config.colors.main} showSpinner={false} />
      {children}
      <Toaster
        toastOptions={{
          duration: 3000,
          className: "bg-background text-foreground border border-border",
        }}
      />
      <Tooltip
        id="tooltip"
        className="z-[60] !opacity-100 max-w-sm shadow-lg bg-background text-foreground border border-border"
      />
      <CrispChat />
    </>
  );
};

export default LayoutClient;
