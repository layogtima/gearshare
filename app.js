// Import components from components.js
import {
    toolCard,
    myToolCard,
    messagePreview,
    addItemModal,
    borrowRequestModal,
    messageDetailModal,
    toolDetailModal,
    unifiedGearModal,
} from './components.js';

// Import data layer from hydrate.js
import {
    getData,
    addItem,
    sendBorrowRequest,
    updateItem,
    deleteItem,
    sendMessage,
    updateLocation,
    getLocationSuggestions,
    formTemplates
} from './hydrate.js';

// Main application logic
const { createApp, ref, computed, watch, onMounted } = Vue;

// Create the Vue app
createApp({
    // Register components for use in templates
    components: {
        'tool-card': toolCard,
        'my-tool-card': myToolCard,
        'message-preview': messagePreview,
        'add-item-modal': addItemModal,
        'borrow-request-modal': borrowRequestModal,
        'message-detail-modal': messageDetailModal,
        'tool-detail-modal': toolDetailModal,
        'unified-gear-modal': unifiedGearModal
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
        const loading = ref(false);
        const showToolDetailModal = ref(false);
        const selectedToolDetail = ref(null);
        const showUnifiedGearModal = ref(false);
        const unifiedGearItem = ref(null);
        const isEditMode = ref(false);
        const showLocationModal = ref(false);


        // User data
        const unreadMessages = ref(0);

        // Currently selected items
        const selectedItem = ref({});
        const selectedMessage = ref({});
        const messageReply = ref('');

        // Form data
        const newItem = ref({ ...formTemplates.newItem });
        const borrowRequest = ref({ ...formTemplates.borrowRequest });

        // Data collections
        const availableItems = ref([]);
        const myItems = ref([]);
        const messages = ref([]);

        // ==================
        // Data Loading Methods
        // ==================

        // Load data based on active tab
        const loadData = async (tab = activeTab.value) => {
            loading.value = true;
            try {
                switch (tab) {
                    case 'available':
                        if (availableItems.value.length === 0) {
                            availableItems.value = await getData('availableGear', 500);
                        }
                        break;
                    case 'myItems':
                        if (myItems.value.length === 0) {
                            myItems.value = await getData('myGear', 500);
                        }
                        break;
                    case 'messages':
                        if (messages.value.length === 0) {
                            messages.value = await getData('messages', 500);
                            // Count unread messages
                            unreadMessages.value = messages.value.filter(m => !m.isRead).length;
                        }
                        break;
                }
            } catch (error) {
                console.error("Error loading data:", error);
                displayToast("Failed to load data. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // ==================
        // Computed Properties
        // ==================

        // Filtered list of available items based on search query and radius
        const filteredAvailableItems = computed(() => {
            return availableItems.value.filter(item => {
                // Filter by search query
                if (searchQuery.value && !item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
                    !item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
                    !item.ownerName.toLowerCase().includes(searchQuery.value.toLowerCase())) {
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

        const openAddGearModal = () => {
            unifiedGearItem.value = {
                name: '',
                description: '',
                condition: 'Good',
                privacy: 'Public',
                image: null
            };
            isEditMode.value = false;
            showUnifiedGearModal.value = true;
        };

        const openEditGearModal = (item) => {
            unifiedGearItem.value = { ...item };
            isEditMode.value = true;
            showUnifiedGearModal.value = true;
        };

        const saveGearItem = async (item) => {
            loading.value = true;
            try {
                if (isEditMode.value) {
                    // Update existing item
                    await updateItem(item.id, item);

                    // Find and update the item in the appropriate arrays
                    const myItemIndex = myItems.value.findIndex(i => i.id === item.id);
                    if (myItemIndex !== -1) {
                        myItems.value[myItemIndex] = { ...item };
                    }

                    // If privacy is public, update in available items too
                    if (item.privacy === 'Public') {
                        const availableIndex = availableItems.value.findIndex(i => i.id === item.id);
                        if (availableIndex !== -1) {
                            availableItems.value[availableIndex] = {
                                ...item,
                                distance: 0,
                                availabilityText: 'Anytime',
                                ownerName: 'You',
                                ownerAvatar: 'https://placehold.co/100x100/261FB3/FBE4D6?text=Y',
                                ownerRating: 5.0
                            };
                        } else {
                            // Add to available items if not already there
                            availableItems.value.unshift({
                                ...item,
                                distance: 0,
                                availabilityText: 'Anytime',
                                ownerName: 'You',
                                ownerAvatar: 'https://placehold.co/100x100/261FB3/FBE4D6?text=Y',
                                ownerRating: 5.0
                            });
                        }
                    } else {
                        // Remove from available items if no longer public
                        availableItems.value = availableItems.value.filter(i => i.id !== item.id);
                    }

                    displayToast('Contraption successfully updated!');
                } else {
                    // Add new item
                    const result = await addItem(item);
                    myItems.value.unshift(result);

                    // Add to available items if public
                    if (item.privacy === 'Public') {
                        availableItems.value.unshift({
                            ...result,
                            distance: 0,
                            availabilityText: 'Anytime',
                            ownerName: 'You',
                            ownerAvatar: 'https://placehold.co/100x100/261FB3/FBE4D6?text=Y',
                            ownerRating: 5.0
                        });
                    }

                    displayToast('Contraption added to your workshop!');
                }

                showUnifiedGearModal.value = false;
            } catch (error) {
                console.error("Error saving item:", error);
                displayToast("Failed to save contraption. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        const deleteGearItem = async (item) => {
            if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                loading.value = true;
                try {
                    await deleteItem(item.id);

                    // Remove from my items
                    myItems.value = myItems.value.filter(i => i.id !== item.id);

                    // Remove from available items if it exists there
                    availableItems.value = availableItems.value.filter(i => i.id !== item.id);

                    showUnifiedGearModal.value = false;
                    displayToast('Contraption removed from your workshop');
                } catch (error) {
                    console.error("Error deleting item:", error);
                    displayToast("Failed to delete contraption. Please try again.");
                } finally {
                    loading.value = false;
                }
            }
        };

        const openToolDetailModal = (item) => {
            console.log('MODAL OPEN ATTEMPT!', item);
            selectedToolDetail.value = item;
            showToolDetailModal.value = true;
        };

        const closeToolDetailModal = () => {
            showToolDetailModal.value = false;
        };

        // Toggle the new item modal visibility
        const toggleNewItemModal = () => {
            showNewItemModal.value = !showNewItemModal.value;
            if (!showNewItemModal.value) {
                // Reset form on close
                newItem.value = { ...formTemplates.newItem };
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
        const addNewItem = async () => {
            loading.value = true;
            try {
                const result = await addItem(newItem.value);
                myItems.value.unshift(result); // Add to the beginning of the array

                // Optionally, if privacy is set to Public, also add to available items
                if (newItem.value.privacy === 'Public') {
                    const availableItemObject = {
                        ...result,
                        distance: 0, // It's your own item
                        availabilityText: 'Anytime',
                        ownerName: 'You',
                        ownerAvatar: 'https://placehold.co/100x100/261FB3/FBE4D6?text=Y',
                        ownerRating: 5.0
                    };

                    availableItems.value.unshift(availableItemObject);
                }

                toggleNewItemModal();
                displayToast('Contraption added to your workshop!');
            } catch (error) {
                console.error("Error adding item:", error);
                displayToast("Failed to add contraption. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // Edit an existing item
        const editItem = (item) => {
            // In a real app, this would open an edit form with populated data
            displayToast(`Editing ${item.name}... (Feature coming soon!)`);
        };

        // Toggle the privacy setting of an item
        const toggleItemPrivacy = async (item) => {
            // Cycle through privacy settings
            const privacyLevels = ['Public', 'Friends Only', 'Private'];
            const currentIndex = privacyLevels.indexOf(item.privacy);
            const nextIndex = (currentIndex + 1) % privacyLevels.length;
            const newPrivacy = privacyLevels[nextIndex];

            loading.value = true;
            try {
                // Update the item in our data layer
                await updateItem(item.id, { privacy: newPrivacy });

                // Update local state
                item.privacy = newPrivacy;

                displayToast(`Privacy updated to ${newPrivacy}`);
            } catch (error) {
                console.error("Error updating privacy:", error);
                displayToast("Failed to update privacy. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // Delete an item after confirmation
        const confirmDeleteItem = async (item) => {
            if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                loading.value = true;
                try {
                    // Delete the item from our data layer
                    await deleteItem(item.id);

                    // Update local state
                    myItems.value = myItems.value.filter(i => i.id !== item.id);

                    // Also remove from available items if it exists there
                    availableItems.value = availableItems.value.filter(i => i.id !== item.id);

                    displayToast('Item deleted from your workshop');
                } catch (error) {
                    console.error("Error deleting item:", error);
                    displayToast("Failed to delete item. Please try again.");
                } finally {
                    loading.value = false;
                }
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
        const sendBorrowRequest = async () => {
            loading.value = true;
            try {
                // Send the request through our data layer
                await sendBorrowRequest(selectedItem.value.id, borrowRequest.value);

                showBorrowModal.value = false;
                displayToast('Borrow request dispatched! You\'ll get a response soon.');
            } catch (error) {
                console.error("Error sending borrow request:", error);
                displayToast("Failed to send request. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // Messaging

        // Open a message detail view
        const openMessageDetail = (message) => {
            selectedMessage.value = message;
            showMessageDetail.value = true;

            // Mark as read if not already
            if (!message.isRead) {
                message.isRead = true;
                unreadMessages.value--;
            }
        };

        // Send a reply to a message
        const sendReply = async () => {
            if (!messageReply.value.trim()) return;

            loading.value = true;
            try {
                // Send the reply through our data layer
                await sendMessage(selectedMessage.value.senderName, messageReply.value);

                displayToast('Reply sent via pneumatic tube!');
                showMessageDetail.value = false;
                messageReply.value = '';
            } catch (error) {
                console.error("Error sending reply:", error);
                displayToast("Failed to send reply. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // Approve a borrow request
        const approveRequest = async () => {
            loading.value = true;
            try {
                // Update the item in our data layer to show it's now borrowed
                const itemToUpdate = myItems.value.find(item =>
                    item.name === selectedMessage.value.requestDetails.itemName
                );

                if (itemToUpdate) {
                    await updateItem(itemToUpdate.id, { borrower: selectedMessage.value.senderName });
                    itemToUpdate.borrower = selectedMessage.value.senderName;
                }

                displayToast('Request approved! The borrower has been notified.');
                showMessageDetail.value = false;
            } catch (error) {
                console.error("Error approving request:", error);
                displayToast("Failed to approve request. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // Reject a borrow request
        const rejectRequest = async () => {
            loading.value = true;
            try {
                // In a real app, we would update the request status in the database
                displayToast('Request declined. The borrower has been notified.');
                showMessageDetail.value = false;
            } catch (error) {
                console.error("Error rejecting request:", error);
                displayToast("Failed to reject request. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // Location

        // Detect the user's location
        const detectLocation = async () => {
            displayToast('Detecting your location...');
            loading.value = true;

            try {
                // In a real app, this would use the browser's geolocation API
                // For the MVP, we'll use our simulated API
                const result = await updateLocation('Indiranagar, Bengaluru');
                currentLocation.value = result.location;
                displayToast('Location updated to ' + result.location);

                // Refresh available items based on new location
                availableItems.value = await getData('availableGear', 500);
            } catch (error) {
                console.error("Error updating location:", error);
                displayToast("Failed to update location. Please try again.");
            } finally {
                loading.value = false;
            }
        };

        // ==================
        // Watchers
        // ==================

        // Watch for changes in search parameters to refresh results
        watch([searchQuery, searchRadius], () => {
            // In a real app, this might trigger a server request for filtered data
            console.log('Search parameters changed');
        });

        // Watch for active tab changes to load relevant data
        watch(activeTab, (newTab) => {
            loadData(newTab);
        });

        // ==================
        // Lifecycle Hooks
        // ==================

        // Initialize the app when mounted
        onMounted(async () => {
            // Load initial data for the active tab
            await loadData();

            // Set up keyboard shortcuts (beyond what's in the HTML)
            document.addEventListener('keydown', (e) => {
                // Ctrl+F to focus search when on the available tab
                if (e.ctrlKey && e.key === 'f' && activeTab.value === 'available') {
                    e.preventDefault();
                    document.querySelector('input[placeholder="Search for gears and contraptions..."]')?.focus();
                }

                // Ctrl+/ to show keyboard shortcuts
                if (e.ctrlKey && e.key === '/') {
                    e.preventDefault();
                    displayToast('Keyboard Shortcuts: Alt+N (Add), Alt+1/2/3 (Tabs), Ctrl+F (Search)');
                }
            });

            // Check if we need to show a welcome message
            if (localStorage.getItem('gearShareFirstVisit') !== 'false') {
                displayToast('Welcome to GearShare! Start by adding your tools or browse what\'s available.');
                localStorage.setItem('gearShareFirstVisit', 'false');
            }
        });

        const setupGearModalInteractions = () => {
            // State for the detail modal
            const showToolDetailModal = ref(false);
            const selectedToolDetail = ref(null);

            // Methods for the detail modal
            const openToolDetailModal = (item) => {
                selectedToolDetail.value = item;
                showToolDetailModal.value = true;
                // Optional: could fetch additional details here
            };

            const closeToolDetailModal = () => {
                showToolDetailModal.value = false;
                // Wait for animation to complete before nulling the selected item
                setTimeout(() => {
                    selectedToolDetail.value = null;
                }, 300);
            };

            return {
                showToolDetailModal,
                selectedToolDetail,
                openToolDetailModal,
                closeToolDetailModal
            };
        };

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
            loading,
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
            displayToast,
            showToolDetailModal,
            selectedToolDetail,
            openToolDetailModal,
            closeToolDetailModal,
            showUnifiedGearModal,
            unifiedGearItem,
            isEditMode,
            openAddGearModal,
            openEditGearModal,
            saveGearItem,
            deleteGearItem,
            showLocationModal
        };
    }
}).mount('#app');