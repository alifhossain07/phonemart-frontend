"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineShieldCheck
} from "react-icons/hi";

import { useAuth } from "@/app/context/AuthContext";


const menuItems = [
  { name: "Profile", href: "/profile", icon: <HiOutlineUser size={22} /> },
  { name: "Orders", href: "/orders", icon: <HiOutlineShoppingBag size={22} /> },
  { name: "Wishlist", href: "/wishlist", icon: <HiOutlineHeart size={22} /> },
  { name: "Warranty", href: "/warranty", icon: <HiOutlineShieldCheck size={22} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();



  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* User Info Header - Hidden or simplified on mobile to save space */}
      <div className="flex flex-row lg:flex-col items-center p-4 lg:py-8 border-b lg:border-none border-gray-50">
        
        <div className="ml-4 lg:ml-0 lg:text-center">
          <h2 className="font-bold lg:mt-4 text-base lg:text-lg text-gray-800 leading-tight">
            {user?.name || "User"}
          </h2>
          <p className="text-xs lg:text-sm text-gray-500 font-medium">
            {user?.phone || 'No phone'}
          </p>
        </div>
      </div>

      {/* Navigation - Wrapped on mobile, vertical list on desktop */}
      <nav className="flex flex-wrap lg:flex-col border-t border-gray-50 lg:border-t">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center justify-center lg:justify-between p-3 lg:p-4 transition-all group flex-1 min-w-[33%] md:min-w-[25%] lg:w-full border-r border-b border-gray-50 lg:border-r-0 ${
                isActive ? 'bg-orange-50 lg:bg-transparent text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-4">
                <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="text-[10px] sm:text-xs lg:text-base font-medium text-center">{item.name}</span>
              </div>
              
              {/* Arrow Icon - Hidden on mobile, visible on desktop */}
              <span className={`hidden lg:block text-gray-400 transition-transform ${isActive ? 'translate-x-1' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}