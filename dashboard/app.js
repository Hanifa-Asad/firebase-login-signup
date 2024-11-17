
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp,doc,  updateDoc,deleteDoc,getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const db = getFirestore(app);


const profilePhotoImg = document.getElementById("profilePhotoImg");
profilePhotoImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
const profilePhotoInput = document.getElementById("profilePhotoInput");

profilePhotoImg.addEventListener("click", () => {
  profilePhotoInput.click();
});

profilePhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    profilePhotoImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

let backgroundImg = "";


function selectImg(src, event) {
  backgroundImg = src;
  const bgImg = document.getElementsByClassName('bg-img');


  for (let i = 0; i < bgImg.length; i++) {
    bgImg[i].className = "bg-img";
  }


  event.target.className += " selectedImg";
}


document.addEventListener("DOMContentLoaded", () => {
  const imageElements = document.querySelectorAll(".bg-img");

  imageElements.forEach((img) => {
    img.addEventListener("click", (event) => {
     
      const src = img.src;
      selectImg(src, event);
    });
  });
});


async function post() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const currentTime = new Date().toLocaleTimeString();
  const email = localStorage.getItem("userEmail");
  const profilePhotoImg = document.getElementById("profilePhotoImg");  
  const backgroundImg = "images/3.jfif"; 
  
  if (title.value.trim() && description.value.trim()) {
    const postContainer = document.getElementById("postContainer");
    const postElement = document.createElement("div");
    postElement.classList.add("card", "p-2", "mb-2");
    postElement.dataset.id = Date.now(); 

    postElement.innerHTML = `
      <div class="card-header d-flex">
          <img class="profile-photo" src="${profilePhotoImg.src}" />
          <div class="name-time d-flex flex-column">
              ${email}
              <div class="time">${currentTime}</div>
          </div>
      </div>
      <div style="background-image: url(${backgroundImg})" class="card-body">
          <blockquote class="blockquote mb-0">
              <p class="post-title">${title.value}</p>
              <footer class="blockquote-footer post-description">${description.value}</footer>
          </blockquote>
      </div>
      <div class="card-footer d-flex justify-content-end">
          <button type="button" class="ms-2 btn btn-warning editBtn">Edit</button>
          <button type="button" class="ms-2 btn btn-danger deleteBtn">Delete</button>
      </div>
    `;

    postContainer.appendChild(postElement);

 


 
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: title.value,
        description: description.value,
        time: serverTimestamp(),
        backgroundImage: backgroundImg
      });
      console.log("Post successfully added to Firestore");
      console.log("Post successfully added to Firestore with ID: ", docRef.id);
      postElement.dataset.id = docRef.id; 
    } catch (error) {
      console.error("Error adding post: ", error);
    }
   
   title.value = "";
   description.value = "";
  } else {
    Swal.fire({
      title: "Empty Post",
      text: "Can't publish post without Title or Description",
      icon: "warning",
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const postContainer = document.getElementById("postContainer");
  fetchPostsFromFirestore(postContainer);
  if (postContainer) {
    postContainer.addEventListener("click", (event) => {
   
      if (event.target.classList.contains("editBtn")) {
        const postElement = event.target.closest(".card");
        editPost(postElement); 
      }

      if (event.target.classList.contains("deleteBtn")) {
        const postElement = event.target.closest(".card");
        deletePost(postElement);  
      }
    });
  } else {
    console.error("postContainer not found");
  }
});

document.getElementById("postBtn").addEventListener("click", (event) => {
  event.preventDefault();  
  post();  
});
async function fetchPostsFromFirestore(postContainer) {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      const postElement = document.createElement("div");
      postElement.classList.add("card", "p-2", "mb-2");
      postElement.dataset.id = doc.id; 

      postElement.innerHTML = `
        <div class="card-header d-flex">
            <img class="profile-photo" src="${postData.profilePhotoImg || 'default_profile.jpg'}" />
            <div class="name-time d-flex flex-column">
                ${postData.email || 'Anonymous'}
                <div class="time">${postData.time ? postData.time.toDate().toLocaleTimeString() : ''}</div>
            </div>
        </div>
        <div style="background-image: url(${postData.backgroundImage || 'default-background.jpg'})" class="card-body">
            <blockquote class="blockquote mb-0">
                <p class="post-title">${postData.title}</p>
                <footer class="blockquote-footer post-description">${postData.description}</footer>
            </blockquote>
        </div>
        <div class="card-footer d-flex justify-content-end">
            <button type="button" class="ms-2 btn btn-warning editBtn">Edit</button>
            <button type="button" class="ms-2 btn btn-danger deleteBtn">Delete</button>
        </div>
      `;

      postContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error fetching posts: ", error);
  }
}

async function deletePost(postElement) {
  if (!postElement) {
    console.error('Post element not found.');
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this post?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      
      postElement.remove();

      const postId = postElement.dataset.id;

      deletePostFromFirestore(postId)
        .then(() => {
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        })
        .catch((error) => {
          console.error("Error deleting post: ", error);
          Swal.fire('Error', 'There was an error deleting the post. Please try again later.', 'error');
        });
    }
  });
}


async function deletePostFromFirestore(postId) {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    console.log("Post deleted from Firestore");
  } catch (error) {
    console.error("Error deleting post from Firestore: ", error);
    throw error; 
  }
}


async function editPost(postElement) {
  const titleElement = postElement.querySelector(".post-title");
  const descriptionElement = postElement.querySelector(".post-description");
  const cardBody = postElement.querySelector(".card-body");

  const currentTitle = titleElement.textContent;
  const currentDescription = descriptionElement.textContent;
  const currentBackgroundImage = cardBody.style.backgroundImage.replace('url("', '').replace('")', '');

  Swal.fire({
    title: 'Edit Post',
    html: `
      <input id="swal-title" class="swal2-input" placeholder="Title" value="${currentTitle}">
      <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${currentDescription}</textarea>
      <input id="swal-background" class="swal2-input" placeholder="Background Image URL" value="${currentBackgroundImage}">
    `,
    focusConfirm: false,
    preConfirm: async() => {
      const newTitle = document.getElementById('swal-title').value;
      const newDescription = document.getElementById('swal-description').value;
      const newBackgroundImage = document.getElementById('swal-background').value;

      if (newTitle && newDescription && newBackgroundImage) {
        titleElement.textContent = newTitle;
        descriptionElement.textContent = newDescription;
        cardBody.style.backgroundImage = `url(${newBackgroundImage})`;

        
        const postId = postElement.dataset.id; 

       
        updatePostInFirestore(postId, newTitle, newDescription, newBackgroundImage);
      }
    }
  });
}


async function updatePostInFirestore(postId, newTitle, newDescription, newBackgroundImage) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      title: newTitle,
      description: newDescription,
      backgroundImage: newBackgroundImage,
      time: serverTimestamp(),  
    });
    console.log("Post updated in Firestore");
  } catch (error) {
    console.error("Error updating post in Firestore: ", error);
    Swal.fire('Error', 'There was an error updating the post. Please try again later.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const logOutButton = document.getElementById("logOut");

  if (logOutButton) {
    logOutButton.addEventListener("click", () => {
      console.log("Logging out...");
      signOut(auth)
        .then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Logged out successfully!",
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            window.location.href = "../index.html"; // Redirect after successful logout
          });
        })
        .catch((error) => {
          console.error("Error during sign out:", error);
          Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: error.message,
          });
        });
    });
  } else {
    console.error("Logout button not found");
  }
});
