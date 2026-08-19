'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import LikeButton from '@/Components/LikeButton'
import Avatar from '@/Components/Avatar'
import ConfirmDeleteModal from '@/Components/AdminComponents/ConfirmDeleteModal'

const timeAgo = (dateString) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    const units = [
        ['year', 31536000], ['month', 2592000], ['day', 86400],
        ['hour', 3600], ['minute', 60]
    ];
    for (const [label, secondsInUnit] of units) {
        const value = Math.floor(seconds / secondsInUnit);
        if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`;
    }
    return 'just now';
}

const CommentComposer = ({ value, onChange, onSubmit, submitting, placeholder, autoFocus, onCancel }) => (
    <div className='flex flex-col gap-2'>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            rows={2}
            maxLength={2000}
            className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 outline-none focus:border-black dark:focus:border-white transition-all text-sm resize-none'
        />
        <div className='flex gap-2 justify-end'>
            {onCancel && (
                <button
                    type='button'
                    onClick={onCancel}
                    className='px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
                >
                    Cancel
                </button>
            )}
            <button
                type='button'
                onClick={onSubmit}
                disabled={submitting || !value.trim()}
                className='px-5 py-2 text-xs font-bold text-white dark:text-black bg-black dark:bg-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed'
            >
                {submitting ? 'Posting...' : 'Comment'}
            </button>
        </div>
    </div>
)

const CommentRow = ({ comment, canEdit, canDelete, allowComments, isReply, onEdit, onDelete, onReply, replyOpen }) => {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);

    const submitEdit = async () => {
        if (!editText.trim()) return;
        setSavingEdit(true);
        const ok = await onEdit(comment._id, editText.trim());
        setSavingEdit(false);
        if (ok) setEditing(false);
    };

    return (
        <div className='flex gap-3'>
            <Avatar
                src={comment.user?.image}
                name={comment.user?.name}
                size={isReply ? 28 : 36}
                className='border border-gray-100 dark:border-gray-800'
            />
            <div className='flex-1 min-w-0'>
                <div className='flex items-baseline gap-2 flex-wrap'>
                    <p className='text-sm font-bold text-gray-900 dark:text-white'>{comment.user?.name || 'Deleted user'}</p>
                    <p className='text-xs text-gray-400 dark:text-gray-500'>{timeAgo(comment.createdAt)}</p>
                    {comment.edited && <p className='text-xs text-gray-300 dark:text-gray-600 italic'>Edited</p>}
                </div>

                {editing ? (
                    <div className='mt-2'>
                        <CommentComposer
                            value={editText}
                            onChange={setEditText}
                            onSubmit={submitEdit}
                            submitting={savingEdit}
                            onCancel={() => { setEditing(false); setEditText(comment.content); }}
                        />
                    </div>
                ) : (
                    <p className='text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap break-words'>{comment.content}</p>
                )}

                {!editing && (
                    <div className='flex items-center gap-4 mt-2'>
                        <LikeButton
                            targetType='comment'
                            targetId={comment._id}
                            initialLiked={comment.likedByMe}
                            initialCount={comment.likeCount}
                            size='sm'
                        />
                        {!isReply && allowComments && (
                            <button
                                type='button'
                                onClick={() => onReply(comment._id)}
                                className='text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
                            >
                                {replyOpen ? 'Cancel' : 'Reply'}
                            </button>
                        )}
                        {canEdit && (
                            <button
                                type='button'
                                onClick={() => setEditing(true)}
                                className='text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
                            >
                                Edit
                            </button>
                        )}
                        {canDelete && (
                            <button
                                type='button'
                                onClick={() => setConfirmingDelete(true)}
                                className='text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors'
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>

            {confirmingDelete && (
                <ConfirmDeleteModal
                    heading='Delete this comment?'
                    message='This comment (and any replies to it) will be permanently removed.'
                    onCancel={() => setConfirmingDelete(false)}
                    onConfirm={() => { setConfirmingDelete(false); onDelete(comment._id); }}
                />
            )}
        </div>
    )
}

// postOwnerId is used for the post-author moderation right ("can delete
// comments on my own post"); currentUserId comes from the session, not
// props — the server independently re-checks all of this anyway.
const CommentSection = ({ postId, allowComments, postOwnerId }) => {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [postingReply, setPostingReply] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await axios.get('/api/comments', { params: { postId } });
            setComments(res.data.comments);
        } catch (error) {
            toast.error('Failed to load comments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComments(); }, [postId]);

    const submitComment = async () => {
        if (!newComment.trim()) return;
        setPosting(true);
        try {
            await axios.post('/api/comments', { postId, content: newComment.trim() });
            setNewComment('');
            await fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Something went wrong.');
        } finally {
            setPosting(false);
        }
    };

    const submitReply = async (parentId) => {
        if (!replyText.trim()) return;
        setPostingReply(true);
        try {
            await axios.post('/api/comments', { postId, content: replyText.trim(), parentId });
            setReplyText('');
            setReplyingTo(null);
            await fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Something went wrong.');
        } finally {
            setPostingReply(false);
        }
    };

    const editComment = async (id, content) => {
        try {
            await axios.put('/api/comments', { content }, { params: { id } });
            await fetchComments();
            return true;
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Something went wrong.');
            return false;
        }
    };

    const deleteComment = async (id) => {
        try {
            await axios.delete('/api/comments', { params: { id } });
            await fetchComments();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Something went wrong.');
        }
    };

    const topLevel = comments.filter((c) => !c.parentId);
    const repliesOf = (id) => comments.filter((c) => c.parentId === id || String(c.parentId) === String(id));

    const isAdmin = session?.user?.role === 'admin';
    const isPostOwner = postOwnerId && session?.user?.id === String(postOwnerId);

    return (
        <div className='mt-8 pt-8 border-t border-gray-100 dark:border-gray-800'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-6'>Comments ({comments.length})</h3>

            {allowComments ? (
                session ? (
                    <div className='mb-10'>
                        <CommentComposer
                            value={newComment}
                            onChange={setNewComment}
                            onSubmit={submitComment}
                            submitting={posting}
                            placeholder='Write a comment...'
                        />
                    </div>
                ) : (
                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-10'>
                        <Link href='/login' className='font-bold text-black dark:text-white hover:underline'>Log in</Link> to join the conversation.
                    </p>
                )
            ) : (
                <p className='text-sm text-gray-400 dark:text-gray-500 italic mb-10'>Comments are closed for this post.</p>
            )}

            {loading ? (
                <p className='text-sm text-gray-400 dark:text-gray-500 italic'>Loading comments...</p>
            ) : topLevel.length === 0 ? (
                <p className='text-sm text-gray-400 dark:text-gray-500 italic'>No comments yet.</p>
            ) : (
                <div className='flex flex-col gap-8'>
                    {topLevel.map((comment) => {
                        const ownComment = session?.user?.id === String(comment.user?._id);
                        return (
                            <div key={comment._id} className='flex flex-col gap-4'>
                                <CommentRow
                                    comment={comment}
                                    isReply={false}
                                    allowComments={allowComments}
                                    canEdit={ownComment}
                                    canDelete={ownComment || isAdmin || isPostOwner}
                                    onEdit={editComment}
                                    onDelete={deleteComment}
                                    onReply={(id) => setReplyingTo(replyingTo === id ? null : id)}
                                    replyOpen={replyingTo === comment._id}
                                />

                                {replyingTo === comment._id && (
                                    <div className='ml-11'>
                                        <CommentComposer
                                            value={replyText}
                                            onChange={setReplyText}
                                            onSubmit={() => submitReply(comment._id)}
                                            submitting={postingReply}
                                            placeholder={`Reply to ${comment.user?.name || 'this comment'}...`}
                                            autoFocus
                                            onCancel={() => { setReplyingTo(null); setReplyText(''); }}
                                        />
                                    </div>
                                )}

                                {repliesOf(comment._id).map((reply) => {
                                    const ownReply = session?.user?.id === String(reply.user?._id);
                                    return (
                                        <div key={reply._id} className='ml-11'>
                                            <CommentRow
                                                comment={reply}
                                                isReply={true}
                                                allowComments={allowComments}
                                                canEdit={ownReply}
                                                canDelete={ownReply || isAdmin || isPostOwner}
                                                onEdit={editComment}
                                                onDelete={deleteComment}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default CommentSection
