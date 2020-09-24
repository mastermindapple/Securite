var database = firebase.database();

document.getElementById("submit-btn").addEventListener('click', e => {
    e.preventDefault();
    document.getElementById("load-gif").style.visibility = "visible"
    giveError("Please wait.")
    setTimeout(checkFields,2000);
})

function checkFields(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;


    if(!username || !password){
        giveError("Fill in all the fields.");
    }
    else{
        checkUsername(username,password);
    }
}
function checkUsername(username,password){
    var users;
    database.ref("/Users/").once('value')
    .then(snapshot => {
        users = snapshot.val();

        //check for username
        // if username found, check password
        if(Object.keys(users).includes(username)){
            checkPassword(username,password);
        }
        //if username not found, error
        else{
            console.error("username does not exist");
            giveError("Username does not exist.");
        }
    })
    //if error from firebase side
    .catch(err => {
        console.error(err);
        giveError("An error occurred. Try again later.");
    })
}

function checkPassword(username,password){
    var credentials;
    //retrieving user's credentials
    database.ref("/Users/"+username+"/").once("value")
    .then(snapshot => {
        credentials = snapshot.val();

        //checking user's password
        //if password correct, login
        if(credentials.password === password){
            logIn(credentials.unique_id);
        }
        //if password incorrect, show error
        else{
            giveError("Incorrect Password.");
        }

    })
    //checking and showing for errors from firebase side
    .catch(err => {
        console.error(err);
        giveError("An error occurred. Try again later.");
    })
}

function logIn(uniqueId){
    //redirect to home.html, showing child's history or in order to add a child.
    console.log("Logged in!");
    location.replace("home.html?user=" + uniqueId + "&redirect=login");
}

function giveError(message){
    document.getElementById("message-handler").innerHTML = (message);
    console.error(message);
    document.getElementById("load-gif").style.visibility = "hidden"
}