import React from 'react'

const SubsTableItem = ({ email, mongoId, date, deleteEmail }) => {
    const emailDate = new Date(date);

    return (
        <tr className='bg-white hover:bg-gray-50/50 transition-colors group'>
            {/* Email Column */}
            <th scope='row' className='px-8 py-5 font-semibold text-gray-900 whitespace-nowrap'>
                {email || "No Email"}
            </th>

            {/* Date Column */}
            <td className='px-8 py-5 hidden sm:table-cell text-gray-500'>
                {emailDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
            </td>

            {/* Action Column */}
            <td className='px-8 py-5 text-center'>
                <button 
                    onClick={() => deleteEmail(mongoId)} 
                    className='px-3 py-1.5 text-[11px] font-bold text-red-500 bg-red-50 rounded-lg group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white'
                >
                    REMOVE
                </button>
            </td>
        </tr>
    )
}

export default SubsTableItem