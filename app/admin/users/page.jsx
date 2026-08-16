'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import Avatar from '@/Components/Avatar'

const Page = () => {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data.users);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const changeRole = async (id, role) => {
        setSavingId(id);
        try {
            const res = await axios.patch('/api/users', { id, role });
            if (res.data.success) {
                toast.success(res.data.msg);
                fetchUsers();
            } else {
                toast.error(res.data.msg || "Update failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong.");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className='flex-1 bg-[#fcfcfc] min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold text-gray-900'>Users</h1>
                <p className='text-gray-500 text-sm mt-1'>Manage roles for everyone on the platform.</p>
            </div>

            <div className='relative max-w-[1000px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
                <div className='max-h-[75vh] overflow-y-auto scrollbar-hide'>

                    <div className='hidden sm:flex items-center gap-4 text-xs text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100 font-bold px-8 py-5'>
                        <div className='w-56 shrink-0'>User</div>
                        <div className='flex-1'>Email</div>
                        <div className='w-20 shrink-0 text-center'>Posts</div>
                        <div className='w-40 shrink-0 text-center'>Role</div>
                    </div>

                    <div className='divide-y divide-gray-50'>
                        {loading ? (
                            <p className="text-center py-20 text-gray-400 italic">Loading users...</p>
                        ) : users.length > 0 ? (
                            users.map((u) => (
                                <div key={u._id} className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 sm:px-8 sm:py-5 hover:bg-gray-50/50 transition-colors'>
                                    <div className='flex items-center gap-3 w-56 shrink-0'>
                                        <Avatar
                                            src={u.image}
                                            name={u.name}
                                            size={32}
                                            className='border border-gray-100 shadow-sm'
                                        />
                                        <p className='text-sm font-semibold text-gray-900'>{u.name}</p>
                                    </div>

                                    <p className='flex-1 text-sm text-gray-500 truncate'>{u.email}</p>

                                    <p className='w-20 shrink-0 text-center text-sm text-gray-500'>{u.postCount}</p>

                                    <div className='w-40 shrink-0 flex justify-center'>
                                        <select
                                            value={u.role}
                                            disabled={savingId === u._id || u.email === session?.user?.email}
                                            onChange={(e) => changeRole(u._id, e.target.value)}
                                            className='px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white outline-none focus:border-black disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            <option value="author">Author</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-20 text-gray-400 italic">No users found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
