var StartPoint = StartPoint || {};
(function ($, undefined) {
    firebase.initializeApp(config);
    var habitsArr= [];
    var emailRegex =  new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    var userData = {name : "", gender: "", age: 0, badges : [], habits : []};
    
    var name = "";
    var email = "";
    var password = "";
    var confirmPass = "";
    var gender = "";
    var age = "";
    var currentUserId = "";
    var days = "";
    var currentUser;

    StartPoint.Index = function () {
        function init() {
            initControls();
        }
        
        function initControls() {
            $("#btnLogOut").hide();
           
             $("#btnLogOut").on("click", function(){
                $("#btnLogOut").hide(); 
                $("#btnUpdate").show();
                firebase.auth().signOut()
                .then(function() {
                 console.log("Sign-out successful.");
                 $("#btnLogOut").hide();
                 window.location.href="getstarted.html"; 
               })
                .catch(function(error) {
                 console.log(error.message);
               });
             });

            $("#btnUpdate").on("click", function(){
                console.log("on update");
                currentUser.habits[0].frecuency=["Mo","We", "Fr"];
                updateUserInformation(currentUser);
            });

            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    //we can save the extra data here
                     $("#btnLogOut").show();
                     currentUserId = firebase.auth().currentUser.uid; 
                     firebase.database().ref('items/'+ currentUserId).on('value', function(snapshot){
                        console.log(snapshot.val());
                        currentUser = snapshot.val();
                    $("#name").append(user.displayName);
                    });
                   console.log("user in profile sent from login id");
                   //console.log(user.currentUser);
            
                  } else {
                    console.log("user not logged in")
            
                  }
                });
        }

        // function publicFunction() {    
        // }

          firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //we can save the extra data here
       // btnLogOut.classList.remove("hide");



       console.log("user in profile sent from login");
       console.log(user);

      } else {
        console.log("user not logged in")

      }
    });

        function updateUserInformation(Userdata){
            firebase.database().ref('items/').child(currentUserId).update(Userdata)
                .then((snap) => {
                    //currentUser = snap;
                    console.log(snap)
                    window.location.href="profile.html"; 
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    showError(errorMessage);
                    console.log(errorMessage);
                    // ...
                });
        }

      

        return {
            Init: init,
            // PublicFuncion: publicFunction
        };

    }();
        
})(jQuery);