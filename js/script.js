

/*
  File: script.js
  Author: CS100 Team
  Date Created: 23 July 2023
  Copyright: CSTU
  Description: JS code of CSTU Passport that validate with JS
*/

const config = {
    backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

// Function to validate Firstname and Lastname
function validateName() {
    const fullnameInput = document.getElementById("fullname");
    const names = fullnameInput.value.trim().split(" ");
    const errorElement = document.getElementById("fullnameError");


    if (names.length !== 2) {
        errorElement.textContent = "Please enter both your Firstname and Lastname.";
        return false;
    } else if (names[0].charAt(0) !== names[0].charAt(0).toUpperCase()) {
        errorElement.textContent = "Name must start with a capital letter.";
        return false;
    } else {
        errorElement.textContent = ""; // Clear the error message when valid
    }
    return true;
}

// Function to validate Student ID
function validateStudentID() {
    const studentIDInput = document.getElementById("studentID");
    const studentIDPattern = /^\d{10}$/;
    const errorElement = document.getElementById("studentIDError");

    if (!studentIDPattern.test(studentIDInput.value)) {
        errorElement.textContent = "Please enter a 10-digit Student ID.";
        return false;
    } else {
        errorElement.textContent = ""; // Clear the error message when valid
    }
    return true;
}

function validateDates() {
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const errorElementStart = document.getElementById("startDateError");
    const errorElementEnd = document.getElementById("endDateError");

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate > endDate) {
        errorElementStart.textContent = "Start date cannot be after end date.";
        errorElementEnd.textContent = "End date cannot be before start date.";
        return false;
    } else {
        errorElementStart.textContent = ""; // Clear the error message when valid
        errorElementEnd.textContent = ""; // Clear the error message when valid
    }
    return true;
}

function validateDateInCalendar(dateInput, calendarData) {
    const errorElement = document.getElementById("dateError");
    const date = new Date(dateInput);

    for (let year in calendarData) {
        for (let semester of calendarData[year]) {
            const startDate = new Date(semester.start_date);
            const endDate = new Date(semester.end_date);

            if (date >= startDate && date <= endDate) {
                errorElement.textContent = ""; // Clear the error message when valid
                return true;
            }
        }
    }

    errorElement.textContent = "Date must be within a semester in the calendar.";
    return false;
}


function displayData(data) {
    var mainContainer = document.getElementsByClassName("output-container")[0];
    // mainContainer.style.display = "block";
    mainContainer.innerHTML = "";


    for (let key in data) {
        let p = document.createElement("p");
        p.textContent = `${key}: ${data[key]}`;
        mainContainer.appendChild(p);
    }
}

// Function to validate University Email
function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailPattern = /^.+@dome\.tu\.ac\.th$/;
    const errorElement = document.getElementById("emailError");

    if (!emailPattern.test(emailInput.value)) {
        errorElement.textContent =
            "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
        return false;
    } else {
        errorElement.textContent = ""; // Clear the error message when valid
    }
    return true;
}

// Function to validate form inputs on user input
function validateFormOnInput() {
    validateName();
    validateStudentID();
    validateEmail();
    validateDates();
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
    try {
        const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Failed to fetch activity types.");
            return [];
        }
    } catch (error) {
        console.error("An error occurred while fetching activity types:", error);
        return [];
    }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
    const activityTypeSelect = document.getElementById("activityType");

    for (const type of activityTypes) {
        const option = document.createElement("option");
        option.value = type.id;
        option.textContent = type.value;
        activityTypeSelect.appendChild(option);
    }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
    const activityTypes = await fetchActivityTypes();
    populateActivityTypes(activityTypes);
});



// Function to submit the form
// Function to submit the form
async function submitForm(event) {
    event.preventDefault();

    // Validate form inputs before submission
    if (!validateName() || !validateStudentID() || !validateEmail() || !validateDates()) {
        return;
    }

    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const academicYearInput = document.getElementById("academicYear").value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);


    if (endDate <= startDate) {
        alert("End datetime should be after the start datetime.");
        return;
    }

    // Create the data object to send to the backend
    const formData = new FormData(event.target);
    const data = {
        first_name: formData.get("fullname").split(" ")[0],
        last_name: formData.get("fullname").split(" ")[1],
        student_id: parseInt(formData.get("studentID")),
        email: formData.get("email"),
        title: formData.get("workTitle"),
        type_of_work_id: parseInt(formData.get("activityType")),
        academic_year: parseInt(formData.get("academicYear")) - 543,
        semester: parseInt(formData.get("semester")),
        start_date: formData.get("startDate"),
        end_date: formData.get("endDate"),
        location: formData.get("location"),
        description: formData.get("description")
    };

    console.log(data);

    try {
        // Fetch calendar data
        fetch(`http://${window.location.hostname}:${port}/getCalendar`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(calendarData => {
                // Validate the start date and end date
                const startDateInput = data.start_date;
                const endDateInput = data.end_date;
                const academicYear = data.academicYear - 543;
                const semesters = calendarData[academicYear];

                if (!semesters) {
                    alert("Invalid academic year.");
                    return;
                }

                let valid = false;
                for (let semester of semesters) {
                    const startDate = new Date(semester.start_date);
                    const endDate = new Date(semester.end_date);
                    if (new Date(startDateInput) >= startDate && new Date(endDateInput) <= endDate) {
                        valid = true;
                        break;
                    }
                }

                if (!valid) {
                    alert("Start date and end date must be within a semester in the academic year.");
                    return;
                }

                // Continue with form submission...
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

        // Send data to the backend using POST request
        const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Form data submitted successfully!");

            var mainContainer = document.getElementsByClassName("output-container");
            mainContainer.innerHTML = " ";

            // Format JSON data for display
            const formattedData = Object.entries(responseData.data)
                .map(([key, value]) => `"${key}": "${value}"`)
                .join("\n");

            // Display success message with formatted data
            // alert(responseData.message + "\n" + formattedData);


            displayData(responseData.data);

            // appendData(responseData);


            document.getElementById("myForm").reset();
        } else {
            console.error("Failed to submit form data.");

            // Display error message
            alert("Failed to submit form data. Please try again.");

        }
    } catch (error) {
        console.error("An error occurred while submitting form data:", error);
    }


}

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);

// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document
    .getElementById("studentID")
    .addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("startDate").addEventListener("input", validateDates);
document.getElementById("endDate").addEventListener("input", validateDates);

