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
            console.log("Init controls");

            $("#aLogin").on("click", function() {
                console.log("on home log In");
                var userName = $("#email").val();
                var password = $("#password").val();
                StartPoint.Index.UserLogin(userName, password);
            });

            $("#btnLogOut").on("click", function() {
                console.log("on home log In");
                var userName = $("#email").val();
                var password = $("#password").val();
                StartPoint.Index.UserLogin(userName, password);
            });

            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    $("#aLogin").hide();
                    $("#btnLogOut").show();
                    console.log("user loged in ");
                } else {
                    $("#aLogin").show();
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