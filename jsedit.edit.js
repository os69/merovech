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
    var commands = global.jsedit.commands;

    // =========================================================================
    // save & restore selection
    // =========================================================================
    function saveSelection() {
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
    }

    function restoreSelection(savedSel) {
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
    }

    edit.commandBindings = [ {
        key : 38,
        commandClass : commands.PrevCommand
    }, {
        key : 40,
        commandClass : commands.NextCommand
    }, {
        key : 39,
        commandClass : commands.FirstChildCommand
    }, {
        key : 37,
        commandClass : commands.ParentCommand
    }, {
        key : 'd'.charCodeAt(0),
        commandClass : commands.DeleteCommand
    }, {
        key : 'c'.charCodeAt(0),
        commandClass : commands.CopyCommand
    }, {
        key : 'v'.charCodeAt(0),
        commandClass : commands.PasteCommand
    }, {
        key : 'x'.charCodeAt(0),
        commandClass : commands.CutCommand
    }, {
        key : 'u'.charCodeAt(0),
        commandClass : commands.UnOrderedListCommand
    }, {
        key : 'o'.charCodeAt(0),
        commandClass : commands.OrderedListCommand
    }, {
        key : 'i'.charCodeAt(0),
        commandClass : commands.ItemCommand
    }, {
        commandClass : commands.TextCommand
    }, {
        commandClass : commands.H1Command
    }, {
        commandClass : commands.H2Command
    }, {
        commandClass : commands.H3Command
    }, {
        commandClass : commands.DivCommand
    }, {
        commandClass : commands.PreCommand
    }, {
        commandClass : commands.StaticCommand
    }, {
        commandClass : commands.BoldCommand
    }, {
        commandClass : commands.LinkCommand,
        createCommandFromParameters : function(context, parameters) {
            if (parameters.length >= 1) {
                context.pageName = parameters[0];
            }
            return new this.commandClass(context);
        }
    }, {
        key : 's'.charCodeAt(0),
        commandClass : commands.SaveCommand,
        createCommandFromParameters : function(context, parameters) {
            if (parameters.length >= 1) {
                context.pageName = parameters[0];
            }
            return new this.commandClass(context);
        }
    }, {
        commandClass : commands.LoadCommand,
        createCommandFromParameters : function(context, parameters) {
            if (parameters.length >= 1) {
                context.pageName = parameters[0];
            }
            return new this.commandClass(context);
        }
    }, {
        commandClass : commands.ImageCommand,
        template : 'image <size> <name>',
        createCommandFromParameters : function(context, parameters) {
            if (parameters.length >= 1) {
                context.size = parameters[0];
            }
            if (parameters.length >= 2) {
                context.url = parameters[1];
            }
            return new this.commandClass(context);
        }
    } ];

    edit.commandBindingsKeyMap = core.map(edit.commandBindings, function(binding) {
        return binding.key;
    });

    edit.commandBindingsNameMap = core.map(edit.commandBindings, function(binding) {
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
            this.container = $("<div></div>");
            $(parent).append(this.container);

            // create toolbar
            this.toolbar = $("<div class='toolbar'></div>");
            this.container.append(this.toolbar);

            // create command input field
            this.command = $("<input size=80 type='text'></input>");
            this.toolbar.append(this.command);

            // assign even handler for command input field
            this.command.keydown(function(event) {
                switch (event.keyCode) {
                case 13:
                    self.executeCommandLine();
                    break;
                case 27:
                    self.restoreSelection();
                    self.element.focus();
                    break;
                }
            });

            // toolbar buttons
            this.createButtons(this.toolbar);

            // toolbar status field
            this.status = $("<div class='status'></div>");
            this.toolbar.append(this.status);

            // autocomplete for command input field
            this.autocompleteList = [];
            this.command.autocomplete({
                source : function() {
                    self.autocomplete.apply(self, arguments);
                }
            });

            // create content
            this.content = $("<div tabindex=1 class='jse-content'></div>");
            this.container.append(this.content);
            this.content.append($("<h1 tabindex=1 contenteditable='true'>Heading1</h1>"));

            // assign event handlers for all elements in content
            this.relevantElements = "ul, ol, li, div, pre, p, h1, h2, input, img, table, tbody, tr, td, a";
            this.assignHandlers(this.content);

            // load page
            var pageName = core.url().parameter("page");
            if (pageName) {
                self.loadPage(pageName);
            }

            self.commandStack = [];
        },

        createButtons : function(toolbar) {
            var self = this;
            var container = $("<div></div>");
            toolbar.append(container);
            $.each(edit.commandBindings, function() {
                var commandBinding = this;
                var button = $("<button>" + commandBinding.commandClass.prototype.name + "</button>");
                container.append(button);
                button.click(function() {
                    if (commandBinding.template) {
                        self.command.val(commandBinding.template);
                    } else {
                        var command = new commandBinding.commandClass(self.createContext());
                        command.execute();
                    }
                });
            });
        },

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
                    command.execute();

                    event.preventDefault();
                    return;
                }

            } else {
                // 2. NO CTRL KEY
                switch (event.keyCode) {
                case 'dummy':
                    this.executeCommandLineInit();
                    this.command.val("delete");
                    this.executeCommand();
                    break;
                case 27:
                    event.preventDefault();
                    this.executeCommandLineInit();
                    break;
                }
            }

        },

        setElement : function(element) {
            var self = this;
            if (element && element.length > 0) {
                self.element = element;
                self.status.text(self.getPath());
            }
            self.element.focus();
        },

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
            this.saveSelection();
            this.command.val("");
            this.command.focus();
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

            // and execute
            command.execute();

            // update history
            if (this.autocompleteList.indexOf(commandLine) === -1) {
                this.autocompleteList.push(commandLine);
            }

            // clear command line
            this.command.val("");

            // restore selection
            //self.restoreSelection();

        },

        // ---------------------------------------------------------------------
        // execute command
        // ---------------------------------------------------------------------
        executeCommand : function() {
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
            $(".jse-content").focus();
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

        saveSelection : function() {
            this.selection = saveSelection();
        },

        restoreSelection : function() {
            restoreSelection(this.selection);
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

        insertNew : function(referenceElement, newElement) {
            if (referenceElement.get(0).tagName.toLowerCase() === 'td') {
                referenceElement.append(newElement);
            } else {
                referenceElement.after(newElement);
            }
        }
    });

}(this));
