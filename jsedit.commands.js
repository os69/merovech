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
        }
    });

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
                var node = $(html);
                this.element.after(node);
                this.editor.assignHandlers(node);
                var leafNode = getLeafNode(node);
                this.editor.setElement(leafNode);
            }
        });
    };

    // =========================================================================
    // html insertion commands
    // =========================================================================
    module.OrderedListCommand = module.defineInsertCommand("ol", "<ol tabindex=1><li tabindex=1><div tabindex=1 contenteditable='true'>x</div></li></ol>");
    module.UnOrderedListCommand = module.defineInsertCommand("ul", "<ul tabindex=1><li tabindex=1><div tabindex=1 contenteditable='true'>x</div></li></ul>");
    module.TextCommand = module.defineInsertCommand("text", "<div tabindex=1 contenteditable='true'>x</div>");
    module.H1Command = module.defineInsertCommand("h1", "<h1 tabindex=1 contenteditable='true'></h1>");
    module.H2Command = module.defineInsertCommand("h2", "<h2 tabindex=1 contenteditable='true'></h2>");
    module.H3Command = module.defineInsertCommand("h3", "<h3 tabindex=1 contenteditable='true'></h3>");
    module.PreCommand = module.defineInsertCommand("pre", "<pre tabindex=1 contenteditable='true'></pre>");
    module.DivCommand = module.defineInsertCommand("div", "<div tabindex=1><div tabindex=1 contenteditable='true'></div></div>");

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

        name : 'delete',

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
        }
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
            var copy = this.editor.copyElement.clone(false);
            this.element.after(copy);
            this.editor.assignHandlers(copy);
            this.editor.setElement(this.element.next());
        }
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
    // item
    // =========================================================================
    module.ItemCommand = module.defineCommand({

        name : 'item',

        execute : function() {
            var item = $("<li tabindex=1></li>");
            this.editor.assignHandlers(item);
            var text = $("<div tabindex=1 contenteditable='true'></div>");
            this.editor.assignHandlers(text);
            item.append(text);
            this.editor.findSibling(this.element, "li").after(item);
            this.editor.setElement(text);
        }
    });

    // =========================================================================
    // image
    // =========================================================================
    module.ImageCommand = module.defineCommand({

        name : 'image',

        execute : function() {
            var img = $("<img  class='jsimg'  tabindex=1 src=" + this.url + " height='" + this.size + "px'></img>");
            this.editor.assignHandlers(img);
            this.element.after(img);
            this.editor.setElement(img);
        }
    });


    // =========================================================================
    // bold
    // =========================================================================
    module.BoldCommand = module.defineCommand({

        name : 'bold',

        execute : function() {
            this.editor.restoreSelection();
            document.execCommand('bold', false);
        }
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

    // =========================================================================
    // static
    // =========================================================================
    module.StaticCommand = module.defineCommand({

        name : 'static',

        execute : function() {
            this.editor.makeStatic();
        }
    });

}(this));
