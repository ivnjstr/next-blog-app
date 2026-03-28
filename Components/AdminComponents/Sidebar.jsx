'use client'

import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

const Sidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); // State for mobile toggle

    const menuItems = [
        { name: 'Add blogs', href: '/admin/addProduct', icon: assets.add_icon },
        { name: 'Blog lists', href: '/admin/bloglist', icon: assets.blog_icon },
        { name: 'Subscriptions', href: '/admin/subscriptions', icon: assets.email_icon },
    ];

    return (
        <>
            {/* Mobile Toggle Button (Visible only on small screens) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`sm:hidden fixed top-4 left-4 z-[60] bg-black p-2 rounded-md shadow-lg ${isOpen ? 'hidden' : ''}`}
            >
                <div className='flex flex-col gap-1 w-5'>
                    <span className={`h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
            </button>

            {/* Overlay for mobile (closes menu when clicking outside) */}
            {isOpen && (
                <div 
                    className='fixed inset-0 bg-black/20 backdrop-blur-sm z-[40] sm:hidden'
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed sm:static inset-y-0 left-0 z-50
                flex flex-col bg-white border-r border-gray-100 min-h-screen
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                sm:translate-x-0 w-72 sm:w-80
            `}>
                
                {/* Logo Section */}
                <div className='px-6 py-6 sm:pl-12 border-b border-gray-100 flex items-center justify-between'>
                    <Link href='/' onClick={() => setIsOpen(false)}>
                        <Image src={assets.logo} width={130} alt='Logo' className='transition-opacity hover:opacity-80' />
                    </Link>
                </div>

                {/* Navigation Container */}
                <div className='relative py-10 px-4'>
                    <div className='flex flex-col gap-3 w-full sm:w-[90%] ml-auto'>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href} 
                                    onClick={() => setIsOpen(false)} // Closes menu on click
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-l-full sm:rounded-l-full rounded-r-full sm:rounded-r-none transition-all duration-200 group
                                        ${isActive 
                                            ? 'bg-black text-white shadow-lg shadow-black/10' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                        }`}
                                >
                                    <div className={`p-1 rounded-md ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                                        <Image 
                                            src={item.icon} 
                                            alt='' 
                                            width={20} 
                                            className={`${isActive ? 'invert' : 'opacity-60 group-hover:opacity-100'}`} 
                                        />
                                    </div>
                                    <p className='font-semibold text-sm tracking-wide'>
                                        {item.name}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                </div>
                
                {/* Bottom Decoration */}
                <div className='mt-auto p-8'>
                    <div className='p-4 bg-gray-50 rounded-2xl'>
                        <p className='text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1'>Admin Mode</p>
                        <p className='text-[11px] text-gray-500 leading-tight'>Manage your editorial content and subscribers.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar