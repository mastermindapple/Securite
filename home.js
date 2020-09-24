var database = firebase.database();
document.body.onload = getUser();

function getUser() {
  document.getElementById("message-handler").innerHTML = "Please wait.";
  /*
    variable directory
    users -> all the users available;
    user -> active username
    userId -> active user's id
    params -> available parameters in url
    redirectCause -> why was the page redirected?
  */

  var users;
  var user;
  var userId = parseFloat(window.location.href.split("?user=")[1]);
  document.getElementById("badSites").href = "badSites.html?user=" + userId;
  document.getElementById("goodSites").href = "goodSites.html?user=" + userId;
  document.getElementById("home").href = "home.html?user=" + userId;
  var params;
  var redirectCause;

  if (window.location.href.includes("?")) {
    params = window.location.href.split("?")[1].split("&");
    // getting the retrievable parameters
  }
    for (param in params) {
      //getting the cause of redirect
      if (params[param].includes("redirect=")) {
        redirectCause = params[param].split("=")[1];
      }
    }
  
  database
    .ref("/Users/")
    .once("value")
    .then((snapshot) => {
      users = snapshot.val();

      for (activeUser in users) {
        if (users[activeUser].unique_id == userId) {
          user = activeUser;
        }
      }
      document.getElementById("home").href = "home.html?user=" + users[user].unique_id;
      document.getElementById("badSites").href = "badSites.html?user=" + users[user].unique_id;
      document.getElementById("goodSites").href = "goodSites.html?user=" + users[user].unique_id;
      document.getElementById("addChild").href = "addChild.html?task=childCreate&user=" + users[user].unique_id;
      if (user == undefined) {
        //no user
        location.replace("login.html");
      } else if (redirectCause == "childCreate") {
        //load introductory tutorial
        var center = document.getElementById("center");
        var head = document.createElement("h1");
        var lineBreak = document.createElement("br");
        var content = document.createElement("p");

        head.classList = "headers";
        head.innerHTML = "Hello, " + users[user].child.name;

        content.classList = "content";
        content.innerHTML =
          "You can start by installing the chrome extension from Lorem <br>and start browsing the web.";

        center.appendChild(head);
        center.appendChild(lineBreak);
        center.appendChild(content);
        document.getElementById("message-handler").innerHTML = "";
      }
      document.getElementById("user-prompt").innerHTML = "Hi, " + user;
      loadData(users[user], user);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("message-handler").innerHTML =
        "An error occurred! Please try again later.";
    });
}

function loadData(userData) {
  if (userData.child == null) {
    var button = document.createElement("button");
    button.innerHTML = "Add Child";
    button.className = "add-btn";
    button.addEventListener("click", (e) => {
      e.preventDefault();
      addChild(userData.unique_id);
    });

    var info = document.createElement("p");
    info.innerHTML =
      "Please add a child in order to your account to proceed with Securite.";
    info.classList = "content";

    document.getElementById("feed").appendChild(button);
    document.getElementById("feed").appendChild(info);
    document.getElementById("message-handler").innerHTML = "";
  } else {
    //display child's data
    loadChart(userData);
  }
}

function addChild(userId) {
  location.replace("addChild.html?task=childCreate&user=" + userId);
}

function loadChart(userData) {
  document.getElementById("chartContainer").style.visibility = "visible";

  var chartContainer = document.createElement("div");
  chartContainer.style.height = "300px";
  chartContainer.style.width = "600px";
  document.getElementById("center").appendChild(chartContainer);

  //calculateExplicitSites(userData.child.badSites);

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,

    title: {
      text: "",
    },
    axisX: {
      interval: 1,
    },
    axisY2: {
      interlacedColor: "rgba(1,77,101,.2)",
      gridColor: "rgba(1,77,101,.1)",
      title: "Explicit sites visited by " + userData.child.name,
    },
    data: [
      {
        type: "bar",
        name: "companies",
        axisYType: "secondary",
        color: "#014D65",
        dataPoints: calculateExplicitSites(userData.child.badSites),
      },
    ],
  });
  chart.render();
  document.getElementById("message-handler").innerHTML = "";
}

function calculateExplicitSites(badSites) {
  if (badSites == undefined) {
    //no bad sites visited
    return([{y:0, label:"No sites visited"}])
  } else {
    var visitDates = [];
    var sitesArr = [];

    for (site in badSites) {
      var surfDate =
        badSites[site].date +
        "," +
        badSites[site].month +
        "," +
        badSites[site].year;
      if (visitDates.includes(surfDate) === false) {
        visitDates.push(surfDate);
      }
    }
    for (t in visitDates) {
      var time = visitDates[t].split(",");
      var date = parseInt(time[0]);
      var month = parseInt(time[1]);
      var year = parseInt(time[2]);

      var sitesVisitedDuringThisDate = [];
      for (site in badSites) {
        if (
          badSites[site].date == date &&
          badSites[site].month == month &&
          badSites[site].year == year
        ) {
          //sites are of this date
          sitesVisitedDuringThisDate.push(site);
        }
      }
      sitesArr.push(sitesVisitedDuringThisDate);
    }
    for (date in visitDates) {
      if (visitDates[date].split(",")[1] == "12") {
        var currentDate = visitDates[date].split(",");
        currentDate[1] = "1";
        currentDate.join(", ");
        visitDates[date] = currentDate;
      } else {
        var currentDate = visitDates[date].split(",");
        ///currentDate[1] = parseInt(currentDate[1])++;
        +currentDate[1]++;
        currentDate = currentDate.join(", ");
        visitDates[date] = currentDate;
      }
    }
    var productArr = [];
    for (date in visitDates) {
      productArr.push({ label: visitDates[date], y: sitesArr[date].length });
    }
    //productarr is the result
    return productArr;
  }
}

//user=9688.1234&redirect=childCreate&child=janav
