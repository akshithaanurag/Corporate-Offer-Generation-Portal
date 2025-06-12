Corporate-Offer-Generation-Portal

This project is a simple front-end-only web platform designed for IAESTE India to manage and promote internship offers from Indian companies to international students. It includes role-based login functionality for Organizations (companies) and the NC Corporate (IAESTE National Committee) with a complete offer submission and monitoring system.

This is a fully client-side implementation using HTML, CSS, and JavaScript with localStorage and sessionStorage for data persistence. There is no backend or server required.

Project Structure

  project-root/
  ├── index.html
  ├── register.html
  ├── org-dashboard.html
  ├── nc-dashboard.html
  ├── styles.css
  ├── script.js
  ├── README.md
  ├── login-page.png
  ├── nc-dashboard.png
  └── org-dashboard.png

Screenshots:
Login Page
This is the initial login screen where both Organizations and the NC can sign in.
![login page screenshot ](https://github.com/user-attachments/assets/422fb144-2d28-4aae-94a4-7180d04baea9)

NC Dashboard
The NC Dashboard allows the National Committee to view all registered companies, internship offers, and summary statistics.
![NC page screenshot ](https://github.com/user-attachments/assets/2a6c5048-ae4c-429e-9332-17bf5d9c2e1f)

Organization Dashboard
The Organization Dashboard enables companies to submit detailed internship offers and manage their listings.
![organization page screenshot ](https://github.com/user-attachments/assets/96cfbdf6-c11e-427c-8a10-7b1e05f2a4df)


User Roles and Access
1. Organization
  Registers through register.html
  After login, redirected to org-dashboard.html
  Can submit internship offers (including file upload, mode, duration, stipend, etc.)
  Offer submissions are stored in localStorage
  Governmental organizations are required to provide stipend justification

2. NC (National Committee)
  Pre-registered admin user:
  Email: nc@iaeste.in
  Password: admin123
  Logs in via index.html and redirected to nc-dashboard.html
  Can view all registered companies and their offers
  Can view statistics like number of offers, government vs non-government participation
  Can check which companies are eligible for international promotion (must have submitted at least one offer)

Core Features
  Login
  User selects their role (Organization or NC)
  Validates credentials using localStorage
  Session stored using sessionStorage

Registration
  Basic form validation (email format, password length/match, phone number)
  Prevents duplicate email registration
  Saves organization data in localStorage

Internship Offer Submission
Submit internship details including:
  Duration
  Stipend
  Field of Internship
  Required Skills
  Mode (Remote / Hybrid / On-Site)
  Benefits (Food, Accommodation, Travel)
  PDF upload name
  Accommodation address (if applicable)
  Justification (mandatory for Government orgs if stipend is provided)
Offers are stored in localStorage and linked to the company

NC Dashboard
  View all registered organizations
  View all submitted offers
  Identify if companies are eligible for international promotion
  View offer statistics (number of offers, categories, modes)

Technologies Used
  HTML5
  CSS3
  JavaScript (ES6)
  localStorage & sessionStorage

Setup Instructions
  Clone or download this repository.
  Open index.html in your browser.
  Use the default NC login to access admin features, or register a new organization.
  All data is stored in the browser and persists across sessions.

Future Enhancements 
  Backend integration with Node.js or PHP and a database (e.g., MySQL or MongoDB)
  Secure authentication using JWT or OAuth
  Actual file upload and download capability
  Email notifications for registration and offer submissions
  Advanced filters and search in NC Dashboard

