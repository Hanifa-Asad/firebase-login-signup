
const profilePhotoImg = document.getElementById("profilePhotoImg");
const profilePhotoInput = document.getElementById("profilePhotoInput");
const email = localStorage.getItem("userEmail");
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

var backgroundImg;
function post(){
    var title = document.getElementById("title")
    var description  = document.getElementById("description")
    var currentTime = new Date().toLocaleTimeString();
    if (title.value.trim() && description.value.trim()) {
      var post = document.getElementById("post");
      post.innerHTML += `
     <div class="card p-2 mb-2">
         <div class="card-header d-flex">
         <img class="profile-photo" src="${profilePhotoImg.src}" />
         <div class="name-time d-flex flex-column">
          ${email} 
          <div class="time">${currentTime}</div>
        </div>
      </div>
        <div style="background-image: url(${backgroundImg})" class="card-body">
          <blockquote class="blockquote mb-0">
             <p>${title.value}</p>
             <footer class="blockquote-footer">${description.value}</footer>
           </blockquote>
        </div>
         <div class="card-footer d-flex justify-content-end">
           <button type="button" onclick="editpost(this)" class="ms-2 btn  editBtn">Edit</button>
           <button type="button" onclick="deletePost(this)" class="ms-2 btn btn-danger deleteBtn">Delete</button>
         </div>
    </div>`;
      title.value = "";
      description.value = "";
    } else {
      Swal.fire({
        title: "Empty Post",
        text: "Can't publish post without Title or Description",
        icon: "question",
      });
    }
}


// function post(){
//   var title = document.getElementById("title")
//   var description  = document.getElementById("description")
  
// if(title.value.trim() && description.value.trim()){
//   var post = document.getElementById("post")
//   post.innerHTML+=`
//    <div class="card p-2 mb-2">
//                   <div class="card-header">
//                     <em>@post</em>
//                   </div>
//                   <div style="background-image: url(${backgroundImg})" class="card-body">
//                     <blockquote class="blockquote mb-0">
//                       <p>${title.value}</p>
//                       <footer class="blockquote-footer">${description.value}</footer>
//                     </blockquote>
//                   </div>
//                 </div>
//   `
//   title.value =""
//   description.value = ""
// }else{
//   Swal.fire({
//     title: "Empty Post",
//     text: "Can't publish post without Title or Description",
//     icon: "question"
//   });  }
// }
function selectImg(src){
  backgroundImg =src
  var bgImg = document.getElementsByClassName('bg-img')
  // for(var i=0; i<bgImg.length; i++){
  //   bgImg[i].classList.remove('selectedImg')
  // } 
  for(var i=0; i<bgImg.length; i++){
    bgImg[i].className ="bg-img"
  } 
  event.target.className +=" selectedImg"
}