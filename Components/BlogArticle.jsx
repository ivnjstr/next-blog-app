'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import LikeButton from '@/Components/LikeButton'
import CommentSection from '@/Components/CommentSection'
import Avatar from '@/Components/Avatar'

// Renders a blog post's hero + article body.
// Shared by the real /blogs/[id] page and the admin "Add Blog" live preview
// so both stay pixel-identical instead of drifting apart over time. Likes
// and comments only render when postId is present — the admin live preview
// (an unsaved draft) has no real post to attach them to.
const BlogArticle = ({
    title, category, author, authorImage, image, description, showHeaderLink = true,
    postId, postOwnerId, allowComments, likeCount, likedByCurrentUser
}) => {
    const { data: session } = useSession();
    return (
        <div className="bg-white min-h-screen">
            {/* Transparent Header Over soft background */}
            <div className='bg-[#f9f9f9] py-8 px-6 md:px-12 lg:px-28'>
                <div className='flex justify-between items-center max-w-7xl mx-auto'>
                    {showHeaderLink ? (
                        <Link href={'/'}>
                            <Image src={assets.logo} alt='Logo' width={140} className='w-28 sm:w-36' />
                        </Link>
                    ) : (
                        <Image src={assets.logo} alt='Logo' width={140} className='w-28 sm:w-36' />
                    )}
                    {showHeaderLink && (
                        <Link href={session ? '/admin' : '/signup'}>
                            <button className='flex items-center gap-2 font-semibold py-2 px-5 sm:px-8 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-sm'>
                                {session ? 'Dashboard' : 'Get Started'} <Image src={assets.arrow} alt='' className='invert w-3' />
                            </button>
                        </Link>
                    )}
                </div>

                {/* Hero Title Section */}
                <div className='text-center mt-16 mb-24 max-w-4xl mx-auto'>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold mb-4">{category}</p>
                    <h1 className='text-3xl sm:text-6xl font-bold leading-tight text-gray-900 mb-8'>
                        {title || "Your Blog Title"}
                    </h1>

                    <div className="flex flex-col items-center">
                        <Avatar src={authorImage} name={author} size={50} className='border-2 border-white shadow-md' />
                        <p className='mt-3 text-gray-600 font-medium italic'>by {author}</p>
                    </div>
                </div>
            </div>

            {/* Featured Image - Overlapping look */}
            <div className='max-w-5xl mx-auto px-5 -mt-16 mb-16'>
                {image ? (
                    <Image
                        className='rounded-3xl shadow-2xl object-cover aspect-video border-[8px] border-white'
                        src={image}
                        width={1280}
                        height={720}
                        alt='Featured'
                        unoptimized={typeof image === 'string' && image.startsWith('blob:')}
                    />
                ) : (
                    <div className='rounded-3xl shadow-2xl aspect-video border-[8px] border-white bg-gray-200' />
                )}
            </div>

            {/* Article Content */}
            <article className='max-w-5xl mx-auto px-6 mb-20'>
                <div
                    className='blog-content prose prose-lg max-w-none first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left text-gray-700 leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: description || "<p class='text-gray-400 italic'>Your content will appear here...</p>" }}
                >
                </div>

                {postId && (
                    <div className='mt-16 pt-8 border-t border-gray-100'>
                        <LikeButton
                            targetType='post'
                            targetId={postId}
                            initialLiked={likedByCurrentUser}
                            initialCount={likeCount}
                        />
                    </div>
                )}

                {/* Social Sharing Section */}
                <div className='mt-8 py-10 border-t border-gray-100'>
                    <p className='text-gray-400 uppercase text-[10px] tracking-widest font-bold mb-6'>Share this story</p>
                    <div className='flex gap-4'>
                        <Image src={assets.facebook_icon} alt='FB' width={32} className='cursor-pointer hover:opacity-70 transition-opacity' />
                        <Image src={assets.twitter_icon} alt='TW' width={32} className='cursor-pointer hover:opacity-70 transition-opacity' />
                        <Image src={assets.googleplus_icon} alt='GP' width={32} className='cursor-pointer hover:opacity-70 transition-opacity' />
                    </div>
                </div>

                {postId && (
                    <CommentSection postId={postId} postOwnerId={postOwnerId} allowComments={allowComments} />
                )}
            </article>
        </div>
    )
}

export default BlogArticle
