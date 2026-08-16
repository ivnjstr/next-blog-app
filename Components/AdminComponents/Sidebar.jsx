'use client'

import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const DashboardIcon = ({ className }) => (
    <svg viewBox="0 0 20 20" fill="none" className={className} width={20} height={20}>
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
)

const UsersIcon = ({ className }) => (
    <svg viewBox="0 0 20 20" fill="none" className={className} width={20} height={20}>
        <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2 17c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="14.5" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.6" />
        <path d="M13 12.2c2.3.35 4 2.2 4 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
)

const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false); // State for mobile toggle
    const [stats, setStats] = useState({ blogs: 0, subs: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [blogRes, emailRes] = await Promise.all([
                    axios.get('/api/blog'),
                    axios.get('/api/email')
                ]);
                setStats({
                    blogs: blogRes.data.blogs.length,
                    subs: emailRes.data.emails.length
                });
            } catch (error) {
                // Quick stats are non-critical, fail silently
            }
        };
        fetchStats();
    }, []);

    const menuItems = [
        { name: 'Dashboard', href: '/admin', isDashboard: true },
        { name: 'Add blogs', href: '/admin/addProduct', icon: assets.add_icon },
        { name: 'Blog lists', href: '/admin/bloglist', icon: assets.blog_icon },
        ...(session?.user?.role === 'admin' ? [
            { name: 'Subscriptions', href: '/admin/subscriptions', icon: assets.email_icon },
            { name: 'Users', href: '/admin/users', isUsers: true },
        ] : []),
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
                fixed sm:sticky inset-y-0 sm:inset-y-auto left-0 sm:top-0 z-50
                flex flex-col bg-white border-r border-gray-100 h-screen overflow-y-auto
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
                                        {item.isDashboard ? (
                                            <DashboardIcon className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'} />
                                        ) : item.isUsers ? (
                                            <UsersIcon className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-black'} />
                                        ) : (
                                            <Image
                                                src={item.icon}
                                                alt=''
                                                width={20}
                                                className={`${isActive ? 'invert' : 'opacity-60 group-hover:opacity-100'}`}
                                            />
                                        )}
                                    </div>
                                    <p className='font-semibold text-sm tracking-wide'>
                                        {item.name}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                </div>
                
                {/* Bottom: Quick Stats + Live Site Link */}
                <div className='mt-auto p-8'>
                    <div className='p-4 bg-gray-50 rounded-2xl'>
                        <p className='text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3'>Quick Stats</p>
                        <div className='flex gap-3 mb-4'>
                            <div className='flex-1'>
                                <p className='text-xl font-bold text-gray-900'>{stats.blogs}</p>
                                <p className='text-[10px] text-gray-400 uppercase tracking-wider'>Posts</p>
                            </div>
                            <div className='flex-1'>
                                <p className='text-xl font-bold text-gray-900'>{stats.subs}</p>
                                <p className='text-[10px] text-gray-400 uppercase tracking-wider'>Subscribers</p>
                            </div>
                        </div>
                        <Link
                            href='/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='block text-center text-[11px] font-bold bg-white border border-gray-200 rounded-xl py-2.5 hover:bg-black hover:text-white hover:border-black transition-all'
                        >
                            View Live Site ↗
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar