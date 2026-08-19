'use client'
import { createPortal } from 'react-dom'

const ConfirmDeleteModal = ({ title, heading = 'Delete this post?', message, confirmLabel = 'Yes, delete', onCancel, onConfirm }) => {
    if (typeof document === 'undefined') return null

    return createPortal(
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'
            onClick={onCancel}
        >
            <div
                className='w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6'
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>{heading}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                    {message || (title ? <>&quot;<span className='font-semibold text-gray-700 dark:text-gray-200'>{title}</span>&quot; will be permanently removed. This can&apos;t be undone.</> : "This post will be permanently removed. This can't be undone.")}
                </p>
                <div className='flex justify-end gap-3'>
                    <button
                        onClick={onCancel}
                        className='px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all'
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmDeleteModal
