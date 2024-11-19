import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, remove, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCj4cgWB84F2KSReQYI18aMraaLs1PHSss",
    authDomain: "sign-up-4dc9f.firebaseapp.com",
    projectId: "sign-up-4dc9f",
    storageBucket: "sign-up-4dc9f.firebasestorage.app",
    messagingSenderId: "412516384144",
    appId: "1:412516384144:web:a1125e20b0c8e7dce58715",
    measurementId: "G-QW5MH80Z92"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Variables
const msgTxt = document.getElementById('msgTxt');
const msgBtn = document.getElementById('msgBtn');
const messagesContainer = document.getElementById('messages'); // Ensure this exists in your HTML

let sender = sessionStorage.getItem('sender');
if (!sender) {
    // Use SweetAlert2 to ask for the user's name
    Swal.fire({
        title: 'Please enter your name',
        input: 'text',
        inputPlaceholder: 'Enter your name',
        showCancelButton: false,
        confirmButtonText: 'Submit',
        allowOutsideClick: false,
        preConfirm: (inputValue) => {
            if (!inputValue) {
                Swal.showValidationMessage('Name cannot be empty!');
            }
            return inputValue;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            sender = result.value; // Get the value from the input field
            sessionStorage.setItem('sender', sender);
        }
    });
}
// Module Object
const module = {
    sendMsg: function() {
        const msg = msgTxt.value.trim();
        if (msg === "") return;  // Don't send empty messages
        
        const timestamp = new Date().getTime();
        set(ref(db, "messages/" + timestamp), {
            msg: msg,
            sender: sender
        });

        msgTxt.value = ""; // Clear the input field
    },

    dltMsg: function(key) {
        remove(ref(db, "messages/" + key));
    }
};

// Send Message on Button Click
msgBtn.addEventListener('click', () => {
    module.sendMsg();
});

// Listen for New Messages
onChildAdded(ref(db, "messages"), (data) => {
    const msgElement = document.createElement("div");
    msgElement.className = "outer";
    msgElement.id = data.key;

    if (data.val().sender === sender) {
        msgElement.innerHTML = `
            <div id="inner" class="me">
                you: ${data.val().msg}
                <button class="dltMsgBtn" data-key="${data.key}">DELETE</button>
            </div>`;
    } else {
        msgElement.innerHTML = `
            <div id="inner" class="notMe">
                ${data.val().sender}: ${data.val().msg}
            </div>`;
    }

    // Append message to the messages container
    messagesContainer.appendChild(msgElement);

    // Add event listener to the delete button
    const deleteBtn = msgElement.querySelector(".dltMsgBtn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", function() {
            module.dltMsg(data.key);
        });
    }
});

// Listen for Deleted Messages
onChildRemoved(ref(db, "messages"), (data) => {
    const msgBox = document.getElementById(data.key);
    if (msgBox) {
        messagesContainer.removeChild(msgBox);
    }
});
