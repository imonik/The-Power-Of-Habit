//import profile from "./assets/js/home.js";
var StartPoint = StartPoint || {};
(function ($, undefined) {

    StartPoint.Index = function () {
        function init() {
            initControls();
        }

        function initControls() {
            
            // $('.materialboxed').materialbox();
            // $('.modal').modal();
            console.log("Init controls");

            $("#homeLogin").on("click", function() {
                console.log("on home log In");
                var userName = $("#email").val();
                var password = $("#password").val();
                StartPoint.Index.UserLogin(userName, password);
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