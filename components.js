// Modern Vue 3 component approach
// Use this as your components.js file

const toolCard = {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="steampunk-card overflow-hidden tool-card relative">
      <div class="cog-decoration cog-top-right"></div>
      <div class="md:flex">
        <div class="md:flex-shrink-0">
          <img class="h-48 w-full object-cover md:w-48 tool-card-image" :src="item.image" :alt="item.name">
          <div class="absolute top-2 right-2">
            <span :class="['steampunk-badge', 
              item.condition === 'Excellent' ? 'bg-royal' : 
              item.condition === 'Good' ? 'bg-midnight' : 
              'bg-abyss']">
              {{ item.condition }}
            </span>
          </div>
        </div>
        <div class="p-4 flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-ornate text-royal">{{ item.name }}</h3>
              <p class="text-sm font-mechanical text-abyss mt-1">{{ item.distance }} km away • Available {{ item.availabilityText }}</p>
            </div>
          </div>
          
          <p class="mt-2 text-abyss text-sm">{{ item.description }}</p>
          
          <div class="mt-4 flex items-center">
            <img class="h-8 w-8 rounded-full border-2 border-royal" :src="item.ownerAvatar" :alt="item.ownerName">
            <span class="ml-2 text-sm font-mechanical text-abyss">{{ item.ownerName }}</span>
            <div class="ml-auto flex items-center">
              <span class="text-royal mr-1">★</span>
              <span class="text-sm text-abyss">{{ item.ownerRating }}</span>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <button @click="$emit('borrow-request', item)" class="steampunk-button">
              <i class="fas fa-handshake mr-2"></i> Request Usage
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
    <div class="steampunk-card overflow-hidden tool-card">
      <div class="md:flex">
        <div class="md:flex-shrink-0">
          <img class="h-48 w-full object-cover md:w-48 tool-card-image" :src="item.image" :alt="item.name">
        </div>
        <div class="p-4 flex-1">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-ornate text-royal">{{ item.name }}</h3>
              <p v-if="item.borrower" class="text-sm font-mechanical text-red-600 mt-1">
                Currently operated by {{ item.borrower }}
              </p>
              <p v-else class="text-sm font-mechanical text-green-600 mt-1">
                Available for community use
              </p>
            </div>
            <span :class="['steampunk-badge', 
              item.privacy === 'Public' ? 'bg-royal' : 
              item.privacy === 'Friends Only' ? 'bg-midnight' : 
              'bg-abyss']">
              {{ item.privacy }}
            </span>
          </div>
          
          <p class="mt-2 text-abyss text-sm">{{ item.description }}</p>
          
          <div class="mt-4 flex justify-between">
            <button @click="$emit('edit', item)" class="text-royal hover:text-midnight font-mechanical">
              <i class="fas fa-edit mr-1"></i> Modify
            </button>
            <div>
              <button @click="$emit('toggle-privacy', item)" class="text-royal hover:text-midnight mr-3">
                <i :class="['fas', item.privacy === 'Public' ? 'fa-eye' : item.privacy === 'Friends Only' ? 'fa-user-friends' : 'fa-eye-slash']"></i>
              </button>
              <button @click="$emit('delete', item)" class="text-red-600 hover:text-red-800">
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
    <div class="p-4 hover:bg-cream cursor-pointer flex items-start" @click="$emit('open', message)">
      <img class="h-12 w-12 rounded-full border-2 border-royal mr-3" :src="message.senderAvatar" :alt="message.senderName">
      <div class="flex-1">
        <div class="flex justify-between">
          <h4 class="font-ornate text-royal">{{ message.senderName }}</h4>
          <span v-if="!message.isRead" class="bg-royal h-3 w-3 rounded-full"></span>
        </div>
        <p class="text-abyss font-mechanical text-sm">{{ message.subject }}</p>
        <p class="text-abyss text-opacity-70 text-xs mt-1">{{ message.date }}</p>
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
    <div class="fixed inset-0 bg-abyss bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="steampunk-modal w-full max-w-md mx-auto relative">
        <div class="steampunk-modal-header py-4 px-6">
          <h3 class="text-xl">Register New Contraption</h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="$emit('add')">
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2" for="item-name">
                Contraption Title
              </label>
              <input 
                id="item-name"
                v-model="newItem.name" 
                type="text" 
                placeholder="What marvel are you sharing?" 
                class="w-full steampunk-input"
                required
              >
            </div>
            
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2" for="item-description">
                Technical Description
              </label>
              <textarea 
                id="item-description"
                v-model="newItem.description" 
                placeholder="Detail its functions and capabilities..." 
                class="w-full steampunk-input"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2">
                Operational Condition
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input type="radio" v-model="newItem.condition" value="Excellent" class="mr-1">
                  <span class="text-abyss">Pristine</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="newItem.condition" value="Good" class="mr-1">
                  <span class="text-abyss">Functioning</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="newItem.condition" value="Fair" class="mr-1">
                  <span class="text-abyss">Requires Care</span>
                </label>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2">
                Visibility Protocol
              </label>
              <select 
                v-model="newItem.privacy" 
                class="w-full steampunk-input steampunk-select"
              >
                <option value="Public">Public Registry (All inventors)</option>
                <option value="Friends Only">Fellow Inventors Only</option>
                <option value="Private">Workshop Records Only</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2">
                Daguerreotype
              </label>
              <div class="border-2 border-dashed border-royal rounded-xl p-6 text-center">
                <i class="fas fa-camera-retro text-royal text-3xl mb-2"></i>
                <p class="text-sm text-abyss">Tap to capture an image or select from your archives</p>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="$emit('close')" 
                class="px-4 py-2 border-2 border-royal text-royal rounded-xl hover:bg-cream font-mechanical"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="steampunk-button"
              >
                Register Contraption
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
    <div class="fixed inset-0 bg-abyss bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="steampunk-modal w-full max-w-md mx-auto">
        <div class="steampunk-modal-header py-4 px-6">
          <h3 class="text-xl">Usage Request Protocol</h3>
        </div>
        <div class="p-6">
          <div class="mb-4 flex items-center">
            <img class="h-12 w-12 rounded-full border-2 border-royal mr-4" :src="selectedItem.ownerAvatar" :alt="selectedItem.ownerName">
            <div>
              <p class="font-ornate text-royal">{{ selectedItem.ownerName }}</p>
              <div class="flex items-center">
                <span class="text-royal mr-1">★</span>
                <span class="text-sm text-abyss">{{ selectedItem.ownerRating }}</span>
              </div>
            </div>
          </div>
          
          <div class="mb-4 p-3 bg-cream rounded-xl">
            <p class="text-sm font-ornate text-royal">{{ selectedItem.name }}</p>
            <p class="text-xs text-abyss">{{ selectedItem.distance }} km from your workshop</p>
          </div>
          
          <form @submit.prevent="$emit('send')">
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2" for="borrow-dates">
                Operational Timeline
              </label>
              <div class="flex space-x-2">
                <input 
                  type="date" 
                  v-model="borrowRequest.startDate"
                  class="flex-1 steampunk-input"
                  required
                >
                <span class="flex items-center font-mechanical">to</span>
                <input 
                  type="date" 
                  v-model="borrowRequest.endDate"
                  class="flex-1 steampunk-input"
                  required
                >
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2" for="borrow-message">
                Personal Correspondence
              </label>
              <textarea 
                id="borrow-message"
                v-model="borrowRequest.message" 
                placeholder="Explain your intentions and operational requirements..." 
                class="w-full steampunk-input"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="$emit('close')" 
                class="px-4 py-2 border-2 border-royal text-royal rounded-xl hover:bg-cream font-mechanical"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="steampunk-button"
              >
                Dispatch Request
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
    <div class="fixed inset-0 bg-abyss bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="steampunk-modal w-full max-w-md mx-auto">
        <div class="steampunk-modal-header py-4 px-6 flex justify-between items-center">
          <h3 class="text-xl">Correspondence</h3>
          <button @click="$emit('close')" class="text-cream hover:text-white">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="mb-4 flex items-center">
            <img class="h-12 w-12 rounded-full border-2 border-royal mr-4" :src="selectedMessage.senderAvatar" :alt="selectedMessage.senderName">
            <div>
              <p class="font-ornate text-royal">{{ selectedMessage.senderName }}</p>
              <p class="text-sm text-abyss">{{ selectedMessage.date }}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="font-ornate text-royal">{{ selectedMessage.subject }}</h4>
            <div class="mt-2 p-3 bg-cream rounded-xl">
              <p class="text-abyss font-mechanical">{{ selectedMessage.content }}</p>
            </div>
          </div>
          
          <div v-if="selectedMessage.requestDetails" class="mb-4 p-3 border-2 border-royal bg-cream bg-opacity-50 rounded-xl">
            <p class="text-sm font-ornate text-royal">Contraption request: {{ selectedMessage.requestDetails.itemName }}</p>
            <p class="text-xs text-abyss font-mechanical">From {{ selectedMessage.requestDetails.startDate }} to {{ selectedMessage.requestDetails.endDate }}</p>
          </div>
          
          <div v-if="selectedMessage.requestDetails" class="flex space-x-2 justify-end">
            <button 
              @click="$emit('reject')" 
              class="px-4 py-2 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 font-mechanical"
            >
              Decline
            </button>
            <button 
              @click="$emit('approve')" 
              class="steampunk-button"
            >
              Approve
            </button>
          </div>
          
          <div v-else class="mt-4">
            <textarea 
              :value="messageReply"
              @input="$emit('update:message-reply', $event.target.value)"
              placeholder="Compose your reply..." 
              class="w-full steampunk-input message-scroll"
              rows="3"
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button 
                @click="$emit('reply')" 
                class="steampunk-button"
              >
                Send Reply
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