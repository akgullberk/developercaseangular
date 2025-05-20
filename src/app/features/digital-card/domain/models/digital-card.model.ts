export interface DigitalCard {
    id: string;
    fullName: string;
    title: string;
    profileImage: string;
    biography: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        instagram?: string;
    };
    skills: string[];
} 