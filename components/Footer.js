import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import config from "@/config";
import logo from "@/app/icon.png";

const Footer = () => {
	return (
		<footer className="bg-muted/50 border-t">
			<div className="max-w-7xl mx-auto px-8 py-24">
				<div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
					<div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
						<Link
							href="/#"
							aria-current="page"
							className="flex gap-2 justify-center md:justify-start items-center"
						>
							<Image
								src={logo}
								alt={`${config.appName} logo`}
								priority={true}
								className="w-6 h-6"
								width={24}
								height={24}
							/>
							<span className="font-extrabold tracking-tight text-base md:text-lg">
								{config.appName}
							</span>
						</Link>

						<p className="mt-3 text-sm text-muted-foreground">
							{config.appDescription}
						</p>
						<p className="mt-3 text-sm text-muted-foreground/60">
							Copyright © {new Date().getFullYear()} - All rights reserved
						</p>

						<Link
							href="https://shipfa.st/?ref=shipfast_badge"
							target="_blank"
							className="mt-4 inline-block"
						>
							<Card className="bg-neutral hover:bg-neutral/90 transition-colors">
								<CardContent className="p-2 flex items-center gap-2 text-sm text-neutral-foreground">
									<span className="opacity-90">Built with</span>
									<span className="flex items-center gap-0.5 font-semibold tracking-tight">
										<svg
											className="size-5"
											viewBox="0 0 375 509"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M249.685 14.125C249.685 11.5046 248.913 8.94218 247.465 6.75675C246.017 4.57133 243.957 2.85951 241.542 1.83453C239.126 0.809546 236.463 0.516683 233.882 0.992419C231.301 1.46815 228.917 2.69147 227.028 4.50999L179.466 50.1812C108.664 118.158 48.8369 196.677 2.11373 282.944C0.964078 284.975 0.367442 287.272 0.38324 289.605C0.399039 291.938 1.02672 294.226 2.20377 296.241C3.38082 298.257 5.06616 299.929 7.09195 301.092C9.11775 302.255 11.4133 302.867 13.75 302.869H129.042V494.875C129.039 497.466 129.791 500.001 131.205 502.173C132.62 504.345 134.637 506.059 137.01 507.106C139.383 508.153 142.01 508.489 144.571 508.072C147.131 507.655 149.516 506.503 151.432 504.757L172.698 485.394C247.19 417.643 310.406 338.487 359.975 250.894L373.136 227.658C374.292 225.626 374.894 223.327 374.882 220.99C374.87 218.653 374.243 216.361 373.065 214.341C371.887 212.322 370.199 210.646 368.17 209.482C366.141 208.318 363.841 207.706 361.5 207.707H249.685V14.125Z"
												fill="currentColor"
											/>
										</svg>
										ShipFast
									</span>
								</CardContent>
							</Card>
						</Link>
					</div>

					<div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
						<div className="lg:w-1/3 md:w-1/2 w-full px-4">
							<h2 className="font-semibold text-foreground tracking-widest text-sm md:text-left mb-3">
								LINKS
							</h2>

							<nav className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
								{config.mailgun.supportEmail && (
									<Link
										href={`mailto:${config.mailgun.supportEmail}`}
										target="_blank"
										className="text-muted-foreground hover:text-foreground"
									>
										Support
									</Link>
								)}
								<Link
									href="/#pricing"
									className="text-muted-foreground hover:text-foreground"
								>
									Pricing
								</Link>
								<Link
									href="/blog"
									className="text-muted-foreground hover:text-foreground"
								>
									Blog
								</Link>
								<Link
									href="/#"
									target="_blank"
									className="text-muted-foreground hover:text-foreground"
								>
									Affiliates
								</Link>
							</nav>
						</div>

						<div className="lg:w-1/3 md:w-1/2 w-full px-4">
							<h2 className="font-semibold text-foreground tracking-widest text-sm md:text-left mb-3">
								LEGAL
							</h2>

							<nav className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
								<Link
									href="/tos"
									className="text-muted-foreground hover:text-foreground"
								>
									Terms of services
								</Link>
								<Link
									href="/privacy-policy"
									className="text-muted-foreground hover:text-foreground"
								>
									Privacy policy
								</Link>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
