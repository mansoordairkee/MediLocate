// MediLocate JavaScript

// Mock data
const mockServices = {
    hospital: [
        {
            id: "h1",
            name: "SMS Hospital",
            type: "hospital",
            category: "Government Hospital",
            address: "Jawahar Lal Nehru Marg, Jaipur",
            phone: "0141-2560291",
            hours: "24/7",
            rating: 4.5,
            distance: "0.5 mi",
            isOpen: true
        },
        {
            id: "h2",
            name: "Fortis Escorts Hospital",
            type: "hospital",
            category: "Private Hospital",
            address: "Jawahar Circle, Malviya Nagar, Jaipur",
            phone: "0141-2547000",
            hours: "24/7",
            rating: 4.4,
            distance: "1.2 mi",
            isOpen: true
        },
        {
            id: "h3",
            name: "Mahatma Gandhi Hospital",
            type: "hospital",
            category: "Multi-specialty Hospital",
            address: "Sitapura Industrial Area, Jaipur",
            phone: "0141-2771777",
            hours: "24/7",
            rating: 4.3,
            distance: "2.0 mi",
            isOpen: true
        }
    ],
    pharmacy: [
        {
            id: "p1",
            name: "Apollo Pharmacy",
            type: "pharmacy",
            category: "24-Hour Pharmacy",
            address: "MI Road, Jaipur",
            phone: "1800-102-7777",
            hours: "24/7",
            rating: 4.3,
            distance: "0.8 mi",
            isOpen: true
        },
        {
            id: "p2",
            name: "MedPlus Pharmacy",
            type: "pharmacy",
            category: "Pharmacy",
            address: "C Scheme, Ashok Nagar, Jaipur",
            phone: "0141-4003001",
            hours: "8 AM - 10 PM",
            rating: 4.2,
            distance: "1.1 mi",
            isOpen: true
        },
        {
            id: "p3",
            name: "Wellness Forever",
            type: "pharmacy",
            category: "Pharmacy",
            address: "Malviya Nagar, Jaipur",
            phone: "0141-3569898",
            hours: "9 AM - 9 PM",
            rating: 4.0,
            distance: "1.8 mi",
            isOpen: true
        }
    ],
    lab: [
        {
            id: "l1",
            name: "Dr. Lal PathLabs",
            type: "lab",
            category: "Diagnostic Lab",
            address: "MI Road, Jaipur",
            phone: "0141-2377777",
            hours: "7 AM - 8 PM",
            rating: 4.6,
            distance: "0.9 mi",
            isOpen: true
        },
        {
            id: "l2",
            name: "SRL Diagnostics",
            type: "lab",
            category: "Pathology Lab",
            address: "Malviya Nagar, Jaipur",
            phone: "0141-2729800",
            hours: "7 AM - 7 PM",
            rating: 4.5,
            distance: "1.5 mi",
            isOpen: true
        }
    ],
    blood_bank: [
        {
            id: "b1",
            name: "SMS Hospital Blood Bank",
            type: "blood_bank",
            category: "Blood Bank",
            address: "Jawahar Lal Nehru Marg, Jaipur",
            phone: "0141-2560291",
            hours: "24/7",
            rating: 4.7,
            distance: "0.5 mi",
            isOpen: true
        },
        {
            id: "b2",
            name: "Santokba Durlabhji Memorial Hospital Blood Bank",
            type: "blood_bank",
            category: "Blood Bank",
            address: "Bhawani Singh Rd, Jaipur",
            phone: "0141-2566251",
            hours: "8 AM - 8 PM",
            rating: 4.4,
            distance: "1.3 mi",
            isOpen: true
        }
    ],
    veterinary: [
        {
            id: "v1",
            name: "Jaipur Veterinary Hospital",
            type: "veterinary",
            category: "Government Vet Hospital",
            address: "Adarsh Nagar, Jaipur",
            phone: "0141-2600101",
            hours: "9 AM - 6 PM",
            rating: 4.2,
            distance: "1.0 mi",
            isOpen: true
        },
        {
            id: "v2",
            name: "Pets & Vets Clinic",
            type: "veterinary",
            category: "Animal Clinic",
            address: "Malviya Nagar, Jaipur",
            phone: "098290-22005",
            hours: "10 AM - 8 PM",
            rating: 4.6,
            distance: "1.9 mi",
            isOpen: true
        }
    ]
};

const serviceCategories = [
    { id: 'all', name: 'All Services', icon: 'map-pin', description: 'Show all medical services' },
    { id: 'hospital', name: 'Hospitals', icon: 'building-2', description: 'Emergency rooms and hospitals' },
    { id: 'pharmacy', name: 'Pharmacies', icon: 'pill', description: '24/7 and regular pharmacies' },
    { id: 'lab', name: 'Laboratories', icon: 'test-tube', description: 'Diagnostic and testing labs' },
    { id: 'blood_bank', name: 'Blood Banks', icon: 'heart', description: 'Blood donation centers' },
    { id: 'veterinary', name: 'Veterinary', icon: 'paw-print', description: 'Animal hospitals and clinics' }
];

// State
let selectedServiceType = 'all';
let searchQuery = '';
let locationEnabled = true;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderServiceFilters();
    renderServiceList();
    setupEventListeners();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value;
            renderServiceList();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                findNearby();
            }
        });
    }
    
    // Location toggle
    const locationToggle = document.getElementById('locationToggle');
    if (locationToggle) {
        locationToggle.addEventListener('click', toggleLocation);
    }
}

function toggleLocation() {
    locationEnabled = !locationEnabled;
    const btn = document.getElementById('locationToggle');
    const textEl = btn.querySelector('.location-text');
    
    if (locationEnabled) {
        btn.classList.remove('disabled');
        if (textEl) textEl.textContent = 'Location Enabled';
    } else {
        btn.classList.add('disabled');
        if (textEl) textEl.textContent = 'Location Disabled';
    }
    
    console.log('Location:', locationEnabled ? 'Enabled' : 'Disabled');
}

function renderServiceFilters() {
    const container = document.getElementById('serviceFilters');
    if (!container) return;
    
    container.innerHTML = '';
    
    serviceCategories.forEach(category => {
        const isActive = selectedServiceType === category.id;
        
        const button = document.createElement('button');
        button.className = `service-filter-btn ${isActive ? 'active' : ''}`;
        button.onclick = () => selectService(category.id);
        button.setAttribute('data-testid', `button-filter-${category.id}`);
        
        button.innerHTML = `
            <div class="service-icon ${category.id}">
                <i data-lucide="${category.icon}"></i>
            </div>
            <div class="service-info">
                <h4>${category.name}</h4>
                <p>${category.description}</p>
            </div>
        `;
        
        container.appendChild(button);
    });
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function selectService(serviceId) {
    selectedServiceType = serviceId;
    renderServiceFilters();
    renderServiceList();
}

function renderServiceList() {
    const container = document.getElementById('serviceList');
    const countElement = document.getElementById('serviceCount');
    if (!container) return;
    
    let allServices = [];
    
    // Filter by service type
    if (selectedServiceType === 'all') {
        Object.values(mockServices).forEach(serviceGroup => {
            allServices = allServices.concat(serviceGroup);
        });
    } else {
        allServices = mockServices[selectedServiceType] || [];
    }
    
    // Filter by search query
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        allServices = allServices.filter(service =>
            service.name.toLowerCase().includes(query) ||
            service.category.toLowerCase().includes(query) ||
            service.address.toLowerCase().includes(query)
        );
    }
    
    // Update count
    if (countElement) {
        countElement.textContent = `${allServices.length} found`;
    }
    
    // Render services
    container.innerHTML = '';
    
    if (allServices.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--muted-foreground);">No services found matching your criteria</div>';
        return;
    }
    
    allServices.forEach(service => {
        const serviceEl = createServiceCard(service);
        container.appendChild(serviceEl);
    });
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function createServiceCard(service) {
    const div = document.createElement('div');
    div.className = 'service-item';
    div.setAttribute('data-testid', `card-service-${service.id}`);
    
    const statusClass = service.isOpen ? 'open' : 'closed';
    const statusText = service.isOpen ? 'Open' : 'Closed';
    
    div.innerHTML = `
        <div class="service-item-header">
            <div class="service-item-info">
                <div class="service-item-icon ${service.type}">
                    <i data-lucide="${getServiceIcon(service.type)}"></i>
                </div>
                <div class="service-item-details">
                    <h3>${service.name}</h3>
                    <div class="type">${service.category}</div>
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
            <div class="badge badge-status ${statusClass}">
                ${statusText}
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
            <button class="btn btn-primary" onclick='getDirections("${service.address}")'>
                <i data-lucide="navigation"></i>
                Directions
            </button>
            <button class="btn btn-outline" onclick='callService("${service.phone}")'>
                <i data-lucide="phone"></i>
                Call
            </button>
        </div>
    `;
    
    return div;
}

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

// Actions
function callEmergency() {
    if (confirm('This will attempt to call emergency services (105). Continue?')) {
        window.open('tel:105');
    }
}

function callService(phone) {
    if (confirm(`Call ${phone}?`)) {
        window.open(`tel:${phone}`);
    }
}

function getDirections(address) {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
}

function findNearby() {
    console.log('Finding nearby services...', searchQuery);
    alert('Finding nearby services for: ' + (searchQuery || 'all services'));
}

function logout() {
    console.log('Logout triggered');
    window.location.href = 'auth.html';
}

