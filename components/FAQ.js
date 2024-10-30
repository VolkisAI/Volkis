"use client";

import { useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqList = [
  {
    question: "What do I get exactly?",
    answer: <div className="space-y-2 leading-relaxed">Loreum Ipseum</div>,
  },
  {
    question: "Can I get a refund?",
    answer: (
      <p>
        Yes! You can request a refund within 7 days of your purchase. Reach out
        by email.
      </p>
    ),
  },
  {
    question: "I have another question",
    answer: (
      <div className="space-y-2 leading-relaxed">Cool, contact us by email</div>
    ),
  },
];

const FAQ = () => {
  return (
    <section className="bg-muted/50" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="text-primary font-semibold mb-4">FAQ</p>
          <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="basis-1/2">
          {faqList.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-base font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
