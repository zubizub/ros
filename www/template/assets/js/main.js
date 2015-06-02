//libs
//= libs/jquery.js
//= libs/jquery.easing.min.js
//can be useful
//!= libs/bootstrap.js
//!= libs/autoresize.jquery.js
//!= libs/jquery.maskedinput.min.js
//!= libs/jquery.preload.min.js
//!= libs/modernizr.js
//!= libs/mousewheel.js
//!= libs/owl.carousel.min.js

//prog
$(function () {

    //components
    //= prog/historyLoader.js
    //= prog/usefulFunc.js
    //= prog/siteInterface.js
    //= prog/header.js

    Application = new function(){
        this.historyLoader = new historyLoader();
        this.usefulFunc = new usefulFunc();
        this.siteInterface = new siteInterface();
        this.header = new header();

        var i;
        for (i in this)
            this[i].parentClass = this;
        for (i in this)
            if (this[i].init !== undefined)
                this[i].init();
    };
});
