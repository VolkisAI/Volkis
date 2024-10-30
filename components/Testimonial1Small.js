import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const Testimonial1Small = () => {
  return (
    <Card className="bg-background">
      <CardContent className="space-y-6 md:space-y-8 max-w-lg mx-auto px-8 py-16 md:py-32">
        <div className="flex justify-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>

        <figure className="space-y-6">
          <blockquote className="text-xl md:text-2xl font-medium text-center">
            <p>
              "This is the <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1.5">best solution</span> for anyone who wants to start a SaaS business."
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-center gap-x-4">
            <Image
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User feedback"
              width={48}
              height={48}
            />
            <div>
              <p className="font-semibold">Someone Nice</p>
              <p className="text-muted-foreground text-sm">23.1K followers on 𝕏</p>
            </div>
          </figcaption>
        </figure>
      </CardContent>
    </Card>
  );
};

export default Testimonial1Small;
