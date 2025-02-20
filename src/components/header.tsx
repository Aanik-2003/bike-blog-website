"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeClass = "text-red-500";
  const inactiveClass = "hover:text-red-500";

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white shadow z-50">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/">AK</Link>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                href="/"
                className={`transition-colors ${pathname === "/" ? activeClass : inactiveClass}`}
              >
                Home
              </Link>
            </li>
            
            <li className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`transition-colors ${pathname.startsWith("/categories") ? activeClass : inactiveClass}`}
              >
                Categories
              </button>
              <ul
                ref={dropdownRef}
                className={`absolute left-0 mt-2 w-48 bg-gray-800 rounded shadow-lg transition-opacity duration-200 ${
                  isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <li>
                  <Link href="/categories/mountain-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Mountain Bikes
                  </Link>
                </li>
                <li>
                  <Link href="/categories/electric-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Electric Bikes
                  </Link>
                </li>
                <li>
                  <Link href="/categories/cruiser-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Cruiser Bikes
                  </Link>
                </li>
                <li>
                  <Link href="/categories/hybrid-bikes" className="block px-4 py-2 hover:bg-red-600">
                    Hybrid Bikes
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
