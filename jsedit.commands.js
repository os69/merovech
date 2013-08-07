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

    module.editableElement = '<span tabindex=1 contenteditable="true"></span>';

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
    // insertion base command
    // =========================================================================
    module.InsertBaseCommand = core.createDerivedClass(module.Command, {

        name : 'insertbasecommand',

        template : '<img src=<%=url%> width=<%=size%> />',

        insertMode : 'after',
        editable : true,
        leaf : true,

        changeIfAllowed : function(text,allowed,oldValue,newValue){
            if(allowed){
                return newValue;
            }else{
                if(oldValue!==newValue){
                    alert("not allowed option "+text);
                }
                return oldValue;
            }
        },
        
        setParameters : function(parameters) {

            // evaluate parameters
            for ( var i = 0; i < parameters.length; ++i) {
                var parameter = parameters[i];
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

                case 'editable':
                    this.editable = this.changeIfAllowed("editable",!this.editableLocked,this.editable,true);
                    break;
                case 'static':
                    this.editable = this.changeIfAllowed("static",!this.editableLocked,this.editable,false);
                    break;

                case 'leaf':
                    this.leaf = this.changeIfAllowed("leaf",!this.leafLocked,this.editable,true);;
                    break;
                case 'container':
                    this.leaf = this.changeIfAllowed("container",!this.leafLocked,this.editable,false);;
                    break;
                }
            }

            // container elements are not editable
            if (!this.leaf) {
                this.editable = false;
            }

            // editable elements are always leafs 
            if (this.editable) {
                this.leaf = true;
            }
            
        },

        getLeafNode : function(node) {
            if (node.children().length === 0) {
                return node;
            }
            return this.getLeafNode($(node.children().get(0)));
        },

        insert : function() {
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

        execute : function() {

            // assemble insertion element
            if (this.leaf) {
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

        undo : undoInsertion

    });

    // =========================================================================
    // undo
    // =========================================================================
    module.UndoCommand = core.createDerivedClass(module.Command, {

        name : 'undo',
        char : 'z',
        doc  : 'Undo of DOM operations (insertion, deletion, ... of DOM nodes).',
        execute : function() {
            // pop command 
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
    module.PrevCommand = core.createDerivedClass(module.Command, {

        name : 'prev',
        charCode : 38,
        charLabel : 'Alt+CursorLeft',
        doc: 'Move focus to preceding dom element.',
        
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
    module.NextCommand = core.createDerivedClass(module.Command, {

        name : 'next',
        charCode : 40,
        charLabel: 'Alt+CursorRight',
        doc:'Move focus to next dom element.',

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
    module.ParentCommand = core.createDerivedClass(module.Command, {

        name : 'parent',
        charCode : 37,
        charLabel:'Alt+CursorUp',
        doc : 'Move focus to parent dom element.',        

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
    module.FirstChildCommand = core.createDerivedClass(module.Command, {

        name : 'firstchild',
        charCode : 39,
        doc: 'Move focus to first child.',
        execute : function() {
            var newElement = this.element.children(":first-child");
            this.editor.setElement(newElement);
        }
    });

    // =========================================================================
    // copy
    // =========================================================================
    module.CopyCommand = core.createDerivedClass(module.Command, {
        name : 'copy',
        char : 'c',
        button : 'copy',
        buttonGroup : 'tools',
        doc : 'Copy focused element to buffer.',
        execute : function() {
            this.editor.copyElement = this.element;
        }
    });

    // =========================================================================
    // paste
    // =========================================================================
    module.PasteCommand = core.createDerivedClass(module.Command, {
        name : 'paste',
        char : 'v',
        button : 'paste',
        buttonGroup : 'tools',
        doc : 'Paste buffer after focused element.',
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
    module.PasteBeforeCommand = core.createDerivedClass(module.Command, {

        name : 'pastebefore',
        doc: 'Paste buffer before focused element.',

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
    module.CutCommand = core.createDerivedClass(module.Command, {
        name : 'cut',
        char : 'x',
        button : 'cut',
        buttonGroup : 'tools',
        doc : 'Cut focused element.',
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
    module.UnCutCommand = core.createDerivedClass(module.Command, {

        name : 'uncut',
        doc: 'Insert cut elements before focused element.',
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
                this.editor.executeCommand(paste);
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
    // delete
    // =========================================================================
    module.DeleteCommand = core.createDerivedClass(module.Command, {
        name : 'del',
        char : 'd',
        button : 'del',
        buttonGroup : 'tools',
        doc: 'Delete focused element',
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
    // load
    // =========================================================================
    module.LoadCommand = core.createDerivedClass(module.Command, {
        name : 'load',
        char : 'l',
        button : 'load',
        buttonGroup : 'tools',
        doc: 'Load page.',
        synopsis : 'load [<i>pagename</i>]',
        setParameters : function(parameters) {
            if (parameters.length >= 1) {
                this.pageName = parameters[0];
            }
        },
        execute : function() {
            this.editor.loadPage(this.pageName);
        }

    });

    // =========================================================================
    // save
    // =========================================================================
    module.SaveCommand = core.createDerivedClass(module.Command, {
        name : 'save',
        char : 's',
        button : 'save',
        buttonGroup : 'tools',
        doc : 'Save page.',
        synopsis : 'save [<i>pagename</i>]',
        setParameters : function(parameters) {
            if (parameters.length >= 1) {
                this.pageName = parameters[0];
            }
        },
        execute : function() {
            this.editor.savePage(this.pageName);
        }
    });

    // =========================================================================
    // static
    // =========================================================================
    module.StaticCommand = core.createDerivedClass(module.Command, {

        name : 'static',
        doc: 'Disable editor function an switch to static HTML. This is useful for copying marked text.',
        execute : function() {
            this.editor.makeStatic();
        }
    });

    // =========================================================================
    // -------------------------------------------------------------------------
    // =========================================================================
    

    // =========================================================================
    // img
    // =========================================================================
    module.ImageCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'img',
        commandTemplate : 'img <width> <url>',
        editable : false,
        synopsis : 'img <i>width</i> <i>url</i>',
        doc : 'Insert an image.',
        parameterDoc : {'width' : 'Width of image.',
                       'url'   : 'Url of image.'},
        setParameters : function(parameters) {
            if (parameters.length >= 1) {
                this.size = parameters[0];
            }
            if (parameters.length >= 2) {
                this.url = parameters[1];
            }
            module.InsertBaseCommand.prototype.setParameters.apply(this, [parameters.slice(2)]);
        },
        template : '<img tabindex=1 src="<%=url%>" width="<%=width%>" />'
    });

    // =========================================================================
    // ol
    // =========================================================================
    module.OlCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'ol',
        editable:false,
        editableLocked:true,
        leaf:false,
        leafLocked:true,
        button : 'ol',
        buttonGroup: 'list',
        template : '<ol tabindex=1><li tabindex=1><%=editableElement%></li></ol>'
    });

    // =========================================================================
    // ul
    // =========================================================================
    module.UlCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'ul',
        editable:false,
        editableLocked:true,
        leaf:false,
        leafLocked:true,
        button : 'ul',
        buttonGroup: 'list',        
        template : '<ul tabindex=1><li tabindex=1><%=editableElement%></li></ul>'
    });

    // =========================================================================
    // li
    // =========================================================================
    module.LiCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'li',
        char : 'i',
        insertMode:'sibling',
        siblingType : 'li',
        editable:false,
        leaf:false,
        button : 'li',
        buttonGroup: 'list',        
        template : '<li tabindex=1><%=editableElement%></li>'
    });

    // =========================================================================
    // link
    // =========================================================================
    module.LinkCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'link',
        commandTemplate : 'link <target>',
        synopsis : 'link <i>path</i>',
        setParameters : function(parameters) {
            if (parameters.length >= 1) {
                this.url = parameters[0];
            }
            module.InsertBaseCommand.prototype.setParameters.apply(this, [parameters.slice(1)]);
        },
        template : '<a href="jsedit.html?page=<%=url%>" tabindex=1><%=editableElement%></a>'
    });

    // =========================================================================
    // h1
    // =========================================================================
    module.H1Command = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'h1',
        button : 'h1',
        buttonGroup: 'simple',
        template : '<h1 tabindex=1><%=editableElement%></h1>'
    });

    // =========================================================================
    // h2
    // =========================================================================
    module.H2Command = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'h2',
        button : 'h2',
        buttonGroup: 'simple',
        template : '<h2 tabindex=1><%=editableElement%></h2>'
    });

    // =========================================================================
    // h3
    // =========================================================================
    module.H3Command = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'h3',
        template : '<h3 tabindex=1><%=editableElement%></h3>'
    });

    // =========================================================================
    // div
    // =========================================================================
    module.DivCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'div',
        button : 'text',
        buttonGroup: 'simple',
        template : '<div tabindex=1><%=editableElement%></div>'
    });

    // =========================================================================
    // pre
    // =========================================================================
    module.PreCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'pre',
        button : 'code',
        buttonGroup: 'simple',
        template : '<pre tabindex=1><%=editableElement%></pre>'
    });

    // =========================================================================
    // bold
    // =========================================================================
    module.BoldCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'bold',
        template : '<b tabindex=1><%=editableElement%></b>'
    });

    // =========================================================================
    // span
    // =========================================================================
    module.SpanCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'span',
        template : '<span tabindex=1><%=editableElement%></span>'
    });

    // =========================================================================
    // paragraph
    // =========================================================================
    module.ParagraphCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'cp',
        template : '<p tabindex=1><%=editableElement%></p>'
    });


    // =========================================================================
    // table
    // =========================================================================
    module.TableCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'table',
        editable:false,
        editableLocked:true,
        leaf:false,
        leafLocked:true,
        template : '<table tabindex=1><tbody tabindex=1><tr tabindex=1><td tabindex=1><%=editableElement%></td></tr></tbody></table>'
    });

    // =========================================================================
    // tr
    // =========================================================================
    module.TableRowCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'tr',
        editable:false,
        editableLocked:true,
        leaf:false,
        leafLocked:true,
        template : '<tr tabindex=1><td tabindex=1><%=editableElement%></td></tr>'
    });

    // =========================================================================
    // td
    // =========================================================================
    module.TableDataCommand = core.createDerivedClass(module.InsertBaseCommand, {
        name : 'td',
        template : '<td tabindex=1><%=editableElement%></td>'
    });

    // =========================================================================
    // attribute dialog
    // =========================================================================
    module.AttributeDialogCommand = core.createDerivedClass(module.Command, {
        name : 'attr',
        execute : function() {
            var self = this;
            var fields = [];
            for ( var attr, i = 0, attrs = self.element.get(0).attributes, l = attrs.length; i < l; i++) {
                attr = attrs.item(i);
                fields.push({
                    name : attr.nodeName,
                    value : attr.nodeValue
                });
            }
            core.nameValueDialog({
                fields : fields,
                title : 'Attributes'
            }, function(delta) {
                for ( var i = 0; i < delta.addedFields.length; ++i) {
                    var field = delta.addedFields[i];
                    self.element.attr(field.name, field.value);
                }
                for ( var i = 0; i < delta.deletedFields.length; ++i) {
                    var field = delta.deletedFields[i];
                    self.element.removeAttr(field.name);
                }
                for ( var i = 0; i < delta.changedFields.length; ++i) {
                    var field = delta.changedFields[i];
                    self.element.attr(field.name, field.newValue);
                }
            });
        }
    });

    // =========================================================================
    // create map: command by key
    // =========================================================================
    (function() {

        module.commandByKey = {};

        for ( var key in module) {
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
    (function() {

        module.commandByName = {};

        for ( var key in module) {
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
