// hydrate.js - Data Layer for GearShare
// This file simulates API responses and keeps product data separate from application logic

// Helper function to create stable placeholder image URLs
function createPlaceholderUrl(width, height, text, isTool = true) {
    // For tool images: Cream text on Royal background
    // For profile avatars: Royal text on Cream background
    const bgColor = isTool ? '261FB3' : 'FBE4D6';
    const textColor = isTool ? 'FBE4D6' : '261FB3';

    // Replace spaces with plus signs for URL
    const formattedText = text.replace(/\s+/g, '+');
    return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${formattedText}`;
}

// Helper function to create gear item
function createGearItem(id, name, description, condition, distance, availability, ownerName, rating) {
    return {
        id,
        name,
        description,
        image: createPlaceholderUrl(400, 300, name, true),
        condition,
        distance,
        availabilityText: availability,
        ownerName,
        ownerAvatar: createPlaceholderUrl(100, 100, ownerName.charAt(0), false),
        ownerRating: rating
    };
}

// Helper function to create my gear item
function createMyGearItem(id, name, description, condition, privacy, borrower = null) {
    return {
        id,
        name,
        description,
        image: createPlaceholderUrl(400, 300, name, true),
        condition,
        privacy,
        borrower
    };
}

// Helper function to create a message
function createMessage(id, senderName, subject, content, date, isRead, requestDetails = null) {
    return {
        id,
        senderName,
        senderAvatar: createPlaceholderUrl(100, 100, senderName.charAt(0), false),
        subject,
        content,
        date,
        isRead,
        requestDetails
    };
}

// Available gear in the community
export const availableGearData = [
    createGearItem(
        1,
        'Power Drill (Cordless)',
        'Bosch 18V cordless drill with two batteries and charger. Perfect for home projects.',
        'Excellent',
        0.8,
        'Anytime',
        'Solomon G.',
        4.8
    ),
    createGearItem(
        2,
        'Gardening Tool Set',
        'Complete set with trowel, pruners, rake, and gloves. Great for urban gardening.',
        'Good',
        1.2,
        'Weekends',
        'Kailash R.',
        4.5
    ),
    createGearItem(
        3,
        'Linear Motor Prototyping Kit',
        'Custom-built testing equipment for linear motor design with precision measuring tools.',
        'Fair',
        1.5,
        'Mon-Fri after 6pm',
        'Solomon G.',
        4.9
    ),
    createGearItem(
        4,
        'Automotive Diagnostic Scanner',
        'Professional OBD2 scanner that can diagnose most modern vehicles. Includes laptop with software.',
        'Excellent',
        2.3,
        'Weekends',
        'Meera P.',
        4.7
    ),
    createGearItem(
        5,
        'Industrial Sewing Machine',
        'Heavy duty sewing machine perfect for leatherwork, canvas, and other thick materials.',
        'Good',
        3.1,
        'Evenings & Weekends',
        'Rafael S.',
        4.9
    ),
    createGearItem(
        6,
        '3D Printer (Prusa i3 MK3S)',
        'Well-maintained 3D printer with various filaments available. Can help with setup for first-timers.',
        'Excellent',
        1.8,
        'Anytime with notice',
        'Amina K.',
        5.0
    )
];

// My gear inventory
export const myGearData = [
    createMyGearItem(
        101,
        'Flow Toy Repair Kit',
        'Professional tools for repairing LED flow toys including soldering station, tapes, and circuit testers.',
        'Excellent',
        'Public'
    ),
    createMyGearItem(
        102,
        'Hoop Making Tools',
        'Set of specialized tools for making and repairing flow hoops. Includes tape, connectors, and sizing tools.',
        'Good',
        'Friends Only',
        'Kailash R.'
    ),
    createMyGearItem(
        103,
        'Soldering Station (Professional)',
        'Temperature-controlled soldering station with multiple tips, fume extractor, and magnifying glass mount.',
        'Excellent',
        'Public'
    )
];

// Messages data
export const messagesData = [
    createMessage(
        201,
        'Solomon G.',
        'Request to borrow your Flow Toy Repair Kit',
        'Hi Amit! I\'m working on some new LED patterns for my props and need to fix some wiring issues. Your repair kit looks perfect for what I need. I\'d take good care of it and share any cool patterns I develop!',
        'Today, 10:23 AM',
        false,
        {
            itemName: 'Flow Toy Repair Kit',
            startDate: '2025-03-22',
            endDate: '2025-03-24'
        }
    ),
    createMessage(
        202,
        'Kailash R.',
        'Thanks for the hoop tools!',
        'Just wanted to say thanks for lending me your hoop making tools! I was able to fix my broken hoop and even make a new one for a beginner workshop this weekend. Will return them tomorrow as promised!',
        'Yesterday, 4:15 PM',
        false
    ),
    createMessage(
        203,
        'Meera P.',
        'Community tool repair workshop?',
        'Hey there! I noticed you have several repair kits in your inventory. I\'m organizing a community repair cafe next month and wondered if you\'d be interested in hosting a station to help people fix their flow toys? Let me know if you\'re interested!',
        '2 days ago',
        true
    )
];

// Form templates
export const formTemplates = {
    newItem: {
        name: '',
        description: '',
        condition: 'Good',
        privacy: 'Public',
        image: createPlaceholderUrl(400, 300, 'New Tool', true)
    },
    borrowRequest: {
        startDate: '',
        endDate: '',
        message: ''
    }
};

// Get data with optional delay to simulate network latency
export const getData = (dataType, delay = 0) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            switch (dataType) {
                case 'availableGear':
                    resolve(availableGearData);
                    break;
                case 'myGear':
                    resolve(myGearData);
                    break;
                case 'messages':
                    resolve(messagesData);
                    break;
                case 'formTemplates':
                    resolve(formTemplates);
                    break;
                default:
                    resolve([]);
            }
        }, delay);
    });
};

// Simulate adding a new item
export const addItem = (item) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would send data to an API
            const newItem = {
                ...item,
                id: Date.now(),
                image: item.image || createPlaceholderUrl(400, 300, item.name, true)
            };
            resolve(newItem);
        }, 300);
    });
};

// Simulate sending a borrow request
export const sendBorrowRequest = (itemId, request) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would send data to an API
            resolve({ success: true, itemId, request });
        }, 300);
    });
};

// Simulate updating an item
export const updateItem = (itemId, updates) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would send data to an API
            resolve({ success: true, itemId, updates });
        }, 300);
    });
};

// Simulate deleting an item
export const deleteItem = (itemId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would send data to an API
            resolve({ success: true, itemId });
        }, 300);
    });
};

// Simulate sending a message
export const sendMessage = (recipientId, message) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would send data to an API
            resolve({ success: true, recipientId, message });
        }, 300);
    });
};

// Simulate updating user location
export const updateLocation = (location) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would send data to an API
            resolve({ success: true, location });
        }, 1000);
    });
};

// Get random location suggestions (for autocomplete)
export const getLocationSuggestions = (query) => {
    const suggestions = [
        'Indiranagar, Bengaluru',
        'Koramangala, Bengaluru',
        'HSR Layout, Bengaluru',
        'Jayanagar, Bengaluru',
        'JP Nagar, Bengaluru',
        'Whitefield, Bengaluru',
        'BTM Layout, Bengaluru',
        'Malleshwaram, Bengaluru',
        'Electronic City, Bengaluru',
        'Richmond Town, Bengaluru'
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            if (!query) {
                resolve([]);
                return;
            }

            const filteredSuggestions = suggestions.filter(
                location => location.toLowerCase().includes(query.toLowerCase())
            );

            resolve(filteredSuggestions);
        }, 200);
    });
};