// Initial References
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

let initialHour = 0,
    initialMinute = 0,
    alarmIndex = 0;

// Append zeroes for single digits
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const searchObject = (parameter, value) => {
    let alarmObject,
        objIndex,
        exists = false;

    alarmsArray.forEach((alarm, index) => {
        if (alarm[parameter] == value) {
            exists = true;
            alarmObject = alarm;
            objIndex = index;
            return false;
        }
    });
    return [exists, alarmObject, objIndex];
};

// Display Time
function displayTimer() {
    let date = new Date();
    let [hours, minutes, seconds] = [
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds()),
    ];

    // Display Time
    timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

    // Alarm check
    alarmsArray.forEach((alarm) => {
        if (
            alarm.isActive &&
            `${alarm.alarmHour}:${alarm.alarmMinutes}` === `${hours}:${minutes}`
        ) {
            alarmSound.play();
            alarmSound.loop = true;
        }
    });
}

const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (isNaN(inputValue) || inputValue < 0) return appendZero(0);
    return appendZero(inputValue);
};

hourInput.addEventListener("input", () => {
    hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
    minuteInput.value = inputCheck(minuteInput.value);
});

// Create Alarm Div
const createAlarm = (alarmObj) => {
    const { id, alarmHour, alarmMinutes } = alarmObj;

    // Alarm DIV
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinutes}</span>`;

    // Checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked) {
            startAlarm(e);
        } else {
            stopAlarm(e);
        }
    });

    alarmDiv.appendChild(checkbox);

    // Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);

    activeAlarms.appendChild(alarmDiv);
};

// Set Alarm
setAlarm.addEventListener("click", () => {
    if (!hourInput.value || !minuteInput.value) {
        alert("Please set a valid alarm time.");
        return;
    }

    alarmIndex += 1;

    // Alarm Object
    let alarmObj = {
        id: `${alarmIndex}_${hourInput.value}_${minuteInput.value}`,
        alarmHour: hourInput.value,
        alarmMinutes: minuteInput.value,
        isActive: false,
    };

    alarmsArray.push(alarmObj);
    createAlarm(alarmObj);

    // Reset inputs
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
});

// Start Alarm
const startAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = true;
    }
};

// Stop Alarm
const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = false;
        alarmSound.pause();
    }
};

// Delete Alarm
const deleteAlarm = (e) => {
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(index, 1);
    }
};

window.onload = () => {
    setInterval(displayTimer, 1000);
    initialHour = 0;
    initialMinute = 0;
    alarmIndex = 0;
    alarmsArray = [];
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
};
