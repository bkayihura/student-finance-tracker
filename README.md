## Student Finance Tracker

## About
Student Finance Tracker is a web application that helps students manage income,expenses,and budgets.

## Features
Add, edit and delete transactions
Regex form validatio and live search
Sort transactions by date, amount or description
Dashboard showing income, expenses, balance and records
Monthly budget tracking
Seven-day spending chart
Save transactions using localStorage
Import and export JSON files 
Responsive layout for mobile and desktop

## Technologies
HTML
CSS
JavaScript
Regular Expressions(Regex)
localStorage

## Regex Validation
Description:/^\S(?:.*\S)?$/ - prevents leading and trailing spaces.
Amount:/^(0|[1-9]\d*)(\.\d{1,2})?$/ - validates positive-format numbers, including zer.
Date:/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/ - checks date format and basic ranges. 
Category:/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/ - accepts category names.
Advanced regex: /\b(\w+)\s+\1\b/i - detects repated words.

## Keyboard Accessibility
Tab: Move between interactive elements
Shift + Tab: Move backward
Enter: Activate buttons and links
Space: Toggle checkboxes
Skip to Content: Jump to the main content

## Accessibility
Semantic HTML
Form labels
Visible keyboard focus
ARIA status and alert messages
Responsive layout

## Testing
Open tests.html using a local server to run seven regex validation tests.

## How to Run
1.Download or clone the repository.
2.Open the project folder in VS Code.
3.Start Live Server.
4.Open index.html in your browser.

## GitHub Repository
https://github.com/bkayihura/student-finance-tracker

## Live Website
https://bkayihura.github.io/student-finance-tracker/