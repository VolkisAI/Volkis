"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Tablet, 
  Monitor 
} from "lucide-react";

const tabs = [
  {
    id: "1",
    title: "Mobile",
    icon: <Smartphone className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p><strong>Device:</strong> iPhone 13 Pro</p>
        <p><strong>Screen Size:</strong> 6.1 inches</p>
        <p><strong>Resolution:</strong> 2532 x 1170 pixels</p>
        <p><strong>Processor:</strong> A15 Bionic chip</p>
        <p><strong>RAM:</strong> 6 GB</p>
        <p><strong>Storage:</strong> 256 GB</p>
        <p><strong>Battery:</strong> 3095 mAh</p>
      </div>
    ),
  },
  {
    id: "2",
    title: "Tablet",
    icon: <Tablet className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p><strong>Device:</strong> iPad Pro (12.9-inch)</p>
        <p><strong>Screen Size:</strong> 12.9 inches</p>
        <p><strong>Resolution:</strong> 2732 x 2048 pixels</p>
        <p><strong>Processor:</strong> A12X Bionic chip</p>
        <p><strong>RAM:</strong> 4 GB</p>
        <p><strong>Storage:</strong> 256 GB</p>
        <p><strong>Battery:</strong> 10000 mAh</p>
      </div>
    ),
  },
  {
    id: "3",
    title: "Desktop",
    icon: <Monitor className="h-5 w-5" />,
    content: (
      <div className="space-y-2">
        <p><strong>Device:</strong> MacBook Pro (16-inch)</p>
        <p><strong>Screen Size:</strong> 16 inches</p>
        <p><strong>Resolution:</strong> 3072 x 1920 pixels</p>
        <p><strong>Processor:</strong> Apple M3 chip</p>
        <p><strong>RAM:</strong> 16 GB</p>
        <p><strong>Storage:</strong> 1 TB</p>
        <p><strong>Battery:</strong> 10000 mAh</p>
      </div>
    ),
  },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="max-w-xl mx-auto space-y-4">
      <Card className="p-1">
        <div className="grid grid-cols-3">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="flex items-center gap-2"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.title}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </CardContent>
      </Card>
    </section>
  );
};

export default Tabs;
