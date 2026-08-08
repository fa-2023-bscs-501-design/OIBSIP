# 🧮 Calculator — Oasis Infobyte Level 2 Task 1

## 📌 Project Overview

This project is a fully functional browser-based calculator developed as part of the Oasis Infobyte Web Development Internship — Level 2, Task 1.

The calculator provides a clean, modern, and user-friendly interface for performing basic arithmetic operations using HTML5, CSS3, and Vanilla JavaScript.

## 🎯 Objective

The objective of this project is to build an interactive browser-based calculator that performs basic arithmetic operations while demonstrating DOM manipulation, JavaScript event handling, conditional logic, switch statements, number parsing, responsive CSS design, and CSS Grid layout.

## 🛠️ Technologies Used

* **HTML5** — Structure of the calculator
* **CSS3** — Styling, layout, animations, and responsiveness
* **Vanilla JavaScript** — Calculator functionality and event handling

## ✨ Features

* 🔢 Numeric buttons from 0–9
* 🔹 Decimal point support
* ➕ Addition
* ➖ Subtraction
* ✖️ Multiplication
* ➗ Division
* 🟰 Equals button
* 🧹 Clear button
* ⌫ Backspace/Delete functionality
* ⚠️ Division-by-zero error handling
* 🔗 Operator chaining
* 📱 Responsive design
* 🎨 Modern user interface
* 📊 CSS Grid button layout
* 🖱️ JavaScript event listeners
* 🚫 No inline `onclick` attributes
* 🚫 No `eval()` function

## 📂 Project Structure

```
WebDev-L2-Calculator/
│
├── index.html
├── style.css
├── script.js
├── README.md
├── Task1_Calculator_Documentation.docx
│
└── Screenshots/
    ├── 01_Basic_Calculation.png
    ├── 02_Division_By_Zero.png
    ├── 03_Expression_Display.png
    └── 04_Operator_Chaining.png
```

## ⚙️ How to Run

1. Open the `WebDev-L2-Calculator` folder.
2. Locate the `index.html` file.
3. Open `index.html` in a modern web browser.
4. Use the calculator buttons to perform calculations.

No additional libraries or installations are required.

## 🧮 Supported Operations

| Operation      | Example   | Result |
| -------------- | --------- | -----: |
| Addition       | 5 + 3     |      8 |
| Subtraction    | 10 − 4    |      6 |
| Multiplication | 7 × 6     |     42 |
| Division       | 20 ÷ 5    |      4 |
| Decimal        | 5.5 + 2.5 |      8 |

## ⚠️ Error Handling

The calculator prevents division by zero.

For example, when the user enters `10 ÷ 0`, the calculator displays an error message instead of crashing.

## 🔗 Operator Chaining

The calculator supports sequential operations, allowing users to continue entering another operation without completely resetting the calculator.

## ⌫ Backspace Functionality

The Backspace button removes the last entered character.

Example:

`123 → ⌫ → 12`

## 🧹 Clear Functionality

The Clear (`C`) button resets the calculator display to `0`.

## 💻 JavaScript Implementation

The calculator functionality is implemented using Vanilla JavaScript.

The project uses:

* `addEventListener()` for button interactions
* `switch` statements for arithmetic operations
* `parseFloat()` for converting input values into numbers
* Variables for maintaining calculator state
* Conditional statements for validation and error handling

The project intentionally avoids the use of JavaScript's `eval()` function.

## 🎨 CSS Design

CSS3 is used to create a modern calculator interface.

The design includes:

* Dark calculator theme
* Gradient page background
* Rounded buttons
* Hover effects
* Click animations
* CSS Grid layout
* Responsive media queries
* Mobile-friendly sizing

## 📱 Responsive Design

The calculator is designed to work across different screen sizes.

CSS media queries are used to adjust:

* Calculator width
* Button size
* Font size
* Spacing
* Overall layout

## 🧪 Testing

The calculator was tested during development for:

* Basic arithmetic calculations
* Decimal input
* Backspace functionality
* Clear functionality
* Division-by-zero handling
* Expression display
* Operator chaining

## 📸 Screenshots

Screenshots of selected calculator functionality will be stored in the `Screenshots` folder.

These will include:

1. Basic calculation
2. Division-by-zero error handling
3. Expression display
4. Operator chaining

## 📚 Learning Outcomes

Through this project, the following concepts were practiced:

* HTML structure
* CSS Grid
* Responsive web design
* DOM selection
* Event listeners
* JavaScript functions
* Variables and application state
* Conditional statements
* Switch statements
* Number parsing
* Error handling
* User interaction
* Front-end project organization

## 🎓 Internship Information

**Organization:** Oasis Infobyte
**Internship Track:** Web Development
**Level:** Level 2
**Task:** Task 1 — Calculator

## 👩‍💻 Author

**Meerab Asif**

## 📄 Purpose

This project was developed as part of the Oasis Infobyte Web Development Internship for educational and practical learning purposes.
