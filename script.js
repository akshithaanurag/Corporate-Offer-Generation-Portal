// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Check which page is loaded and initialize accordingly
    const path = window.location.pathname.split('/').pop();
    
    if (path === 'index.html' || path === '' || path === 'login.html') {
        initLoginPage();
    } else if (path === 'org-dashboard.html') {
        initOrgDashboard();
    } else if (path === 'nc-dashboard.html') {
        initNCDashboard();
    } else if (path === 'register.html') {
        initRegistration();
    }
});

// Global variables
let currentUser = null;
const usersKey = 'iaeste_users';
const offersKey = 'iaeste_offers';

// Initialize login page
function initLoginPage() {
    // Check if users exist in localStorage, if not create some dummy data
    if (!localStorage.getItem(usersKey)) {
        const adminUser = {
            id: 1,
            name: 'IAESTE NC',
            email: 'nc@iaeste.in',
            password: 'admin123',
            type: 'nc',
            phone: '9876543210',
            address: 'IAESTE India Office'
        };
        localStorage.setItem(usersKey, JSON.stringify([adminUser]));
    }
    
    if (!localStorage.getItem(offersKey)) {
        localStorage.setItem(offersKey, JSON.stringify([]));
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const userTypeRadio = document.querySelector('input[name="user-type"]:checked');
            
            if (!email || !password) {
                alert('Please enter both email and password!');
                return;
            }
            
            if (!userTypeRadio) {
                alert('Please select user type (Organization or NC)!');
                return;
            }
            
            const userType = userTypeRadio.value;
            
            const users = JSON.parse(localStorage.getItem(usersKey));
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                alert('Invalid credentials!');
                return;
            }
            
            // Check user type
            if ((userType === 'nc' && user.type !== 'nc') || (userType !== 'nc' && user.type === 'nc')) {
                alert('User type mismatch! Please select correct user type.');
                return;
            }
            
            currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            if (user.type === 'nc') {
                window.location.href = 'nc-dashboard.html';
            } else {
                window.location.href = 'org-dashboard.html';
            }
        });
    }
    
    // Add click handler for register button if exists
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
}

// Initialize registration page
function initRegistration() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get all form values
            const name = document.getElementById('company-name').value.trim();
            const address = document.getElementById('company-address').value.trim();
            const phone = document.getElementById('contact-number').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const orgType = document.getElementById('org-type').value;
            
            // Basic validation
            if (!name || !address || !phone || !email || !password || !confirmPassword) {
                alert('Please fill in all required fields!');
                return;
            }
            
            // Email format validation
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert('Please enter a valid email address!');
                return;
            }
            
            // Password match validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Password length validation
            if (password.length < 6) {
                alert('Password must be at least 6 characters long!');
                return;
            }
            
            // Phone number validation
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number!');
                return;
            }
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem(usersKey)) || [];
            if (users.some(u => u.email === email)) {
                alert('Email already registered!');
                return;
            }
            
            // Create new user
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name,
                address,
                phone,
                email,
                password,
                type: orgType === 'governmental' ? 'gov' : 'non-gov',
                offers: []
            };
            
            users.push(newUser);
            localStorage.setItem(usersKey, JSON.stringify(users));
            
            alert('Registration successful! Please login.');
            window.location.href = 'index.html';
        });
    }
    
    // Add click handler for login link if exists
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

// Initialize Organization Dashboard
function initOrgDashboard() {
    // Check if user is logged in
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    document.getElementById('company-name-display').textContent = currentUser.name;
    
    // Load company's offers
    loadCompanyOffers();
    
    // Handle offer form submission
    const offerForm = document.getElementById('offer-form');
    if (offerForm) {
        offerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const duration = document.getElementById('duration').value;
            const stipend = document.getElementById('stipend').value;
            const field = document.getElementById('field').value;
            const skills = document.getElementById('skills').value;
            const food = document.getElementById('food').checked;
            const accommodation = document.getElementById('accommodation').checked;
            const travel = document.getElementById('travel').checked;
            const mode = document.querySelector('input[name="mode"]:checked').value;
            const stipendJustification = document.getElementById('stipend-justification').value;
            const accommodationAddress = document.getElementById('accommodation-address').value;
            
            // Handle file upload
            const fileInput = document.getElementById('offer-pdf');
            const fileName = fileInput.files[0] ? fileInput.files[0].name : 'No file uploaded';
            
            // Create new offer
            const offers = JSON.parse(localStorage.getItem(offersKey));
            const newOffer = {
                id: offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1,
                companyId: currentUser.id,
                companyName: currentUser.name,
                companyType: currentUser.type,
                duration,
                stipend,
                field,
                skills,
                remuneration: { food, accommodation, travel },
                mode,
                stipendJustification: currentUser.type === 'gov' ? stipendJustification : null,
                accommodationAddress: accommodation ? accommodationAddress : null,
                pdfFileName: fileName,
                date: new Date().toISOString(),
                status: 'pending'
            };
            
            offers.push(newOffer);
            localStorage.setItem(offersKey, JSON.stringify(offers));
            
            // Add offer to user's offers array
            const users = JSON.parse(localStorage.getItem(usersKey));
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                if (!users[userIndex].offers) {
                    users[userIndex].offers = [];
                }
                users[userIndex].offers.push(newOffer.id);
                localStorage.setItem(usersKey, JSON.stringify(users));
            }
            
            alert('Offer submitted successfully!');
            offerForm.reset();
            loadCompanyOffers();
        });
    }
    
    // Toggle stipend justification field based on org type
    if (currentUser.type === 'gov') {
        document.getElementById('stipend-justification-container').style.display = 'block';
    } else {
        document.getElementById('stipend-justification-container').style.display = 'none';
    }
    
    // Toggle accommodation address field
    document.getElementById('accommodation').addEventListener('change', function() {
        document.getElementById('accommodation-address-container').style.display = 
            this.checked ? 'block' : 'none';
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}


// Load company's offers
function loadCompanyOffers() {
    const offers = JSON.parse(localStorage.getItem(offersKey));
    const companyOffers = offers.filter(o => o.companyId === currentUser.id);
    
    const offersTable = document.getElementById('offers-table');
    if (offersTable) {
        offersTable.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Field</th>
                <th>Duration</th>
                <th>Stipend</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
        `;
        
        companyOffers.forEach(offer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${offer.id}</td>
                <td>${offer.field}</td>
                <td>${offer.duration}</td>
                <td>${offer.stipend}</td>
                <td>${offer.mode}</td>
                <td>${offer.status}</td>
                <td>${new Date(offer.date).toLocaleDateString()}</td>
            `;
            offersTable.appendChild(row);
        });
    }
}

// Initialize NC Dashboard
function initNCDashboard() {
    // Check if user is logged in as NC
    const userData = sessionStorage.getItem('currentUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    if (currentUser.type !== 'nc') {
        window.location.href = 'index.html';
        return;
    }
    
    // Load all companies and offers
    loadAllCompanies();
    loadAllOffers();
    updateStatistics();
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Load all companies for NC dashboard
function loadAllCompanies() {
    const users = JSON.parse(localStorage.getItem(usersKey));
    const companies = users.filter(u => u.type !== 'nc');
    const offers = JSON.parse(localStorage.getItem(offersKey));
    
    const companiesTable = document.getElementById('companies-table');
    if (companiesTable) {
        companiesTable.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Offers</th>
                <th>Promotion</th>
                <th>Actions</th>
            </tr>
        `;
        
        companies.forEach(company => {
            const companyOffers = offers.filter(o => o.companyId === company.id);
            const isEligible = companyOffers.length > 0;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${company.name}</td>
                <td>${company.type === 'gov' ? 'Governmental' : 'Non-Governmental'}</td>
                <td>${company.email}</td>
                <td>${company.phone}</td>
                <td>${companyOffers.length}</td>
                <td>
                    ${isEligible ? '<span class="badge eligible">Eligible</span>' : '<span class="badge">Not Eligible</span>'}
                </td>
                <td>
                    <button class="view-offers-btn" data-id="${company.id}">View Offers</button>
                </td>
            `;
            companiesTable.appendChild(row);
        });
        
        // Add event listeners to view offers buttons
        document.querySelectorAll('.view-offers-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const companyId = parseInt(this.getAttribute('data-id'));
                viewCompanyOffers(companyId);
            });
        });
    }
}

// View offers for a specific company
function viewCompanyOffers(companyId) {
    const offers = JSON.parse(localStorage.getItem(offersKey));
    const companyOffers = offers.filter(o => o.companyId === companyId);
    const users = JSON.parse(localStorage.getItem(usersKey));
    const company = users.find(u => u.id === companyId);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Offers from ${company.name}</h3>
            <table class="offers-modal-table">
                <tr>
                    <th>ID</th>
                    <th>Field</th>
                    <th>Duration</th>
                    <th>Stipend</th>
                    <th>Mode</th>
                    <th>Date</th>
                    <th>PDF</th>
                </tr>
                ${companyOffers.map(offer => `
                    <tr>
                        <td>${offer.id}</td>
                        <td>${offer.field}</td>
                        <td>${offer.duration}</td>
                        <td>${offer.stipend}</td>
                        <td>${offer.mode}</td>
                        <td>${new Date(offer.date).toLocaleDateString()}</td>
                        <td>
                            ${offer.pdfFileName !== 'No file uploaded' ? 
                                `<a href="#" class="download-pdf" data-id="${offer.id}">Download</a>` : 
                                'No PDF'}
                        </td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    // Handle PDF download (simulated in this localStorage-only version)
    document.querySelectorAll('.download-pdf').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const offerId = parseInt(this.getAttribute('data-id'));
            const offer = companyOffers.find(o => o.id === offerId);
            alert(`In a real implementation, this would download: ${offer.pdfFileName}`);
        });
    });
}

// Load all offers for NC dashboard
function loadAllOffers() {
    const offers = JSON.parse(localStorage.getItem(offersKey));
    const users = JSON.parse(localStorage.getItem(usersKey));
    
    const offersTable = document.getElementById('all-offers-table');
    if (offersTable) {
        offersTable.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Type</th>
                <th>Field</th>
                <th>Duration</th>
                <th>Stipend</th>
                <th>Mode</th>
                <th>Date</th>
                <th>PDF</th>
            </tr>
        `;
        
        offers.forEach(offer => {
            const company = users.find(u => u.id === offer.companyId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${offer.id}</td>
                <td>${company ? company.name : 'Unknown'}</td>
                <td>${offer.companyType === 'gov' ? 'Governmental' : 'Non-Governmental'}</td>
                <td>${offer.field}</td>
                <td>${offer.duration}</td>
                <td>${offer.stipend}</td>
                <td>${offer.mode}</td>
                <td>${new Date(offer.date).toLocaleDateString()}</td>
                <td>
                    ${offer.pdfFileName !== 'No file uploaded' ? 
                        `<a href="#" class="download-pdf" data-id="${offer.id}">Download</a>` : 
                        'No PDF'}
                </td>
            `;
            offersTable.appendChild(row);
        });
        
        // Handle PDF download (simulated in this localStorage-only version)
        document.querySelectorAll('.download-pdf').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const offerId = parseInt(this.getAttribute('data-id'));
                const offer = offers.find(o => o.id === offerId);
                alert(`In a real implementation, this would download: ${offer.pdfFileName}`);
            });
        });
    }
}

// Update statistics on NC dashboard
function updateStatistics() {
    const users = JSON.parse(localStorage.getItem(usersKey));
    const companies = users.filter(u => u.type !== 'nc');
    const offers = JSON.parse(localStorage.getItem(offersKey));
    
    const eligibleCompanies = companies.filter(company => {
        const companyOffers = offers.filter(o => o.companyId === company.id);
        return companyOffers.length > 0;
    });
    
    document.getElementById('total-companies').textContent = companies.length;
    document.getElementById('total-offers').textContent = offers.length;
    document.getElementById('eligible-companies').textContent = eligibleCompanies.length;
}