var StartPoint = StartPoint || {};
(function ($, undefined) {
    firebase.initializeApp(config);
    var habitsArr= [];
    var emailRegex =  new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    var userData = {name : "", gender: "", age: 0, badges : [], habits : []};
    var days = [];
    var name = "";
    var email = "";
    var password = "";
    var confirmPass = "";
    var gender = "";
    var age = "";

    StartPoint.Index = function () {
        function init() {
            initControls();
        }
        
        function initControls() {
            $("#habit").show();
            //$("#signup").hide();   
            
            $("#age").prepend("<option value=''>Select</option>").val('');
            $("#age").prop("selected", "selected")
            $("#gender").prop("selected", "selected")

            var select = $('#age');
            
            for (var i = 18; i <= 100; i++) {
                $('<option>', {value: i, text: i}).appendTo(select);
            }
            
            $("#gender").change(function(){
                gender = $(this).children("option:selected").val();
                console.log("gender changed");
            });

            $("#age").change(function(){
                age = $(this).children("option:selected").val();
                console.log("age changed");
            });
            
            $(".habits").on("click", function(){
                var habit = {id:0, name : "", streak:0, daysLeft: 0, frequency: [], location: {long: 0, lat: 0}};
                
                var selectedHabit = $(this).text();
                var id = parseInt($(this).data("id"));
                if(!habitsArr.includes(selectedHabit)){
                    habit.id = id;
                    habit.name = selectedHabit;
                    habitsArr.push(habit);
                }
            });

             $("#btnNext").on("click", function(){
                $("#habit").hide(); 
                $("#signup").show();
             });

            $("#btnSignUp").on("click", function(){

                if(validateUserData()){
                    userData.name = name;
                    userData.gender = gender;
                    userData.age = age;
                    userData.habits = habitsArr;

                    firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function(user) {
                        console.log(user);

                        updateUserInformation(name, email);
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        //showError(errorMessage);
                        console.log(errorMessage);
                        // ...
                    });
                }
            });
            $("#btnLogIn").on("click", function(){
                var email = $("#txtLogEmail").val();
                var logPass = $("#txtLogPassword").val()

                if(email != "" && logPass != ""){
                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
                    .then(function() {
                    // Existing and future Auth states are now persisted in the current
                    // session only. Closing the window would clear any existing state even
                    // if a user forgets to sign out.
                    // ...
                    // New sign-in will be persisted with session persistence.
                    //var promise = firebase.auth().signInWithEmailAndPassword(email, password);
                    //promise.catch(e => console.log("message: " + e.message));
                    firebase.auth().signInWithEmailAndPassword(email, logPass)
                                    .then(function(user) {
                                        console.log("user " +user);
                                        window.location.href="profile.html"; 
                                       
                                    })
                                    .catch(function(error) {
                                        // Handle Errors here.
                                        var errorCode = error.code;
                                        var errorMessage = error.message;
                                        console.log(errorMessage);
                                        // ...
                                    });
                    })
                .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                });
                }
            });
        }

        // function publicFunction() {    
        // }

        function validateUserData(){

            var validData = true;
            name = $("#txtName").val();
            email = $("#txtEmail").val();
            password =  $("#txtPassword").val();
            confirmPass = $("#txtConfirmPassword").val();

            if(email == "" && name == "" && password == "" && confirmPass == ""){
                alert("Please enter the information.");
                validData = false;
                return;
            } else {
                if(!emailRegex.test(email)){
                    alert("Please enter a valid email.");
                    validData = false;
                    return;
                }else if(password.length <= 6) {
                    alert("Please enter a password with more than 6 characteres");
                    validData = false;
                return;
                }else if( password != confirmPass) {
                    alert("Password does not match.")
                    validData = false;
                return;
                }else if(age == "") {
                    alert("Please select age.")
                    validData = false;
                }else if(gender == "") {
                    alert("Please select age.")
                    validData = false;
                }
            }
            return validData;
        }

        function updateUserInformation(name, email){

            firebase.auth().onAuthStateChanged(function(user) {
                //         name = name.charAt(0).toUpperCase() + name.slice(1);
                //         user.updateProfile({
                //          displayName: name
            }).then(function() {
                firebase.database().ref('items/').child(user.uid).set(userData)
                         .then((snap) => {
                             console.log(snap)
                             window.location.href="profile.html"; 
                             $("name").text();
                         }).catch(function(error) {
                             // Handle Errors here.
                             var errorCode = error.code;
                             var errorMessage = error.message;
                             //showError(errorMessage);
                             console.log(errorMessage);
                             // ...
                         })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
          })
        //});  

        //     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        //     .then(function() {
        //     // Existing and future Auth states are now persisted in the current
        //     // session only. Closing the window would clear any existing state even
        //     // if a user forgets to sign out.
        //     // ...
        //     // New sign-in will be persisted with session persistence.
        //     //var promise = firebase.auth().signInWithEmailAndPassword(email, password);
        //     //promise.catch(e => console.log("message: " + e.message));
        //     firebase.auth().onAuthStateChanged(function(user) {
        //         name = name.charAt(0).toUpperCase() + name.slice(1);
        //         user.updateProfile({
        //          displayName: name
        //        })
        //      .then(function() {
        //          firebase.database().ref('items/').child(user.uid).set(userData)
        //                  .then((snap) => {
        //                      console.log(snap)
        //                      window.location.href="profile.html"; 
        //                  }).catch(function(error) {
        //                      // Handle Errors here.
        //                      var errorCode = error.code;
        //                      var errorMessage = error.message;
        //                      //showError(errorMessage);
        //                      console.log(errorMessage);
        //                      // ...
        //                  });
        //      });
        //      });
        //     })
        //   .catch(function(error) {
        //     // Handle Errors here.
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        //   });  
        }

      

        return {
            Init: init,
            // PublicFuncion: publicFunction
        };

    }();
        
})(jQuery);