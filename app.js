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
  getDocs, doc, setDoc,
  updateDoc, serverTimestamp, arrayUnion, arrayRemove, deleteDoc , 
  deleteField ,orderBy,query ,where ,onSnapshot
} from "./firebase.js";
// var email = document.getElementById("email");
export { signUp, logIn }

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
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("userEmail", email)

        Swal.fire({
          position: "top-end", 
          icon: "success",
          title: "Account created successfully!",
          timer: 12000,
          customClass: {
            popup: 'swal-popup', 
          },
        }).then(() => {
              window.location.href = "/firebase-login-signup/dashboard/index.html";
      
        });
        try {
          const docRef = await addDoc(collection(db, "users"), {
            ...userData,
            uId: user.uid,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
    
      })
      .catch((error) => {
        console.log(error.message);
        alert(error.code);
      });
  } else {
  ;
    Swal.fire({
      title: "Invalid",
      text: "Invalid Email or Password",
      icon: "question",
      timer: 3000,
    });
  }
  if (password !== cPassword) {
    
    Swal.fire({
      title: "Not Match",
      text: "IPasswords should be identical",
      icon: "question",
      timer: 3000,
    });
  }
};
// if (window.location.pathname !== "/dashboard") {
//   let signUp_btn = document.getElementById("signUp_btn");
//   signUp_btn.addEventListener("click", signUp);
// }
let signUp_btn = document.getElementById("signUp_btn");

if (window.location.pathname === "/") {
   
    signUp_btn.addEventListener("click", signUp);
} else {
    
    signUp_btn.addEventListener("click", signUp);
}



let logIn = () => {
  let email = document.getElementById("Email").value;
  let password = document.getElementById("pass").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user);

     
      Swal.fire({
        position: "top-end", 
        icon: "success",
        title: "Account created successfully!",
        timer: 12000,
        customClass: {
          popup: 'swal-popup',
        },
      }).then(() => {
        window.location.href = "/firebase-login-signup/dashboard/index.html";
      });
   
    })

    .catch((error) => {
      alert(error.code)
    });
  };
  // if (window.location.pathname == "/firebase-login-signup/") {
  //   let login_btn = document.getElementById("login_btn");
  //   login_btn.addEventListener("click", logIn);
  // }

  let login_btn = document.getElementById("login_btn");

if (window.location.pathname === "/") {
   
    login_btn.addEventListener("click", logIn);
} else {
    
    login_btn.addEventListener("click", logIn);
}

  let googleSignup = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        Swal.fire({
          position: "top-end", 
          icon: "success",
          title: "Account created successfully!",
          timer: 12000,
          customClass: {
            popup: 'swal-popup', 
          },
        }).then(() => {
          window.location.href = "/firebase-login-signup/dashboard/index.html";
          
        });


        try {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            number: user.phoneNumber

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
// /firebase-login-signup/
  // if (window.location.pathname == "/") {
  //   let googleBtn = document.getElementById("googleBtn");
  //   googleBtn.addEventListener("click", googleSignup);
  // }
  let googleBtn = document.getElementById("googlebtn");

  if (window.location.pathname === "/") {
     
      googleBtn.addEventListener("click", googleSignup);
  } else {
      
      googleBtn.addEventListener("click", googleSignup);
  }


  let getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => `, doc.data());
    });
  };
  getAllUsers()
  console.log(getAllUsers);
  
if (window.location.pathname == "/firebase-login-signup/dashboard/index.html") {
  
 document.getElementById("saveAccountUpdates").addEventListener("click", async () => {
    console.log("Update button clicked");
    const name = document.getElementById("updateName").value;
    const number = document.getElementById("updateNumber").value;
    let ageInput = document.getElementById("ageInput").value;
    let addInterestsInput = document.getElementById("addInterestsInput").value;
    let removeInterestsInput = document.getElementById("removeInterestsInput").value;

    let id = auth.currentUser.uid;
    let addInterests = addInterestsInput.split(",").map(interests => interests.trim());
  let removeInterests = removeInterestsInput.split(",").map(interests => interests.trim());
    
    if (name && number) {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("User found:", user.uid); 
  
          
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, {
            name: name,
            number: number,
            age: ageInput,
            timestamp: serverTimestamp(), 
            addInterests: arrayUnion(...addInterests), 
            removeInterests: arrayRemove(...removeInterests) 
          });
          
          console.log("Account updated successfully"); 
  
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Account updated successfully!",
            showConfirmButton: false,
            timer: 3000
          });
          
         
          document.querySelector("#updateAccountModal .btn-close").click();
        } else {
          console.error("No user is currently signed in.");
        }
      } catch (error) {
        console.error("Error updating account:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to update account",
          text: error.message
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Information",
        text: "Please fill out both the name and number fields."
      });
    }
  });
}
  

let deleteAccount=async()=>{
  let id = auth.currentUser.uid
  console.log(id);
  await deleteDoc(doc(db, "users", auth.currentUser.uid));
  console.log("Account Deleted");
}
if (window.location.pathname == "/firebase-login-signup/dashboard/index.html") {
  let delete_btn = document.getElementById("deleteAccount")
delete_btn.addEventListener("click", deleteAccount)
}
if (window.location.pathname == "/firebase-login-signup/dashboard/index.html") {
  


      const deleteFieldModal = new bootstrap.Modal(document.getElementById('deleteFieldModal'));

      document.getElementById('deleteField').addEventListener('click', () => {
          deleteFieldModal.show(); 
      });
  
     
      document.getElementById('confirmDeleteField').addEventListener('click', () => {
          const fieldName = document.getElementById('fieldToDelete').value.trim();
          if (fieldName) {
             
              deleteFieldFromFirestore(fieldName);
          } else {
              Swal.fire('Error', 'Please provide a valid field name to delete.', 'warning');
          }
      });
  
    
      async function deleteFieldFromFirestore(fieldName) {
          try {
            let id = auth.currentUser.uid
            console.log(id);
            
              const userRef = doc(db, 'users', auth.currentUser.uid); 
              await updateDoc(userRef, {
                [fieldName]: deleteField()
            });
              Swal.fire('Success', `Field "${fieldName}" deleted successfully!`, 'success');
          } catch (error) {
              console.error("Error deleting field: ", error);
              Swal.fire('Error', 'There was an issue deleting the field.', 'error');
          }
      }
    }

  