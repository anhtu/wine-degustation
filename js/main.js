/**
 *
 * @author Anh-Tu Nguyen
 * <br/><a href="mailto:tuna@exoplatform.com">tuna@exoplatform.com<a/>
 * <br/>04 09, 2013
 */
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',

    /* no js extension at the end */
    paths: {
        jquery     : 'jquery-1.8.2.min',
        underscore : 'underscore-min',
        backbone   : 'backbone-min'
    },

    /* define dependencies for each module and export */
    shim: {
        jquery: {
            exports: "$"
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

// Start the main app logic.
requirejs(['jquery', 'backbone', 'underscore'],
    function   ($,        Backbone,   _) {

        /* defining namespace */
        (function (){
            window.am = {};
            am.ui     = {};
            am.controllers = {};
            am.model  = {};
            am.app    = {};
        }) ();

        window.am || (window.am = {});

        /* defining templates */
        (function () {
            window.TLT = {};
            TLT["account/view"] =
                '<div class="container">\n' +
                    '  <img src="<%=avatar%>" class="img-rounded"/>\n' +
                    '  <p class="text-left"><%=account.first_name %></p>\n' +
                    '</div>';
        })();

});
