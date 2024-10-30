import Link from "next/link";
import ButtonSignin from "@/components/ButtonSignin";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <header className="p-4 flex justify-end max-w-7xl mx-auto">
        <ButtonSignin text="Login" />
      </header>

      <main>
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center">
          <div className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                  Transform YouTube Videos Into Perfect{" "}
                  <span className="text-primary">AI Clips</span>
                </h1>
                <p className="text-xl opacity-80 leading-relaxed">
                  Create engaging short-form content automatically. Our AI analyzes your videos and creates the perfect clips for social media.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="btn btn-primary btn-lg">
                  Get Started Free
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="/pricing" className="btn btn-outline btn-lg">
                  View Pricing
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="avatar"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-base-100">
                        <img
                          src={`https://i.pravatar.cc/150?img=${i}`}
                          alt="User avatar"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="opacity-80">
                  Joined by 1,000+ content creators
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070"
                  alt="Video Editing Dashboard"
                  className="object-cover"
                  fill
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-base-100/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-base-200">
          <div className="max-w-7xl mx-auto px-8 py-24">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">How It Works</h2>
              <p className="text-lg opacity-80 max-w-2xl mx-auto">
                Create viral-worthy clips in three simple steps. No editing experience required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Upload Your Video",
                  description: "Simply paste your YouTube URL or upload your video directly",
                  icon: "🎥"
                },
                {
                  title: "AI Analysis",
                  description: "Our AI identifies the most engaging moments in your content",
                  icon: "🤖"
                },
                {
                  title: "Get Perfect Clips",
                  description: "Download ready-to-share clips optimized for each platform",
                  icon: "✨"
                }
              ].map((feature, i) => (
                <div key={i} className="card bg-base-100 shadow-xl">
                  <div className="card-body items-center text-center">
                    <span className="text-4xl mb-4">{feature.icon}</span>
                    <h3 className="card-title">{feature.title}</h3>
                    <p className="opacity-80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
