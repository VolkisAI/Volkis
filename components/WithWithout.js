import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const WithWithout = () => {
  return (
    <section className="bg-background">
      <div className="max-w-5xl mx-auto px-8 py-16 md:py-32">
        <h2 className="text-center font-extrabold text-3xl md:text-5xl tracking-tight mb-12 md:mb-20">
          Tired of managing Stripe invoices?
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
          <Card className="bg-destructive/10 text-destructive w-full">
            <CardContent className="p-8 md:p-12">
              <h3 className="font-bold text-lg mb-4">
                Stripe invoices without ZenVoice
              </h3>

              <ul className="space-y-2">
                {[
                  "Manually create invoices",
                  "Or pay up to $2 per invoice",
                  "Waste hours in customer support",
                  "Can't update details once sent (VAT, Tax ID)",
                  "Can't make invoices for previous purchases",
                ].map((item, index) => (
                  <li key={index} className="flex gap-2 items-center">
                    <X className="h-4 w-4 shrink-0 opacity-75" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 text-primary w-full">
            <CardContent className="p-8 md:p-12">
              <h3 className="font-bold text-lg mb-4">
                Stripe invoices + ZenVoice
              </h3>

              <ul className="space-y-2">
                {[
                  "Self-serve invoices",
                  "One-time payment for unlimited invoices",
                  "No more customer support",
                  "Editable invoices to stay compliant",
                  "Invoices for any payment, even past ones",
                ].map((item, index) => (
                  <li key={index} className="flex gap-2 items-center">
                    <Check className="h-4 w-4 shrink-0 opacity-75" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WithWithout;
