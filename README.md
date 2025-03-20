# ⚙️ GEARSHARE

> *Because capitalism wants you to buy your own damn drill, we want you to share it.*

A hyperlocal tool-sharing platform that fosters community hacking and helps you connect with fellow DIYers, share resources, one borrowed tool at a time.

https://github.com/user-attachments/assets/91607271-7102-44e4-91ba-012e3709cd4d


Uploading Screen Recording 2025-03-21 at 2.56.47 AM.mp4…



## Core Philosophy

GearShare exists to:
- Make specialized tools accessible to everyone
- Strengthen neighborhood connections and resilience
- Reduce unnecessary consumption and waste
- Look sexy af doing it!

## Features

### 🧰 Personal Inventory System
- **"Tools I Have"**: Add contraptions with photos, condition notes, and availability status
- **Privacy Tiers**:
  - **Public**: Available to all local makers
  - **Friends Only**: Only available to your trusted circle
  - **Private**: Just for your reference, not shared
- **Usage History**: Track who borrowed what and when (with ratings)

### 📍 Hyperlocal Matching
- GPS-based radius setting (default 2km, adjustable)
- Search filters by tool type, availability timing, condition
- Walking/cycling route suggestions (to discourage driving for small items)

### 🤝 Trust & Safety System
- Verified user system (invitation-based)
- "Cogs" reputation economy (earn by sharing, spend when borrowing)
- Peer ratings with specific metrics (timeliness, item condition, communication)
- Optional tool deposit system for high-value items

### 🏘️ Community Resilience Features (Coming Soon)
- Emergency tool registry (critical tools available during disasters)
- "Common Needs" algorithm that suggests what tools the neighborhood lacks
- Group purchase coordination for expensive tools
- Repair event coordination

## Technical Implementation

### Component Architecture
The application is built with:
- **Frontend**: Vue.js 3 (Composition API) with Tailwind CSS
- **UI Theme**: Steampunk-inspired design system
- **License**: GNU General Public License v3

### Core Components
```
├── app.js             # Main application logic
├── components.js      # Reusable UI components
├── index.html         # App shell and structure
├── styles.css         # Steampunk styling
└── LICENSE            # GNU GPL v3
```

### State Management

The application uses Vue's reactive state management:
```javascript
// Core state examples
const activeTab = ref('available');
const searchQuery = ref('');
const searchRadius = ref('2');
const currentLocation = ref('Bengaluru, Karnataka');
```

## User Experience Flow

1. **Onboarding**:
   - Set your location
   - Add tools to your inventory

2. **Discovery**:
   - Browse available tools in your vicinity
   - Search or filter by criteria
   - View distance, condition, and owner information

3. **Borrowing**:
   - Request a tool with dates and message
   - Owner receives notification
   - Owner approves or declines
   - Coordinate handoff via messaging system

4. **Return Process**:
   - Return item on agreed date
   - Owner updates status
   - Leave feedback (coming soon)

## Developer Quick Reference

### Add a new tool to inventory
```javascript
const addNewItem = () => {
  const newItemObject = {
    id: Date.now(),
    name: newItem.value.name,
    description: newItem.value.description,
    condition: newItem.value.condition,
    privacy: newItem.value.privacy,
    image: '/api/placeholder/400/320',
    borrower: null
  };
  myItems.value.unshift(newItemObject);
};
```

### Send a borrowing request
```javascript
const sendBorrowRequest = () => {
  showBorrowModal.value = false;
  displayToast('Borrow request sent! You\'ll get a response soon.');
  // Future: API call to save request
};
```

### Approve a borrowing request
```javascript
const approveRequest = () => {
  displayToast('Request approved! The borrower has been notified.');
  showMessageDetail.value = false;
  
  const itemToUpdate = myItems.value.find(item =>
    item.name === selectedMessage.value.requestDetails.itemName
  );
  
  if (itemToUpdate) {
    itemToUpdate.borrower = selectedMessage.value.senderName;
  }
};
```

## Development Roadmap

### High Priority
1. User authentication system
2. Image upload functionality
3. Geolocation integration
4. Rating and feedback mechanisms

### Medium Priority
5. Community vouching features
6. Emergency tool registry
7. Group purchase coordination

### Low Priority
8. Calendar integration
9. Repair database integration
10. Decentralized architecture exploration

## Design Elements

The system features a steampunk aesthetic with:
- Brass and royal blue color scheme
- Gear and cog decorative elements
- Victorian-inspired typography
- Steam-era terminology ("contraptions" instead of "tools")

## Contributing

GearShare is a collective project for collective benefit. Contributions that align with our anti-capitalist, pro-community ethos are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the GNU General Public License v3. See `LICENSE` for more information.

---

*Gearshare: Because you don't need to own every damn tool in the hardware store.*
