(function(global) {
    "use strict";

    /* global window */
    /* global document */
    /* global alert */
    /* global $ */
    /* global location */

    // =========================================================================
    // packages
    // =========================================================================
    global.jsedit.edit = {};
    var edit = global.jsedit.edit;
    var core = global.jsedit.core;
    var commands = global.jsedit.commands;

    // =========================================================================
    // editor
    // =========================================================================
    edit.editor = core.createClass({

        // ---------------------------------------------------------------------
        // init
        // ---------------------------------------------------------------------
        init : function(parent) {

            // create main container
            var self = this;
            this.containerDiv = $(parent);

            // create navbar
            this.navbarDiv = $("<div class='navbar navbar-fixed-top'></div>");
            this.containerDiv.append(this.navbarDiv);
            this.toolbarDiv = $("<div class='navbar-inner'></div>");
            this.navbarDiv.append(this.toolbarDiv);

            // create brand
            this.toolbarDiv.append('<a class="brand" href="help.html">Merovech</a>');

            // create form (for commands and css status field)
            this.inputForm = $('<form class="navbar-form pull-left" style="margin-right:10px"></form>');
            this.toolbarDiv.append(this.inputForm);

            // create command input field
            this.commandInput = $("<input class='span2' type='text' style='margin-right:10px'></input>");
            this.inputForm.append(this.commandInput);
            this.commandInput.keydown(function(event) {
                self.handleCommandInputKey(event);
            });

            // autocomplete for command input field
            this.autocompleteList = [];
            this.commandInput.autocomplete({
                source : function() {
                    self.autocomplete.apply(self, arguments);
                }
            });

            // create css status field
            this.cssInput = $("<input class='span2' type='text'></input>");
            this.inputForm.append(this.cssInput);
            this.cssInput.keydown(function(event) {
                self.handleCssInputKey(event);
            });

            // toolbar status field
            this.statusSpan = $("<span class='' style='width:200px;float:left;margin-top:10px'>DIV</span>");
            this.toolbarDiv.append(this.statusSpan);

            // toolbar buttons
            this.createButtons(this.toolbarDiv);

            // create content
            this.contentDiv = $("<div tabindex=1 class='jse-content container'></div>");
            this.containerDiv.append(this.contentDiv);
            this.contentDiv.append($("<h1 tabindex=1 contenteditable='true'>Heading1</h1>"));            

            // assign event handlers for all elements in content
            this.relevantElements = "ul, ol, li, div, pre, p, h1, h2, h3, input, img, table, tbody, tr, td, a, span, b";
            this.assignHandlers(this.contentDiv);

            // load page
            var pageName = core.url().parameter("page");
            if (pageName) {
                self.loadPage(pageName);
            }else{
                this.setElement(this.contentDiv.find("h1"));
            }

            // command stack
            self.commandStack = [];
            
            // check for custom css stylesheet
            var css = core.url().parameter("css");
            if(css){
                core.loadStyleSheet(css);
            }
            
            // check for custom less stylesheet
            var less = core.url().parameter("less");
            if(less){
                core.loadStyleSheet(less);
            }

        },

        // ---------------------------------------------------------------------
        // key events command input
        // ---------------------------------------------------------------------
        handleCommandInputKey : function(event) {
            var self = this;
            switch (event.keyCode) {
            case 13:
                event.preventDefault();
                // async needed if command is choosen from history (don't know why)
                setTimeout(function(){
                    self.executeCommandLine();    
                },0);                
                break;
            case 27:
                self.element.focus();
                break;
            }
        },

        // ---------------------------------------------------------------------
        // key events css status field
        // ---------------------------------------------------------------------
        handleCssInputKey : function(event) {
            var self = this;
            switch (event.keyCode) {
            case 13:
                event.preventDefault();
                var cssClasses = self.cssInput.val();
                self.element.attr("class", cssClasses);
                break;
            case 27:
                self.element.focus();
                break;
            }
        },

        // ---------------------------------------------------------------------
        // create buttons
        // ---------------------------------------------------------------------
        createButtons : function(toolbar) {
            var self = this;
            // var container = $("<div class='btn-toolbar'></div>");
            // toolbar.append(container);
            var container = toolbar;
            var groups = {};
            $.each(commands, function(key, commandClass) {
                if (!commandClass.prototype || !commandClass.prototype.button || !commandClass.prototype.buttonGroup) {
                    return;
                }
                var prot = commandClass.prototype;
                var group = groups[prot.buttonGroup];
                if (!group) {
                    group = $("<div class='btn-group'></div>");
                    groups[prot.buttonGroup] = group;
                    container.append(group);
                }
                var button = $("<button class='btn'>" + prot.button + "</button>");
                if(commandClass.prototype.charLabel){
                    button.attr("title",commandClass.prototype.charLabel);
                }else if(commandClass.prototype.char){
                    button.attr("title","ALT+"+commandClass.prototype.char.toUpperCase());
                }
                group.append(button);
                button.click(function() {
                    if (prot.commandTemplate) {
                        self.executeCommandLineInit();
                        self.commandInput.val(prot.commandTemplate);
                    } else {
                        var command = new commandClass(self.createContext());
                        self.executeCommand(command);
                    }
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
        // handle key events of html elements
        // ---------------------------------------------------------------------
        handle : function(element, event) {

            var self = this;
            self.element = $(element);
            var command;
            event.stopPropagation();

            if (event.altKey && event.keyCode !== 18) {
                // 1 ALT KEY

                // get key of event
                var key = null;
                if (event.keyCode !== 0) {
                    key = event.keyCode;
                } else {
                    key = event.charCode;
                }
                key = String.fromCharCode(key).toLowerCase().charCodeAt(0);

                // get command by key
                var commandClass = commands.commandByKey[key];
                if (!commandClass) {
                    return;
                }

                // create command
                command = new commandClass(self.createContext());

                // execute command
                self.executeCommand(command);

                event.preventDefault();
                return;

            } else {
                // 2. NO ALT KEY
                switch (event.keyCode) {
                case 'dummy':
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
            
            // execute command
            try{
                command.execute();    
            }catch(e){
                alert(e);
                return;
            }
            
            // if undo is immpossible -> return
            if(command.undo===commands.Command.prototype.undo){
                return;
            }
            
            // put command on command stack (for undo)
            this.commandStack.push(command);
            
        },

        // ---------------------------------------------------------------------
        // set current focus element
        // ---------------------------------------------------------------------
        setElement : function(element) {
            var self = this;

            if (element && element.length > 0) {
                self.element = element;
                var path = self.getPath();
                self.statusSpan.text(path);
                self.statusSpan.attr("title",path);
                self.cssInput.val(self.getCss());
            }

            if (self.element.length > 0) {
                self.element.focus();
                if (self.element.get(0).tagName === 'IMG') {
                    self.element.one('load', function() {
                        self.element.focus();
                    });
                }
                if (self.element.attr("contenteditable") === "true") {
                    if(self.element.text()===""){
                        self.element.text(self.element.get(0).tagName.toLowerCase());
                        core.selectText(self.element.get(0));
                        self.element.focus();                        
                    }
                }else{
                    if(self.element.get(0).tagName === 'SPAN' && self.element.text()===""){
                        var editableElement = $(commands.editableElement);
                        editableElement.text("span");
                        self.element.append(editableElement);
                        self.assignHandlers(self.element);
                        self.element.focus();
                    }
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
            self.commandInput.focus();
            self.commandInput.val("");
        },

        // ---------------------------------------------------------------------
        // execute command line
        // ---------------------------------------------------------------------
        executeCommandLine : function() {

            // split command line into parts
            var self = this;
            var commandLine = self.commandInput.val();
            var parts = commandLine.split(" ");

            // extract command name
            if (parts.length < 1) {
                return;
            }
            var commandName = parts[0];

            // get command binding
            var commandClass = commands.commandByName[commandName];
            if (!commandClass) {
                return;
            }

            // extract command parameters
            var parameters = parts.slice(1);

            // create command
            var command = new commandClass(self.createContext());
            if (command.setParameters) {
                command.setParameters(parameters);
            }

            // update history
            if (this.autocompleteList.indexOf(commandLine) === -1) {
                this.autocompleteList.push(commandLine);
            }

            // clear command line
            self.commandInput.focus();
            self.commandInput.val("");

            // and execute
            self.executeCommand(command);

        },

        // ---------------------------------------------------------------------
        // execute command
        // ---------------------------------------------------------------------
        executeCommandOld : function() {
            var self = this;
            var commandString = self.commandInput.val();
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
            this.commandInput.val("");
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
                    
                    // clear old content
                    self.contentDiv.empty();
                    
                    // append new content
                    self.contentDiv.append($(data));
                    self.assignHandlers(self.contentDiv);
                    
                    // set focus to first contenteditable
                    var focusElement = $(".jse-content").find('[contenteditable="true"]');
                    focusElement = $(focusElement.get(0));
                    if(focusElement.length>0){
                        self.setElement(focusElement);
                    }
                    
                    // adjust url
                    core.url().parameter("page", pageName).submit();
                    
                },
                dataType : 'text'
            }).error(function() {
                alert("Cannot load page '"+pageName+"' error:" + arguments[0].statusText);
            }).success(function() {
                // alert("ok");
            });
            
            
        },

        // --------------------------------------------------------------------
        // save page
        // ---------------------------------------------------------------------
        savePage : function(pageName) {
            var content = this.contentDiv.html();
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

}(this));
