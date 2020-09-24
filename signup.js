var database = firebase.database();

document.getElementById("submit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  var messagePara = document.getElementById("error-message");
  var name = document.getElementById("name-first").value + document.getElementById("name-last").value;
  var email = document.getElementById("email").value;
  var username = document.getElementById("username").value;
  var confirmPassword = document.getElementById("password-confirm").value;
  var password = document.getElementById("password").value;
  var wrongChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  var existingUsers;
  var userData;
  if (
    !name ||
    !email ||
    !username ||
    !password ||
    !confirmPassword
  ) {
    messagePara.innerHTML = "Fill in all the fields.";
  } else if (username.match(wrongChars)) {
    messagePara.innerHTML =
      "Your Username cannot contain special characters.";
  } else if (password !== confirmPassword) {
    messagePara.innerHTML = "Your passwords do not Match.";
  } else {
    messagePara.innerHTML = "Please Wait.";
      database.ref("/Users/").once("value").then(
          snapshot => {
              userData = snapshot.val();
              existingUsers = Object.keys(userData);
              if(existingUsers.includes(username)){
                messagePara.innerHTML = ("Username already exists.");
              }
              else if(checkExistingEmails(userData,email) == true){
                messagePara.innerHTML = ("An account with this email already exists.");
              }
              else{
                   signUp(name,email,username,password);
              }
          }
      )
      .catch(err => {
          console.error(err);
          messagePara.innerHTML = ("An error occurred! Try again Later.");
      })
  }
});

function signUp(name,email,userId,password){
  var uniqueId = Math.random() * 10000;
  var date = new Date();

  database.ref("/Users/"+userId).set({
      name: name,
      email: email,
      password: password,
      unique_id: uniqueId,
      date_joined: date
  })
  .then(promise => {
      location.replace("home.html?user=" + uniqueId);
  })
  .catch(err => {
      document.getElementById("error-message").innerHTML = ("An error occurred! Please try again.");
      console.error(err);
  })
}
function checkExistingEmails(existingUsers,email){
  for(var j=0; j<Object.keys(existingUsers).length; j++){
    if(existingUsers[Object.keys(existingUsers)[j]].email == email){
      return true;
    }
    if(j = (Object.keys(existingUsers).length) -1){
      return false;
    }
  }
}