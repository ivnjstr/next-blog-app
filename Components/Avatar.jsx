import Image from 'next/image'

// A colored initial in a circle, not a stock photo of a stranger — used
// anywhere a user hasn't uploaded their own avatar. Showing the same
// random person's face as everyone's "default" reads as off/uncanny on a
// multi-user site; initials are the standard, neutral fallback instead.
const COLORS = [
    'bg-red-400', 'bg-orange-400', 'bg-amber-500', 'bg-emerald-500',
    'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

const colorForName = (name) => {
    const str = name || '?';
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
};

// fill=true mirrors next/image's own `fill` prop — sizes to a positioned
// parent instead of an explicit width/height, for spots like the profile
// page's avatar-upload circle where the wrapper defines the size.
const Avatar = ({ src, name, size = 36, className = '', fill = false, unoptimized = false }) => {
    if (src) {
        return fill ? (
            <Image src={src} alt={name || 'User'} fill unoptimized={unoptimized} className={`object-cover rounded-full ${className}`} />
        ) : (
            <Image
                src={src}
                alt={name || 'User'}
                width={size}
                height={size}
                className={`rounded-full object-cover shrink-0 ${className}`}
            />
        );
    }

    const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
    const sizeStyle = fill ? { position: 'absolute', inset: 0 } : { width: size, height: size, fontSize: size * 0.42 };
    return (
        <div
            className={`rounded-full flex items-center justify-center text-white font-bold ${colorForName(name)} ${fill ? '' : 'shrink-0'} ${className}`}
            style={fill ? { ...sizeStyle, fontSize: '2.5rem' } : sizeStyle}
        >
            {initial}
        </div>
    );
};

export default Avatar
