(function (window) {
    window.ngs = {
        compile: function () {
            directiveList = this.collectDirectives();
            for (let i = 0; i < directiveList.length; i++) {
                let elementsLength = directiveList[i].eleList;
                console.log(directiveList);
                for(let j = 0; j < elementsLength.length; j++) {
                    directives[directiveList[i].directiveFunction](elementsLength[j], directiveList[i].directiveName);
                }
            }
            let template = $("body")[0].innerHTML;
            let matches = directives.getInterpolationList(template);
            let matchList = [];
            if (matches) {
                for (let index = 0; index < matches.length; index++) {
                    let dta = data[(matches[index].match(/[^.]*/g)[0])];
                    let value = matches[index].match(/(?<=[.])[^(.)]*/g);
                    matchList.push(directives.parse(dta, value));
                }
                for (let index = 0; index < matches.length; index++) {
                    template = template.replace(directives.startSymbol + matches[index] + directives.endSymbol, matchList[index]);
                }
                $("body")[0].innerHTML = template   
            }
        },
        collectDirectives: function () {
            directiveList = [];
            let directives = new Set($("body")[0].innerHTML.match(/ng\-(?!view).[^=]*/g));
            directives.forEach(function (value) {
                let directive = { 'directiveName': value , "directiveFunction": value.replace(/\W+(.)/g, function(match, chr) { return chr.toUpperCase(); })}
                directive.eleList = document.querySelectorAll('[' + value + ']');
                directiveList.push(directive);
            });
            return directiveList;
        }
    }
    document.addEventListener("navigationSuccess", function () {
        ngs.compile();
    });
    window.directives = {
        startSymbol: "{{",
        endSymbol: "}}",
        ngApp: function() {
            return;
        },
        ngInclude: function (ele) {
            let url = ele.attributes[0].value;
            let template = templateCacheProvider.get(url);
            if (template) {
                ele.innerHTML = template;
                return;
            }
            loadService(url, function (template) {
                ele.innerHTML = template;
                templateCacheProvider.set(template, url);
            });
        },
        ngRepeat: function (ele, eleName) {
            let template = ($(ele)[0].outerHTML).replace(/ng-repeat[^"]*.[^"]*./g, "");
            let attribute = ele.getAttribute(eleName).match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)?\s*$/);
            let newTemplate = "";
            let interpolationList = this.getInterpolationList(template);
            for(var i = 0; i < 3; i++) {
                let dta = data[attribute[2]][i];
                newTemplate += this.processTemplate(template, interpolationList, dta);
            }
            this.updateTemplate(ele, newTemplate);
        },
        getInterpolationList: function(template) {
            return template.match(/(?<=\{\{)(.*?)(?=\}\})/g);
        },
        processTemplate: function(template, interpolationList, data) {
            let matchList = [];
            for (let index = 0; index < interpolationList.length; index++) {
                let value = interpolationList[index].match(/(?<=[.])[^(.)]*/g);
                matchList.push(this.parse(data, value));
            }
            for (let index = 0; index < matchList.length; index++) {
                template = template.replace(this.startSymbol + interpolationList[index] + this.endSymbol, matchList[index]);
            }
            return template;
        },
        parse: function(data, value) {
            let fvalue;
            for (let i = 0; i < value.length; i++) {
                if (fvalue) {
                    fvalue = fvalue[value[i]];
                } else {
                    fvalue = data[value[i]];
                }
            }
            return fvalue;
        },
        updateTemplate: function(element, template) {
            $(element).replaceWith(template);
        }
    }
    window.templateCacheService = function() {
        let templateCache = {};
        return {
            get: function(url) {
                return templateCache[url];
            },
            set: function(template, url) {
                templateCache[url] = template;
            }
        }
    }
    window.templateCacheProvider = templateCacheService();
    window.loadService = function(url, callback) {
        fetch(url).then(function (response) {
            response.text().then(function (template) {
                callback(template);
            });
        })
    }
    window.data = {};
})(window)