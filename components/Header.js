"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import ButtonSignin from "./ButtonSignin";
import logo from "@/app/icon.png";
import config from "@/config";

const links = [
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#testimonials",
    label: "Reviews",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

const cta = <ButtonSignin extraStyle="btn-primary" />;

const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <nav className="container flex items-center justify-between px-8 py-4 mx-auto">
        <Link
          className="flex items-center gap-2 shrink-0"
          href="/"
          title={`${config.appName} homepage`}
        >
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className="w-8"
            placeholder="blur"
            priority={true}
            width={32}
            height={32}
          />
          <span className="font-extrabold text-lg">{config.appName}</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1">
          {cta}
        </div>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4">{cta}</div>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Header;
