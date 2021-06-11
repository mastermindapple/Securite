const database = firebase.database();

document.body.onload = getUser();
var user;

function getUser() {
  giveError("Please Wait.");
  var parameters;
  if(location.href.includes("?")){
    parameters = window.location.href.split("?")[1].split("&");
  }
  for (parameter in parameters) {
    if (parameters[parameter].includes("user=")) {
      user = parameters[parameter].split("user=")[1];
    }
  }
  if (user == undefined) {
    location.replace("home.html");
  } else {
    getUserName(user);
  }
}

function getUserName(id) {
    var users;
    var username;
    database
      .ref("/Users/")
      .once("value")
      .then((snapshot) => {
        users = snapshot.val();
        for (user in users) {
          if (users[user].unique_id == id) {
            username = user;
          }
        }
        if (username == undefined) {
          giveError("An error occurred. Please try again later.");
        } else {
          loadSites(username, id);
          document.getElementById('active').href = "badSites.html?user="+id;
          document.getElementById('home').href = "home.html?user="+id;
          document.getElementById('goodSites').href = "goodSites.html?user="+id;
          document.getElementById("addChild").href = "addChild.html?task=childCreate&user=" + id;
        }
      })
      .catch((err) => {
        giveError("An error occurred. Please try again later.");
        console.error(err);
      });
  }

  function loadSites(username, id) {
    var childData;
    database
      .ref("/Users/" + username + "/child/")
      .once("value")
      .then((snapshot) => {
        childData = snapshot.val();
        if (childData.name !== undefined || childData.name !== null) {
          if (childData.goodSites == undefined) {
              giveError("Your child has not visited any sites.");
          } else {
            displaySites(childData.goodSites,id);
          }
        } else {
          giveError("You do not have a child.");
          setTimeout(function () {
            location.replace("home.html?user=" + id);
          },1000);
        }
      })
      .catch((err) => {
        console.error(err);
        giveError("An error occurred. Please try again later.");
      });
  }

  function displaySites(sites,id) {
    var splittedArr = []
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for(site in sites){
      var row = document.createElement("tr");
      row.classList = "row";
      //shortening the url
      if(sites[site].url.split('').length > 20){
        var splitted = sites[site].url.split('');
        for(var x = 0; x<20; x++){
          console.log(splitted[x])
          splittedArr.push(splitted[x]);
        }       
        console.log(splittedArr)
      }

      var url = document.createElement("td");
      url.innerHTML = "<a id='url-link' target= '_blank' href='" + sites[site].url + "'>"+splittedArr.join('')+"..."+ "</a>";
      url.classList = "urls";

      var date = document.createElement("td");
      date.innerHTML = sites[site].date + ", " + months[sites[site].month] + ", " + sites[site].year;
  
      var time = document.createElement("td");
      time.innerHTML = sites[site].hour + ":" + sites[site].minute + ":" + sites[site].second;
    
      row.appendChild(url);
      row.appendChild(date);
      row.appendChild(time);
      document.getElementById("table").appendChild(row);
      giveError("");
      splittedArr = [];
    }
  }

function giveError(message) {
    document.getElementById("error-handler").innerHTML = message;
  }
  