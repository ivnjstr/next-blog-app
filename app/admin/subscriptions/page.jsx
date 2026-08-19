'use client'
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const response = await axios.get('/api/email');
    setEmails(response.data.emails);
  }

  const deleteEmail = async (mongoId) => {
    const response = await axios.delete('/api/email', {
      params: { id: mongoId }
    })
    if (response.data.success) {
      toast.success(response.data.msg);
      fetchEmails();
    } else {
      toast.error("Error!")
    }
  }

  useEffect(() => {
    fetchEmails();
  }, [])

  return (
    <div className='flex-1 bg-[#fcfcfc] dark:bg-gray-950 min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Email Subscriptions</h1>
        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Manage your newsletter audience and growth.</p>
      </div>

      {/* Subscription Card Container */}
      <div className='relative max-w-[800px] overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm'>
        <div className='max-h-[75vh] overflow-y-auto scrollbar-hide'>

          {/* Header row - desktop only, mobile cards are self-describing */}
          <div className='hidden sm:flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 font-bold px-8 py-5'>
            <div className='flex-1'>Email Address</div>
            <div className='w-32 shrink-0'>Date Subscribed</div>
            <div className='w-28 shrink-0 text-center'>Action</div>
          </div>

          <div className='divide-y divide-gray-50 dark:divide-gray-800'>
            {emails.length > 0 ? (
              emails.map((item, index) => (
                <SubsTableItem
                  deleteEmail={deleteEmail}
                  key={index}
                  email={item.email}
                  mongoId={item._id}
                  date={item.date}
                />
              ))
            ) : (
              <p className="text-center py-20 text-gray-400 dark:text-gray-500 italic">No subscribers yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page