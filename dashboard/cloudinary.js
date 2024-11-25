import { db, doc,getFirestore,collection, addDoc,query, where, onSnapshot,serverTimestamp } from "../firebase.js";
const cloudName = 'ddcx5wyfwe';
const unsignedUploadPreset = 'bbnadrxb';

// // Get the file input element
// const fileSelect = document.getElementById("profilePhotoInput");
// // Get the container where the image will be displayed
// const profilePhotoContainer = document.getElementById("profilePhoto");


  
// fileSelect.addEventListener('change', function() {
//   if (this.files && this.files[0]) {
//     const reader = new FileReader();

//     reader.onload = function(e) {
//       let profilePhotoImg = profilePhotoContainer.querySelector('img');
//       if (!profilePhotoImg) {
//         profilePhotoImg = document.createElement('img');
//         profilePhotoContainer.appendChild(profilePhotoImg);
//       }

//       profilePhotoImg.src = e.target.result;
//     }

//     reader.readAsDataURL(this.files[0]);
//   }
// });




// const profilePhotoImg = document.getElementById("profilePhotoImg");
// profilePhotoImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
// const profilePhotoInput = document.getElementById("profilePhotoInput");

// profilePhotoImg.addEventListener("click", () => {
//   profilePhotoInput.click();
// });
// function uploadFile(file) {
//   const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
//   const fd = new FormData();
//   fd.append('upload_preset', unsignedUploadPreset);
//   fd.append('tags', 'browser_upload'); // Optional tags
//   fd.append('file', file);

//   console.log("Uploading file to Cloudinary...");

//   fetch(url, {
//     method: 'POST',
//     body: fd,
//   })
//     .then((response) => response.json())
//     .then(async (data) => {
//       console.log('Cloudinary response:', data);

//       // Check if Cloudinary returned the expected response
//       if (data.secure_url) {
//         const url = data.secure_url;
//         const transformedURL = url.replace('/upload/', '/upload/w_150,c_scale/');

//         // Save URL to Firestore
//         try {
//           const docRef = await addDoc(collection(db, 'Images'), {
//             name: data.display_name,
//             url: transformedURL,
//             time: serverTimestamp(),
//           });
//           console.log('Document written with ID: ', docRef.id);
//         } catch (e) {
//           console.error('Error adding document to Firestore: ', e);
//         }
//       } else {
//         console.error('Error from Cloudinary: ', data);
//       }
//     })
//     .catch((error) => {
//       console.error('Error uploading the file:', error);
//     });
// }


// profilePhotoInput.addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   const reader = new FileReader();
//   reader.onload = () => {
//     profilePhotoImg.src = reader.result;
//   };
//   reader.readAsDataURL(file);
// });

// const handleFiles = function(files) {
//   for (let i = 0; i < files.length; i++) {
//     uploadFile(files[i]); // call the function to upload the file
//   }
// };
// let getData=()=>{
// const q = query(collection(db, "Images") );
// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const gallery = document.getElementById("profilePhoto")
//     profilePhoto.innerHTML=""
//   querySnapshot.forEach((doc) => {
//     profilePhoto.innerHTML += `
//       <img src="${doc.data().url}"/>
//     `
//     console.log("get data",doc.data());
    
//   });
// });
// }
// getData()

const fileSelect = document.getElementById("fileSelect");
const fileElem = document.getElementById("fileElem");

// Trigger the hidden file input when the "Upload Image" button is clicked
fileSelect.addEventListener("click", function(e) {
  fileElem.click(); // Trigger file input click
  e.preventDefault(); // Prevent any default action
}, false);

// Handle file selection and upload to Cloudinary
fileElem.addEventListener('change', function() {
  if (this.files && this.files[0]) {
    const file = this.files[0];
    console.log("Selected file: ", file);
    uploadFile(file); // Call the function to upload the selected file
  }
});

// Function to upload the selected file to Cloudinary
function uploadFile(file) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  const fd = new FormData();
  fd.append('upload_preset', unsignedUploadPreset);
  fd.append('tags', 'browser_upload');  // Optional: add tags for Cloudinary
  fd.append('file', file);

  console.log("Uploading file to Cloudinary...");

  fetch(url, {
    method: 'POST',
    body: fd,
  })
    .then((response) => response.json())
    .then(async (data) => {
      console.log('Cloudinary response:', data);

      // Check if the response contains the URL
      const url = data.secure_url;
      const transformedURL = url.replace("/upload/", "/upload/w_150,c_scale/");

      // Save the image URL to Firestore
      try {
        const docRef = await addDoc(collection(db, "Images"), {
          name: data.display_name,
          url: transformedURL,
          time: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document to Firestore: ", e);
      }

      // Optional: Display the uploaded image in the gallery
      displayUploadedImage(transformedURL);
    })
    .catch((error) => {
      console.error('Error uploading the file:', error);
    });
}

// Display the uploaded image in the gallery
function displayUploadedImage(imageUrl) {
  const gallery = document.getElementById("gallery");
  const imgElement = document.createElement("img");
  imgElement.src = imageUrl;
  imgElement.alt = "Uploaded Image";
  gallery.appendChild(imgElement);
}

// Fetch and display existing images from Firestore
function getData() {
  const q = query(collection(db, "Images"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";  // Clear existing gallery content

    querySnapshot.forEach((doc) => {
      gallery.innerHTML += `<img src="${doc.data().url}" alt="Firestore Image"/>`;
      console.log("Fetched data:", doc.data());
    });
  });
}
getData();