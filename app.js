import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  provider,
  signOut,
  getFirestore,
  db,
  collection,
  addDoc,
  getDocs, doc, setDoc
} from "./firebase.js";
// var email = document.getElementById("email");
export { signUp, logIn }
// let signUp = () => {
//     let email = document.getElementById("email").value;
//     let password = document.getElementById("pswd").value;
//     let cPassword = document.getElementById("cpswd").value;
//     let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
//     let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/g;

//     if (emailRegex.test(email) && passwordRegex.test(password)){
//         console.log("test");
//         createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {

//     const user = userCredential.user;
//     console.log(user);

//     swal("Account created successfully");

//   })
//   .catch((error) => {
//     console.log(error.message);
//     swal("error.code");

//   });

//     } else{
//         swal("Invalid email or Password");
//     }
//     if ( password !== cPassword){
//         swal("passwords should be identical")

//     }
// };
let signUp = () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("pswd").value;
  let cPassword = document.getElementById("cpswd").value;
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  let name = document.getElementById("name").value;
  let number = document.getElementById("number").value;
  let userData = { name, number, email, password };
  console.log(userData);
  if (emailRegex.test(email) && passwordRegex.test(password)) {
    console.log("test");
    createUserWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("userEmail", email)
        // alert("Account created successfully");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Account created successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
        window.location.href = "./dashboard/index.html"
        try {
              const docRef = await addDoc(collection(db, "users"), {
                ...userData,
                uId: user.uid,
              });
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
             // try {
      //   await setDoc(doc(db,"users",user.uid), {
      //     ...userData,
      //     uId: user.uid
      //   });
      //       console.log("Document written with ID: ", user.uid);
      //     } catch (e) {
      //       console.error("Error adding document: ", e);
      //     }
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.code);
      });
  } else {
    // alert("Invalid email or Password");
    Swal.fire({
      title: "Invalid",
      text: "Invalid Email or Password",
      icon: "question",
      timer: 3000,
    });
  }
  if (password !== cPassword) {
    // alert("Passwords should be identical");
    Swal.fire({
      title: "Not Match",
      text: "IPasswords should be identical",
      icon: "question",
      timer: 3000,
    });
  }
};
// if(window.location.pathname=="/index.html"){
//     let signUp_btn = document.getElementById("signUp_btn");
//     signUp_btn.addEventListener("click", signUp);
// }
// let signUp_btn = document.getElementById("signUp_btn");
//     signUp_btn.addEventListener("click", signUp);
if (window.location.pathname == "/index.html") {
  document.addEventListener('DOMContentLoaded', function () {
    const signUp_btn = document.getElementById('signUp_btn'); // Replace 'signUp_btn' with your actual element ID
    if (signUp_btn) {
      signUp_btn.addEventListener("click", signUp);
    } else {
      console.error("Element with ID 'signUp_btn' not found.");
    }
  });
}

let logIn = () => {
  let email = document.getElementById("Email").value;
  let password = document.getElementById("pass").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      const user = userCredential.user;
      console.log(user);

      // alert("Login Successful")
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Account created successfully!",
        timer: 3000,  

      });
      window.location.href = "./dashboard/index.html"
      // try {
      //   await setDoc(doc(db,"users",user.uid), {
      //     ...userData,
      //     uId: user.uid
      //   });
      //       console.log("Document written with ID: ", user.uid);
      //     } catch (e) {
      //       console.error("Error adding document: ", e);
      //     }
      })
   
    .catch((error) => {
      alert(error.code)
    });
};
if (window.location.pathname == "/index.html") {
  let login_btn = document.getElementById("login_btn");
  login_btn.addEventListener("click", logIn);
}
// let login_btn = document.getElementById("login_btn");
// login_btn.addEventListener("click", logIn);
let googleSignup = () => {
  signInWithPopup(auth, provider)
    .then(async(result) => {

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user);
       Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Account created successfully!",
        timer: 3000,
      });
      window.location.href = "./dashboard/index.html"
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid:user.uid,
          name : user.displayName,
          email : user.email,
          image : user.photoURL,
          number : user.phoneNumber
  
        });
          console.log("Document written with ID: ", user.uid);
        } catch (e) {
          console.error("Error adding document: ", e);
        }

    }).catch((error) => {

      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(email, credential);
    });
}


if (window.location.pathname == "/index.html") {
  let googleBtn = document.getElementById("googleBtn");
  googleBtn.addEventListener("click", googleSignup);
}
// let googleBtn = document.getElementById("googleBtn");
// googleBtn.addEventListener("click", googleSignup);
// console.log(window.location);
// if(window.location.pathname=="/dashboard/index.html"){
//   document.getElementById("logOut").addEventListener("click",()=>{
//     signOut(auth).then(() => {
//         alert("Log out successfull")
//         // Swal.fire({
//         //   position: "top-end",
//         //   icon: "success",
//         //   title: "log out successfully!",
//         //   timer: 3000,

//         // });
//         window.location.href = "../index.html"
//       }).catch((error) => {
//         console.log(error.code);

//       });
// })

// }
//   document.getElementById("logOut").addEventListener("click",()=>{
//     signOut(auth).then(() => {
//         alert("Log out successfull")
//         // Swal.fire({
//         //   position: "top-end",
//         //   icon: "success",
//         //   title: "log out successfully!",
//         //   timer: 3000,

//         // });
//         window.location.href = "../index.html"
//       }).catch((error) => {
//         console.log(error.code);

//       });
// })
document.addEventListener('DOMContentLoaded', function () {
  // Your JavaScript code that interacts with the DOM goes here
  const myElement = document.getElementById('logOut');
  if (myElement) {
    myElement.addEventListener('click', function () {
      // Handle the click event
      signOut(auth).then(() => {
        alert("Log out successfull")
        // Swal.fire({
        //   position: "top-end",
        //   icon: "success",
        //   title: "log out successfully!",
        //   timer: 3000,

        // });
        window.location.href = "../index.html"
      }).catch((error) => {
        console.log(error.code);

      });
    });
  }
});
// Check current path for debugging
// console.log("Current path:", window.location.pathname);

// if (window.location.pathname ==="/dashboard/index.html" || window.location.pathname === "/") {
//     const logOutButton = document.getElementById("logOut");

//     // Check if logOut button exists
//     if (logOutButton) {
//         logOutButton.addEventListener("click", () => {
//             signOut(auth)
//                 .then(() => {
//                     alert("Log out successful");
//                     window.location.href = "../index.html";
//                 })
//                 .catch((error) => {
//                     console.error("Sign out error:", error.message);
//                 });
//         });
//     } else {
//         console.warn("logOut button not found on this page.");
//     }
// } else {
//     console.warn("Script not running because path is not index.html or root.");
// }
// console.log(window.location);
let getAllUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `,doc.data());
  });
};
getAllUsers()