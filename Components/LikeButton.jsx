'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'

const HeartIcon = ({ filled, className }) => (
    <svg viewBox="0 0 20 20" width={18} height={18} className={className} fill={filled ? 'currentColor' : 'none'}>
        <path
            d="M10 17.5s-6.5-4.03-6.5-8.66C3.5 6 5.5 4 8 4c1.1 0 2.2.5 2.9 1.4A4.02 4.02 0 0113.9 4c2.5 0 4.5 2 4.5 4.5-.01 4.64-8.4 9-8.4 9z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
        />
    </svg>
)

// Reused for both post likes and comment likes — the target is identified
// purely by { targetType, targetId }. Logged-out clicks go straight to
// /login instead of firing a request that would just 401 anyway.
const LikeButton = ({ targetType, targetId, initialLiked = false, initialCount = 0, size = 'md' }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setLiked(initialLiked);
        setCount(initialCount);
    }, [targetId, initialLiked, initialCount]);

    const toggle = async () => {
        if (!session) {
            router.push('/login');
            return;
        }
        if (busy) return;

        setBusy(true);
        const prevLiked = liked;
        const prevCount = count;
        // Optimistic flip — reconciled with the server response right after.
        setLiked(!prevLiked);
        setCount(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            const res = await axios.post('/api/likes', { targetType, targetId });
            setLiked(res.data.liked);
            setCount(res.data.count);
        } catch (error) {
            setLiked(prevLiked);
            setCount(prevCount);
        } finally {
            setBusy(false);
        }
    };

    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <button
            type="button"
            onClick={toggle}
            className={`inline-flex items-center gap-1.5 ${textSize} font-semibold transition-colors ${liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
            <HeartIcon filled={liked} className={`transition-transform ${liked ? 'scale-110' : 'scale-100'}`} />
            {count}
        </button>
    )
}

export default LikeButton
