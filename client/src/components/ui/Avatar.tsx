import { useState } from 'react';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizePx = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 128,
};

const fontSizes = {
    sm: '0.75rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '2.25rem',
};

export function Avatar({
    src,
    alt = 'User avatar',
    name,
    size = 'md',
    className = '',
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);

    // Generate initials from name
    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '?';

    // Generate a consistent color based on name
    const getColorFromName = (name?: string) => {
        if (!name) return '#9B8FD8'; // primary
        const colors = [
            '#9B8FD8', // primary
            '#8FBC8B', // sage
            '#E6B17E', // amber
            '#89B4D4', // soft-blue
            '#C4BBE8', // primary-light
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const dimensions = sizePx[size];
    const showImage = src && !imageError;

    return (
        <div
            className={`relative rounded-full overflow-hidden flex-shrink-0 ${className}`}
            style={{
                width: `${dimensions}px`,
                height: `${dimensions}px`,
                minWidth: `${dimensions}px`,
                minHeight: `${dimensions}px`,
                backgroundColor: getColorFromName(name),
            }}
        >
            {/* Always visible initials as fallback */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 500,
                    fontSize: fontSizes[size],
                }}
            >
                {initials}
            </div>

            {/* Image overlay (only when src exists and hasn't errored) */}
            {showImage && (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                    onError={() => {
                        console.error('Error loading avatar:', src);
                        setImageError(true);
                    }}
                />
            )}
        </div>
    );
}


