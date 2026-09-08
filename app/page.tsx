import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YOOM — Video calls & meetings for everyone',
  description:
    'YOOM lets you connect, collaborate, and celebrate from anywhere with secure video meetings, screen sharing, recordings, and an AI assistant.',
};

const features = [
  {
    icon: '/icons/add-meeting.svg',
    title: 'Instant Meetings',
    description:
      'Start a high-quality video call in one click. No downloads, no waiting.',
  },
  {
    icon: '/icons/schedule.svg',
    title: 'Schedule Ahead',
    description:
      'Plan meetings in advance and share invite links with your team.',
  },
  {
    icon: '/icons/recordings.svg',
    title: 'Recordings',
    description:
      'Record any meeting and revisit the important moments whenever you need.',
  },
  {
    icon: '/icons/add-personal.svg',
    title: 'Personal Room',
    description:
      'Get your own permanent meeting room with a link you can reuse anytime.',
  },
  {
    icon: '/icons/ai-chat.svg',
    title: 'AI Assistant',
    description:
      'Draft agendas, summaries, and invites with a built-in AI chat helper.',
  },
  {
    icon: '/icons/join-meeting.svg',
    title: 'Join by Link',
    description:
      'Hop into any meeting instantly with a simple, shareable invitation link.',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-2 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-dark-3 bg-dark-1/80 px-6 py-4 backdrop-blur-md lg:px-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icons/logo.svg" width={32} height={32} alt="YOOM logo" />
          <p className="text-2xl font-extrabold">YOOM</p>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-sky-1 transition hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-blue-1 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-16 lg:py-28">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <span className="mb-6 rounded-full border border-dark-4 bg-dark-3 px-4 py-1.5 text-sm text-sky-1">
            🎥 Video calling, reimagined
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight lg:text-6xl">
            Connect, collaborate, and celebrate{' '}
            <span className="text-blue-1">from anywhere</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-sky-1">
            YOOM brings your team together with secure HD video meetings, screen
            sharing, recordings, and a built-in AI assistant. All in one place.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-xl bg-blue-1 px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-110"
            >
              Start for free
            </Link>
            <Link
              href="/sign-in"
              className="rounded-xl border border-dark-4 bg-dark-3 px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-125"
            >
              Sign in
            </Link>
          </div>

          {/* Hero visual */}
          <div className="mt-16 w-full max-w-4xl">
            <div className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-dark-3 bg-hero bg-cover bg-center shadow-2xl lg:h-[420px]">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-1/80 to-transparent" />
              <div className="glassmorphism absolute bottom-6 left-6 rounded-xl px-5 py-3">
                <p className="text-sm font-medium">Your meeting is ready ✨</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold lg:text-4xl">
              Everything you need to meet
            </h2>
            <p className="mt-3 text-sky-1">
              Powerful features that make remote collaboration effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-dark-3 bg-dark-1 p-6 transition hover:border-blue-1"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-1">
                  <Image
                    src={feature.icon}
                    width={24}
                    height={24}
                    alt={feature.title}
                  />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-sky-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-dark-3 bg-gradient-to-br from-blue-1/20 to-dark-1 p-10 text-center lg:p-16">
          <h2 className="text-3xl font-bold lg:text-4xl">
            Ready to start your first meeting?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sky-1">
            Join for free and host your first video call in seconds. No credit
            card required.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-xl bg-blue-1 px-8 py-3.5 text-base font-semibold text-white transition hover:brightness-110"
          >
            Get started now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-3 px-6 py-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/icons/logo.svg" width={24} height={24} alt="YOOM logo" />
            <p className="text-lg font-bold">YOOM</p>
          </div>
          <p className="text-sm text-sky-1">
            © {new Date().getFullYear()} YOOM. Video calls & meetings for
            everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
