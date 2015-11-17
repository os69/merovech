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
    // bootstrap
    // =========================================================================
    edit.bootstrap1 = function () {

        // load config
        var request = new window.XMLHttpRequest();
        request.open('GET', 'meroconfig.js', false);
        request.send(null);
        if (request.status !== 200)
            throw "HTTP GET failed:" + 'meroconfig.js';
        var configText = request.responseText;

        // eval config
        var config;
        eval(configText); // jshint ignore:line
        edit.config = config;
        if (edit.config.header) {
            core.loadHtml(edit.config.header);
        }

    };

    edit.bootstrap2 = function () {
        commands.bootstrap();
    };

    // =========================================================================
    // navigation stack
    // =========================================================================
    edit.NavStack = core.createClass({

        init: function () {
            this.elements = [];
            this.index = -1;
        },

        clear: function () {
            this.elements = [];
            this.index = -1;
        },

        reorg: function () {
            if (this.elements.length === 0) {
                return;
            }
            var i, element;
            // check elements < index
            for (i = 0; i < this.index; ++i) {
                element = this.elements[i];
                if (document.contains(element[0])) {
                    continue;
                } else {
                    this.elements.splice(i, 1);
                    i--;
                    this.index--;
                }
            }
            // check elements >=index
            for (i = this.index; i < this.elements.length; ++i) {
                element = this.elements[i];
                if (document.contains(element[0])) {
                    continue;
                } else {
                    if (i === this.index) {
                        this.elements.splice(i, Infinity);
                        this.index = this.elements.length - 1;
                        return;
                    }
                    this.elements.splice(i, 1);
                    i--;
                }
            }

        },

        navigate: function (element) {
            this.reorg();
            if (this.elements.length === 0) {
                this.elements.push(element);
                this.index = 0;
                return;
            }
            var current = this.elements[this.index];
            if (current === element) {
                return;
            }
            this.elements.splice(this.index + 1, Infinity);
            this.elements.push(element);
            this.index++;
        },

        back: function () {
            if (this.index < 1) {
                return null;
            }
            this.index--;
            return this.elements[this.index];
        },

        forward: function () {
            if (this.index > this.elements.length - 2) {
                return null;
            }
            this.index++;
            return this.elements[this.index];
        }

    });

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
            this.navbarDiv = $("<div class='meroNavbar'></div>");
            this.containerDiv.append(this.navbarDiv);

            // create brand
            this.navbarDiv.append('<a class="meroBrand" href="help.html">Merovech</a>');

            // create command input field
            this.commandInput = $("<input class='meroCommand' type='text'></input>");
            this.navbarDiv.append(this.commandInput);
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
            this.cssInput = $("<input  class='meroCSS' type='text'></input>");
            this.navbarDiv.append(this.cssInput);
            this.cssInput.keydown(function (event) {
                self.handleCssInputKey(event);
            });

            // status field
            this.statusSpan = $("<span class='meroStatus'>DIV</span>");
            this.navbarDiv.append(this.statusSpan);

            // buttons
            this.buttonsArea = $("<span class='meroButtons'></span>");
            this.navbarDiv.append(this.buttonsArea);

            // buttons
            this.createButtons(this.buttonsArea);

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

            // navigation stack
            this.navStack = new edit.NavStack();

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
                if (!edit.config || !edit.config.visibleButtonGroups || !edit.config.visibleButtonGroups[prot.buttonGroup]) {
                    return;
                }
                var group = groups[prot.buttonGroup];
                if (!group) {
                    group = $("<span class='meroButttonGroup'></span>");
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

            // do we have a new element?
            if (!element || element.length === 0) {
                return;
            }

            // remove outline from old element
            if (self.element) {
                self.element.css("outline", "0");
            }

            // delayed focus for images
            if (element.get(0).tagName === 'IMG') {
                element.one('load', function () {
                    element.focus();
                    element.css("outline", self.outlineFocus);
                });
            }

            if (element.attr("contenteditable") === "true") {
                // conteneditable with no text -> fill default text
                if (element.text() === "") {
                    element.text(element.get(0).tagName.toLowerCase());
                    core.selectText(element.get(0));
                }
            } else {
                var tagName = element.get(0).tagName;
                if (['IMG'].indexOf(tagName) < 0) {
                    if (element.children().length === 0) {
                        // no contenteditable and no children -> create default child
                        var editableElement = $(commands.editableElement);
                        editableElement.text("span");
                        element.append(editableElement);
                        element = editableElement;
                        self.assignHandlers(element);
                    }
                }
            }

            // set new element
            self.element = element;

            // set focus 
            self.setFocus();

            // draw outline
            self.element.css("outline", self.outlineFocus);

            // add element to nav stack
            this.navStack.navigate(self.element);

            // scroll window
            self.scrollWindow();

            // update toolbar
            self.updateToolbar();

        },

        // ---------------------------------------------------------------------
        // set focus
        // ---------------------------------------------------------------------
        setFocus: function () {
            var self = this;
            if (self.element.attr("contenteditable") === "true") {
                self.element.focus();
            } else {
                var childContentEditables = self.element.find('[contenteditable=true]');
                if (childContentEditables.length > 0) {
                    childContentEditables.get(0).focus();
                } else {
                    self.element.focus();
                }
            }
        },

        // ---------------------------------------------------------------------
        // update toolbar
        // ---------------------------------------------------------------------
        updateToolbar: function () {
            var self = this;
            var path = self.getPath();
            self.statusSpan.text(path);
            self.statusSpan.attr("title", path);
            self.cssInput.val(self.getCss());

        },

        // ---------------------------------------------------------------------
        // scroll window (avoid that focused element is hided by overlay toolbar)
        // ---------------------------------------------------------------------
        scrollWindow: function () {

            // margin
            var marginTop = this.navbarDiv.height() + 20;

            // get visible area (make a little bit smaller to ensure that element will be visible)
            var y1 = $(window).scrollTop() + marginTop;
            var y2 = $(window).scrollTop() + $(window).height() - 20;
            //var y2 = y1 + 400;

            // get position of current element
            var coords = this.element.offset();
            var x = coords.left;
            var y = coords.top;

            // adjust window scroll position to make element visible
            if (y < y1) {
                window.scrollTo(x, y - marginTop);
            }
            if (y > y2) {
                window.scrollTo(x, y - marginTop);
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

            // complete command name
            try {
                commandName = commands.completeParameter(commandName, commands.commandNames);
            } catch (e) {
                alert(e);
            }

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

                    // clear navigation
                    self.navStack.clear();

                    // append new content
                    self.contentDiv.append($(data));
                    self.assignHandlers(self.contentDiv);

                    // adjust url
                    core.url().parameter("page", pageName).submit();

                    // set focus to first contenteditable
                    setTimeout(function () {
                        var focusElement = $(".jse-content").find('[contenteditable="true"]');
                        focusElement = $(focusElement.get(0));
                        if (focusElement.length > 0) {
                            self.setElement(focusElement);
                        }
                    }, 10);

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
            var urlParsed = core.url({
                url: url
            });
            if (core.endsWith(urlParsed.pathname, "mero.html")) {
                var targetPage = urlParsed.parameter("page");
                this.loadPage(targetPage);
            } else {
                window.open(url, '_blank');
                //window.location = url;
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