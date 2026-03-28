import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#fcfcfc]">
            <ToastContainer theme="dark" position="bottom-right" />
            
            {/* Sidebar remains fixed on the left */}
            <Sidebar />

            <div className="flex flex-col w-full sm:pl-0">
                {/* Top Navigation Bar */}
                <header className="sticky top-0 z-10 flex items-center justify-between w-full py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div className="flex items-center gap-2 pl-12 sm:pl-0">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">
                            Admin Console
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-gray-900">Ivan Jester</p>
                            <p className="text-[10px] text-gray-400">Editor-in-Chief</p>
                        </div>
                        <div className="relative">
                            <Image 
                                src={assets.profile_icon} 
                                width={40} 
                                height={40}
                                alt="Profile" 
                                className="rounded-full border border-gray-200 p-0.5 hover:ring-2 hover:ring-black transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}