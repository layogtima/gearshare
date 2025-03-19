// Modern Vue 3 component approach
// Use this as your components.js file to replace individual component files

const toolCard = {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    template: `
      <div class="bg-white rounded-lg shadow-md overflow-hidden tool-card">
        <div class="md:flex">
          <div class="md:flex-shrink-0">
            <img class="h-48 w-full object-cover md:w-48 tool-card-image" :src="item.image" :alt="item.name">
          </div>
          <div class="p-4 flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ item.distance }} km away • Available {{ item.availabilityText }}</p>
              </div>
              <span :class="['px-2 py-1 text-xs font-semibold rounded-full', 
                item.condition === 'Excellent' ? 'bg-green-100 text-green-800' : 
                item.condition === 'Good' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800']">
                {{ item.condition }}
              </span>
            </div>
            
            <p class="mt-2 text-gray-600 text-sm">{{ item.description }}</p>
            
            <div class="mt-4 flex items-center">
              <img class="h-8 w-8 rounded-full" :src="item.ownerAvatar" :alt="item.ownerName">
              <span class="ml-2 text-sm text-gray-700">{{ item.ownerName }}</span>
              <div class="ml-auto flex items-center">
                <span class="text-yellow-500 mr-1">★</span>
                <span class="text-sm text-gray-700">{{ item.ownerRating }}</span>
              </div>
            </div>
            
            <div class="mt-4 flex justify-end">
              <button @click="$emit('borrow-request', item)" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-sm transition duration-300">
                Request to Borrow
              </button>
            </div>
          </div>
        </div>
      </div>
    `
};

const myToolCard = {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    template: `
      <div class="bg-white rounded-lg shadow-md overflow-hidden tool-card">
        <div class="md:flex">
          <div class="md:flex-shrink-0">
            <img class="h-48 w-full object-cover md:w-48 tool-card-image" :src="item.image" :alt="item.name">
          </div>
          <div class="p-4 flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
                <p v-if="item.borrower" class="text-sm text-red-600 mt-1">
                  Currently borrowed by {{ item.borrower }}
                </p>
                <p v-else class="text-sm text-green-600 mt-1">
                  Available
                </p>
              </div>
              <span :class="['px-2 py-1 text-xs font-semibold rounded-full', 
                item.privacy === 'Public' ? 'bg-green-100 text-green-800' : 
                item.privacy === 'Friends Only' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800']">
                {{ item.privacy }}
              </span>
            </div>
            
            <p class="mt-2 text-gray-600 text-sm">{{ item.description }}</p>
            
            <div class="mt-4 flex justify-between">
              <button @click="$emit('edit', item)" class="text-blue-500 hover:text-blue-700">
                <i class="fas fa-edit mr-1"></i> Edit
              </button>
              <div>
                <button @click="$emit('toggle-privacy', item)" class="text-gray-500 hover:text-gray-700 mr-3">
                  <i :class="['fas', item.privacy === 'Public' ? 'fa-eye' : item.privacy === 'Friends Only' ? 'fa-user-friends' : 'fa-eye-slash']"></i>
                </button>
                <button @click="$emit('delete', item)" class="text-red-500 hover:text-red-700">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
};

const messagePreview = {
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    template: `
      <div class="p-4 hover:bg-gray-50 cursor-pointer" @click="$emit('open', message)">
        <div class="flex justify-between items-start">
          <div class="flex items-start">
            <img class="h-10 w-10 rounded-full mr-3" :src="message.senderAvatar" :alt="message.senderName">
            <div>
              <h4 class="font-medium text-gray-900">{{ message.senderName }}</h4>
              <p class="text-gray-600 text-sm">{{ message.subject }}</p>
              <p class="text-gray-500 text-xs mt-1">{{ message.date }}</p>
            </div>
          </div>
          <span v-if="!message.isRead" class="bg-green-500 h-3 w-3 rounded-full"></span>
        </div>
      </div>
    `
};

const addItemModal = {
    props: {
        newItem: {
            type: Object,
            required: true
        }
    },
    template: `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
          <div class="community-gradient py-4 px-6">
            <h3 class="text-xl font-bold text-gray-800">Add New Tool</h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="$emit('add')">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="item-name">
                  Tool Name
                </label>
                <input 
                  id="item-name"
                  v-model="newItem.name" 
                  type="text" 
                  placeholder="What are you sharing?" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="item-description">
                  Description
                </label>
                <textarea 
                  id="item-description"
                  v-model="newItem.description" 
                  placeholder="Tell others about your tool..." 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">
                  Tool Condition
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input type="radio" v-model="newItem.condition" value="Excellent" class="mr-1">
                    <span>Excellent</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" v-model="newItem.condition" value="Good" class="mr-1">
                    <span>Good</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" v-model="newItem.condition" value="Fair" class="mr-1">
                    <span>Fair</span>
                  </label>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">
                  Privacy Setting
                </label>
                <select 
                  v-model="newItem.privacy" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Public">Public (Available to all)</option>
                  <option value="Friends Only">Friends Only</option>
                  <option value="Private">Private (Just for my reference)</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2">
                  Add Photo
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <i class="fas fa-camera text-gray-400 text-3xl mb-2"></i>
                  <p class="text-sm text-gray-500">Tap to take a photo or upload from your gallery</p>
                </div>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button 
                  type="button" 
                  @click="$emit('close')" 
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `
};

const borrowRequestModal = {
    props: {
        selectedItem: {
            type: Object,
            required: true
        },
        borrowRequest: {
            type: Object,
            required: true
        }
    },
    template: `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
          <div class="community-gradient py-4 px-6">
            <h3 class="text-xl font-bold text-gray-800">Borrow Request</h3>
          </div>
          <div class="p-6">
            <div class="mb-4 flex items-center">
              <img class="h-12 w-12 rounded-full mr-4" :src="selectedItem.ownerAvatar" :alt="selectedItem.ownerName">
              <div>
                <p class="font-medium">{{ selectedItem.ownerName }}</p>
                <div class="flex items-center">
                  <span class="text-yellow-500 mr-1">★</span>
                  <span class="text-sm text-gray-700">{{ selectedItem.ownerRating }}</span>
                </div>
              </div>
            </div>
            
            <div class="mb-4 p-3 bg-gray-100 rounded-lg">
              <p class="text-sm font-medium text-gray-800">{{ selectedItem.name }}</p>
              <p class="text-xs text-gray-600">{{ selectedItem.distance }} km away</p>
            </div>
            
            <form @submit.prevent="$emit('send')">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="borrow-dates">
                  When do you need it?
                </label>
                <div class="flex space-x-2">
                  <input 
                    type="date" 
                    v-model="borrowRequest.startDate"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                  <span class="flex items-center">to</span>
                  <input 
                    type="date" 
                    v-model="borrowRequest.endDate"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="borrow-message">
                  Message to owner
                </label>
                <textarea 
                  id="borrow-message"
                  v-model="borrowRequest.message" 
                  placeholder="Explain why you need this tool and how you'll use it..." 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="flex justify-end space-x-3">
                <button 
                  type="button" 
                  @click="$emit('close')" 
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `
};

const messageDetailModal = {
    props: {
        selectedMessage: {
            type: Object,
            required: true
        },
        messageReply: {
            type: String,
            required: true
        }
    },
    template: `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
          <div class="solarpunk-gradient py-4 px-6 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-800">Message</h3>
            <button @click="$emit('close')" class="text-gray-600 hover:text-gray-800">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6">
            <div class="mb-4 flex items-center">
              <img class="h-12 w-12 rounded-full mr-4" :src="selectedMessage.senderAvatar" :alt="selectedMessage.senderName">
              <div>
                <p class="font-medium">{{ selectedMessage.senderName }}</p>
                <p class="text-sm text-gray-600">{{ selectedMessage.date }}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <h4 class="font-bold text-gray-800">{{ selectedMessage.subject }}</h4>
              <div class="mt-2 p-3 bg-gray-100 rounded-lg">
                <p class="text-gray-800">{{ selectedMessage.content }}</p>
              </div>
            </div>
            
            <div v-if="selectedMessage.requestDetails" class="mb-4 p-3 border border-green-200 bg-green-50 rounded-lg">
              <p class="text-sm font-medium text-gray-800">Tool request: {{ selectedMessage.requestDetails.itemName }}</p>
              <p class="text-xs text-gray-700">From {{ selectedMessage.requestDetails.startDate }} to {{ selectedMessage.requestDetails.endDate }}</p>
            </div>
            
            <div v-if="selectedMessage.requestDetails" class="flex space-x-2 justify-end">
              <button 
                @click="$emit('reject')" 
                class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
              >
                Decline
              </button>
              <button 
                @click="$emit('approve')" 
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Approve
              </button>
            </div>
            
            <div v-else class="mt-4">
              <textarea 
                :value="messageReply"
                @input="$emit('update:message-reply', $event.target.value)"
                placeholder="Write your reply..." 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 message-scroll"
                rows="3"
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button 
                  @click="$emit('reply')" 
                  class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
};

// Export all components for use in app.js
export {
    toolCard,
    myToolCard,
    messagePreview,
    addItemModal,
    borrowRequestModal,
    messageDetailModal
};