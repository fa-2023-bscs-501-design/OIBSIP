# Level 1 — Task 3: Temperature Converter Website

## 1. Project Overview

This project is an interactive Temperature Converter Website developed as part of the Oasis Infobyte Web Development and Designing Internship.

The objective of this task was to create a web-based tool that converts temperature values between Celsius, Fahrenheit, and Kelvin using HTML5, CSS3, and Vanilla JavaScript.

The project also focuses on input validation and user-friendly handling of invalid temperature values.

## 2. Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript

## 3. Main Features

### Temperature Input

The website provides a numeric input field where the user can enter a temperature value.

The input is validated before performing the conversion.

### Input Unit Selector

A dropdown control allows the user to select the input temperature unit:

* Celsius
* Fahrenheit
* Kelvin

### Temperature Conversion

After clicking the Convert button, the application calculates the corresponding values for all supported temperature units.

The results are displayed with clear unit labels.

### Input Validation

The application checks whether the entered value is a valid numeric temperature.

If the input is empty or invalid, a user-friendly error message is displayed instead of performing an incorrect calculation.

### Absolute Zero Validation

The application also handles temperatures below absolute zero.

For Celsius input, values below `-273.15°C` are rejected.

For Fahrenheit and Kelvin inputs, the corresponding absolute-zero limits are also considered.

This prevents physically invalid temperature values from being processed.

## 4. Conversion Logic

The application uses standard temperature conversion formulas.

### Celsius to Fahrenheit

The Celsius value is converted to Fahrenheit using the standard conversion relationship.

### Fahrenheit to Celsius

The Fahrenheit value is converted back to Celsius using the standard conversion relationship.

### Celsius and Kelvin

Kelvin conversion is based on the difference of `273.15` between Celsius and Kelvin scales.

The JavaScript implementation performs these calculations automatically after the user selects the input unit.

## 5. User Interface

The interface was designed as a clean and centred layout.

CSS was used to create:

* Clear labels
* Temperature input area
* Unit selection control
* Convert button
* Result display area
* Error messages
* Consistent spacing
* Responsive layout

The design focuses on readability and ease of use.

## 6. JavaScript Functionality

The `script.js` file handles the interactive behaviour of the application.

It is responsible for:

* Reading the temperature input
* Detecting the selected unit
* Validating the input
* Checking absolute-zero limits
* Performing temperature conversions
* Displaying converted results
* Displaying appropriate error messages

The project uses Vanilla JavaScript without external JavaScript libraries.

## 7. Responsive Design

The website was designed to remain usable on different screen sizes.

CSS responsive rules ensure that:

* Input controls remain accessible
* Results remain readable
* Content does not overlap
* The interface adapts to smaller screens

The layout was checked on mobile-sized screens as part of testing.

## 8. Testing

Four test screenshots were created to document the behaviour of the application.

### TC1 — Celsius Conversion

Tests temperature conversion when Celsius is selected as the input unit.

### TC2 — Fahrenheit Conversion

Tests temperature conversion when Fahrenheit is selected as the input unit.

### TC3 — Invalid Input Validation

Tests the application's response to invalid or non-numeric input.

### TC4 — Absolute Zero Validation

Tests the application's handling of temperature values below the physically valid absolute-zero limit.

## 9. Test Files

The testing screenshots are stored in the `test` folder:

```text id="j8b6yw"
test/
├── TC1.png
├── TC2.png
├── TC3.png
└── TC4.png
```

These screenshots provide visual evidence of the application's conversion and validation behaviour.

## 10. Project Files

```text id="9q3h7s"
WebDev-L1-TemperatureConverter/
│
├── index.html
├── style.css
├── script.js
├── temp-convert.mp4
├── DOCUMENTATION.md
└── test/
    ├── TC1.png
    ├── TC2.png
    ├── TC3.png
    └── TC4.png
```

### `index.html`

Contains the structure of the temperature converter interface.

### `style.css`

Contains the visual styling, layout, spacing, typography, and responsive design rules.

### `script.js`

Contains the temperature conversion calculations, validation logic, and result handling.

### `test/`

Contains screenshots documenting the test cases.

### `temp-convert.mp4`

Contains the recorded demonstration of the completed temperature converter.

## 11. Learning Outcomes

This project helped strengthen my understanding of:

* JavaScript DOM manipulation
* User input handling
* Form validation
* Conditional logic
* Temperature conversion formulas
* Error handling
* Event handling
* Responsive CSS
* Interactive web development

## 12. Conclusion

The Temperature Converter project successfully demonstrates the use of HTML5, CSS3, and Vanilla JavaScript to build an interactive web application.

The final application supports multiple temperature units, validates user input, handles absolute-zero violations, displays conversion results clearly, and provides a responsive user interface.
