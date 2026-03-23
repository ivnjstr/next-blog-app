'use client'
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const page = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    const response = await axios.get('/api/email');
    //save email data in the state
    setEmails(response.data.emails);
    console.log(response.data.emails)
  }

  const deleteEmail = async (mongoId) => {
    const response = await axios.delete('/api/email', {
      params: {
        id: mongoId
      }
    })
    if (response.data.success) { //if this is true 
      toast.success(response.data.msg);
      fetchEmails();
    } else {
      toast.error("Error!")
    }
  }

  useEffect(() => {
    fetchEmails();
  }, []) //i want to execute this fetchEmails only once when the components get loaded > so just add ,[]

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All Subscription</h1>
      <div className='relative max-w-150 h-[80vh] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-left text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th className='px-6 py-3' scope='col'>
                Email Subscription
              </th>
              <th className='hidden sm:block px-6 py-3' scope='col'>
                Date
              </th>
              <th className='px-6 py-3' scope='col'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {emails.map((item, index) => { //individual item is "item" then index
              return <SubsTableItem  deleteEmail={deleteEmail} key={index} email={item.email} mongoId={item._id} date={item.date} />
            })}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page
