export interface MonthTheme {
    id: number;
    name: string;
    primary: string;
    secondary: string;
    heroImage: string;
    quote: string;
    emoji: string;
}

export const MONTHS_THEMES: Record<number, MonthTheme> = {
    0: {
        id: 0,
        name: "January",
        primary: "#3B82F6",
        secondary: "#DBEAFE",
        heroImage: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22",
        quote: "The magic of winter silence.",
        emoji: "❄️"
    },
    1: {
        id: 1,
        name: "February",
        primary: "#EC4899",
        secondary: "#FCE7F3",
        heroImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
        quote: "Love is the flower you've got to let grow.",
        emoji: "💖"
    },
    2: {
        id: 2,
        name: "March",
        primary: "#10B981",
        secondary: "#D1FAE5",
        heroImage: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7",
        quote: "Spring is nature's way of saying, 'Let's party!'",
        emoji: "🌸"
    },
    3: {
        id: 3,
        name: "April",
        primary: "#F59E0B",
        secondary: "#FEF3C7",
        heroImage: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa",
        quote: "April hath put a spirit of youth in everything.",
        emoji: "🌱"
    },
    4: {
        id: 4,
        name: "May",
        primary: "#8B5CF6",
        secondary: "#EDE9FE",
        heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        quote: "May: The month of expectation.",
        emoji: "🌻"
    },
    5: {
        id: 5,
        name: "June",
        primary: "#06B6D4",
        secondary: "#CFFAFE",
        heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        quote: "Sun is shining. Weather is sweet.",
        emoji: "🌊"
    },
    6: {
        id: 6,
        name: "July",
        primary: "#EF4444",
        secondary: "#FEE2E2",
        heroImage: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1",
        quote: "Summer: Hair gets lighter. Water gets warmer.",
        emoji: "🍉"
    },
    7: {
        id: 7,
        name: "August",
        primary: "#F97316",
        secondary: "#FFEDD5",
        heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        quote: "August is a gentle reminder of why we must savor each day.",
        emoji: "☀️"
    },
    8: {
        id: 8,
        name: "September",
        primary: "#D97706",
        secondary: "#FEF3C7",
        heroImage: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
        quote: "September days are here, with summer's best of weather.",
        emoji: "🍂"
    },
    9: {
        id: 9,
        name: "October",
        primary: "#7C2D12",
        secondary: "#FFEDD5",
        heroImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071",
        quote: "Life starts all over again when it gets crisp in the fall.",
        emoji: "🎃"
    },
    10: {
        id: 10,
        name: "November",
        primary: "#4B5563",
        secondary: "#F3F4F6",
        heroImage: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e",
        quote: "November: Let your gratitude be your light.",
        emoji: "🌪️"
    },
    11: {
        id: 11,
        name: "December",
        primary: "#111827",
        secondary: "#E5E7EB",
        heroImage: "https://images.unsplash.com/photo-1512389142860-9c449e58a543",
        quote: "May your days be merry and bright.",
        emoji: "🎄"
    }
};
