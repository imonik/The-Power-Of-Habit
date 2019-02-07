var Utils = Utils || {};
(function ($, undefined) {

    Utils.Index = function () {
        function init() {
            initControls();
        }
        function initControls() {
            funcion1();
            function2();
        }

        function publicFunction() {
            
        }

        return {
            Init: init,
            PublicFuncion: publicFunction
        };

    }();
        
})(jQuery);