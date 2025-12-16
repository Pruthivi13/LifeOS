import Image from 'next/image';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
};

const sizePx = {
    sm: 32,
    md: 40,
    lg: 48,
};

export function Avatar({
    src,
    alt = 'User avatar',
    name,
    size = 'md',
    className = '',
}: AvatarProps) {
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

    if (src) {
        return (
            <div
                className={`
          relative rounded-full overflow-hidden
          ${sizeClasses[size]}
          ${className}
        `}
            >
                <img
                    src={src}
                    alt={alt}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                        console.error('Error loading avatar:', src);
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className={`
        flex items-center justify-center
        rounded-full font-medium text-white
        ${sizeClasses[size]}
        ${className}
      `}
            style={{ backgroundColor: getColorFromName(name) }}
        >
            {initials}
        </div>
    );
}
