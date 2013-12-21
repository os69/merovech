(function (global) {

    "use strict";
    /*global window */
    /*global $  */
    /*global document */

    // =========================================================================
    // packages
    // =========================================================================
    global.mero = {};
    global.mero.core = {};
    var core = global.mero.core;

    // =========================================================================
    // helper: create object with prototype
    // =========================================================================
    core.object = function (prototype) {
        var TmpFunction = function () {};
        TmpFunction.prototype = prototype;
        return new TmpFunction();
    };

    // =========================================================================
    // helper: extend object
    // =========================================================================
    core.extend = function (o1, o2) {
        for (var key in o2) {
            o1[key] = o2[key];
        }
        return o1;
    };

    // =========================================================================
    // helper: generate constructor function
    // =========================================================================
    var generateConstructorFunction = function () {
        var ConstructorFunction = null;
        ConstructorFunction = function () {
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
    core.createClass = function (prototype) {
        var Cls = generateConstructorFunction();
        Cls.prototype = prototype;
        return Cls;
    };

    // =========================================================================
    // create derived class
    // =========================================================================
    core.createDerivedClass = function (parentClass, prototype) {
        var Cls = generateConstructorFunction();
        Cls.prototype = core.extend(core.object(parentClass.prototype), prototype);
        return Cls;
    };

    // =========================================================================
    // copy options
    // =========================================================================
    core.copyOptions = function (target, source) {
        for (var name in source) {
            if (source.hasOwnProperty(name)) {
                target[name] = source[name];
            }
        }
    },

    // =========================================================================
    // remove list2 elements from list1
    // =========================================================================
    core.removeElements = function (list1, list2) {
        for (var i = 0; i < list2.length; ++i) {
            var index = $.inArray(list2[i], list1);
            if (index >= 0) {
                list1.splice(index, 1);
            }
        }
    };

    // =========================================================================
    // name/value dialog
    // =========================================================================
    core.nameValueDialog = function (options, callback) {
        // construct html of dialog
        var content = $("<table></table>");
        for (var i = 0; i < options.fields.length; ++i) {
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
            buttons: [{
                text: "Ok",
                click: function () {
                    $(this).dialog("close");
                    callback();
                }
            }],
            title: options.title
            // width:"600px"
        });
    };

    // =========================================================================
    // create map from list
    // =========================================================================
    core.map = function (list, key) {
        var map = {};
        for (var i = 0; i < list.length; ++i) {
            var element = list[i];
            var keyValue = key(element);
            if (!keyValue) {
                continue;
            }
            map[keyValue] = element;
        }
        return map;
    };

    // =========================================================================
    // parse url
    // =========================================================================
    core.parseUrl = function (url) {
        var a = $('<a>', {
            href: url
        })[0];
        return {
            protocol: a.protocol,
            hostname: a.hostname,
            pathname: a.pathname,
            search: a.search,
            hash: a.hash
        };
    };

    // =========================================================================
    // get current url
    // =========================================================================
    core.getCurrentUrl = function (url) {
        return {
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash
        };
    };

    // =========================================================================
    // url manager
    // =========================================================================
    core.url = core.createClass({

        init: function (options) {
            if (!options) {
                $.extend(this,core.getCurrentUrl());
            } else {
                $.extend(this,core.parseUrl(options.url));
            }
            this.loadParameters();
        },

        loadParameters: function () {
            this.parameters = {};
            var parameterString = this.search.substring(1);
            var parameters = parameterString.split("&");
            for (var i = 0; i < parameters.length; i++) {
                if (parameters[i].length === 0) {
                    continue;
                }
                var pair = parameters[i].split("=");
                var name = this.decode(pair[0]);
                var value = this.decode(pair[1]);
                this.parameters[name] = value;
            }
            this.modified = false;
        },

        parameter: function (name, value) {
            if (arguments.length === 1) {
                return this.parameters[name];
            } else {
                if (value !== this.parameters[name]) {
                    this.parameters[name] = value;
                    this.modified = true;
                }
            }
            return this;
        },

        parameterJSON: function (name, value) {
            if (arguments.length === 1) {
                var value2 = this.parameters[name];
                if (typeof value2 === 'undefined') {
                    return value2;
                }
                return JSON.parse(value2);
            } else {
                var valueString = JSON.stringify(value);
                if (valueString !== this.parameters[name]) {
                    this.parameters[name] = valueString;
                    this.modified = true;
                }
            }
            return this;
        },

        submit: function () {
            if (!this.modified) {
                return;
            }
            var parameterString = "";
            var first = true;
            for (var parameterName in this.parameters) {
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
            this.modified = false;
        },

        encode: function (text) {
            return encodeURIComponent(text);
        },

        decode: function (text) {
            return decodeURIComponent(text.replace(/\+/g, " "));
        }

    });

    // =========================================================================
    // save selection
    // =========================================================================
    core.saveSelection = function () {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var ranges = [];
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
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
    core.restoreSelection = function (savedSel) {
        if (savedSel) {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                for (var i = 0, len = savedSel.length; i < len; ++i) {
                    sel.addRange(savedSel[i]);
                }
            } else if (document.selection && savedSel.select) {
                savedSel.select();
            }
        }
    };

    // =========================================================================
    // store cursor position
    // =========================================================================
    core.getCaretPos = function () {
        core.selRange = window.getSelection().getRangeAt(0);
    };

    // =========================================================================
    // restore cursor position
    // =========================================================================
    core.restoreCaretPos = function () {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selection.removeAllRanges();
            selection.addRange(core.selRange);
        }
    };

    // =========================================================================
    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    // =========================================================================
    (function () {
        var cache = {};

        core.tmpl = function tmpl(str, data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>")
                .join("p.push('").split("\r").join("\\'") + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
    })();

    // =========================================================================
    // select text of dom node
    // =========================================================================
    core.selectText = function (node) {
        var doc = document,
            range, selection;
        if (doc.body.createTextRange) { // ms
            range = doc.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) { // all others
            selection = window.getSelection();
            range = doc.createRange();
            range.selectNodeContents(node);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    // =========================================================================
    // name/value dialog
    // =========================================================================
    core.nameValueDialog = function (options, callback) {

        var oldFields = $.extend(true, [], options.fields);

        // append title
        var appendTitle = function (parentNode, field) {
            parentNode.append("<td colspan=2><span class='nvtitle'>" + field.title + "</span></td>");
        };

        // append input field
        var appendInputField = function (parentNode, field) {

            var nameCell = $("<td></td>");
            parentNode.append(nameCell);
            field.nameInputField = $("<input type='text'/>");
            field.nameInputField.val(field.name);
            nameCell.append(field.nameInputField);

            var valueCell = $("<td></td>");
            parentNode.append(valueCell);
            field.valueInputField = $("<input type='text'/>");
            field.valueInputField.val(field.value);
            valueCell.append(field.valueInputField);

            var removeCell = $("<td></td>");
            parentNode.append(removeCell);
            var button = $("<button>Remove</button>");
            button.click(function () {
                parentNode.remove();
                core.removeElements(options.fields, [field]);
            });
            removeCell.append(button);

        };

        // construct html of dialog
        var content = $("<div></div>");
        var table = $("<table style='margin-top:10px'></table>");
        content.append(table);
        for (var i = 0; i < options.fields.length; ++i) {
            var field = options.fields[i];
            var row = $("<tr></tr>");
            table.append(row);
            if (field.title) {
                appendTitle(row, field);
            } else {
                appendInputField(row, field);
            }
        }
        var addButton = $("<button>Add</button>");
        content.append(addButton);
        addButton.click(function () {
            var field = {
                name: 'new',
                value: 'value'
            };
            options.fields.push(field);
            var row = $("<tr></tr>");
            table.append(row);
            appendInputField(row, field);
        });

        var calculateDelta = function (oldFields, newFields) {
            var delta = {
                addedFields: [],
                deletedFields: [],
                changedFields: []
            };
            var oldMap = core.map(oldFields, function (field) {
                return field.name;
            });
            var newMap = core.map(newFields, function (field) {
                return field.name;
            });
            for (var i = 0; i < newFields.length; ++i) {
                var newField = newFields[i];
                var oldField = oldMap[newField.name];
                if (!oldField) {
                    delta.addedFields.push({
                        name: newField.name,
                        value: newField.value
                    });
                } else {
                    if (oldField.value !== newField.value) {
                        delta.changedFields.push({
                            name: newField.name,
                            oldValue: oldField.value,
                            newValue: newField.value
                        });
                    }
                }
            }
            for (var i = 0; i < oldFields.length; ++i) {
                var oldField = oldFields[i];
                var newField = newMap[oldField.name];
                if (!newField) {
                    delta.deletedFields.push({
                        name: oldField.name,
                        value: oldField.value
                    });
                }
            }
            return delta;
        };

        // dialog widget
        content.dialog({
            buttons: [{
                text: "Ok",
                click: function () {
                    // transfer values from input fields to object
                    for (var i = 0; i < options.fields.length; ++i) {
                        var field = options.fields[i];
                        field.name = field.nameInputField.val();
                        field.value = field.valueInputField.val();
                    }
                    // delta
                    this.delta = calculateDelta(oldFields, options.fields);
                    // close dialog
                    $(this).dialog("close");
                }
            }],
            close: function () {
                callback(this.delta);
            },
            title: options.title,
            width: 600
        });
    };

    // =========================================================================
    // endsWith
    // =========================================================================
    core.endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // =========================================================================
    // startsWith
    // =========================================================================
    core.startsWith = function (str, prefix) {
        return str.indexOf(prefix) === 0;
    };

    // =========================================================================
    // load stylesheet
    // =========================================================================
    core.loadStyleSheet = function (name) {

        var rel = "stylesheet";
        if (core.endsWith(name, ".less")) {
            rel = "stylesheet/less";
        }

        var link = $("<link>");
        link.attr({
            type: 'text/css',
            rel: rel,
            href: name
        });
        $("head").append(link);

        if (core.endsWith(name, ".less")) {
            less.sheets.push(link.get(0));
            less.refresh();
        }
    };

})(this);