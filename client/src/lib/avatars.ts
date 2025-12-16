// Predefined avatar options
// Using DiceBear API for consistent, reliable avatar generation

export type AvatarStyle = 'adventurer' | 'avataaars' | 'bottts' | 'fun-emoji' | 'lorelei' | 'notionists' | 'pixel-art' | 'thumbs';

export interface PredefinedAvatar {
    id: string;
    name: string;
    url: string;
    category: 'male' | 'female' | 'neutral';
}

// Generate avatars using DiceBear API (consistent, free, no CORS issues)
const generateDiceBearUrl = (style: AvatarStyle, seed: string): string => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

export const predefinedAvatars: PredefinedAvatar[] = [
    // Male avatars
    { id: 'male-1', name: 'Alex', url: generateDiceBearUrl('adventurer', 'Alex'), category: 'male' },
    { id: 'male-2', name: 'James', url: generateDiceBearUrl('adventurer', 'James'), category: 'male' },
    { id: 'male-3', name: 'Michael', url: generateDiceBearUrl('adventurer', 'Michael'), category: 'male' },
    { id: 'male-4', name: 'David', url: generateDiceBearUrl('avataaars', 'David'), category: 'male' },
    { id: 'male-5', name: 'Chris', url: generateDiceBearUrl('avataaars', 'Chris'), category: 'male' },
    { id: 'male-6', name: 'Ryan', url: generateDiceBearUrl('lorelei', 'Ryan'), category: 'male' },

    // Female avatars
    { id: 'female-1', name: 'Emma', url: generateDiceBearUrl('adventurer', 'Emma'), category: 'female' },
    { id: 'female-2', name: 'Sophia', url: generateDiceBearUrl('adventurer', 'Sophia'), category: 'female' },
    { id: 'female-3', name: 'Olivia', url: generateDiceBearUrl('adventurer', 'Olivia'), category: 'female' },
    { id: 'female-4', name: 'Ava', url: generateDiceBearUrl('avataaars', 'Ava'), category: 'female' },
    { id: 'female-5', name: 'Mia', url: generateDiceBearUrl('avataaars', 'Mia'), category: 'female' },
    { id: 'female-6', name: 'Luna', url: generateDiceBearUrl('lorelei', 'Luna'), category: 'female' },

    // Neutral/Fun avatars
    { id: 'neutral-1', name: 'Robot', url: generateDiceBearUrl('bottts', 'Robot1'), category: 'neutral' },
    { id: 'neutral-2', name: 'Bot', url: generateDiceBearUrl('bottts', 'Bot2'), category: 'neutral' },
    { id: 'neutral-3', name: 'Pixel', url: generateDiceBearUrl('pixel-art', 'Pixel1'), category: 'neutral' },
    { id: 'neutral-4', name: 'Happy', url: generateDiceBearUrl('fun-emoji', 'Happy'), category: 'neutral' },
    { id: 'neutral-5', name: 'Cool', url: generateDiceBearUrl('fun-emoji', 'Cool'), category: 'neutral' },
    { id: 'neutral-6', name: 'Star', url: generateDiceBearUrl('thumbs', 'Star'), category: 'neutral' },
];

export const getAvatarById = (id: string): PredefinedAvatar | undefined => {
    return predefinedAvatars.find(avatar => avatar.id === id);
};

export const getAvatarsByCategory = (category: 'male' | 'female' | 'neutral'): PredefinedAvatar[] => {
    return predefinedAvatars.filter(avatar => avatar.category === category);
};
