(function(global) {

    "use strict";
    /*global window */
    /*global $  */
    /*global document */
    
    // =========================================================================
    // packages
    // =========================================================================
    global.jsedit = {};
    global.jsedit.core = {};
    var core = global.jsedit.core;

    // =========================================================================
    // helper: create object with prototype
    // =========================================================================
    core.object = function(prototype) {
        var TmpFunction = function() {
        };
        TmpFunction.prototype = prototype;
        return new TmpFunction();
    };

    // =========================================================================
    // helper: extend object
    // =========================================================================
    core.extend = function(o1, o2) {
        for ( var key in o2) {
            o1[key] = o2[key];
        }
        return o1;
    };

    // =========================================================================
    // helper: generate constructor function
    // =========================================================================
    var generateConstructorFunction = function() {
        var ConstructorFunction = null;
        ConstructorFunction = function() {
            if (!(this instanceof ConstructorFunction)) {
                return new ConstructorFunction("blub", arguments);
            }
            if (this.init) {
                if (arguments.length == 2 && arguments[0] === "blub") {
                    this.init.apply(this, arguments[1]);
                } else {
                    this.init.apply(this, arguments);
                }
            }
        };
        return ConstructorFunction;
    };

    // =========================================================================
    // create class
    // =========================================================================
    core.createClass = function(prototype) {
        var Cls = generateConstructorFunction();
        Cls.prototype = prototype;
        return Cls;
    };

    // =========================================================================
    // create derived class
    // =========================================================================
    core.createDerivedClass = function(parentClass, prototype) {
        var Cls = generateConstructorFunction();
        Cls.prototype = core.extend(core.object(parentClass.prototype), prototype);
        return Cls;
    };

    // =========================================================================
    // copy options
    // =========================================================================
    core.copyOptions = function(target, source) {
        for ( var name in source) {
            if (source.hasOwnProperty(name)) {
                target[name] = source[name];
            }
        }
    },

    // =========================================================================
    // remove list2 elements from list1
    // =========================================================================
    core.removeElements = function(list1, list2) {
        for ( var i = 0; i < list2.length; ++i) {
            var index = $.inArray(list2[i], list1);
            if (index >= 0) {
                list1.splice(index, 1);
            }
        }
    };

    // =========================================================================
    // name/value dialog
    // =========================================================================
    core.nameValueDialog = function(options, callback) {
        // construct html of dialog
        var content = $("<table></table>");
        for ( var i = 0; i < options.fields.length; ++i) {
            var row = $("<tr></tr>");
            content.append(row);
            var nameCell = $("<td></td>");
            row.append(nameCell);
            var field = options.fields[i];
            nameCell.append(field.name);
            var valueCell = $("<td></td>");
            row.append(valueCell);
            if (field.readonly) {
                field.inputField = $("<input readonly='readonly' type='text'/>");
            } else {
                field.inputField = $("<input type='text'/>");
            }

            field.inputField.val(field.value);
            valueCell.append(field.inputField);
        }
        // dialog widget
        content.dialog({
            buttons : [ {
                text : "Ok",
                click : function() {
                    $(this).dialog("close");
                    callback();
                }
            } ],
            title : options.title
        // width:"600px"
        });
    };

    // =========================================================================
    // create map from list
    // =========================================================================
    core.map = function(list,key){
        var map = {};
        for(var i=0;i<list.length;++i){
            var element = list[i];
            var keyValue =  key(element);
            if(!keyValue){
                continue;
            }
            map[keyValue] = element;
        }
        return map;
    };
    
    // =========================================================================
    // url manager
    // =========================================================================
    core.url = core.createClass({

        init : function() {
            this.load();
        },

        load : function() {
            this.parameters = {};
            var parameterString = window.location.search.substring(1);
            var parameters = parameterString.split("&");
            for ( var i = 0; i < parameters.length; i++) {
                if (parameters[i].length === 0) {
                    continue;
                }
                var pair = parameters[i].split("=");
                var name = this.decode(pair[0]);
                var value = this.decode(pair[1]);
                this.parameters[name] = value;
            }
        },

        parameter : function(name, value) {
            if (arguments.length === 1) {
                return this.parameters[name];
            } else {
                this.parameters[name] = value;
            }
            return this;
        },

        parameterJSON : function(name, value) {
            if (arguments.length === 1) {
                var value2 = this.parameters[name];
                if (typeof value2 === 'undefined') {
                    return value2;
                }
                return JSON.parse(value2);
            } else {
                this.parameters[name] = JSON.stringify(value);
            }
            return this;
        },

        submit : function() {
            var parameterString = "";
            var first = true;
            for ( var parameterName in this.parameters) {
                if (first) {
                    first = false;
                } else {
                    parameterString += "&";
                }
                var nameString = this.encode(parameterName);
                var valueString = this.encode(this.parameters[parameterName]);
                parameterString += nameString + "=" + valueString;
            }
            var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            newUrl += "?" + parameterString;
            window.history.pushState("dummy", "Title", newUrl);
        },

        encode : function(text) {
            return encodeURIComponent(text);
        },

        decode : function(text) {
            return decodeURIComponent(text.replace(/\+/g, " "));
        }

    });

    // =========================================================================
    // save selection
    // =========================================================================
    core.saveSelection = function() {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var ranges = [];
                for ( var i = 0, len = sel.rangeCount; i < len; ++i) {
                    ranges.push(sel.getRangeAt(i));
                }
                return ranges;
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    };

    // =========================================================================
    // restore selection
    // =========================================================================
    core.restoreSelection = function(savedSel) {
        if (savedSel) {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                for ( var i = 0, len = savedSel.length; i < len; ++i) {
                    sel.addRange(savedSel[i]);
                }
            } else if (document.selection && savedSel.select) {
                savedSel.select();
            }
        }
    };

        

    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    (function(){
      var cache = {};
     
      core.tmpl = function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            tmpl(document.getElementById(str).innerHTML) :
         
          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
           
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
           
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");
       
        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
      };
    })();


})(this);
