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
        backbone   : 'backbone-min',
        bootstrap  : '../../bootstrap/js/bootstrap.min'
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
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

// Start the main app logic.
requirejs(['jquery', 'backbone', 'underscore', 'bootstrap'],

/*
 * if we do not import bootstrap here, our modal does not work
 * basically, bootstrap only extends some jQuery feature
 * so why?
 *
 * */
function   ($,        Backbone,   _, bootstrap) {

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
            // id  : "", does not set id for the model since if it has id, it considered to be old
            name: "",
            origin: "",
            year: ""
        },

        initialize: function () {
            console.log('wd.model.Wine - init');
            /**
            if (this.attributes.name) { // we can access like this or this.get('name')
                this.id = this.attributes.name.toLowerCase().replace(' ','_');
                this.url = "/" + wd.app.URL.WINES + "/" + this.id;
            }
            else {
                this.url = "/" + wd.app.URL.WINES;
            }
            **/
            this.url = "/" + wd.app.URL.WINES;
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
            _.bindAll(this, "render");
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

            /* that's why we need to bind addWine to this and the bind must happen before */
            _.bindAll(this, "addWine");

            /* pay attention to this kind of binding, this in addWine will refer to the model */
            this.model.on("add", this.addWine);
        },
        render: function(){
            console.log("wd.ui.WineListView - render");

            /* models of collection: Raw access to the JavaScript array of models inside of the collection */
            var self = this;
            _.each(this.model.models, function(wine) {
                $(self.el).append(new wd.ui.WineListItem({ model: wine }).render().el);
            }, this);
            return this;
        },
        addWine: function() {
            console.log("wd.ui.WineListView - addWine");
            var _wine = this.model.at(this.model.length - 1);
            $(this.el).append(new wd.ui.WineListItem({ model: _wine }).render().el);
        }
    });

    wd.ui.WineDetail = Backbone.View.extend({
        tagName: 'div',
        className: 'thumbnail',
        mode: "VIEW",  // in the view, we can assign attribute directly like this
        events: {
            'click button[name="edit"]': 'edit',
            'click button[name="save"]': 'save'
        },

        template: {
            VIEW: '<img src="imgs/260x120.png">\n<button type="button" name="edit" class="btn float-btn"><i class="icon-edit"></i>Edit</button>' +
                  '<div class="caption"><h3><%=wine.name %></h3></div>',
            EDIT: '<img src="imgs/260x120.png" style="margin-bottom: 10px;">\n<button type="button" name="save" class="btn float-btn"><i class="icon-ok"></i>Save</button>' +
                  '<input type="text" name="name" placeholder="<%=wine.name %>">' +
                  '<input type="text" name="origin" placeholder="<%=wine.origin %>">' +
                  '<input type="text" name="year" placeholder="<%=wine.year%>">'
        },
        initialize: function () {
            console.log(this.mode);

            _.bindAll(this, "render");
            if (this.model) {
                this.model.on('change', this.render);
            }
        },

        /* depending on the mode, we render differently */
        render: function() {
            console.log("wd.ui.WineDetail - render");
            /* this will modify directly in the DOM */
            $(this.el).html(_.template(this.template[this.mode], { wine: this.model.toJSON()}));
            return this;
        },

        edit: function() {
            console.log("wd.ui.WineDetail - edit");
            this.mode = 'EDIT';
            this.render();
        },

        save: function() {
            console.log("wd.ui.WineDetail - save");
            var form = $(this.el)
              , _name = form.find("input[name='name']").val() || this.model.get('name')
              , _year = form.find("input[name='year']").val() || this.model.get('year')
              , _origin = form.find("input[name='origin']").val() || this.model.get('origin');

            /* if id is null, save will init a POST request to create new, otherwise it's a PUT request */
            this.model.url = "/" + wd.app.URL.WINES + "/" + this.model.id;
            this.model.save({ id: this.model.id, name: _name, year: _year, origin: _origin},
                {
                    error: function () { console.log("save problem"); }
                },
                {
                    success: function() { console.log("saving ok"); }
                }
            );

            form.find("input[name='name']").val('');
            form.find("input[name='year']").val('');
            form.find("input[name='origin']").val('');
        }
    });

    /**
     * AddWineView is a wrapper of Bootstrap Modal
     */
    wd.ui.AddWineView = Backbone.View.extend({
        tagName: 'div',
        className: 'modal hide fade',
        events: {
            'a.btn': 'close'
        },
        render: function () {
            $(this.el).html(_.template('<div class="modal-header">' +
                '<button type="button" class="close" aria-hidden="true">&times;</button>' +
                '<h3>Add Wine</h3>' +
                '</div>' +
            '<div class="modal-body">' +
                '<input type="text" name="name" placeholder="name of wine">' +
                '<input type="text" name="origin" placeholder="origin">' +
                '<input type="text" name="year" placeholder="year of production"><br>' +
                '</div>' +
            '<div class="modal-footer">' +
                '<!-- data-dismiss attribute allows to close the modal -->' +
                '<a data-target="#" class="btn" name="close">Close</a>' +
                '<button type="button" class="btn btn-primary" name="submit">Add</button>' +
                '</div>')
            );

            return this;
        },

        show: function () {

            return this;
        },

        /* instead of using data-dismiss of button in bootstrap modal
         * we use <a href> to update our URL and use close event in backbone
         * because if we use data-dismiss, we are unable to return to our home,
         * 'href' function is disabled
         * */
        close: function () {
            console.log('close');
            return this;
        }

     });

    /*======== ROUTER ========*/
    wd.controllers.Home = Backbone.Router.extend({
        routes: {
            "wines": "list",             // #wines
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
        },

        /*
         * wrap addWine function into a View that uses Bootstrap Model
         *
         */
        add: function() {
            console.log('wd.controllers.Home - add');

            var self = this;
            /* we do not encapsulate addWine into a view because it's not attached
             * to any model
             * */
            var addWineForm = $("#addWine");
            addWineForm.show();
            /* click on add wine */
            addWineForm.find("button[name='submit']").on("click",
                function () {
                    var _newWine
                      , _name = addWineForm.find("input[name='name']").val()
                      , _year = addWineForm.find("input[name='year']").val()
                      , _origin = addWineForm.find("input[name='origin']").val();
                    _newWine = new wd.model.Wine({ name: _name, year: _year, origin: _origin});

                    console.log(_newWine);

                    /* if id is null, save will init a PUT request */
                    _newWine.save(
                        {
                            error: function () { console.log("save problem"); }
                        },
                        {
                            success: function() { console.log("saving ok"); console.log(self.wineList); self.wineList.add(_newWine); }
                        }
                    );

                    addWineForm.find("input[name='name']").val('');
                    addWineForm.find("input[name='year']").val('');
                    addWineForm.find("input[name='origin']").val('');
                }
            );

            this.addWine = new wd.ui.AddWineView();
            $("body").append(this.addWine.render().el);
            this.addWine.show();
        }
    });

    /* attach to window for debugging purpose */
    window.homeScreen = new wd.controllers.Home();
    Backbone.history.start();
});
