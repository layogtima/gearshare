// Import components from components.js
import {
    toolCard,
    myToolCard,
    messagePreview,
    addItemModal,
    borrowRequestModal,
    messageDetailModal
} from './components.js';

// Main application logic
const { createApp, ref, computed, watch } = Vue;

// Create the Vue app
createApp({
    // Register components for use in templates
    components: {
        'tool-card': toolCard,
        'my-tool-card': myToolCard,
        'message-preview': messagePreview,
        'add-item-modal': addItemModal,
        'borrow-request-modal': borrowRequestModal,
        'message-detail-modal': messageDetailModal
    },

    setup() {
        // ==================
        // State Management
        // ==================

        // UI state
        const activeTab = ref('available');
        const searchQuery = ref('');
        const searchRadius = ref('2');
        const currentLocation = ref('Bengaluru, Karnataka');
        const showNewItemModal = ref(false);
        const showBorrowModal = ref(false);
        const showMessageDetail = ref(false);
        const showToast = ref(false);
        const toastMessage = ref('');

        // User data
        const unreadMessages = ref(2);

        // Currently selected items
        const selectedItem = ref({});
        const selectedMessage = ref({});
        const messageReply = ref('');

        // Form data
        const newItem = ref({
            name: '',
            description: '',
            condition: 'Good',
            privacy: 'Public',
            image: '/api/placeholder/400/320'
        });

        const borrowRequest = ref({
            startDate: '',
            endDate: '',
            message: ''
        });

        // ==================
        // Mock Data (would come from API in production)
        // ==================

        // Available tools in the community
        const availableItems = ref([
            {
                id: 1,
                name: 'Power Drill (Cordless)',
                description: 'Bosch 18V cordless drill with two batteries and charger. Perfect for home projects.',
                image: '/api/placeholder/400/320',
                condition: 'Excellent',
                distance: 0.8,
                availabilityText: 'Anytime',
                ownerName: 'Solomon G.',
                ownerAvatar: '/api/placeholder/100/100',
                ownerRating: 4.8
            },
            {
                id: 2,
                name: 'Gardening Tool Set',
                description: 'Complete set with trowel, pruners, rake, and gloves. Great for urban gardening.',
                image: '/api/placeholder/400/320',
                condition: 'Good',
                distance: 1.2,
                availabilityText: 'Weekends',
                ownerName: 'Kailash R.',
                ownerAvatar: '/api/placeholder/100/100',
                ownerRating: 4.5
            },
            {
                id: 3,
                name: 'Linear Motor Prototyping Kit',
                description: 'Custom-built testing equipment for linear motor design with precision measuring tools.',
                image: '/api/placeholder/400/320',
                condition: 'Fair',
                distance: 1.5,
                availabilityText: 'Mon-Fri after 6pm',
                ownerName: 'Solomon G.',
                ownerAvatar: '/api/placeholder/100/100',
                ownerRating: 4.9
            }
        ]);

        // User's own tools
        const myItems = ref([
            {
                id: 101,
                name: 'Flow Toy Repair Kit',
                description: 'Professional tools for repairing LED flow toys including soldering station, tapes, and circuit testers.',
                image: '/api/placeholder/400/320',
                condition: 'Excellent',
                privacy: 'Public',
                borrower: null
            },
            {
                id: 102,
                name: 'Hoop Making Tools',
                description: 'Set of specialized tools for making and repairing flow hoops. Includes tape, connectors, and sizing tools.',
                image: '/api/placeholder/400/320',
                condition: 'Good',
                privacy: 'Friends Only',
                borrower: 'Kailash R.'
            }
        ]);

        // Message inbox
        const messages = ref([
            {
                id: 201,
                senderName: 'Solomon G.',
                senderAvatar: '/api/placeholder/100/100',
                subject: 'Request to borrow your Flow Toy Repair Kit',
                content: 'Hi Amit! I\'m working on some new LED patterns for my props and need to fix some wiring issues. Your repair kit looks perfect for what I need. I\'d take good care of it and share any cool patterns I develop!',
                date: 'Today, 10:23 AM',
                isRead: false,
                requestDetails: {
                    itemName: 'Flow Toy Repair Kit',
                    startDate: '2025-03-22',
                    endDate: '2025-03-24'
                }
            },
            {
                id: 202,
                senderName: 'Kailash R.',
                senderAvatar: '/api/placeholder/100/100',
                subject: 'Thanks for the hoop tools!',
                content: 'Just wanted to say thanks for lending me your hoop making tools! I was able to fix my broken hoop and even make a new one for a beginner workshop this weekend. Will return them tomorrow as promised!',
                date: 'Yesterday, 4:15 PM',
                isRead: false
            }
        ]);

        // ==================
        // Computed Properties
        // ==================

        // Filtered list of available items based on search query and radius
        const filteredAvailableItems = computed(() => {
            return availableItems.value.filter(item => {
                // Filter by search query
                if (searchQuery.value && !item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
                    !item.description.toLowerCase().includes(searchQuery.value.toLowerCase())) {
                    return false;
                }

                // Filter by distance
                if (parseFloat(item.distance) > parseFloat(searchRadius.value)) {
                    return false;
                }

                return true;
            });
        });

        // ==================
        // Methods
        // ==================

        // UI Management

        // Toggle the new item modal visibility
        const toggleNewItemModal = () => {
            showNewItemModal.value = !showNewItemModal.value;
            if (!showNewItemModal.value) {
                // Reset form on close
                newItem.value = {
                    name: '',
                    description: '',
                    condition: 'Good',
                    privacy: 'Public',
                    image: '/api/placeholder/400/320'
                };
            }
        };

        // Display a toast notification
        const displayToast = (message) => {
            toastMessage.value = message;
            showToast.value = true;

            setTimeout(() => {
                showToast.value = false;
            }, 3000); // Hide after 3 seconds
        };

        // Item Management

        // Add a new item to the user's inventory
        const addNewItem = () => {
            const newItemObject = {
                id: Date.now(), // Use timestamp as a unique ID
                name: newItem.value.name,
                description: newItem.value.description,
                condition: newItem.value.condition,
                privacy: newItem.value.privacy,
                image: '/api/placeholder/400/320', // Placeholder image
                borrower: null
            };

            myItems.value.unshift(newItemObject); // Add to the beginning of the array

            // Optionally, if privacy is set to Public, also add to available items
            if (newItem.value.privacy === 'Public') {
                const availableItemObject = {
                    ...newItemObject,
                    distance: 0, // It's your own item
                    availabilityText: 'Anytime',
                    ownerName: 'You',
                    ownerAvatar: '/api/placeholder/100/100',
                    ownerRating: 5.0
                };

                availableItems.value.unshift(availableItemObject);
            }

            toggleNewItemModal();
            displayToast('Tool added successfully!');
        };

        // Edit an existing item
        const editItem = (item) => {
            // In a real app, this would open an edit form
            displayToast('Edit functionality would open here');
        };

        // Toggle the privacy setting of an item
        const toggleItemPrivacy = (item) => {
            // Cycle through privacy settings
            const privacyLevels = ['Public', 'Friends Only', 'Private'];
            const currentIndex = privacyLevels.indexOf(item.privacy);
            const nextIndex = (currentIndex + 1) % privacyLevels.length;
            item.privacy = privacyLevels[nextIndex];

            displayToast(`Privacy updated to ${item.privacy}`);
        };

        // Delete an item after confirmation
        const confirmDeleteItem = (item) => {
            // In a real app, this would show a confirmation dialog
            if (confirm('Are you sure you want to delete this item?')) {
                myItems.value = myItems.value.filter(i => i.id !== item.id);
                displayToast('Item deleted successfully');
            }
        };

        // Borrowing Flow

        // Open the borrow request modal
        const openBorrowModal = (item) => {
            selectedItem.value = item;
            showBorrowModal.value = true;

            // Set default dates to today and tomorrow
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            borrowRequest.value.startDate = today.toISOString().split('T')[0];
            borrowRequest.value.endDate = tomorrow.toISOString().split('T')[0];
            borrowRequest.value.message = '';
        };

        // Send a borrow request
        const sendBorrowRequest = () => {
            showBorrowModal.value = false;

            // In a real app, this would send the request to the server
            // For the MVP, we'll just show a success message
            displayToast('Borrow request sent! You\'ll get a response soon.');
        };

        // Messaging

        // Open a message detail view
        const openMessageDetail = (message) => {
            selectedMessage.value = message;
            showMessageDetail.value = true;

            // Mark as read
            if (!message.isRead) {
                message.isRead = true;
                unreadMessages.value--;
            }
        };

        // Send a reply to a message
        const sendReply = () => {
            if (!messageReply.value.trim()) return;

            // In a real app, this would send the reply to the server
            displayToast('Reply sent!');
            showMessageDetail.value = false;
            messageReply.value = '';
        };

        // Approve a borrow request
        const approveRequest = () => {
            // In a real app, this would update the status in the database
            displayToast('Request approved! The borrower has been notified.');
            showMessageDetail.value = false;

            // For the MVP, let's update the UI to show the item is borrowed
            const itemToUpdate = myItems.value.find(item =>
                item.name === selectedMessage.value.requestDetails.itemName
            );

            if (itemToUpdate) {
                itemToUpdate.borrower = selectedMessage.value.senderName;
            }
        };

        // Reject a borrow request
        const rejectRequest = () => {
            // In a real app, this would update the status in the database
            displayToast('Request declined. The borrower has been notified.');
            showMessageDetail.value = false;
        };

        // Location

        // Detect the user's location
        const detectLocation = () => {
            // In a real app, this would use the browser's geolocation API
            // For the MVP, we'll just simulate a location change
            setTimeout(() => {
                currentLocation.value = 'Indiranagar, Bengaluru';
                displayToast('Location updated');
            }, 1000);
        };

        // ==================
        // Watchers
        // ==================

        // Watch for changes in search parameters
        watch([searchQuery, searchRadius], () => {
            // In a real app, this might trigger a server request or complex filtering
            console.log('Search parameters changed');
        });

        // ==================
        // Lifecycle Hooks
        // ==================

        // Initialization code
        const initializeApp = () => {
            // In a real app, we might check for saved data, handle authentication, etc.
            console.log('App initialized');

            // Set up event handlers for back button, etc.
            window.addEventListener('popstate', () => {
                if (showNewItemModal.value) {
                    showNewItemModal.value = false;
                    return;
                }

                if (showBorrowModal.value) {
                    showBorrowModal.value = false;
                    return;
                }

                if (showMessageDetail.value) {
                    showMessageDetail.value = false;
                    return;
                }
            });
        };

        // Call initialization function
        initializeApp();

        // ==================
        // Return All Reactive Data and Methods
        // ==================
        return {
            // State and data
            activeTab,
            searchQuery,
            searchRadius,
            currentLocation,
            showNewItemModal,
            showBorrowModal,
            showMessageDetail,
            showToast,
            toastMessage,
            selectedItem,
            selectedMessage,
            messageReply,
            unreadMessages,
            availableItems,
            myItems,
            messages,
            newItem,
            borrowRequest,

            // Computed properties
            filteredAvailableItems,

            // Methods
            toggleNewItemModal,
            addNewItem,
            openBorrowModal,
            sendBorrowRequest,
            openMessageDetail,
            sendReply,
            approveRequest,
            rejectRequest,
            toggleItemPrivacy,
            editItem,
            confirmDeleteItem,
            detectLocation,
            displayToast
        };
    }
}).mount('#app');