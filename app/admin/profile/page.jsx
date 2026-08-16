'use client'
import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import ConfirmDeleteModal from '@/Components/AdminComponents/ConfirmDeleteModal'

const Page = () => {
    const { update } = useSession();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [profile, setProfile] = useState({ name: "", email: "", role: "", image: "" });
    const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
    const [deletePassword, setDeletePassword] = useState("");
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const avatarPreview = useMemo(
        () => (avatarFile ? URL.createObjectURL(avatarFile) : profile.image),
        [avatarFile, profile.image]
    )

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/api/profile');
                setProfile(res.data);
            } catch (error) {
                toast.error("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (passwords.next && passwords.next !== passwords.confirm) {
            toast.error("New password and confirmation don't match.");
            return;
        }

        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('email', profile.email);
        if (avatarFile) formData.append('image', avatarFile);
        if (passwords.next) {
            formData.append('currentPassword', passwords.current);
            formData.append('newPassword', passwords.next);
        }

        setSaving(true);
        try {
            const res = await axios.put('/api/profile', formData);
            if (res.data.success) {
                toast.success(res.data.msg);
                setProfile(res.data.user);
                setAvatarFile(null);
                setPasswords({ current: "", next: "", confirm: "" });
                // Push the fresh name/email/image into the live session
                // (header, etc.) without requiring a re-login.
                await update({
                    name: res.data.user.name,
                    email: res.data.user.email,
                    image: res.data.user.image
                });
            } else {
                toast.error(res.data.msg || "Update failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    }

    const deleteAccount = async () => {
        setConfirmingDelete(false);
        setDeleting(true);
        try {
            const res = await axios.delete('/api/profile', { data: { currentPassword: deletePassword } });
            if (res.data.success) {
                toast.success(res.data.msg);
                await signOut({ callbackUrl: '/' });
            } else {
                toast.error(res.data.msg || "Deletion failed");
                setDeleting(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong.");
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-[#fcfcfc]'>
                <p className='text-gray-400 font-medium'>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className='bg-[#fcfcfc] min-h-screen pb-20'>
            <form onSubmit={onSubmitHandler} className='pt-8 px-6 sm:pt-12 sm:pl-16 max-w-[600px]'>

                <div className='mb-10'>
                    <h1 className='text-2xl font-bold text-gray-900'>My Profile</h1>
                    <p className='text-gray-500 text-sm mt-1'>Update your account details and password.</p>
                </div>

                {/* Avatar */}
                <div className='flex flex-col items-center gap-3 mb-8'>
                    <label htmlFor="avatar" className='cursor-pointer group relative'>
                        <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-gray-200 overflow-hidden bg-white group-hover:border-black transition-all">
                            <Image
                                src={avatarPreview || assets.profile_icon}
                                alt='Profile'
                                fill
                                className='object-cover'
                                unoptimized={!!avatarFile}
                            />
                        </div>
                        <span className='absolute bottom-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full'>EDIT</span>
                    </label>
                    <input onChange={(e) => setAvatarFile(e.target.files[0])} type="file" id='avatar' accept="image/*" hidden />
                </div>

                {/* Fields */}
                <div className='flex flex-col gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm'>

                    <div>
                        <div className='flex items-center justify-between mb-2'>
                            <p className='text-sm font-bold text-gray-700'>Role</p>
                            <span className='text-[10px] font-bold uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full'>{profile.role}</span>
                        </div>
                        <p className='text-xs text-gray-400'>Your role can&apos;t be changed from here.</p>
                    </div>

                    <div>
                        <p className='text-sm font-bold text-gray-700 mb-2'>Name</p>
                        <input
                            className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all'
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div>
                        <p className='text-sm font-bold text-gray-700 mb-2'>Email</p>
                        <input
                            className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all'
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                            required
                        />
                        <p className='text-xs text-gray-400 mt-2'>Changing this changes the email you log in with.</p>
                    </div>

                    <div className='pt-4 border-t border-gray-100'>
                        <p className='text-sm font-bold text-gray-700 mb-1'>Change Password</p>
                        <p className='text-xs text-gray-400 mb-4'>Leave blank to keep your current password.</p>

                        <div className='flex flex-col gap-4'>
                            <input
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all'
                                type="password"
                                placeholder='Current password'
                                value={passwords.current}
                                onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                            />
                            <input
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all'
                                type="password"
                                placeholder='New password'
                                value={passwords.next}
                                onChange={(e) => setPasswords(p => ({ ...p, next: e.target.value }))}
                            />
                            <input
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all'
                                type="password"
                                placeholder='Confirm new password'
                                value={passwords.confirm}
                                onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                            />
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={saving}
                        className='mt-2 w-full sm:w-40 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {saving ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                </div>
            </form>

            <div className='pt-8 px-6 sm:pl-16 max-w-[600px]'>
                <div className='flex flex-col gap-4 bg-white p-8 rounded-2xl border border-red-100 shadow-sm'>
                    <div>
                        <p className='text-sm font-bold text-red-600'>Danger Zone</p>
                        <p className='text-xs text-gray-400 mt-1'>Deleting your account permanently removes it and every post you&apos;ve written. This can&apos;t be undone.</p>
                    </div>
                    <input
                        className='w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black transition-all'
                        type="password"
                        placeholder='Enter your password to confirm'
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                    <button
                        type='button'
                        disabled={deleting || !deletePassword}
                        onClick={() => setConfirmingDelete(true)}
                        className='w-full sm:w-56 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {deleting ? 'DELETING...' : 'DELETE MY ACCOUNT'}
                    </button>
                </div>
            </div>

            {confirmingDelete && (
                <ConfirmDeleteModal
                    heading='Delete your account?'
                    message={"Your account and every post you've written will be permanently removed. This can't be undone."}
                    confirmLabel='Yes, delete my account'
                    onCancel={() => setConfirmingDelete(false)}
                    onConfirm={deleteAccount}
                />
            )}
        </div>
    )
}

export default Page
