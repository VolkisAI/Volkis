import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      <Image
        src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
        alt="Background"
        className="object-cover w-full"
        fill
      />
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 w-full">
        <Card className="max-w-xl mx-auto bg-transparent border-none shadow-none">
          <CardContent className="flex flex-col items-center p-8 md:p-0 space-y-8">
            <h2 className="font-bold text-3xl md:text-5xl tracking-tight text-white text-center">
              Boost your app, launch, earn
            </h2>
            <p className="text-lg text-white/80 text-center">
              Don&apos;t waste time integrating APIs or designing a pricing section...
            </p>
            <Button size="lg" className="w-full sm:w-auto">
              Get {config.appName}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTA;
