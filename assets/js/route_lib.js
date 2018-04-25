(function(window) {
    window.Router = {
        routes: [],
        root: '',
        add: function(state, config) {
            var params = this.getParams(state);
            state = (state.match(/\/([a-z,A-Z,/,0-9])*/g)[0]).replace(/\/$/g, "");
            this.routes.push({state: state, config: config, params: params});
            return this;
        },
        getParams: function(state) {
            var states = state.match(/\/:([a-z,A-Z,0-9])*/g);
            if(states != null) {
                for(var i=0; i<states.length; i++) {
                    states[i] = states[i].replace(/\/:/g, "");
                };
            }
            return states;
        },
        setParams: function(route) {
            window.params = {};
            var urlArray = ((window.location.href.match(/\/#\/([a-z,0-9,A-Z,\./\:])*/g)[0]).replace(/\/#/g, "")).match(/\/[a-z,0-9,A-Z]*/g).filter((data) => {return data != "";});
            var url = urlArray.join("");
            var length = url.indexOf(route.state) + route.state.length;
            var urlParams = url.slice(length).split("/");
            if(route.params != null) {
                for(var i=0; i<route.params.length; i++) {
                    window.params[route.params[i]] = urlParams[i+1];
                }
            }
        },
        checkRoute: function() {
            for(var i=0; i<this.routes.length; i++) {
                if(this.getCurrentRoute().match(this.routes[i].state)) {
                    this.setParams(this.routes[i]);
                    return this.routes[i].config.templateUrl;
                }
            }
            throw "No matching route found";
        },
        getCurrentRoute: function() {
            return (window.location.href.match(/#(.*)$/)[1]);
        },
        default: function(path) {
            if(window.location.href.indexOf("#") == -1)
                this.navigate(path);
            else
                this.update();
        },
        loadTemplate: function(url, callback) {
            fetch(url).then(function (response) {
                response.text().then(function(template) {
                    callback(template);
                });
            })
        },
        navigate: function(path, params) {
            var parameters = "";
            if(params != undefined) {
                var keys = Object.keys(params);
                for(var i =0; i<keys.length; i++) {
                    parameters += ("/" + params[keys[i]])
                }
            }
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + (path ? path : '') + parameters;
            this.update();
        },
        update: function() {
            this.loadTemplate(this.checkRoute(), function(template) {
                Router.ele[0].innerHTML = template;
                let scripts =  template.match(/(?<=<script>)([^]*)(?=<\/script>)/g);
                if(scripts)
                    scripts.forEach(function(scrpt) { eval(scrpt); });
                document.dispatchEvent(Router.navigationSuccessEvent);
            });
        }
    }
    Router.navigationSuccessEvent = new CustomEvent("navigationSuccess");
    Router.ele = document.getElementsByTagName("s-view");
    window.addEventListener("hashchange", function() {
        Router.update();
    });
})(window)