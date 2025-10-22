"use client";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Next.js 13+ router hook

export default function Navbar() {
  const pathname = usePathname().replace(/\/$/, ""); // remove trailing slash

  const links = [
    { href: "/teams", label: "Teams" },
    { href: "/players", label: "Players" },
    { href: "/addStats", label: "Add Stats" },
    { href: "/addPlayer", label: "Add Player" },
    { href: "/addTeam", label: "Add Team" },
    { href: "/addGame", label: "Add Game" },
    { href: "/games", label: "Games" },
  ];

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Volleyball Stats
        </Link>
      </div>

      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1 hidden lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? "active" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
