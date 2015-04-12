(function (global) {
    "use strict";

    /* global window */
    /* global document */
    /* global alert */
    /* global $ */
    /* global location */
    /* global setTimeout */
    /* global console */

    // =========================================================================
    // packages
    // =========================================================================
    global.mero.edit = {};
    var edit = global.mero.edit;
    var core = global.mero.core;
    var commands = global.mero.commands;

    // =========================================================================
    // editor
    // =========================================================================
    edit.editor = core.createClass({

        // ---------------------------------------------------------------------
        // init
        // ---------------------------------------------------------------------
        init: function (parent) {

            // create main container
            var self = this;
            this.containerDiv = $(parent);

            // outline style
            self.outlineFocus = "1px dashed red";

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
            this.commandInput = $("<input class='span2' type='text' style='margin-right:10px;width:100px;'></input>");
            this.inputForm.append(this.commandInput);
            this.commandInput.keydown(function (event) {
                self.handleCommandInputKey(event);
            });

            // autocomplete for command input field
            this.autocompleteList = [];
            this.commandInput.autocomplete({
                source: function () {
                    self.autocomplete.apply(self, arguments);
                }
            });

            // create css status field
            this.cssInput = $("<input class='span2' type='text' style='width:50px;'></input>");
            this.inputForm.append(this.cssInput);
            this.cssInput.keydown(function (event) {
                self.handleCssInputKey(event);
            });

            // toolbar status field
            this.statusSpan = $("<span class='' style='width:800px;float:left;margin-top:10px'>DIV</span>");
            this.toolbarDiv.append(this.statusSpan);

            // toolbar buttons
            //this.createButtons(this.toolbarDiv);

            // invisible text input for capturing clipboard content without html tags
            this.clipboardTextArea = $("<textarea></textarea>");
            this.clipboardTextArea.css("display", "none");
            this.containerDiv.append(this.clipboardTextArea);

            // invisible contenteditable div for capturing clipboard content with html tags
            this.clipboardTextAreaHtml = $("<div contenteditable='true'></div>");
            this.clipboardTextAreaHtml.css("display", "none");
            this.containerDiv.append(this.clipboardTextAreaHtml);

            // create content
            this.contentDiv = $("<div tabindex=1 class='jse-content container'></div>");
            this.containerDiv.append(this.contentDiv);

            // assign event handlers for all elements in content
            this.relevantElements = commands.relevantElements;

            // command stack
            self.commandStack = [];

            // check for custom css stylesheet
            var css = core.url().parameter("css");
            if (css) {
                core.loadStyleSheet(css);
            }

            // check for custom less stylesheet
            var less = core.url().parameter("less");
            if (less) {
                core.loadStyleSheet(less);
            }

            // load page           
            var pageName = core.url().parameter("page");
            if (pageName) {
                self.loadPage(pageName);
            } else {
                this.createDefaultContent();
            }

        },

        // ---------------------------------------------------------------------
        // create default content
        // ---------------------------------------------------------------------
        createDefaultContent: function () {
            this.contentDiv.empty();
            this.contentDiv.append($("<h1 tabindex=1 contenteditable='true'>Heading1</h1>"));
            this.assignHandlers(this.contentDiv);
            this.setElement(this.contentDiv.find("h1"));
        },

        // ---------------------------------------------------------------------
        // key events command input
        // ---------------------------------------------------------------------
        handleCommandInputKey: function (event) {
            var self = this;
            switch (event.keyCode) {
            case 13:
                event.preventDefault();
                // async needed if command is choosen from history (don't know why)
                setTimeout(function () {
                    self.executeCommandLine();
                    self.element.focus();
                }, 0);
                break;
            case 27:
                self.element.focus();
                break;
            }
        },

        // ---------------------------------------------------------------------
        // key events css status field
        // ---------------------------------------------------------------------
        handleCssInputKey: function (event) {
            var self = this;
            switch (event.keyCode) {
            case 13:
                event.preventDefault();
                var cssClasses = self.cssInput.val();
                self.element.attr("class", cssClasses);
                self.element.focus();
                break;
            case 27:
                self.element.focus();
                break;
            }
        },

        // ---------------------------------------------------------------------
        // create buttons
        // ---------------------------------------------------------------------
        createButtons: function (toolbar) {
            var self = this;
            var container = toolbar;
            var groups = {};
            $.each(commands, function (key, commandClass) {
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
                if (commandClass.prototype.charLabel) {
                    button.attr("title", commandClass.prototype.charLabel);
                } else if (commandClass.prototype.char) {
                    button.attr("title", "ALT+" + commandClass.prototype.char.toUpperCase());
                }
                group.append(button);
                button.click(function () {
                    if (prot.buttonTemplate) {
                        self.executeCommandLineInit();
                        self.commandInput.val(prot.buttonTemplate);
                    } else {
                        var command = new commandClass(self.createContext()); /* jshint ignore:line */
                        self.executeCommand(command);
                    }
                });

            });
        },

        // ---------------------------------------------------------------------
        // create command context
        // ---------------------------------------------------------------------
        createContext: function (obj) {
            return $.extend({
                element: this.element,
                copyElement: this.copyElement,
                editor: this
            }, obj);
        },

        // ---------------------------------------------------------------------
        // autocomplete
        // ---------------------------------------------------------------------
        autocomplete: function (input, cb) {
            var list = [];
            for (var i = 0; i < this.autocompleteList.length; ++i) {
                var term = this.autocompleteList[i];
                if (term.indexOf(input.term) === 0) {
                    list.push(term);
                }
            }
            cb(list);
        },

        // ---------------------------------------------------------------------
        // get character code from event
        // ---------------------------------------------------------------------
        getCharCode: function (event) {
            var key;
            if (event.keyCode !== 0) {
                key = event.keyCode;
            } else {
                key = event.charCode;
            }
            key = String.fromCharCode(key).toLowerCase().charCodeAt(0);
            return key;
        },

        // ---------------------------------------------------------------------
        // handle paste event
        // ---------------------------------------------------------------------
        handlePaste: function (event) {
            if (this.flagPasteHtml) {
                this.handlePasteHtml(event); // ctrl+y
                this.flagPasteHtml = false;
            } else {
                this.handlePasteText(event);
            }
        },

        // ---------------------------------------------------------------------
        // handle paste text
        // ---------------------------------------------------------------------
        handlePasteText: function (event) {
            var self = this;
            event.stopPropagation();
            core.getCaretPos();
            this.clipboardTextArea.css("display", "block");
            this.clipboardTextArea.val("");
            this.clipboardTextArea.focus();
            setTimeout(function () {
                self.element.focus();
                core.restoreCaretPos();
                document.execCommand("insertText", false, self.clipboardTextArea.val());
                self.clipboardTextArea.val("");
                self.clipboardTextArea.css("display", "none");
            }, 0);
        },

        // ---------------------------------------------------------------------
        // handle paste html
        // ---------------------------------------------------------------------
        handlePasteHtml: function (event) {
            var self = this;
            event.stopPropagation();
            this.clipboardTextAreaHtml.css("display", "block");
            this.clipboardTextAreaHtml.html("");
            this.clipboardTextAreaHtml.focus();
            setTimeout(function () {
                console.log(self.clipboardTextAreaHtml.html());
                var command = new commands.PasteHtmlCommand(self.createContext({
                    html: self.clipboardTextAreaHtml.html()
                }));
                self.executeCommand(command);
                self.clipboardTextAreaHtml.html("");
                self.clipboardTextAreaHtml.css("display", "none");
            }, 0);
        },

        // ---------------------------------------------------------------------
        // handle key events of html elements
        // ---------------------------------------------------------------------
        handle: function (element, event) {

            var self = this;
            //self.element = $(element);
            var command;
            var key = null;

            if (event.ctrlKey && event.keyCode !== 17) {

                //. 1 CTRL KEY
                // -------------------------------------------------------------

                key = self.getCharCode(event);
                if (key === 118) {
                    self.handlePaste(event);
                } else if (key === 121) {
                    event.stopPropagation();
                    self.flagPasteHtml = !self.flagPasteHtml;
                }

            } else if (event.altKey && event.keyCode !== 18) {

                // 2. ALT KEY
                // -------------------------------------------------------------                

                // get command by key
                key = self.getCharCode(event);
                var commandClass = commands.commandByKey[key];
                if (!commandClass) {
                    return;
                }

                // create command
                command = new commandClass(self.createContext()); /* jshint ignore:line */

                // execute command
                self.executeCommand(command);

                // prevent default and return
                event.stopPropagation();
                event.preventDefault();
                return;

            } else {

                // 3. OTHERS
                // -------------------------------------------------------------
                switch (event.keyCode) {
                case 'dummy':
                    break;
                case 27:
                    event.stopPropagation();
                    event.preventDefault();
                    this.executeCommandLineInit();
                    break;
                case 9:
                    event.stopPropagation();
                    event.preventDefault();
                    break;
                }
            }

        },

        // ---------------------------------------------------------------------
        // execute command
        // ---------------------------------------------------------------------
        executeCommand: function (command, pushOnStack) {

            // execute command
            try {
                if (command.setParameters) {
                    command.setParameters();
                }
                command.execute();
            } catch (e) {
                alert(e);
                return;
            }

            // if undo is immpossible -> return
            if (command.undo === commands.Command.prototype.undo) {
                return;
            }

            // check whether command shall be pushed
            if (arguments.length >= 2 && !pushOnStack) {
                return;
            }

            // put command on command stack (for undo)
            this.commandStack.push(command);

        },

        // ---------------------------------------------------------------------
        // check for parent element with contenteditable = true
        // ---------------------------------------------------------------------
        checkForParentContentEditable: function (element) {

            if (!element || element.length === 0) return element;

            var parent = element;
            while (true) {
                parent = parent.parent();
                if (parent.length === 0) {
                    return element;
                }
                if (parent.attr('contenteditable') === 'true') {
                    return parent;
                }
            }
        },

        // ---------------------------------------------------------------------
        // set current focus element
        // ---------------------------------------------------------------------
        setElement: function (element) {
            var self = this;

            element = self.checkForParentContentEditable(element);

            if (element && element.length > 0) {
                if (self.element) {
                    self.element.css("outline", "0");
                }
                self.element = element;
                var path = self.getPath();
                self.statusSpan.text(path);
                self.statusSpan.attr("title", path);
                self.cssInput.val(self.getCss());
            }

            if (self.element.length > 0) {
                self.element.focus();
                self.element.css("outline", self.outlineFocus);
                if (self.element.get(0).tagName === 'IMG') {
                    self.element.one('load', function () {
                        self.element.focus();
                        self.element.css("outline", self.outlineFocus);
                    });
                }
                if (self.element.attr("contenteditable") === "true") {
                    if (self.element.text() === "") {
                        self.element.text(self.element.get(0).tagName.toLowerCase());
                        core.selectText(self.element.get(0));
                        self.element.focus();
                        self.element.css("outline", self.outlineFocus);
                    }
                } else {
                    //if(self.element.get(0).tagName === 'SPAN' || self.element.text()===""){
                    if (self.element.children().length === 0) {
                        var editableElement = $(commands.editableElement);
                        editableElement.text("span");
                        self.element.append(editableElement);
                        self.assignHandlers(self.element);
                        self.element.focus();
                        self.element.css("outline", self.outlineFocus);
                    }
                }
                var coords = self.element.offset();
                var x = coords.left;
                var y = coords.top - 100;
                window.scrollTo(x, y);
            }

        },

        // ---------------------------------------------------------------------
        // get css classes of focus element
        // ---------------------------------------------------------------------
        getCss: function () {
            return this.element.attr("class");
        },

        // ---------------------------------------------------------------------
        // get dom path of focus element
        // ---------------------------------------------------------------------
        getPath: function () {
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
        executeCommandLineInit: function () {
            var self = this;
            self.commandInput.focus();
            self.commandInput.val("");
        },

        // ---------------------------------------------------------------------
        // execute command line
        // ---------------------------------------------------------------------
        executeCommandLine: function () {

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
            var command = new commandClass(self.createContext({ /* jshint ignore:line */
                parameters: parameters
            }));

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

        // --------------------------------------------------------------------
        // load page
        // ---------------------------------------------------------------------
        loadPage: function (pageName) {
            var self = this;
            if (!pageName) {
                pageName = core.url().parameter("page");
                if (!pageName) {
                    pageName = "default";
                }
            }
            $.ajax({
                url: pageName + ".html",
                success: function (data) {


                    // clear old content
                    self.contentDiv.empty();

                    // append new content
                    self.contentDiv.append($(data));
                    self.assignHandlers(self.contentDiv);

                    // set focus to first contenteditable
                    setTimeout(function () {
                        var focusElement = $(".jse-content").find('[contenteditable="true"]');
                        focusElement = $(focusElement.get(0));
                        if (focusElement.length > 0) {
                            self.setElement(focusElement);
                        }
                    }, 10);

                    /*  setTimeout(function(){
                        jQuery.event.trigger({ type : 'keypress', which : 9 });
                    },2000);*/


                    // adjust url
                    core.url().parameter("page", pageName).submit();

                },
                dataType: 'text'
            }).error(function () {
                alert("Cannot load page '" + pageName + "' error:" + arguments[0].statusText);
            }).success(function () {
                self.commandStack = [];
                // alert("ok");
            });


        },

        // --------------------------------------------------------------------
        // save page
        // ---------------------------------------------------------------------
        savePage: function (pageName) {

            var self = this;

            // get content
            self.element.css("outline", "0");
            var content = this.contentDiv.html();
            self.element.css("outline", self.outlineFocus);

            // set pagename
            if (!pageName) {
                pageName = core.url().parameter("page");
                if (!pageName) {
                    pageName = "default";
                }
            }

            // save
            $.ajax({
                type: 'POST',
                url: pageName + ".html",
                data: content,
                processData: false,
                dataType: 'text'
            }).error(function () {
                alert("error:" + arguments[0].statusText);
            }).success(function () {
                core.url().parameter("page", pageName).submit();
                self.element.css("outline", self.outlineFocus);
                alert("Page '" + pageName + "' saved.");
            });

        },

        // --------------------------------------------------------------------
        // assignHandlers
        // ---------------------------------------------------------------------
        assignHandlers: function (node) {
            // node itself
            var filtered = node.filter(this.relevantElements);
            this.assignByElements(filtered);
            // childs of node
            this.assignByElements(node.find(this.relevantElements));
        },

        // --------------------------------------------------------------------
        // assign by elements
        // ---------------------------------------------------------------------
        assignByElements: function (elements) {
            var self = this;
            elements.off("keydown"); // keypress
            elements.keydown(function (event) { // keypress
                self.handle(this, event);
            });
            elements.off("click");
            elements.click(function (event) {
                if ($(this).hasClass("jse-content")) {
                    return;
                }
                self.setElement($(this));
                event.stopPropagation();
            });
            elements.filter("a").off("dblclick");
            elements.filter("a").dblclick(function () {
                var link = $(this).attr("href");
                self.navigate(link);
            });
            elements.filter("a").off("click");
            elements.filter("a").click(function () {
                var link = $(this).attr("href");
                self.navigate(link);
            });
        },

        // ---------------------------------------------------------------------
        // navigation
        // ---------------------------------------------------------------------
        navigate: function (url) {
            url = core.url({
                url: url
            });
            if (core.endsWith(url.pathname, "mero.html")) {
                var targetPage = url.parameter("page");
                this.loadPage(targetPage);
            } else {
                window.location = url;
            }
        },

        // ---------------------------------------------------------------------
        // make static
        // ---------------------------------------------------------------------
        makeStatic: function () {
            this.content.find("*").attr("contenteditable", false);
        },

        // ---------------------------------------------------------------------
        // save selection
        // ---------------------------------------------------------------------
        saveSelection: function () {
            this.selection = core.saveSelection();
        },

        // ---------------------------------------------------------------------
        // restore selection
        // ---------------------------------------------------------------------
        restoreSelection: function () {
            core.restoreSelection(this.selection);
        },

        // ---------------------------------------------------------------------
        // find sibling
        // ---------------------------------------------------------------------
        findSibling: function (element, type) {
            if (element.is(type)) {
                return element;
            }
            return element.parent(type);
        },

    });

}(this));