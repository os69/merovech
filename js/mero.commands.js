(function (global) {
    "use strict";

    /* global window */
    /* global document */
    /* global alert */
    /* global $ */
    /* global location */

    // =========================================================================
    // packages
    // =========================================================================
    var core = global.mero.core;
    global.mero.commands = {};
    var commands = global.mero.commands;
    var module = commands;

    module.editableElement = '<span tabindex=1 contenteditable="true"></span>';

    module.relevantElements = "ul, ol, li, div, pre, p, h1, h2, h3, input, img, table, tbody, tr, td, a, span, b, i";

    // =========================================================================
    // base class commands
    // =========================================================================
    module.Command = core.createClass({

        init: function (context) {
            this.parameters = [];
            $.extend(this, context);
            this.prev = this.element.prev();
            this.parent = this.element.parent();
        },

        undo: function () {

        },

        nextElement: function () {

            // check for next element
            var newElement = this.element.next();
            if (newElement.length > 0) {
                return newElement;
            }

            // check for previous element
            newElement = this.element.prev();
            if (newElement.length > 0) {
                return newElement;
            }

            // check for parent element
            newElement = this.element.parent();
            if (!newElement.hasClass("jse-content")) {
                return newElement;
            }

            // create default element
            var defaultElement = $(module.editableElement);
            newElement.append(defaultElement);
            this.editor.assignHandlers(defaultElement);
            return defaultElement;
        }

    });

    // =========================================================================
    // delete base command
    // =========================================================================
    module.DeleteBaseCommand = core.createDerivedClass(module.Command, {
        undo: function () {
            if (this.prev.length > 0) {
                this.element.insertAfter(this.prev);
            } else {
                this.parent.prepend(this.element);
            }
            this.editor.assignHandlers(this.element);
            this.editor.setElement(this.element);
        }
    });

    // =========================================================================
    // insert base command
    // =========================================================================
    module.InsertBaseCommand = core.createDerivedClass(module.Command, {

        insertMode: 'after',

        insert: function () {
            switch (this.insertMode) {
            case 'before':
                if (this.element.hasClass("jse-content")) {
                    throw ("Insertion before root node not possible");
                }
                this.element.before(this.insertElement);
                break;
            case 'after':
                if (this.element.hasClass("jse-content")) {
                    throw ("Insertion after root node not possible");
                }
                this.element.after(this.insertElement);
                break;
            case 'prepend':
                if (this.element.attr("contenteditable") === "true") {
                    throw ("Insertion into editable container not possible");
                }
                this.element.prepend(this.insertElement);
                break;
            case 'append':
                if (this.element.attr("contenteditable") === "true") {
                    throw ("Insertion into editable container not possible");
                }
                this.element.append(this.insertElement);
                break;
            case 'sibling':
                var sibling = this.editor.findSibling(this.element, this.siblingType);
                sibling.after(this.insertElement);
                break;
            }
        },

        setParameters: function (fromIndex) {

            // set start index
            if (fromIndex === undefined) {
                fromIndex = 0;
            }

            // evaluate parameters
            for (var i = fromIndex; i < this.parameters.length; ++i) {
                var parameter = this.parameters[i];
                switch (parameter) {

                case 'after':
                    this.insertMode = "after";
                    break;
                case 'before':
                    this.insertMode = "before";
                    break;
                case 'prepend':
                    this.insertMode = "prepend";
                    break;
                case 'append':
                    this.insertMode = "append";
                    break;
                case 'sibling':
                    this.insertMode = "sibling";
                    break;

                }
            }

        },

        undo: function () {
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
        }
    });


    // =========================================================================
    // insert new element
    // =========================================================================
    module.InsertNewElementCommand = core.createDerivedClass(module.InsertBaseCommand, {

        name: 'insertnewelementcommand',

        template: '<img src=<%=url%> width=<%=size%> />',

        editable: true,
        switchEditable: true,

        container: false,

        changeIfAllowed: function (text, allowed, oldValue, newValue) {
            if (allowed) {
                return newValue;
            } else {
                if (oldValue !== newValue) {
                    alert("not allowed option " + text);
                }
                return oldValue;
            }
        },

        setParameters: function (fromIndex) {

            // base class
            module.InsertBaseCommand.prototype.setParameters.apply(this, arguments);

            // set start index
            if (fromIndex === undefined) {
                fromIndex = 0;
            }

            // evaluate parameters
            for (var i = fromIndex; i < this.parameters.length; ++i) {
                var parameter = this.parameters[i];
                switch (parameter) {

                case 'leaf':
                case 'editable':
                    if (!this.editable) {
                        if (this.switchEditable) {
                            this.editable = true;
                            this.container = false;
                        } else {
                            throw "Element is not editable.";
                        }
                    }
                    break;
                case 'not-editable':
                case 'container':
                    if (this.editable) {
                        if (this.switchEditable) {
                            this.editable = false;
                            this.container = true;
                        } else {
                            throw "Element is always editable.";
                        }
                    }
                    break;
                }
            }

        },

        getLeafNode: function (node) {
            if (node.children().length === 0) {
                return node;
            }
            return this.getLeafNode($(node.children().get(0)));
        },

        execute: function () {

            // assemble insertion element
            if (!this.container) {
                // leaf
                this.editableElement = "";
            } else {
                // container
                this.editableElement = module.editableElement;
            }
            var insertElementString = core.tmpl(this.template, this);
            this.insertElement = $(insertElementString);

            // set editable attribute
            if (this.editable) {
                this.insertElement.attr("contenteditable", true);
            }

            // insert
            this.insert();
            this.editor.assignHandlers(this.insertElement);

            // set new focus element
            var leafNode = this.getLeafNode(this.insertElement);
            this.editor.setElement(leafNode);
        },



    });

    // =========================================================================
    // prev
    // =========================================================================
    module.PrevCommand = core.createDerivedClass(module.Command, {
        name: 'prev',
        charCode: 38,
        charLabel: 'Alt+CursorLeft',
        doc: 'Move focus to preceding dom element.',
        group: 'Navigation',
        execute: function () {
            var newElement = this.element.prev();
            if (newElement.length === 0) {
                return;
                //newElement = this.element.parent().children().slice(-1);
                //if (newElement.length === 0) {
                //    return;
                //}
            }
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // next
    // =========================================================================
    module.NextCommand = core.createDerivedClass(module.Command, {
        name: 'next',
        charCode: 40,
        charLabel: 'Alt+CursorRight',
        doc: 'Move focus to next dom element.',
        group: 'Navigation',
        execute: function () {
            var newElement = this.element.next();
            if (newElement.length === 0) {
                return;
                //newElement = this.element.parent().children().slice(0, 1);
                //if (newElement.length === 0) {
                //    return;
                //}
            }
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // parent
    // =========================================================================
    module.ParentCommand = core.createDerivedClass(module.Command, {
        name: 'parent',
        charCode: 37,
        charLabel: 'Alt+CursorUp',
        doc: 'Move focus to parent dom element.',
        group: 'Navigation',
        execute: function () {
            var newElement = this.element.parent();
            if (newElement.hasClass('jse-content')) {
                return;
            }
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // child
    // =========================================================================
    module.ChildCommand = core.createDerivedClass(module.Command, {
        name: 'child',
        charCode: 39,
        doc: 'Move focus to first child.',
        group: 'Navigation',
        execute: function () {
            if (this.element.attr("contenteditable") === "true") {
                return;
            }
            var newElement = this.element.children(":first-child");
            if (newElement.length === 0) {
                return;
            }
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // copy
    // =========================================================================
    module.CopyCommand = core.createDerivedClass(module.Command, {
        name: 'copy',
        char: 'c',
        button: 'copy',
        buttonGroup: 'tools',
        doc: 'Copy focused element to buffer.',
        group: 'Tools',
        execute: function () {
            this.editor.copyElement = this.element;
            this.editor.element.focus();
        }
    });

    // =========================================================================
    // paste
    // =========================================================================
    module.PasteCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name: 'paste',
        char: 'v',
        button: 'paste',
        buttonGroup: 'tools',
        doc: 'Paste buffer after focused element.',
        group: 'Tools',
        execute: function () {
            this.insertElement = this.copyElement.clone(false);
            this.insert();
            this.editor.assignHandlers(this.insertElement);
            this.editor.setElement(this.insertElement);
        }
    });

    // =========================================================================
    // cut
    // =========================================================================
    module.CutCommand = core.createDerivedClass(module.DeleteBaseCommand, {
        name: 'cut',
        char: 'x',
        button: 'cut',
        doc: 'Cut focused element.',
        group: 'Tools',
        execute: function () {
            var newElement = this.nextElement();
            this.editor.copyElement = this.element;
            this.element.remove();
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // uncut
    // =========================================================================
    module.UnCutCommand = core.createDerivedClass(module.InsertBaseCommand, {

        insertMode: 'before',
        name: 'uncut',
        doc: 'Insert cut elements before focused element.',
        group: 'Tools',

        execute: function () {

            // search for first cut command
            var found = false;
            for (var i = this.editor.commandStack.length - 1; i >= 0; i--) {
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
            var first = true;
            for (; i >= 0; i--) {
                var command = this.editor.commandStack[i];
                if (command.name !== module.CutCommand.prototype.name) {
                    break;
                }
                var paste = new module.PasteCommand(this.editor.createContext());
                paste.copyElement = command.element;
                if (first) {
                    paste.insertMode = this.insertMode;
                    first = false;
                } else {
                    paste.insertMode = 'before';
                }
                this.editor.executeCommand(paste, false);
                this.commands.push(paste);
            }

        },

        undo: function () {
            for (var i = 0; i < this.commands.length; ++i) {
                var command = this.commands[i];
                command.undo();
            }
        }

    });

    // =========================================================================
    // undo
    // =========================================================================
    module.UndoCommand = core.createDerivedClass(module.Command, {
        name: 'undo',
        char: 'z',
        doc: 'Undo of DOM operations (insertion, deletion, ... of DOM nodes).',
        group: 'Tools',
        execute: function () {
            // pop command 
            var command = this.editor.commandStack.pop();
            if (!command) {
                return;
            }
            command.undo();
        }
    });

    // =========================================================================
    // delete
    // =========================================================================
    module.DeleteCommand = core.createDerivedClass(module.DeleteBaseCommand, {
        name: 'del',
        char: 'd',
        button: 'del',
        buttonGroup: 'tools',
        doc: 'Delete focused element',
        group: 'Tools',
        execute: function () {
            var newElement = this.nextElement();
            this.element.remove();
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // attribute dialog
    // =========================================================================
    module.AttributeDialogCommand = core.createDerivedClass(module.Command, {
        name: 'attr',
        doc: 'Opens a dialog for editing the attributes of the focused element.',
        group: 'Tools',
        execute: function () {
            var self = this;
            var fields = [];
            for (var attr, i = 0, attrs = self.element.get(0).attributes, l = attrs.length; i < l; i++) {
                attr = attrs.item(i);
                fields.push({
                    name: attr.nodeName,
                    value: attr.nodeValue
                });
            }
            core.nameValueDialog({
                fields: fields,
                title: 'Attributes'
            }, function (delta) {
                if (!delta) {
                    self.editor.setElement(self.editor.element);
                    return;
                }
                for (var i = 0; i < delta.addedFields.length; ++i) {
                    var field = delta.addedFields[i];
                    self.element.attr(field.name, field.value);
                }
                for (var i = 0; i < delta.deletedFields.length; ++i) {
                    var field = delta.deletedFields[i];
                    self.element.removeAttr(field.name);
                }
                for (var i = 0; i < delta.changedFields.length; ++i) {
                    var field = delta.changedFields[i];
                    self.element.attr(field.name, field.newValue);
                }
                self.editor.setElement(self.editor.element);
            });
        }
    });

    // =========================================================================
    // load
    // =========================================================================
    module.LoadCommand = core.createDerivedClass(module.Command, {
        name: 'load',
        char: 'l',
        button: 'load',
        buttonGroup: 'tools',
        buttonTemplate: 'load <enter pagename>',
        doc: 'Load page.',
        synopsis: 'load [<i>pagename</i>]',
        group: 'Load & Save',
        parameterDoc: {
            'pagename': 'Name of page.'
        },
        setParameters: function () {
            if (this.parameters.length >= 1) {
                this.pageName = this.parameters[0];
            }
        },
        execute: function () {
            this.editor.loadPage(this.pageName);
        }

    });

    // =========================================================================
    // save
    // =========================================================================
    module.SaveCommand = core.createDerivedClass(module.Command, {
        name: 'save',
        char: 's',
        button: 'save',
        buttonGroup: 'tools',
        group: 'Load & Save',
        doc: 'Save page.',
        synopsis: 'save [<i>pagename</i>]',
        parameterDoc: {
            'pagename': 'Name of page.'
        },
        setParameters: function () {
            if (this.parameters.length >= 1) {
                this.pageName = this.parameters[0];
            }
        },
        execute: function () {
            this.editor.savePage(this.pageName);
            this.editor.element.focus();
        }
    });

    // =========================================================================
    // static
    // =========================================================================
    module.StaticCommand = core.createDerivedClass(module.Command, {
        name: 'static',
        doc: 'Disable editor function an switch to static HTML. This is useful for copying marked text.',
        group: 'Tools',
        execute: function () {
            this.editor.makeStatic();
        }
    });

    // =========================================================================
    // -------------------------------------------------------------------------
    // =========================================================================

    // =========================================================================
    // link
    // =========================================================================
    module.LinkCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'link',
        editable: true,
        container: false,
        switchEditable: true,
        buttonTemplate: 'link <target>',
        synopsis: 'link <i>target</i>',
        parameterDoc: {
            'target': 'Target URL or just name of target document for links within Merovech.'
        },
        setParameters: function () {
            if (this.parameters.length >= 1) {
                this.target = this.parameters[0];
                if (this.target.slice(0, 1) !== '/' && this.target.slice(0, 4) !== 'http') {
                    this.target = "mero.html?page=" + this.target;
                }
            } else {
                throw "Missing parameter target";
            }
            module.InsertNewElementCommand.prototype.setParameters.apply(this, [1]);
        },
        template: '<a href="<%=target%>" tabindex=1><%=editableElement%></a>'
    });

    // =========================================================================
    // img
    // =========================================================================
    module.ImageCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'img',
        buttonTemplate: 'img <width> <url>',
        editable: false,
        container: false,
        switchEditable: false,
        synopsis: 'img <i>width</i> <i>url</i>',
        doc: 'Insert an image.',
        parameterDoc: {
            'width': 'Width of image.',
            'url': 'Url of image.'
        },
        setParameters: function () {
            if (this.parameters.length < 1) {
                throw "Missing parameters size and url";
            }
            if (this.parameters.length < 2) {
                throw "Missing parameter url";
            }
            this.width = this.parameters[0];
            this.url = this.parameters[1];
            module.InsertNewElementCommand.prototype.setParameters.apply(this, [2]);
        },
        template: '<img tabindex=1 src="<%=url%>" width="<%=width%>" />'
    });

    // =========================================================================
    // h1
    // =========================================================================
    module.H1Command = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'h1',
        button: 'h1',
        buttonGroup: 'simple',
        template: '<h1 tabindex=1><%=editableElement%></h1>'
    });

    // =========================================================================
    // h2
    // =========================================================================
    module.H2Command = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'h2',
        button: 'h2',
        buttonGroup: 'simple',
        template: '<h2 tabindex=1><%=editableElement%></h2>'
    });

    // =========================================================================
    // h3
    // =========================================================================
    module.H3Command = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'h3',
        template: '<h3 tabindex=1><%=editableElement%></h3>'
    });

    // =========================================================================
    // div
    // =========================================================================
    module.DivCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'div',
        button: 'text',
        buttonGroup: 'simple',
        template: '<div tabindex=1><%=editableElement%></div>'
    });

    // =========================================================================
    // pre
    // =========================================================================
    module.PreCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'pre',
        button: 'code',
        buttonGroup: 'simple',
        template: '<pre tabindex=1><%=editableElement%></pre>'
    });

    // =========================================================================
    // bold
    // =========================================================================
    module.BoldCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'bold',
        template: '<b tabindex=1><%=editableElement%></b>'
    });

    // =========================================================================
    // span
    // =========================================================================
    module.SpanCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'span',
        editable: true,
        container: false,
        switchEditable: false,
        template: '<span tabindex=1><%=editableElement%></span>'
    });

    // =========================================================================
    // paragraph
    // =========================================================================
    module.ParagraphCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'paragraph',
        template: '<p tabindex=1><%=editableElement%></p>'
    });

    // =========================================================================
    // italic
    // =========================================================================
    module.ItalicCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'italic',
        template: '<i tabindex=1><%=editableElement%></i>'
    });


    // =========================================================================
    // icon
    // =========================================================================
    module.IconCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'icon',
        buttonTemplate: 'icon <name>',
        editable: false,
        container: false,
        switchEditable: false,
        synopsis: 'icon <i>name</i>',
        doc: 'Insert Bootstrap icon.',
        parameterDoc: {
            'name': 'Name of icon (heart, glass,...)'
        },
        template: '<i tabindex=1 class="icon-<%=icon%>"><%=editableElement%></i>',
        setParameters: function () {
            if (this.parameters.length >= 1) {
                this.icon = this.parameters[0];
            } else {
                throw "Missing parameter iconname";
            }
            module.InsertNewElementCommand.prototype.setParameters.apply(this, [1]);
        },

    });

    // =========================================================================
    // ol
    // =========================================================================
    module.OlCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'ol',
        editable: false,
        container: true,
        switchEditable: false,
        button: 'ol',
        buttonGroup: 'list',
        group: 'Lists',
        template: '<ol tabindex=1><li tabindex=1><%=editableElement%></li></ol>'
    });

    // =========================================================================
    // ul
    // =========================================================================
    module.UlCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'ul',
        editable: false,
        container: true,
        switchEditable: false,
        button: 'ul',
        buttonGroup: 'list',
        group: 'Lists',
        template: '<ul tabindex=1><li tabindex=1><%=editableElement%></li></ul>'
    });

    // =========================================================================
    // li
    // =========================================================================
    module.LiCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'li',
        editable: false,
        container: true,
        switchEditable: true,
        char: 'i',
        insertMode: 'sibling',
        siblingType: 'li',
        button: 'li',
        buttonGroup: 'list',
        group: 'Lists',
        template: '<li tabindex=1><%=editableElement%></li>'
    });

    // =========================================================================
    // table
    // =========================================================================
    module.TableCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'table',
        editable: false,
        container: true,
        switchEditable: false,
        group: 'Tables',
        template: '<table tabindex=1><tbody tabindex=1><tr tabindex=1><td tabindex=1><%=editableElement%></td></tr></tbody></table>'
    });

    // =========================================================================
    // tr
    // =========================================================================
    module.TableRowCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'tr',
        editable: false,
        container: true,
        switchEditable: false,
        group: 'Tables',
        template: '<tr tabindex=1><td tabindex=1><%=editableElement%></td></tr>'
    });

    // =========================================================================
    // td
    // =========================================================================
    module.TableDataCommand = core.createDerivedClass(module.InsertNewElementCommand, {
        name: 'td',
        editable: false,
        container: true,
        switchEditable: true,
        group: 'Tables',
        template: '<td tabindex=1><%=editableElement%></td>'
    });


    // =========================================================================
    // create map: command by key
    // =========================================================================
    (function () {

        module.commandByKey = {};

        for (var key in module) {
            var command = module[key];
            if (!command.prototype) {
                continue;
            }
            if (command.prototype.charCode) {
                if (module.commandByKey[command.prototype.charCode]) {
                    alert("duplicate key " + charCode);
                }
                module.commandByKey[command.prototype.charCode] = command;
                continue;
            }
            if (command.prototype.char) {
                if (module.commandByKey[command.prototype.char.charCodeAt(0)]) {
                    alert("duplicate key " + char);
                }
                module.commandByKey[command.prototype.char.charCodeAt(0)] = command;
                continue;
            }
        }

    })();

    // =========================================================================
    // create map: command by name
    // =========================================================================
    (function () {

        module.commandByName = {};

        for (var key in module) {
            var command = module[key];
            if (!command.prototype || !command.prototype.name) {
                continue;
            }
            if (module.commandByName[command.prototype.name]) {
                alert("duplicate command name " + command.prototype.name);
            }
            module.commandByName[command.prototype.name] = command;
        }

    })();

}(this));