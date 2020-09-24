var database = firebase.database();

var requestg;
var idg = parseFloat(window.location.href.split("&user=")[1]);
if(location.href.includes("?")){
  try {
    requestg = window.location.href.split("?")[1].split("&")[0];
  } catch (error) {
    
  }
  var usersg;
  database.ref("/Users/").once("value")
  .then(snapshot => {
    usersg = snapshot.val();
    for(usergg in usersg){
      if(usersg[usergg].unique_id == idg){
        document.getElementById("home").href = "home.html?user=" + usersg[usergg].unique_id;
        document.getElementById("active").href = "badSites.html?user=" + usersg[usergg].unique_id;
        document.getElementById("goodSites").href = "goodSites.html?user=" + usersg[usergg].unique_id;
        document.getElementById("addChild").href = "addChild.html?user=" + usersg[usergg].unique_id;
      }
    }
  })
}

if(idg == undefined){
  location.replace("home.html");
}

document.getElementById("submit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  //retrieving input values
  var password = document.getElementById("password").value;
  var childName = document.getElementById("child-name").value;
  var childAge = document.getElementById("child-age").value;
  var userId = parseFloat(window.location.href.split("&user=")[1]);
  document.getElementById("load-gif").style.visibility = "visible";
  showError("");
  // checking for empty fields
  if(!password || !childName || !childAge){
    showError("Please fill in all the fields.");
    }
    else{
     getUser(userId,password,childName,childAge);
    }
});

function getUser(id,inputPassword,name,age) {
  var request;
  if(location.href.includes("?")){
    request = window.location.href.split("?")[1].split("&")[0];
  }
  else if(id == undefined){
    location.replace("home.html");
  }
  else{
    location.replace("home.html");
  }
  var activeUser;
  var users;
  //checking for request in url
  if (request === "task=childCreate") {
    database
      .ref("/Users/")
      .once("value")
      .then((snapshot) => {
        //getting all the user data
        users = snapshot.val();
        //getting the user
        for (user in users) {
          if (users[user].unique_id === id) {
            activeUser = user;
            break;
          }
        }

        //check for invalid users
        if(activeUser === undefined){
            showError("An error occurred! Please try again later.");
        }
        else if(users[activeUser].child !== undefined){
          location.replace("home.html?user="+users[activeUser].unique_id);
        }
        else{
            //check for password
            if(checkPassword(users,activeUser,inputPassword) == true){
                //correct password
                console.log("correct");
                addChild(activeUser,name,age,users[user].unique_id);
            }
            else{
                //incorrect password
                console.error("incorrect");
                showError("Incorrect Password!");
            }
        }
      })

      .catch((err) => {
        showError("An error occurred! Try again later.");
        console.error(err);
      });
  } else {
    showError("An error occurred! Try again later.");
  }
}

function showError(message) {
  document.getElementById("message-handler").innerHTML = message;
  document.getElementById("load-gif").style.visibility = "hidden";
}

function checkPassword(userData,activeUser,inputPassword){
    var correctPassword;
    if(userData[activeUser].password === inputPassword){
        //correct password
        return true;
    }
    else{
        //wrong password
        return false;
    }
}

function addChild(parent,name,age,userId){
    database.ref("/Users/"+parent+"/child").set({
        name:name,
        age: age
    })
    .then(promise => {
        showError("Child Create Successful!");
        setTimeout(function(){
            location.replace("home.html?user="+ userId +"&redirect=childCreate&child=" + name);
        },2000)
    })
    .catch(err => {
        console.error(err);
        showError("An error occurred! Please try again later.");
    })
}
