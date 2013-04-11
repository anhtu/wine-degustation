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

    /* defining namespace - wd stands for wine degustation */
    (function (){
        window.wd = {};
        wd.ui     = {};
        wd.controllers = {};
        wd.model  = {};
        wd.app    = {};
    }) ();

    window.wd || (window.wd = {});

    /* defining templates */
    (function () {
        window.TLT = {};
        TLT["account/view"] =
            '<div class="container">\n' +
            '  <img src="<%=avatar%>" class="img-rounded"/>\n' +
            '  <p class="text-left"><%=account.first_name %></p>\n' +
            '</div>';
    })();

    wd.app = {
        URL: { WINES: 'wines' }
    };

    /*======== MODEL ========*/
    wd.model.Wine = Backbone.Model.extend({
        defaults: {
            id  : "",
            name: "",
            origin: "",
            year: ""
        }
    });


    wd.model.WineList = Backbone.Collection.extend({
        model: wd.model.Wine,
        url: "/" + wd.app.URL.WINES
    });

    /*======== VIEW ========*/
    wd.ui.WineListItem = Backbone.View.extend({
        tagName: 'li',
        events: {},
        initialize: function() {
            console.log("wd.ui.WineListItem - initialize");

            /**
             * 1> every time changes occur to our model
             *    we need to re-render our View
             *    how to bind: object.on('change', callback)
             *
             * 2> or every time, new data parsed to our model, meaning that changes occur to
             *    our model, then saved onto the server, new data fetched, we re-render our View
             *    ==> change event still occur after data fetched
             * */

             this.model.on("change", this.render);
        },
        render: function() {
            console.log("wd.ui.WineListItem - render");
            /* when parsing to _.template need to parse with JSON */
            $(this.el).html(_.template('<a href="#' + wd.app.URL.WINES + '/<%=wine.id%>"><%=wine.name%></a>', { wine: this.model.toJSON()}));
            return this;
        }
    });

    wd.ui.WineListView = Backbone.View.extend({
        tagName: 'ul',
        className: 'nav nav-stacked',
        events: {},
        initialize: function(){
            console.log("wd.ui.WineListView - initialize");

            /* *
             * every time change occurs on the collection, re-render the View
             * */
            this.model.on("reset", function () { console.log("reset occurs"); });
            this.model.on("change", function () { console.log("change occurs"); });
        },
        render: function(){
            console.log("wd.ui.WineListView - render");

            /* models of collection: Raw access to the JavaScript array of models inside of the collection */
            var self = this;
            _.each(this.model.models, function(wine) {
                $(self.el).append(new wd.ui.WineListItem({ model: wine }).render().el);
            }, this);
            return this;
        }
    });

    wd.ui.WineDetail = Backbone.View.extend({
        tagName: 'div',
        className: 'thumbnail',
        events: {},
        initialize: function () {

            if (this.model) this.model.on('change', this.render);
        },
        render: function() {
            console.log("wd.ui.WineDetail - render");
            $(this.el).html(_.template('<img src="imgs/260x120.png">\n<div class="caption"><h3><%=wine.name %></h3></div>', { wine: this.model.toJSON()}));
            return this;
        }
    });

    /*======== ROUTER ========*/
    wd.controllers.Home = Backbone.Router.extend({
        routes: {
            "wines": "list",            // #wines
            "wines/:id" : "wineDetail",  // #wines/id
            "add": "add"
        },

        list: function() {
            console.log("wd.controllers.Home - list");

            /* attach our model to the router */
            this.wineList = new wd.model.WineList();

            /* triggers change event on the collection */
            var self = this;

            /* after the fetch wineList is sync with the server */
            this.wineList.fetch({
                error: function() { console.log("error fetched"); }
              , success: function(models, response) {
                    console.log("fetch success - models: ");

                    self.wineListView = new wd.ui.WineListView({ model: models });
                    /* insert the view into the DOM */
                    $("#listWine").html(self.wineListView.render().el);
                }
            });

        },

        wineDetail: function(id) {
            console.log('wd.controllers.Home - wineDetails - id: ' + id);

            /* when we display the wine detail, we should get from the Model not fetch from
             * server anymore
             * */
            this.wineDetail = new wd.ui.WineDetail({ model: this.wineList.get(id) });
            $("#wineDetail").html( this.wineDetail.render().el );
            $("#editWineButton").show();
        },

        add: function() {
            console.log('wd.controllers.Home - add');

            /* we do not encapsulate addWine into a view because it's not attached
             * to any model
             * */
            $("#addWine").show();
        }
    });

    /* attach to window for debugging purpose */
    window.homeScreen = new wd.controllers.Home();
    Backbone.history.start();
});
