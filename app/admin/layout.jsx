'use client' // Added because we use signOut hooks
import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import { Providers } from "@/Components/Providers";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, useSession } from "next-auth/react";

export default function Layout({ children }) {
    const { data: session } = useSession();

    return (
        <div className="flex min-h-screen bg-[#fcfcfc]">
            
            <ToastContainer theme="dark" position="bottom-right" />
            
            <Sidebar />

            <div className="flex flex-col w-full sm:pl-0">
                <header className="sticky top-0 z-10 flex items-center justify-between w-full py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="flex items-center gap-2 pl-12 sm:pl-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">
                            Console
                        </h3>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/admin/profile" className="flex items-center gap-3 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-gray-900 group-hover:underline">{session?.user?.name || "Admin"}</p>
                                <p className="text-[10px] text-gray-400 capitalize">{session?.user?.role}</p>
                            </div>
                            <div className="relative w-10 h-10">
                                <Image
                                    src={session?.user?.image || assets.profile_icon}
                                    fill
                                    alt="Profile"
                                    className="rounded-full border border-gray-200 p-0.5 object-cover group-hover:border-black transition-all"
                                />
                            </div>
                        </Link>

                        {/* Logout Button */}
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="text-[10px] font-bold border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all uppercase tracking-tighter"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>
            </div>
           
        </div>
    )
}