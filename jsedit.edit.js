(function(global) {
    "use strict";

    /*global window */
    /*global document */
    /*global alert */
    /*global $ */
    /*global location */

    // =========================================================================
    // packages
    // =========================================================================
    global.jsedit.edit = {};
    var edit = global.jsedit.edit;
    var core = global.jsedit.core;
    var bindings = global.jsedit.bindings;

    // =========================================================================
    // create maps for accessing bindings by key or by name
    // =========================================================================
    edit.commandBindingsKeyMap = core.map(bindings.commandBindingsList, function(binding) {
        return binding.key;
    });

    edit.commandBindingsNameMap = core.map(bindings.commandBindingsList, function(binding) {
        return binding.commandClass.prototype.name;
    });

    // =========================================================================
    // editor
    // =========================================================================
    edit.editor = core.createClass({

        // ---------------------------------------------------------------------
        // init
        // ---------------------------------------------------------------------
        init : function(parent) {

            // create container
            var self = this;
            this.container = $(parent);

            // create navbar
            this.navbar = $("<div class='navbar navbar-fixed-top'></div>");
            this.container.append(this.navbar);
            this.toolbar = $("<div class='navbar-inner'></div>");
            this.navbar.append(this.toolbar);

            // create brand
            this.toolbar.append('<a class="brand" href="#">Merovech</a>');

            // create form for in command and css input field
            this.inputForm = $('<form class="navbar-form pull-left" style="margin-right:10px"></form>');
            this.toolbar.append(this.inputForm);

            // create command input field
            this.command = $("<input class='span2' type='text' style='margin-right:10px'></input>");
            this.inputForm.append(this.command);

            // assign even handler for command input field
            this.command.keydown(function(event) {
                switch (event.keyCode) {
                case 13:
                    event.preventDefault();
                    self.executeCommandLine();
                    break;
                case 27:
                    self.restoreSelection();
                    self.element.focus();
                    break;
                }
            });

            // create css status field
            this.cssStatus = $("<input class='span2' type='text'></input>");
            this.inputForm.append(this.cssStatus);

            this.cssStatus.keydown(function(event) {
                switch (event.keyCode) {
                case 13:
                    event.preventDefault();
                    var cssClasses = self.cssStatus.val();
                    self.element.attr("class", cssClasses);
                    break;
                case 27:
                    break;
                }
            });

            // toolbar status field
            this.status = $("<span class='' style='width:200px;float:left;margin-top:10px'>DIV</span>");
            this.toolbar.append(this.status);

            // toolbar buttons
            this.createButtons(this.toolbar);

            // autocomplete for command input field
            this.autocompleteList = [];
            this.command.autocomplete({
                source : function() {
                    self.autocomplete.apply(self, arguments);
                }
            });

            // create content
            this.content = $("<div tabindex=1 class='jse-content container'></div>");
            this.container.append(this.content);
            this.content.append($("<h1 tabindex=1 contenteditable='true'>Heading1</h1>"));

            // assign event handlers for all elements in content
            this.relevantElements = "ul, ol, li, div, pre, p, h1, h2, h3, input, img, table, tbody, tr, td, a, span, b";
            this.assignHandlers(this.content);

            // load page
            var pageName = core.url().parameter("page");
            if (pageName) {
                self.loadPage(pageName);
            }

            self.commandStack = [];
        },

        // ---------------------------------------------------------------------
        // create buttons
        // ---------------------------------------------------------------------
        createButtons : function(toolbar) {
            var self = this;
            //var container = $("<div class='btn-toolbar'></div>");
            //toolbar.append(container);
            var container = toolbar;
            $.each(bindings.commandBindings, function() {
                var group = this;
                var groupContainer = $("<div class='btn-group'></div>");
                container.append(groupContainer);
                $.each(group.bindings, function() {
                    var commandBinding = this;
                    if (commandBinding.button !== undefined && !commandBinding.button) {
                        return;
                    }
                    var button = $("<button class='btn'>" + commandBinding.commandClass.prototype.name + "</button>");
                    if (commandBinding.keyLabel) {
                        button.attr("title", "Control+" + commandBinding.keyLabel);
                    } else if (commandBinding.key) {
                        button.attr("title", "Control+" + String.fromCharCode(commandBinding.key).toUpperCase());
                    }
                    groupContainer.append(button);
                    button.click(function() {
                        if (commandBinding.template) {
                            self.executeCommandLineInit();
                            self.command.val(commandBinding.template);
                        } else {
                            var command = new commandBinding.commandClass(self.createContext());
                            self.executeCommand(command);
                        }
                    });

                });
            });
        },

        // ---------------------------------------------------------------------
        // create command context
        // ---------------------------------------------------------------------
        createContext : function() {
            return {
                element : this.element,
                editor : this
            };
        },

        // ---------------------------------------------------------------------
        // autocomplete
        // ---------------------------------------------------------------------
        autocomplete : function(input, cb) {
            var list = [];
            for ( var i = 0; i < this.autocompleteList.length; ++i) {
                var term = this.autocompleteList[i];
                if (term.indexOf(input.term) === 0) {
                    list.push(term);
                }
            }
            cb(list);
        },

        // ---------------------------------------------------------------------
        // handle
        // ---------------------------------------------------------------------
        handle : function(element, event) {

            var self = this;
            self.element = $(element);
            var command;

            event.stopPropagation();

            if (event.ctrlKey && event.keyCode !== 17) {
                // 1 CTRL KEY

                var key = null;
                if (event.keyCode !== 0) {
                    key = event.keyCode;
                } else {
                    key = event.charCode;
                }
                key = String.fromCharCode(key).toLowerCase().charCodeAt(0);

                // new commands
                var commandBinding = edit.commandBindingsKeyMap[key];
                if (commandBinding) {

                    // create command
                    command = new commandBinding.commandClass(self.createContext());

                    // execute command
                    self.executeCommand(command);

                    event.preventDefault();
                    return;
                }

            } else {
                // 2. NO CTRL KEY
                switch (event.keyCode) {
                case 'dummy':
                    this.executeCommandLineInit();
                    this.command.val("delete");
                    break;
                case 27:
                    event.preventDefault();
                    this.executeCommandLineInit();
                    break;
                }
            }

        },

        // ---------------------------------------------------------------------
        // execute command
        // ---------------------------------------------------------------------
        executeCommand : function(command) {
            this.commandStack.push(command);
            command.execute();
        },

        // ---------------------------------------------------------------------
        // set current focus element
        // ---------------------------------------------------------------------
        setElement : function(element) {
            var self = this;

            if (element && element.length > 0) {
                self.element = element;
                self.status.text(self.getPath());
                self.cssStatus.val(self.getCss());
            }

            if (self.element.length > 0) {

                self.element.focus();
                if (self.element.get(0).tagName === 'IMG') {
                    self.element.one('load', function() {
                        self.element.focus();
                    });
                }
                //if(self.element.get(0).tagName.toUpperCase()==='SPAN' && self.element.text()===''){
                if (self.element.text() === '' && self.element.attr("contenteditable") === "true") {

                    self.element.text(self.element.get(0).tagName.toLowerCase());
                    selectText(self.element.get(0));
                    //var sel = window.getSelection();
                    //var range = sel.getRangeAt(0);
                    //var range = document.createRange();
                    //range.selectNodeContents(self.element.get(0));                   
                    self.element.focus();
                    //setTimeout(function(){
                    //    self.element.text("");
                    //},0);
                }
            }

        },

        // ---------------------------------------------------------------------
        // get css classes of focus element
        // ---------------------------------------------------------------------
        getCss : function() {
            return this.element.attr("class");
        },

        // ---------------------------------------------------------------------
        // get dom path of focus element
        // ---------------------------------------------------------------------
        getPath : function() {
            var path = [];
            var element = this.element;
            var hasParent = true;
            while (hasParent) {
                if (element.hasClass("jse-content")) {
                    hasParent = false;
                    continue;
                }
                path.push(element.get(0).tagName);
                element = element.parent();
                if (element.length === 0) {
                    hasParent = false;
                }
            }
            path.reverse();
            return path.join("->");
        },

        // ---------------------------------------------------------------------
        // execute command line init
        // ---------------------------------------------------------------------
        executeCommandLineInit : function() {
            var self = this;
            //setTimeout(function(){
            self.saveSelection();
            self.command.focus();
            self.command.val("");
            //},0);
        },

        // ---------------------------------------------------------------------
        // execute command line
        // ---------------------------------------------------------------------
        executeCommandLine : function() {

            // split command line into parts
            var self = this;
            var commandLine = self.command.val();
            var parts = commandLine.split(" ");

            // extract command name
            if (parts.length < 1) {
                return;
            }
            var commandName = parts[0];

            // get command binding
            var commandBinding = edit.commandBindingsNameMap[commandName];
            if (!commandBinding) {
                return;
            }

            // extract command parameters
            var parameters = parts.slice(1);

            // create command
            var context = self.createContext();
            var command;
            if (commandBinding.createCommandFromParameters) {
                command = commandBinding.createCommandFromParameters(context, parameters);
            } else {
                command = new commandBinding.commandClass(context);
            }

            // update history
            if (this.autocompleteList.indexOf(commandLine) === -1) {
                this.autocompleteList.push(commandLine);
            }

            // clear command line
            self.command.focus();
            self.command.val("");

            // resore selection
            self.restoreSelection();
            
            // and execute
            self.executeCommand(command);

        },

        // ---------------------------------------------------------------------
        // execute command
        // ---------------------------------------------------------------------
        executeCommandOld : function() {
            var self = this;
            var commandString = self.command.val();
            var commands = commandString.split(" ");
            var newElement = null;
            switch (commands[0]) {
            case 'table':
                var e = $("<table tabindex=1 ><tbody tabindex=1><tr tabindex=1><td tabindex=1><div tabindex=1 contenteditable='true'>x</div></td></tr></tbody></table>");
                self.assignHandlers(e);
                this.element.after(e);
                newElement = e;
                break;
            case 'tr':
                e = $("<tr tabindex=1><td tabindex=1><div tabindex=1 contenteditable='true'>x</div></td></tr>");
                this.assignHandlers(e);
                this.element.after(e);
                newElement = e;
                break;
            case 'td':
                e = $("<td tabindex=1><div tabindex=1 contenteditable='true'>x</div></td>");
                this.assignHandlers(e);
                this.element.after(e);
                newElement = e;
                break;
            default:
                return;
            }
            if (this.autocompleteList.indexOf(commandString) === -1) {
                this.autocompleteList.push(commandString);
            }
            this.command.val("");
            if (newElement && newElement.length > 0) {
                self.element = newElement;
                self.status.text(self.element.get(0).tagName);
            }
            self.element.focus();
        },

        // --------------------------------------------------------------------
        // load page
        // ---------------------------------------------------------------------
        loadPage : function(pageName) {
            var self = this;
            if (!pageName) {
                pageName = core.url().parameter("page");
                if (!pageName) {
                    pageName = "default";
                }
            }
            $.ajax({
                url : pageName + ".html",
                success : function(data) {
                    self.content.empty();
                    self.content.append($(data));
                    self.assignHandlers(self.content);
                },
                dataType : 'text'
            }).error(function() {
                alert("error:" + arguments[0].statusText);
            }).success(function() {
                // alert("ok");
            });
            core.url().parameter("page", pageName).submit();
            //$(".jse-content").focus();
        },

        // --------------------------------------------------------------------
        // save page
        // ---------------------------------------------------------------------
        savePage : function(pageName) {
            var content = this.content.html();
            if (!pageName) {
                pageName = core.url().parameter("page");
                if (!pageName) {
                    pageName = "default";
                }
            }
            $.ajax({
                type : 'POST',
                url : pageName + ".html",
                data : content,
                processData : false,
                dataType : 'text'
            }).error(function() {
                alert("error:" + arguments[0].statusText);
            }).success(function() {
                core.url().parameter("page", pageName).submit();
                alert("ok");
            });

        },

        // --------------------------------------------------------------------
        // assignHandlers
        // ---------------------------------------------------------------------
        assignHandlers : function(node) {
            // node itself
            var filtered = node.filter(this.relevantElements);
            this.assignByElements(filtered);
            // childs of node
            this.assignByElements(node.find(this.relevantElements));
        },

        // --------------------------------------------------------------------
        // assign by elements
        // ---------------------------------------------------------------------
        assignByElements : function(elements) {
            var self = this;
            elements.off("keydown"); // keypress
            elements.keydown(function(event) { // keypress
                self.handle(this, event);
            });
            elements.off("click");
            elements.click(function(event) {
                if ($(this).hasClass("jse-content")) {
                    return;
                }
                self.setElement($(this));
                event.stopPropagation();
            });
            elements.filter("a").off("dblclick");
            elements.filter("a").dblclick(function() {
                // window.location.href = $(this).attr("href");
                var link = $(this).attr("href");
                window.location = link;
            });
            elements.filter("a").off("click");
            elements.filter("a").click(function() {
                // window.location.href = $(this).attr("href");
                var link = $(this).attr("href");
                window.location = link;
            });

        },

        // ---------------------------------------------------------------------
        // make static
        // ---------------------------------------------------------------------
        makeStatic : function() {
            this.content.find("*").attr("contenteditable", false);
        },

        // ---------------------------------------------------------------------
        // save selection
        // ---------------------------------------------------------------------
        saveSelection : function() {
            this.selection = core.saveSelection();
        },

        // ---------------------------------------------------------------------
        // restore selection
        // ---------------------------------------------------------------------
        restoreSelection : function() {
            core.restoreSelection(this.selection);
        },

        // ---------------------------------------------------------------------
        // find sibling
        // ---------------------------------------------------------------------
        findSibling : function(element, type) {
            if (element.is(type)) {
                return element;
            }
            return element.parent(type);
        },

    });

    function selectText(text) {
        var doc = document

        , range, selection;
        if (doc.body.createTextRange) { //ms
            range = doc.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) { //all others
            selection = window.getSelection();
            range = doc.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
}(this));
