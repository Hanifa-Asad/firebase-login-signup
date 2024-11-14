
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


function post() {
  var title = document.getElementById("title");
  var description = document.getElementById("description");
  var currentTime = new Date().toLocaleTimeString();

  if (title.value.trim() && description.value.trim()) {
      var postContainer = document.getElementById("post");
      var postElement = document.createElement("div");
      postElement.classList.add("card", "p-2", "mb-2");

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
              <button type="button" onclick="editPost(this)" class="ms-2 btn btn-warning editBtn">Edit</button>
              <button type="button" onclick="deletePost(this)" class="ms-2 btn btn-danger deleteBtn">Delete</button>
          </div>
      `;

      postContainer.appendChild(postElement);

      // Clear input fields after posting
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

// Function to edit a post
function editPost(button) {
  var postElement = button.closest(".card");
  var titleElement = postElement.querySelector(".post-title");
  var descriptionElement = postElement.querySelector(".post-description");
  var cardBody = postElement.querySelector(".card-body");

  // Get current values
  var currentTitle = titleElement.textContent;
  var currentDescription = descriptionElement.textContent;
  var currentBackgroundImage = cardBody.style.backgroundImage.replace('url("', '').replace('")', '');

  // Use SweetAlert2 for multi-input form
  Swal.fire({
      title: 'Edit Post',
      html: `
          <input id="swal-title" class="swal2-input" placeholder="Title" value="${currentTitle}">
          <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${currentDescription}</textarea>
          <input id="swal-background" class="swal2-input" placeholder="Background Image URL" value="${currentBackgroundImage}">
      `,
      focusConfirm: false,
      preConfirm: () => {
          // Get the values from the inputs
          var newTitle = document.getElementById('swal-title').value;
          var newDescription = document.getElementById('swal-description').value;
          var newBackgroundImage = document.getElementById('swal-background').value;

          // Update the post if new values are provided
          if (newTitle && newDescription && newBackgroundImage) {
              titleElement.textContent = newTitle;
              descriptionElement.textContent = newDescription;
              cardBody.style.backgroundImage = `url(${newBackgroundImage})`;
          }
      }
  });
}

// Function to delete a post
function deletePost(button) {
  var postElement = button.closest(".card");

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
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
      }
  });
}

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
