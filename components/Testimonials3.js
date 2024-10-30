import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import config from "@/config";

// The list of your testimonials. It needs 3 items to fill the row.
const list = [
  {
    // Optional, use for social media like Twitter. Does not link anywhere but cool to display
    username: "marclou",
    // REQUIRED
    name: "Marc Lou",
    // REQUIRED
    text: "Really easy to use. The tutorials are really useful and explains how everything works. Hope to ship my next project really fast!",
    // Optional, a statically imported image (usually from your public folder—recommended) or a link to the person's avatar. Shows a fallback letter if not provided
    img: "https://pbs.twimg.com/profile_images/1514863683574599681/9k7PqDTA_400x400.jpg",
  },
  {
    username: "the_mcnaveen",
    name: "Naveen",
    text: "Setting up everything from the ground up is a really hard, and time consuming process. What you pay for will save your time for sure.",
  },
  {
    username: "wahab",
    name: "Wahab Shaikh",
    text: "Easily saves 15+ hrs for me setting up trivial stuff. Now, I can directly focus on shipping features rather than hours of setting up the same technologies from scratch. Feels like a super power! :D",
  },
];

// A single testimonial, to be rendered in  a list
const Testimonial = ({ i }) => {
  const testimonial = list[i];

  if (!testimonial) return null;

  return (
    <li key={i}>
      <Card className="h-full">
        <CardContent className="relative p-6 md:p-10 flex flex-col">
          <blockquote className="flex-1">
            <p className="text-muted-foreground leading-relaxed">
              {testimonial.text}
            </p>
          </blockquote>
          <div className="relative flex items-center justify-between gap-4 pt-4 mt-4 border-t">
            <div>
              <div className="font-medium text-foreground">
                {testimonial.name}
              </div>
              {testimonial.username && (
                <div className="mt-0.5 text-sm text-muted-foreground">
                  @{testimonial.username}
                </div>
              )}
            </div>

            {testimonial.img ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={testimonial.img} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>
    </li>
  );
};

const Testimonials3 = () => {
  return (
    <section id="testimonials">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="sm:text-5xl text-4xl font-extrabold tracking-tight mb-4">
            212 makers are already shipping faster!
          </h2>
          <p className="lg:w-2/3 mx-auto text-muted-foreground">
            Don&apos;t take our word for it. Here&apos;s what they have to say
            about {config.appName}.
          </p>
        </div>

        <ul className="flex flex-col items-center lg:flex-row lg:items-stretch gap-6 lg:gap-8">
          {[...Array(3)].map((e, i) => (
            <Testimonial key={i} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials3;
