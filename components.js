// Modern Vue 3 component approach with Tailwind styles
// Each component is optimized for both desktop and mobile experiences

const toolCard = {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      console.log('Card was clicked!', this.item);
      this.$emit('view-details', this.item);
    }
  },
  template: `
    <div @click="handleClick" class="relative group overflow-hidden rounded-xl border-3 border-royal shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <!-- Main image takes center stage -->
      <div class="aspect-square overflow-hidden relative">
        <img :src="item.image" 
             :alt="item.name" 
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
        
        <!-- Condition badge -->
        <div class="absolute top-3 right-3">
          <span :class="['px-2 py-1 text-xs rounded-full border-2 border-cream font-mechanical font-bold', 
            item.condition === 'Excellent' ? 'bg-royal text-cream' : 
            item.condition === 'Good' ? 'bg-midnight text-cream' : 
            'bg-abyss text-cream']">
            {{ item.condition }}
          </span>
        </div>
        
        <!-- Info overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-abyss to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 class="text-xl font-ornate text-cream tracking-wide">{{ item.name }}</h3>
          <p class="text-sm font-mechanical text-cream mt-1 flex items-center">
            <span class="flex items-center mr-3">
              <i class="fas fa-map-marker-alt mr-1"></i> {{ item.distance }} km away
            </span>
          </p>
        </div>
      </div>
      
      <!-- Bottom info bar, always visible -->
      <div class="p-3 bg-cream border-t-2 border-royal border-opacity-30 flex justify-between items-center">
        <div class="flex items-center">
          <img class="h-8 w-8 rounded-full border-2 border-royal" :src="item.ownerAvatar" :alt="item.ownerName">
          <span class="ml-2 text-sm font-mechanical text-abyss">{{ item.ownerName }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-royal">★</span>
          <span class="text-sm text-abyss ml-1">{{ item.ownerRating }}</span>
        </div>
      </div>
    </div>
  `
};

const unifiedGearModal = {
  props: {
    item: {
      type: Object,
      required: true
    },
    isEditMode: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localItem: { ...this.item },
      originalPrivacy: this.item.privacy || 'Public'
    };
  },
  watch: {
    item(newVal) {
      this.localItem = { ...newVal };
      this.originalPrivacy = newVal.privacy || 'Public';
    }
  },
  methods: {
    saveItem() {
      this.$emit('save', this.localItem);
    },
    cancel() {
      this.localItem = { ...this.item };
      this.$emit('close');
    },
    togglePrivacy() {
      const privacyLevels = ['Public', 'Friends Only', 'Private'];
      const currentIndex = privacyLevels.indexOf(this.localItem.privacy);
      const nextIndex = (currentIndex + 1) % privacyLevels.length;
      this.localItem.privacy = privacyLevels[nextIndex];
    },
    getPrivacyIcon() {
      if (this.localItem.privacy === 'Public') return 'fa-eye';
      if (this.localItem.privacy === 'Friends Only') return 'fa-user-friends';
      return 'fa-eye-slash';
    },
    getPrivacyClass() {
      if (this.localItem.privacy === 'Public') return 'bg-royal text-cream';
      if (this.localItem.privacy === 'Friends Only') return 'bg-midnight text-cream';
      return 'bg-abyss text-cream';
    }
  },
  template: `
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-abyss bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-cream rounded-2xl border-3 border-royal text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button @click="$emit('close')" class="bg-royal rounded-full text-cream h-8 w-8 flex items-center justify-center hover:bg-midnight transition-colors focus:outline-none">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="sm:flex">
            <!-- Left side - Image -->
            <div class="sm:w-1/2">
              <div v-if="localItem.image" class="aspect-square relative">
                <img :src="localItem.image" :alt="localItem.name" class="w-full h-full object-cover">
                
                <!-- Privacy Badge -->
                <div @click="togglePrivacy" class="absolute top-4 left-4 cursor-pointer">
                  <span :class="['px-2 py-1 text-xs rounded-full border-2 border-cream font-mechanical font-bold flex items-center space-x-1', getPrivacyClass()]">
                    <i :class="['fas', getPrivacyIcon()]"></i>
                    <span>{{ localItem.privacy }}</span>
                  </span>
                </div>
                
                <!-- Condition Badge -->
                <div class="absolute top-4 right-4">
                  <select v-model="localItem.condition" 
                          :class="['px-2 py-1 text-xs rounded-full border-2 border-cream font-mechanical font-bold', 
                            localItem.condition === 'Excellent' ? 'bg-royal text-cream' : 
                            localItem.condition === 'Good' ? 'bg-midnight text-cream' : 
                            'bg-abyss text-cream']">
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
              
              <div v-else class="aspect-square bg-royal bg-opacity-20 flex items-center justify-center">
                <div class="text-center">
                  <i class="fas fa-camera-retro text-royal text-3xl mb-2"></i>
                  <p class="text-sm text-abyss">Add an image of your contraption</p>
                </div>
              </div>
            </div>
            
            <!-- Right side - Form -->
            <div class="p-6 sm:w-1/2 overflow-y-auto max-h-[calc(100vh-200px)]">
              <h2 class="text-2xl font-ornate text-royal mb-4">
                {{ isEditMode ? 'Modify Contraption' : 'Register New Contraption' }}
              </h2>
              
              <form @submit.prevent="saveItem">
                <!-- Contraption Name -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-abyss mb-1" for="item-name">Contraption Title</label>
                  <input 
                    id="item-name"
                    v-model="localItem.name" 
                    type="text" 
                    placeholder="What marvel are you sharing?" 
                    class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                    required
                  >
                </div>
                
                <!-- Description -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-abyss mb-1" for="item-description">Technical Description</label>
                  <textarea 
                    id="item-description"
                    v-model="localItem.description" 
                    placeholder="Detail its functions and capabilities..." 
                    class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <!-- Mobile-only Condition/Privacy Controls -->
                <div class="sm:hidden mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-abyss mb-1">Condition</label>
                    <select 
                      v-model="localItem.condition" 
                      class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                    >
                      <option value="Excellent">Pristine</option>
                      <option value="Good">Functioning</option>
                      <option value="Fair">Requires Care</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-abyss mb-1">Visibility</label>
                    <select 
                      v-model="localItem.privacy" 
                      class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                    >
                      <option value="Public">Public</option>
                      <option value="Friends Only">Friends Only</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>
                
                <!-- Buttons -->
                <div class="mt-6 flex space-x-3 justify-end">
                  <!-- Delete button only shows in edit mode -->
                  <button 
                    v-if="isEditMode"
                    type="button" 
                    @click="$emit('delete', localItem)" 
                    class="px-4 py-2 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 font-mechanical transition-colors duration-200"
                  >
                    <i class="fas fa-trash-alt mr-1"></i> Remove
                  </button>
                  <button 
                    type="button" 
                    @click="cancel" 
                    class="px-4 py-2 border-2 border-royal text-royal rounded-xl hover:bg-royal hover:bg-opacity-10 font-mechanical transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="px-4 py-2 bg-royal text-cream rounded-xl border-2 border-royal font-mechanical shadow-steampunk transition-all duration-300 hover:bg-midnight hover:-translate-y-1 active:translate-y-0"
                  >
                    {{ isEditMode ? 'Update Contraption' : 'Register Contraption' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Image uploader section at bottom when no image exists -->
          <div v-if="!localItem.image" class="p-4 border-t border-royal border-opacity-30 bg-royal bg-opacity-5">
            <div class="border-2 border-dashed border-royal rounded-xl p-6 text-center hover:bg-royal hover:bg-opacity-5 transition-colors duration-200 cursor-pointer">
              <i class="fas fa-camera-retro text-royal text-3xl mb-2"></i>
              <p class="text-sm text-abyss">Tap to capture an image or select from your archives</p>
              <input type="file" class="hidden" accept="image/*">
            </div>
          </div>
          
          <!-- Borrowing status section when applicable -->
          <div v-if="isEditMode && localItem.borrower" class="p-4 border-t border-royal border-opacity-30 bg-royal bg-opacity-5">
            <h3 class="text-lg font-ornate text-royal mb-2">Current Status</h3>
            <div class="flex items-center p-3 bg-cream rounded-lg border border-royal">
              <i class="fas fa-user-clock text-royal text-xl mr-3"></i>
              <div>
                <p class="font-mechanical text-abyss">Currently operated by <span class="font-bold">{{ localItem.borrower }}</span></p>
                <p class="text-sm text-abyss opacity-70">Return expected [date placeholder]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};

// Detailed tool modal component
const toolDetailModal = {
  props: {
    item: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-abyss bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-cream rounded-2xl border-3 border-royal text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button @click="$emit('close')" class="bg-royal rounded-full text-cream h-8 w-8 flex items-center justify-center hover:bg-midnight transition-colors focus:outline-none">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="sm:flex">
            <div class="sm:w-1/2">
              <div class="aspect-square">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover">
              </div>
            </div>
            
            <div class="p-6 sm:w-1/2">
              <div class="mb-4">
                <div class="flex justify-between items-start">
                  <h2 class="text-2xl font-ornate text-royal">{{ item.name }}</h2>
                  <span :class="['px-2 py-1 text-xs rounded-full border-2 border-cream font-mechanical font-bold', 
                    item.condition === 'Excellent' ? 'bg-royal text-cream' : 
                    item.condition === 'Good' ? 'bg-midnight text-cream' : 
                    'bg-abyss text-cream']">
                    {{ item.condition }}
                  </span>
                </div>
                
                <div class="mt-1 flex items-center text-sm font-mechanical text-abyss">
                  <span class="flex items-center mr-4">
                    <i class="fas fa-map-marker-alt text-royal mr-1"></i> {{ item.distance }} km away
                  </span>
                  <span class="flex items-center">
                    <i class="far fa-clock text-royal mr-1"></i> {{ item.availabilityText }}
                  </span>
                </div>
              </div>
              
              <div class="mb-4">
                <h3 class="text-lg font-ornate text-royal mb-1">Description</h3>
                <p class="text-abyss">{{ item.description }}</p>
              </div>
              
              <div class="mb-6">
                <h3 class="text-lg font-ornate text-royal mb-2">Owner</h3>
                <div class="flex items-center">
                  <img class="h-12 w-12 rounded-full border-2 border-royal mr-3" :src="item.ownerAvatar" :alt="item.ownerName">
                  <div>
                    <div class="font-mechanical text-abyss">{{ item.ownerName }}</div>
                    <div class="flex items-center">
                      <span class="text-royal">★</span>
                      <span class="text-sm text-abyss ml-1">{{ item.ownerRating }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <button @click="$emit('borrow-request', item)" 
                        class="w-full py-3 px-4 bg-royal text-cream rounded-full border-2 border-cream font-mechanical text-sm transition-all duration-300 hover:bg-midnight hover:-translate-y-1 active:translate-y-0 flex items-center justify-center shadow-md">
                  <i class="fas fa-handshake mr-2"></i> Request Usage
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-royal border-opacity-30 bg-royal bg-opacity-5">
            <h3 class="text-lg font-ornate text-royal mb-2">Similar Contraptions Nearby</h3>
            <div class="flex overflow-x-auto space-x-4 pb-2">
              <!-- Dynamically generate similar items here -->
              <div v-for="(similarItem, index) in getSimilarItems()" :key="index" 
                   class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-royal">
                <img :src="similarItem.image" :alt="similarItem.name" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    getSimilarItems() {
      // In a real app, this would fetch similar items based on the current item
      // For now, we'll return a static array of 3 items
      return [
        { image: 'https://placehold.co/400x300/261FB3/FBE4D6?text=Similar+Item+1', name: 'Similar item 1' },
        { image: 'https://placehold.co/400x300/261FB3/FBE4D6?text=Similar+Item+2', name: 'Similar item 2' },
        { image: 'https://placehold.co/400x300/261FB3/FBE4D6?text=Similar+Item+3', name: 'Similar item 3' }
      ];
    }
  }
};

const myToolCard = {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleEditClick(e) {
      e.stopPropagation();
      this.$emit('edit', this.item);
    },
    handlePrivacyClick(e) {
      e.stopPropagation();
      this.$emit('toggle-privacy', this.item);
    },
    handleDeleteClick(e) {
      e.stopPropagation();
      this.$emit('delete', this.item);
    },
    getPrivacyClass() {
      if (this.item.privacy === 'Public') return 'bg-royal text-cream';
      if (this.item.privacy === 'Friends Only') return 'bg-midnight text-cream';
      return 'bg-abyss text-cream';
    },
    getPrivacyIcon() {
      if (this.item.privacy === 'Public') return 'fa-eye';
      if (this.item.privacy === 'Friends Only') return 'fa-user-friends';
      return 'fa-eye-slash';
    }
  },
  template: `
    <div @click="$emit('edit', item)" 
         class="relative group overflow-hidden rounded-xl border-3 border-royal shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <!-- Main image takes center stage -->
      <div class="aspect-square overflow-hidden relative">
        <img :src="item.image" 
             :alt="item.name" 
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
        
        <!-- Privacy Badge -->
        <div class="absolute top-3 left-3">
          <button @click="handlePrivacyClick" 
                  :class="['px-2 py-1 text-xs rounded-full border-2 border-cream font-mechanical font-bold flex items-center space-x-1', getPrivacyClass()]">
            <i :class="['fas', getPrivacyIcon()]"></i>
            <span class="ml-1">{{ item.privacy }}</span>
          </button>
        </div>
        
        <!-- Condition Badge -->
        <div class="absolute top-3 right-3">
          <span :class="['px-2 py-1 text-xs rounded-full border-2 border-cream font-mechanical font-bold', 
            item.condition === 'Excellent' ? 'bg-royal text-cream' : 
            item.condition === 'Good' ? 'bg-midnight text-cream' : 
            'bg-abyss text-cream']">
            {{ item.condition }}
          </span>
        </div>
        
        <!-- Status Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-abyss to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 class="text-xl font-ornate text-cream tracking-wide">{{ item.name }}</h3>
          <p v-if="item.borrower" class="text-sm font-mechanical text-cream mt-1 flex items-center">
            <i class="fas fa-user-clock mr-1"></i> Currently operated by {{ item.borrower }}
          </p>
          <p v-else class="text-sm font-mechanical text-cream mt-1 flex items-center">
            <i class="fas fa-check-circle mr-1"></i> Available for community use
          </p>
        </div>
      </div>
      
      <!-- Action Bar -->
      <div class="p-3 bg-cream border-t-2 border-royal border-opacity-30 flex justify-between items-center">
        <button @click="handleEditClick" 
                class="text-royal hover:text-midnight font-mechanical transition-colors duration-200 flex items-center">
          <i class="fas fa-edit mr-1"></i> Modify
        </button>
        
        <div class="flex space-x-4">
          <button @click="handlePrivacyClick" 
                  :title="item.privacy === 'Public' ? 'Make private' : item.privacy === 'Friends Only' ? 'Make public' : 'Share with friends'"
                  class="text-royal hover:text-midnight transition-colors duration-200">
            <i :class="['fas', getPrivacyIcon()]"></i>
          </button>
          <button @click="handleDeleteClick" 
                  title="Delete item"
                  class="text-red-600 hover:text-red-800 transition-colors duration-200">
            <i class="fas fa-trash-alt"></i>
          </button>
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
    <div class="p-4 hover:bg-royal hover:bg-opacity-5 cursor-pointer transition-colors duration-200 flex items-start" @click="$emit('open', message)">
      <img class="h-12 w-12 rounded-full border-2 border-royal mr-3" :src="message.senderAvatar" :alt="message.senderName">
      <div class="flex-1">
        <div class="flex justify-between">
          <h4 class="font-ornate text-royal text-lg">{{ message.senderName }}</h4>
          <span v-if="!message.isRead" class="bg-royal h-3 w-3 rounded-full flex-shrink-0"></span>
        </div>
        <p class="text-abyss font-mechanical text-sm font-bold">{{ message.subject }}</p>
        <p class="text-sm text-abyss opacity-70 truncate pr-4">{{ message.content.substring(0, 60) }}{{ message.content.length > 60 ? '...' : '' }}</p>
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
      <div class="bg-cream rounded-2xl border-3 border-royal overflow-hidden w-full max-w-lg mx-auto shadow-lg relative">
        <div class="py-4 px-6 bg-gradient-to-r from-royal to-abyss text-cream flex justify-between items-center">
          <h3 class="text-xl font-ornate">Register New Contraption</h3>
          <button @click="$emit('close')" class="text-cream hover:text-white transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 max-h-[80vh] overflow-y-auto">
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
                class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
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
                class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2">
                Operational Condition
              </label>
              <div class="flex flex-wrap gap-4">
                <label class="flex items-center cursor-pointer px-3 py-2 rounded-xl bg-royal bg-opacity-0 hover:bg-opacity-10 transition-colors">
                  <input type="radio" v-model="newItem.condition" value="Excellent" class="mr-2 text-royal">
                  <span class="text-abyss">Pristine</span>
                </label>
                <label class="flex items-center cursor-pointer px-3 py-2 rounded-xl bg-royal bg-opacity-0 hover:bg-opacity-10 transition-colors">
                  <input type="radio" v-model="newItem.condition" value="Good" class="mr-2 text-royal">
                  <span class="text-abyss">Functioning</span>
                </label>
                <label class="flex items-center cursor-pointer px-3 py-2 rounded-xl bg-royal bg-opacity-0 hover:bg-opacity-10 transition-colors">
                  <input type="radio" v-model="newItem.condition" value="Fair" class="mr-2 text-royal">
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
                class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300 appearance-none bg-no-repeat bg-right pr-8"
                style="background-image: url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 20 20\\' fill=\\'%23261FB3\\'%3E%3Cpath fill-rule=\\'evenodd\\' d=\\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\\' clip-rule=\\'evenodd\\' /%3E%3C/svg%3E'); background-size: 1.5em 1.5em;"
              >
                <option value="Public">Public Registry (All inventors)</option>
                <option value="Friends Only">Fellow Inventors Only</option>
                <option value="Private">Workshop Records Only</option>
              </select>
              <div class="mt-1 text-xs text-abyss opacity-70">
                <div class="flex items-center"><i class="fas fa-eye mr-1"></i> Public: Visible to everyone in your area</div>
                <div class="flex items-center"><i class="fas fa-user-friends mr-1"></i> Friends Only: Visible to connected inventors</div>
                <div class="flex items-center"><i class="fas fa-eye-slash mr-1"></i> Private: Only visible to you</div>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2">
                Daguerreotype
              </label>
              <div class="border-2 border-dashed border-royal rounded-xl p-6 text-center hover:bg-royal hover:bg-opacity-5 transition-colors duration-200 cursor-pointer">
                <i class="fas fa-camera-retro text-royal text-3xl mb-2"></i>
                <p class="text-sm text-abyss">Tap to capture an image or select from your archives</p>
                <input type="file" class="hidden" accept="image/*">
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="$emit('close')" 
                class="px-4 py-2 border-2 border-royal text-royal rounded-xl hover:bg-royal hover:bg-opacity-10 font-mechanical transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-royal text-cream rounded-xl border-2 border-royal font-mechanical shadow-steampunk transition-all duration-300 hover:bg-midnight hover:-translate-y-1 active:translate-y-0"
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
      <div class="bg-cream rounded-2xl border-3 border-royal overflow-hidden w-full max-w-md mx-auto shadow-lg relative">
        <div class="py-4 px-6 bg-gradient-to-r from-royal to-abyss text-cream flex justify-between items-center">
          <h3 class="text-xl font-ornate">Usage Request Protocol</h3>
          <button @click="$emit('close')" class="text-cream hover:text-white transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 max-h-[80vh] overflow-y-auto">
          <div class="mb-4 flex items-center">
            <img class="h-12 w-12 rounded-full border-2 border-royal mr-4" :src="selectedItem.ownerAvatar" :alt="selectedItem.ownerName">
            <div>
              <p class="font-ornate text-royal text-lg">{{ selectedItem.ownerName }}</p>
              <div class="flex items-center">
                <span class="text-royal mr-1">★</span>
                <span class="text-sm text-abyss">{{ selectedItem.ownerRating }}</span>
              </div>
            </div>
          </div>
          
          <div class="mb-6 p-4 bg-cream bg-opacity-50 rounded-xl border border-royal">
            <h4 class="text-lg font-ornate text-royal mb-1">{{ selectedItem.name }}</h4>
            <p class="text-sm text-abyss">{{ selectedItem.description }}</p>
          </div>
          
          <form @submit.prevent="$emit('send')">
            <div class="mb-4">
              <label class="block text-abyss font-mechanical mb-2" for="borrow-dates">
                Operational Timeline
              </label>
              <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <div class="flex-1">
                  <label class="text-xs text-abyss mb-1 block">Start Date</label>
                  <input 
                    type="date" 
                    v-model="borrowRequest.startDate"
                    class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                    required
                  >
                </div>
                <div class="flex-1">
                  <label class="text-xs text-abyss mb-1 block">End Date</label>
                  <input 
                    type="date" 
                    v-model="borrowRequest.endDate"
                    class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                    required
                  >
                </div>
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
                class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
                rows="3"
                required
              ></textarea>
              <p class="mt-1 text-xs text-abyss opacity-70">* Include details about your project and how you'll use this contraption.</p>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="$emit('close')" 
                class="px-4 py-2 border-2 border-royal text-royal rounded-xl hover:bg-royal hover:bg-opacity-10 font-mechanical transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-royal text-cream rounded-xl border-2 border-royal font-mechanical shadow-steampunk transition-all duration-300 hover:bg-midnight hover:-translate-y-1 active:translate-y-0"
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
      <div class="bg-cream rounded-2xl border-3 border-royal overflow-hidden w-full max-w-md mx-auto shadow-lg relative">
        <div class="py-4 px-6 bg-gradient-to-r from-royal to-abyss text-cream flex justify-between items-center">
          <h3 class="text-xl font-ornate">Correspondence</h3>
          <button @click="$emit('close')" class="text-cream hover:text-white transition-colors">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 max-h-[80vh] overflow-y-auto">
          <div class="mb-4 flex items-center">
            <img class="h-12 w-12 rounded-full border-2 border-royal mr-4" :src="selectedMessage.senderAvatar" :alt="selectedMessage.senderName">
            <div>
              <p class="font-ornate text-royal text-lg">{{ selectedMessage.senderName }}</p>
              <p class="text-sm text-abyss">{{ selectedMessage.date }}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="font-ornate text-royal text-lg">{{ selectedMessage.subject }}</h4>
            <div class="mt-2 p-4 bg-cream bg-opacity-50 rounded-xl border border-royal">
              <p class="text-abyss font-mechanical whitespace-pre-line">{{ selectedMessage.content }}</p>
            </div>
          </div>
          
          <div v-if="selectedMessage.requestDetails" class="mb-4 p-4 border-2 border-royal bg-cream bg-opacity-50 rounded-xl">
            <div class="flex items-center justify-between mb-2">
              <p class="text-md font-ornate text-royal">Contraption Request</p>
              <span class="px-2 py-0.5 bg-royal text-cream text-xs rounded-full">Pending</span>
            </div>
            <p class="text-md font-mechanical text-abyss font-bold">{{ selectedMessage.requestDetails.itemName }}</p>
            <p class="text-sm text-abyss font-mechanical mt-1">From {{ selectedMessage.requestDetails.startDate }} to {{ selectedMessage.requestDetails.endDate }}</p>
          </div>
          
          <div v-if="selectedMessage.requestDetails" class="flex space-x-2 justify-end">
            <button 
              @click="$emit('reject')" 
              class="px-4 py-2 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 font-mechanical transition-colors duration-200"
            >
              Decline
            </button>
            <button 
              @click="$emit('approve')" 
              class="px-4 py-2 bg-royal text-cream rounded-xl border-2 border-royal font-mechanical shadow-steampunk transition-all duration-300 hover:bg-midnight hover:-translate-y-1 active:translate-y-0"
            >
              Approve
            </button>
          </div>
          
          <div v-else class="mt-4">
            <label class="block text-abyss font-mechanical mb-2" for="message-reply">
              Your Reply
            </label>
            <textarea 
              id="message-reply"
              :value="messageReply"
              @input="$emit('update:message-reply', $event.target.value)"
              placeholder="Compose your reply..." 
              class="w-full px-3 py-2 bg-cream border-2 border-royal rounded-xl text-abyss focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all duration-300"
              rows="3"
            ></textarea>
            <div class="mt-2 flex justify-end">
              <button 
                @click="$emit('reply')" 
                :disabled="!messageReply.trim()"
                :class="[
                  'px-4 py-2 bg-royal text-cream rounded-xl border-2 border-royal font-mechanical shadow-steampunk transition-all duration-300 flex items-center',
                  messageReply.trim() ? 'hover:bg-midnight hover:-translate-y-1 active:translate-y-0' : 'opacity-50 cursor-not-allowed'
                ]"
              >
                <i class="fas fa-paper-plane mr-2"></i> Send Reply
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
  messageDetailModal,
  toolDetailModal,
  unifiedGearModal
};