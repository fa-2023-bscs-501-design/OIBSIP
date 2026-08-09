# SecureGate — Login Authentication System

A modern client-side authentication system built with HTML5, CSS3, and Vanilla JavaScript.

The project provides user registration, password validation, secure password hashing, login authentication, protected dashboard access, session management, and logout functionality.

---

## Project Overview

SecureGate is a simple authentication system developed as part of the **Oasis Infobyte Web Development Internship — Level 2, Task 4**.

The application demonstrates how a front-end authentication flow can be implemented using JavaScript and browser `localStorage`.

Users can:

- Create an account
- Validate their password
- Log in using their registered credentials
- Access a protected dashboard
- Maintain an active session
- Log out securely

---

## Features

### Registration

- Username/email input
- Password input
- Empty-field validation
- Minimum 8-character password requirement
- At least one number required in the password
- Duplicate username/email detection
- Registration success message

### Login

- Username/email authentication
- Password authentication
- Empty-field validation
- Generic incorrect-credentials error
- Successful login redirects to the protected dashboard

### Protected Dashboard

- Dashboard is displayed only after successful authentication
- Displays the currently logged-in user
- Shows authenticated session status
- Provides account and access information
- Direct access without an active session redirects to the login screen

### Logout

- Clears the active session
- Returns the user to the login screen
- Prevents access to the protected dashboard after logout

### Security

- Passwords are never stored as plain text
- Passwords are processed using the browser's built-in SHA-256 Web Crypto API
- Only the resulting password hash is stored in `localStorage`
- Login compares the generated hash with the stored hash
- Incorrect login attempts use a generic error message

### Responsive Design

The interface is responsive and adapts to:

- Desktop screens
- Tablets
- Mobile devices

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Application structure |
| CSS3 | Styling and responsive layout |
| Vanilla JavaScript | Authentication logic |
| Web Crypto API | SHA-256 password hashing |
| localStorage | Client-side user and session storage |

---

## Project Structure

```text
WebDev-L2-LoginAuthenticationSystem/
│
├── index.html
├── style.css
├── script.js
└── README.md
Authentication Flow
                    START
                      │
                      ▼
               Authentication
                  Interface
                      │
             ┌────────┴────────┐
             ▼                 ▼
         Register            Login
             │                 │
             ▼                 ▼
      Validate Input      Validate Input
             │                 │
             ▼                 ▼
       Check Duplicate    Find User
             │                 │
             ▼                 ▼
       SHA-256 Hash       SHA-256 Hash
             │                 │
             ▼                 ▼
       Save User Data     Compare Hash
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
                 Invalid               Valid
                    │                     │
                    ▼                     ▼
              Error Message         Create Session
                                          │
                                          ▼
                                    Protected
                                     Dashboard
                                          │
                                          ▼
                                        Logout
                                          │
                                          ▼
                                   Clear Session
                                          │
                                          ▼
                                       Login

Password Security

The application does not save user passwords directly.

During registration, the password is converted into a SHA-256 hash using the Web Crypto API.
Original Password
       │
       ▼
SHA-256 Hashing
       │
       ▼
Password Hash
       │
       ▼
localStorage
During login, the entered password is hashed again and compared with the stored hash.

This demonstrates the basic concept of password hashing without storing the original password.

Note: This project is a client-side educational demonstration. Production authentication systems should use server-side authentication, secure password hashing such as Argon2 or bcrypt, HTTPS, secure cookies, and a backend database.
Validation Rules
Registration

The password must:

Contain at least 8 characters
Contain at least 1 number
Not be empty

The username/email must also be provided.

Existing usernames/emails cannot be registered again.

Login

Both username/email and password are required.

If authentication fails, the application displays:

Invalid username/email or password.
The message intentionally does not reveal which credential was incorrect.

Testing Completed

The following functionality was tested:

Test	Result
New user registration	Passed
Empty registration fields	Passed
Weak password validation	Passed
Duplicate account detection	Passed
Correct login	Passed
Incorrect credentials	Passed
Protected dashboard	Passed
Logout	Passed
Session validation	Passed
Responsive layout	Passed
How to Run

No server installation is required.

Step 1

Download or clone the project.

Step 2

Open the project folder.

Step 3

Open:
index.html

in a modern web browser.

Step 4

Create an account and test the authentication flow.

Browser Storage

The application uses browser localStorage for educational client-side storage.

Two storage entries are used:

secureGateUsers
secureGateSession

secureGateUsers stores registered account information and password hashes.

secureGateSession stores the currently authenticated session.

User Interface

The application includes:

Premium authentication interface
Registration screen
Login screen
Protected dashboard
Authentication status indicator
Responsive mobile layout
Success and error notifications
Logout functionality
Project Purpose

This project demonstrates practical understanding of:

DOM manipulation
JavaScript event handling
Form validation
Browser storage
Authentication flow
Password hashing
Session management
Protected UI states
Responsive web design
Author

Meerab Asif

Web Development Intern

Disclaimer

This project is developed for educational and internship purposes.

The authentication system is implemented on the client side and should not be considered suitable for protecting sensitive production applications.
