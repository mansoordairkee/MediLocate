// MediLocate JavaScript - Emergency Services Finder

// Global variables
let map = null;
let userLocation = null;
let selectedServiceType = 'all';
let mapboxToken = '';

// Mock service data
const services = [
    {
        id: 'all',
        name: 'All Services',
        icon: 'map-pin',
        color: 'all',
        description: 'Show all medical services'
    },
    {
        id: 'hospital',
        name: 'Hospitals',
        icon: 'building-2',
        color: 'hospital',
        description: 'Emergency rooms and hospitals'
    },
    {
        id: 'veterinary',
        name: 'Veterinary',
        icon: 'paw-print',
        color: 'veterinary',
        description: 'Animal hospitals and clinics'
    },
    {
        id: 'pharmacy',
        name: 'Pharmacies',
        icon: 'pill',
        color: 'pharmacy',
        description: '24/7 and regular pharmacies'
    },
    {
        id: 'lab',
        name: 'Laboratories',
        icon: 'test-tube',
        color: 'lab',
        description: 'Diagnostic and testing labs'
    },
    {
        id: 'blood_bank',
        name: 'Blood Banks',
        icon: 'heart',
        color: 'blood_bank',
        description: 'Blood donation centers'
    },
];

const mockLocations = {
    hospital: [
        { name: "SMS Hospital", coords: [75.8080, 26.9124], type: "Government Hospital", address: "Jawahar Lal Nehru Marg, Jaipur", phone: "0141-2560291", hours: "24/7", rating: 4.5, distance: "0.5 mi" },
        { name: "Fortis Escorts Hospital", coords: [75.8267, 26.8531], type: "Private Hospital", address: "Jawahar Circle, Malviya Nagar, Jaipur", phone: "0141-2547000", hours: "24/7", rating: 4.4, distance: "1.2 mi" },
        { name: "Mahatma Gandhi Hospital", coords: [75.8994, 26.8150], type: "Multi-specialty Hospital", address: "Sitapura Industrial Area, Jaipur", phone: "0141-2771777", hours: "24/7", rating: 4.3, distance: "2.0 mi" }
    ],

    pharmacy: [
        { name: "Apollo Pharmacy", coords: [75.8125, 26.9070], type: "24-Hour Pharmacy", address: "MI Road, Jaipur", phone: "1800-102-7777", hours: "24/7", rating: 4.3, distance: "0.8 mi" },
        { name: "MedPlus Pharmacy", coords: [75.7878, 26.9121], type: "Pharmacy", address: "C Scheme, Ashok Nagar, Jaipur", phone: "0141-4003001", hours: "8 AM - 10 PM", rating: 4.2, distance: "1.1 mi" },
        { name: "Wellness Forever", coords: [75.8330, 26.8590], type: "Pharmacy", address: "Malviya Nagar, Jaipur", phone: "0141-3569898", hours: "9 AM - 9 PM", rating: 4.0, distance: "1.8 mi" }
    ],

    lab: [
        { name: "Dr. Lal PathLabs", coords: [75.8130, 26.9110], type: "Diagnostic Lab", address: "MI Road, Jaipur", phone: "0141-2377777", hours: "7 AM - 8 PM", rating: 4.6, distance: "0.9 mi" },
        { name: "SRL Diagnostics", coords: [75.8230, 26.8660], type: "Pathology Lab", address: "Malviya Nagar, Jaipur", phone: "0141-2729800", hours: "7 AM - 7 PM", rating: 4.5, distance: "1.5 mi" }
    ],

    blood_bank: [
        { name: "SMS Hospital Blood Bank", coords: [75.8085, 26.9129], type: "Blood Bank", address: "Jawahar Lal Nehru Marg, Jaipur", phone: "0141-2560291", hours: "24/7", rating: 4.7, distance: "0.5 mi" },
        { name: "Santokba Durlabhji Memorial Hospital Blood Bank", coords: [75.8132, 26.8922], type: "Blood Bank", address: "Bhawani Singh Rd, Jaipur", phone: "0141-2566251", hours: "8 AM - 8 PM", rating: 4.4, distance: "1.3 mi" }
    ],

    veterinary: [
        { name: "Jaipur Veterinary Hospital", coords: [75.8202, 26.9201], type: "Government Vet Hospital", address: "Adarsh Nagar, Jaipur", phone: "0141-2600101", hours: "9 AM - 6 PM", rating: 4.2, distance: "1.0 mi" },
        { name: "Pets & Vets Clinic", coords: [75.8261, 26.8543], type: "Animal Clinic", address: "Malviya Nagar, Jaipur", phone: "098290-22005", hours: "10 AM - 8 PM", rating: 4.6, distance: "1.9 mi" }
    ]
};


// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Render service filters
    renderServiceFilters();
    
    // Render service list
    renderServiceList();
    
    // Setup event listeners
    setupEventListeners();
});

// Render service filters
function renderServiceFilters() {
    const container = document.getElementById('serviceFilters');
    
    services.forEach(service => {
        const button = document.createElement('button');
        button.className = `service-filter-btn ${service.id === selectedServiceType ? 'active' : ''}`;
        button.onclick = () => selectService(service.id);
        
        button.innerHTML = `
            <div class="service-icon ${service.color}">
                <i data-lucide="${service.icon}"></i>
            </div>
            <div class="service-info">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
            </div>
        `;
        
        container.appendChild(button);
    });
    
    // Re-initialize icons for new elements
    lucide.createIcons();
}

// Select service type
function selectService(serviceId) {
    selectedServiceType = serviceId;
    
    // Update active state
    document.querySelectorAll('.service-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.service-filter-btn').forEach(btn => {
        if (btn.onclick.toString().includes(serviceId)) {
            btn.classList.add('active');
        }
    });
    
    // Update service list
    renderServiceList();
    
    // Update map markers if map is initialized
    if (map) {
        updateMapMarkers();
    }
}

// Render service list
function renderServiceList() {
    const container = document.getElementById('serviceList');
    const countElement = document.getElementById('serviceCount');
    
    let allServices = [];
    
    if (selectedServiceType === 'all') {
        // Combine all services
        Object.values(mockLocations).forEach(serviceGroup => {
            allServices = allServices.concat(serviceGroup);
        });
    } else {
        allServices = mockLocations[selectedServiceType] || [];
    }
    
    // Update count
    countElement.textContent = `${allServices.length} found`;
    
    // Clear container
    container.innerHTML = '';
    
    allServices.forEach(service => {
        const serviceElement = document.createElement('div');
        serviceElement.className = 'service-item';
        
        const serviceType = getServiceTypeFromService(service);
        const isOpen = service.hours === '24/7' || isCurrentlyOpen(service.hours);
        
        serviceElement.innerHTML = `
            <div class="service-item-header">
                <div class="service-item-info">
                    <div class="service-item-icon">
                        <i data-lucide="${getServiceIcon(serviceType)}" class="icon-${serviceType}"></i>
                    </div>
                    <div class="service-item-details">
                        <h3>${service.name}</h3>
                        <div class="type">${service.type}</div>
                        <div class="service-meta">
                            <div class="service-meta-item">
                                <i data-lucide="map-pin"></i>
                                ${service.distance}
                            </div>
                            <div class="service-meta-item">
                                <i data-lucide="star"></i>
                                ${service.rating}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="badge ${isOpen ? 'status-open' : 'status-closed'}">
                    ${isOpen ? 'Open' : 'Closed'}
                </div>
            </div>
            <div class="service-item-address">
                <div class="address-item">
                    <i data-lucide="map-pin"></i>
                    ${service.address}
                </div>
                <div class="address-item">
                    <i data-lucide="clock"></i>
                    ${service.hours}
                </div>
            </div>
            <div class="service-item-actions">
                <button class="btn btn-primary" onclick="getDirections('${service.name}')">
                    <i data-lucide="navigation"></i>
                    Directions
                </button>
                <button class="btn btn-outline" onclick="callService('${service.phone}')">
                    <i data-lucide="phone"></i>
                    Call
                </button>
            </div>
        `;
        
        container.appendChild(serviceElement);
    });
    
    // Re-initialize icons for new elements
    lucide.createIcons();
}

// Get service type from service object
function getServiceTypeFromService(service) {
    for (const [type, locations] of Object.entries(mockLocations)) {
        if (locations.includes(service)) {
            return type;
        }
    }
    return 'hospital';
}

// Get service icon
function getServiceIcon(serviceType) {
    const icons = {
        hospital: 'building-2',
        pharmacy: 'pill',
        lab: 'test-tube',
        blood_bank: 'heart',
        veterinary: 'paw-print'
    };
    return icons[serviceType] || 'building-2';
}

// Check if service is currently open
function isCurrentlyOpen(hours) {
    if (hours === '24/7') return true;
    
    // Simple time check - in real app, would parse hours properly
    const now = new Date();
    const currentHour = now.getHours();
    
    // Assume most places are open between 8 AM and 8 PM
    return currentHour >= 8 && currentHour < 20;
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                findNearby();
            }
        });
    }

}

// Handle search
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    console.log('Searching for:', query);
    // In a real app, would filter services based on query
}


// Get marker color for service type
function getMarkerColor(serviceType) {
    const colors = {
        hospital: '#DC2626',
        pharmacy: '#16A34A',
        lab: '#7C3AED',
        blood_bank: '#DC2626',
        veterinary: '#EA580C'
    };
    return colors[serviceType] || '#1E7FFF';
}

// Emergency functions
function callEmergency() {
    if (confirm('This will attempt to call emergency services (100). Continue?')) {
        window.open('tel:100');
    }
}

//For phone calls 
function callService(phone) {
    if (confirm(`Call ${phone}?`)) {
        window.open(`tel:${phone}`);
    }
}

//For Direction 
function findNearby() {
    console.log('Finding nearby services...');
    alert('Finding nearby services...');
    // In a real app, would use geolocation to find actual nearby services
}

// Utility functions
function formatDistance(distance) {
    return `${distance} mi`;
}

function formatRating(rating) {
    return `★ ${rating}`;
}

// Export functions for global access
window.selectService = selectService;
window.initializeMap = initializeMap;
window.callEmergency = callEmergency;
window.getDirections = getDirections;
window.callService = callService;
window.findNearby = findNearby;