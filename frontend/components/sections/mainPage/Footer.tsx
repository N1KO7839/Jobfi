import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const SPECIALIZATIONS = [
    { label: "Backend Development", href: "/offers?search=Backend" },
    { label: "Frontend & Web", href: "/offers?search=Frontend" },
    { label: "DevOps & Cloud", href: "/offers?search=DevOps" },
    { label: "Data & AI/ML", href: "/offers?search=Data" },
    { label: "Mobile Engineering", href: "/offers?search=Mobile" },
    { label: "QA & Reliability", href: "/offers?search=QA" },
  ];

  const HUBS = [
    { label: "Warszawa", href: "/offers?location=Warszawa" },
    { label: "Kraków", href: "/offers?location=Kraków" },
    { label: "Wrocław", href: "/offers?location=Wrocław" },
    { label: "Trójmiasto", href: "/offers?location=Gdańsk" },
    { label: "Poznań", href: "/offers?location=Poznań" },
    { label: "Remote Only", href: "/offers?working_mode=Remote" },
  ];

  const BOARDS = [
    { label: "NoFluffJobs", href: "/offers?source=NoFluffJobs" },
    { label: "JustJoin.it", href: "/offers?source=JustJoinIT" },
    { label: "Pracuj.pl", href: "/offers?source=Pracuj.pl" },
    { label: "The Protocol", href: "/offers?source=The Protocol" },
    { label: "Bulldogjob", href: "/offers?source=Bulldogjob" },
    { label: "Solid.Jobs", href: "/offers?source=Solid.Jobs" },
  ];

  return (
    <footer className="mt-auto border-t border-default-200 bg-background/50 pt-12 pb-8 text-sm">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 flex flex-col gap-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2 flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-content2 border border-default-200/80 flex items-center justify-center p-1.5 shadow-2xs">
                <Image
                  alt="Jobfi Logo"
                  className="dark:hidden object-contain"
                  height={18}
                  src="/logo_black.svg"
                  width={18}
                />
                <Image
                  alt="Jobfi Logo"
                  className="hidden dark:block object-contain"
                  height={18}
                  src="/logo.svg"
                  width={18}
                />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                Jobfi
              </span>
            </div>

            <p className="text-default-500 text-xs leading-relaxed max-w-sm">
              Browse tech jobs across Poland with transparent salaries. Sourced
              daily from NoFluffJobs, JustJoin.it, Pracuj.pl, and more.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Specializations
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-default-500">
              {SPECIALIZATIONS.map((item) => (
                <li key={item.label}>
                  <Link
                    className="hover:text-foreground transition-colors"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Tech Hubs
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-default-500">
              {HUBS.map((item) => (
                <li key={item.label}>
                  <Link
                    className="hover:text-foreground transition-colors"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Job Portals
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-default-500">
              {BOARDS.map((item) => (
                <li key={item.label}>
                  <Link
                    className="hover:text-foreground transition-colors"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-default-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-default-400">
          <p>© 2026 Jobfi. Engineered for software engineers in Poland.</p>

          <div className="flex items-center gap-5">
            <Link
              className="hover:text-foreground transition-colors"
              href="/offers"
            >
              Browse Offers
            </Link>
            <Link
              className="hover:text-foreground transition-colors"
              href="/about"
            >
              How It Works
            </Link>
            <Link
              className="hover:text-foreground transition-colors"
              href="/auth/login"
            >
              Sign In
            </Link>
            <Link
              className="hover:text-foreground transition-colors"
              href="/auth/register"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
