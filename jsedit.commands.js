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
    var core = global.jsedit.core;
    global.jsedit.commands = {};
    var commands = global.jsedit.commands;
    var module = commands;

    // =========================================================================
    // base class commands
    // =========================================================================
    module.Command = core.createClass({
        init : function(context) {
            $.extend(this, context);
            this.prev = this.element.prev();
            this.parent = this.element.parent();
        },

        undo : function() {

        }
    });

    // =========================================================================
    // undo deletion
    // =========================================================================
    var undoDeletion = module.undoDeletion = function() {
        if (this.prev.length > 0) {
            this.element.insertAfter(this.prev);
        } else {
            this.parent.append(this.element);
        }
        this.editor.assignHandlers(this.element);
        this.editor.setElement(this.element);
    };

    // =========================================================================
    // undo insertion
    // =========================================================================
    var undoInsertion = module.undoInsertion = function() {
        var newElement = this.insertElement.next();
        if (newElement.length === 0) {
            newElement = this.insertElement.prev();
        }
        if (newElement.length === 0) {
            if (!newElement.hasClass("jse-content")) {
                newElement = this.insertElement.parent();
            }
        }
        this.insertElement.remove();
        this.editor.setElement(newElement);
    };

    // =========================================================================
    // service function for defining commands
    // =========================================================================
    module.defineCommand = function(definition) {
        var commandClass = core.createDerivedClass(module.Command, definition);
        return commandClass;
    };

    // =========================================================================
    // define a command which inserts html
    // =========================================================================
    module.defineInsertCommand = function(name, html) {

        var getLeafNode = function(node) {
            if (node.children().length === 0) {
                return node;
            }
            return getLeafNode($(node.children().get(0)));
        };

        return module.defineCommand({
            name : name,
            execute : function() {
                this.insertElement = $(html);
                this.element.after(this.insertElement);
                this.editor.assignHandlers(this.insertElement);
                var leafNode = getLeafNode(this.insertElement);
                this.editor.setElement(leafNode);
            },
            undo : undoInsertion
        });
    };

    // =========================================================================
    // html insertion commands
    // =========================================================================
    
    // container elements not directly contentediable
    module.OrderedListCommand = module.defineInsertCommand("ol", "<ol tabindex=1><li tabindex=1><span tabindex=1 contenteditable='true'></span></li></ol>");
    module.UnOrderedListCommand = module.defineInsertCommand("ul", "<ul tabindex=1><li tabindex=1><span tabindex=1 contenteditable='true'></span></li></ul>");
    module.DivCommand = module.defineInsertCommand("div", "<div tabindex=1><span tabindex=1 contenteditable='true'></span></div>");
    module.TableCommand = module.defineInsertCommand("table", "<table tabindex=1><tbody tabindex=1><tr tabindex=1><td tabindex=1><span tabindex=1 contenteditable='true'></span></td></tr></tbody></table>");
    module.TableRowCommand = module.defineInsertCommand("tr", "<tr tabindex=1><td tabindex=1><span tabindex=1 contenteditable='true'></span></td></tr>");
    module.TableDataCommand = module.defineInsertCommand("td", "<td tabindex=1><span tabindex=1 contenteditable='true'></span></td>");
    module.PreCommand = module.defineInsertCommand("pre", "<pre tabindex=1><span tabindex=1 contenteditable='true'></span></pre>");
    
    // leaf element directly contenteditable
    module.H1Command = module.defineInsertCommand("h1", "<h1 tabindex=1 contenteditable='true'></h1>");
    module.H2Command = module.defineInsertCommand("h2", "<h2 tabindex=1 contenteditable='true'></h2>");
    module.H3Command = module.defineInsertCommand("h3", "<h3 tabindex=1 contenteditable='true'></h3>");        
    module.SpanCommand = module.defineInsertCommand("span", "<span tabindex=1 contenteditable='true'></span>");
    module.BoldCommand = module.defineInsertCommand("bold", "<b tabindex=1 contenteditable='true'></b>");
    

    // =========================================================================
    // undo
    // =========================================================================
    module.UndoCommand = module.defineCommand({

        name : 'undo',

        execute : function() {
            // pop undo command
            this.editor.commandStack.pop();
            // pop command for undo
            var command = this.editor.commandStack.pop();
            if (!command) {
                return;
            }
            command.undo();
        }
    });

    // =========================================================================
    // prev
    // =========================================================================
    module.PrevCommand = module.defineCommand({

        name : 'prev',

        execute : function() {
            if (this.element.hasClass('jse-content')) {
                return;
            }
            var newElement = this.element.prev();
            if (newElement.length === 0) {
                newElement = this.element.parent();
            }
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // next
    // =========================================================================
    module.NextCommand = module.defineCommand({

        name : 'next',

        execute : function() {
            if (this.element.hasClass('jse-content')) {
                return;
            }
            var newElement = this.element.next();
            if (newElement.length === 0) {
                newElement = this.element.children(":first-child");
            }
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // parent
    // =========================================================================
    module.ParentCommand = module.defineCommand({

        name : 'parent',

        execute : function() {
            if (this.element.hasClass('jse-content')) {
                return;
            }
            var newElement = this.element.parent();
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // firstchild
    // =========================================================================
    module.FirstChildCommand = module.defineCommand({

        name : 'firstchild',

        execute : function() {
            var newElement = this.element.children(":first-child");
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // delete
    // =========================================================================
    module.DeleteCommand = module.defineCommand({

        name : 'del',

        execute : function() {
            var newElement = this.element.next();
            if (newElement.length === 0) {
                newElement = this.element.prev();
            }
            if (newElement.length === 0) {
                newElement = this.element.parent();
            }
            this.element.remove();
            this.editor.setElement(newElement);
        },

        undo : undoDeletion
    });

    // =========================================================================
    // copy
    // =========================================================================
    module.CopyCommand = module.defineCommand({

        name : 'copy',

        execute : function() {
            this.editor.copyElement = this.element;
        }
    });

    // =========================================================================
    // paste
    // =========================================================================
    module.PasteCommand = module.defineCommand({

        name : 'paste',

        execute : function() {
            this.insertElement = this.editor.copyElement.clone(false);
            this.element.after(this.insertElement);
            this.editor.assignHandlers(this.insertElement);
            this.editor.setElement(this.insertElement);
        },

        undo : undoInsertion
    });

    // =========================================================================
    // paste before
    // =========================================================================
    module.PasteBeforeCommand = module.defineCommand({

        name : 'pastebefore',

        execute : function() {
            if (!this.copyElement) {
                this.copyElement = this.editor.copyElement;
            }
            this.insertElement = this.copyElement.clone(false);
            this.element.before(this.insertElement);
            this.editor.assignHandlers(this.insertElement);
            this.editor.setElement(this.insertElement);
        },

        undo : undoInsertion
    });

    // =========================================================================
    // cut
    // =========================================================================
    module.CutCommand = module.defineCommand({

        name : 'cut',

        execute : function() {
            var newElement = this.element.next();
            if (newElement.length === 0) {
                newElement = this.element.prev();
            }
            if (newElement.length === 0) {
                newElement = this.element.parent();
            }
            this.editor.copyElement = this.element;
            this.element.remove();
            this.editor.setElement(newElement);
        },

        undo : undoDeletion
    });

    // =========================================================================
    // uncut
    // =========================================================================
    module.UnCutCommand = module.defineCommand({

        name : 'uncut',

        execute : function() {

            // search for first cut command
            var found = false;
            for ( var i = this.editor.commandStack.length - 1; i >= 0; i--) {
                var command = this.editor.commandStack[i];
                if (command.name !== module.CutCommand.prototype.name) {
                    continue;
                }
                found = true;
                break;
            }
            if (!found) {
                return;
            }

            // loop at all preceding cut commands
            this.commands = [];
            for (; i >= 0; i--) {
                var command = this.editor.commandStack[i];
                if (command.name !== module.CutCommand.prototype.name) {
                    break;
                }
                var context = $.extend(this.editor.createContext(), {
                    copyElement : command.element
                });
                var paste = new module.PasteBeforeCommand(context);
                this.commands.push(paste);
                paste.execute();
                // this.editor.executeCommand(paste);
            }

        },

        undo : function() {
            for ( var i = 0; i < this.commands.length; ++i) {
                var command = this.commands[i];
                command.undo();
            }
        }

    });

    // =========================================================================
    // save
    // =========================================================================
    module.SaveCommand = module.defineCommand({

        name : 'save',

        execute : function() {
            this.editor.savePage(this.pageName);
        }
    });

    // =========================================================================
    // load
    // =========================================================================
    module.LoadCommand = module.defineCommand({

        name : 'load',

        execute : function() {
            this.editor.loadPage(this.pageName);
        }

    });

    // =========================================================================
    // static
    // =========================================================================
    module.StaticCommand = module.defineCommand({

        name : 'static',

        execute : function() {
            this.editor.makeStatic();
        }
    });

    // =========================================================================
    // item
    // =========================================================================
    module.ItemCommand = module.defineCommand({

        name : 'item',

        execute : function() {
            this.insertElement = $("<li tabindex=1></li>");
            this.editor.assignHandlers(this.insertElement);
            var text = $("<span tabindex=1 contenteditable='true'></span>");
            this.editor.assignHandlers(text);
            this.insertElement.append(text);
            this.editor.findSibling(this.element, "li").after(this.insertElement);
            this.editor.setElement(text);
        },

        undo : undoInsertion
    });

    // =========================================================================
    // image
    // =========================================================================
    module.ImageCommand = module.defineCommand({

        name : 'img',

        execute : function() {
            this.insertElement = $("<img  class='jsimg'  tabindex=1 src=" + this.url + " width='" + this.size + "px'></img>");
            this.editor.assignHandlers(this.insertElement);
            this.element.after(this.insertElement);
            this.editor.setElement(this.insertElement);
        },

        undo : undoInsertion
    });

    // =========================================================================
    // link
    // =========================================================================
    module.LinkCommand = module.defineCommand({

        name : 'link',

        execute : function() {
            var url = "http://" + location.host + location.pathname + "?page=" + this.pageName;
            this.editor.restoreSelection();
            document.execCommand("CreateLink", false, url);
            this.editor.assignHandlers(this.element);
        }
    });

}(this));
