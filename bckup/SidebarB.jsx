

import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // Added for active state styling
import React from 'react'

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Add blogs', href: '/admin/addProduct', icon: assets.add_icon },
        { name: 'Blog lists', href: '/admin/bloglist', icon: assets.blog_icon },
        { name: 'Subscriptions', href: '/admin/subscriptions', icon: assets.email_icon },
    ];

    return (
        <div className='flex flex-col bg-white border-r border-gray-100 min-h-screen'>
            {/* Logo Section - Clean & Spaced */}
            <div className='px-6 py-6 sm:pl-12 border-b border-gray-100'>
                <Link href='/'>
                    <Image src={assets.logo} width={130} alt='Logo' className='transition-opacity hover:opacity-80' />
                </Link>
            </div>

            {/* Navigation Container */}
            <div className='w-28 sm:w-80 relative py-10 px-4'>
                <div className='flex flex-col gap-3 w-full sm:w-[90%] ml-auto'>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        
                        return (
                            <Link 
                                key={item.href}
                                href={item.href} 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-l-full transition-all duration-200 group
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
                                <p className='font-semibold text-sm tracking-wide hidden sm:block'>
                                    {item.name}
                                </p>
                            </Link>
                        )
                    })}
                </div>
            </div>
            
            {/* Bottom Decoration/Help Text */}
            <div className='mt-auto p-8 hidden sm:block'>
                <div className='p-4 bg-gray-50 rounded-2xl'>
                    <p className='text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1'>Admin Mode</p>
                    <p className='text-[11px] text-gray-500 leading-tight'>Manage your editorial content and subscribers.</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar