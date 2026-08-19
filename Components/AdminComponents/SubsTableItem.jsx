import React from 'react'

const SubsTableItem = ({ email, mongoId, date, deleteEmail }) => {
    const emailDate = new Date(date);

    return (
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 sm:px-8 sm:py-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group'>
            {/* Email */}
            <p className='flex-1 min-w-0 font-semibold text-gray-900 dark:text-white truncate'>
                {email || "No Email"}
            </p>

            {/* Date + Action: same row on mobile, separate columns on desktop */}
            <div className='flex items-center justify-between gap-3 sm:contents'>
                <p className='text-sm text-gray-500 dark:text-gray-400 sm:w-32 sm:shrink-0'>
                    {emailDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </p>

                <div className='sm:w-28 sm:shrink-0 flex sm:justify-center'>
                    <button
                        onClick={() => deleteEmail(mongoId)}
                        className='px-3 py-1.5 text-[11px] font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg group-hover:opacity-100 transition-all hover:bg-red-500 dark:hover:bg-red-600 hover:text-white'
                    >
                        REMOVE
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SubsTableItem
