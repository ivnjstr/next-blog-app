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
    <div className='flex-1 bg-[#fcfcfc] min-h-screen pt-8 px-6 sm:pt-12 sm:pl-16'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Email Subscriptions</h1>
        <p className='text-gray-500 text-sm mt-1'>Manage your newsletter audience and growth.</p>
      </div>

      {/* Subscription Card Container */}
      <div className='relative max-w-[800px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
        <div className='overflow-x-auto h-[75vh] scrollbar-hide'>
          <table className='w-full text-sm text-left text-gray-600'>
            <thead className='text-xs text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100 font-bold'>
              <tr>
                <th className='px-8 py-5' scope='col'>Email Address</th>
                <th className='hidden sm:table-cell px-8 py-5' scope='col'>Date Subscribed</th>
                <th className='px-8 py-5 text-center' scope='col'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
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
                <tr>
                  <td colSpan="3" className="text-center py-20 text-gray-400 italic">No subscribers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Page