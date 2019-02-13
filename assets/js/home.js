//import profile from "./assets/js/home.js";
var Home = Home || {};
(function ($, undefined) {

    Home.Index = function () {
        function init() {
            initControls();
        }

        function initControls() {
            $('.materialboxed').materialbox();
            $('.modal').modal();

            $("#aLogin").on("click", function() {
                var userName = $("#email").val();
                var password = $("#password").val();
                StartPoint.Index.UserLogin(userName, password);
            });

            $("#btnLogOut").on("click", function() {
                Profile.Index.LogOut();
            });

            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    $("#aLoginNav").hide();
                    $("#btnLogOut").show();
                    console.log("user loged in ");
                } else {
                    $("#aLoginNav").show();
                    $("#btnLogOut").hide();
                    console.log("not user");
                }
            });
        }

        function publicFunction() {
            
        }

        return {
            Init: init,
            PublicFuncion: publicFunction
        };

    }();

})(jQuery);