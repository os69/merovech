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
    module.InsertBaseCommand = core.createDerivedClass(module.Command,{
    
        name : 'insertbasecommand',
        
        template : '<img src=<%=url%> width=<%=size%> />',
        
        getLeafNode : function(node) {
            if (node.children().length === 0) {
                return node;
            }
            return this.getLeafNode($(node.children().get(0)));
        },

        insert : function(){
            this.element.after(this.insertElement);
        },
        
        execute : function() {    
            var insertElementString = core.tmpl(this.template,this);
            this.insertElement = $(insertElementString);            
            this.insert();
            this.editor.assignHandlers(this.insertElement);
            var leafNode = this.getLeafNode(this.insertElement);
            this.editor.setElement(leafNode);
        },
        
        undo : undoInsertion
       
    });

    // =========================================================================
    // undo
    // =========================================================================
    module.UndoCommand = core.createDerivedClass(module.Command,{

        name : 'undo',
        char : 'z',
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
    module.PrevCommand = core.createDerivedClass(module.Command,{

        name : 'prev',
        charCode : 38,

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
    module.NextCommand = core.createDerivedClass(module.Command,{

        name : 'next',
        charCode : 40,

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
    module.ParentCommand = core.createDerivedClass(module.Command,{

        name : 'parent',
        charCode : 37,

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
    module.FirstChildCommand = core.createDerivedClass(module.Command,{

        name : 'firstchild',
        charCode: 39,

        execute : function() {
            var newElement = this.element.children(":first-child");
            this.editor.setElement(newElement);
        }
    });


    // =========================================================================
    // copy
    // =========================================================================
    module.CopyCommand = core.createDerivedClass(module.Command,{
        name : 'copy',
        char : 'c',
        button : 'copy',
        buttonGroup : 'tools',
        execute : function() {
            this.editor.copyElement = this.element;
        }
    });

    // =========================================================================
    // paste
    // =========================================================================
    module.PasteCommand = core.createDerivedClass(module.Command,{
        name : 'paste',
        char : 'v',
        button : 'paste',
        buttonGroup : 'tools',
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
    module.PasteBeforeCommand = core.createDerivedClass(module.Command,{

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
    module.CutCommand = core.createDerivedClass(module.Command,{
        name : 'cut',
        char : 'x',
        button : 'cut',
        buttonGroup : 'tools',
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
    module.UnCutCommand = core.createDerivedClass(module.Command,{

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
    // delete
    // =========================================================================
    module.DeleteCommand = core.createDerivedClass(module.Command,{
        name : 'del',
        char : 'd',
        button : 'del',
        buttonGroup : 'tools',
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
    module.LoadCommand = core.createDerivedClass(module.Command,{
        name : 'load',
        char : 'l',
        commandTemplate: 'load <pagename>',
        button : 'load',
        buttonGroup :'tools',
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
    module.SaveCommand = core.createDerivedClass(module.Command,{
        name : 'save',
        char : 's',
        commandTemplate: 'save <pagename>',
        button:'save',
        buttonGroup:'tools',
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
    module.StaticCommand = core.createDerivedClass(module.Command,{

        name : 'static',

        execute : function() {
            this.editor.makeStatic();
        }
    });

    // =========================================================================
    // image
    // =========================================================================
    module.ImageCommand = core.createDerivedClass(module.InsertBaseCommand,{    
        name : 'img',
        commandTemplate: 'img <size> <url>',
        setParameters : function(parameters){
            if (parameters.length >= 1) {
                this.size = parameters[0];
            }
            if (parameters.length >= 2) {
                this.url = parameters[1];
            }            
        },
        template : '<img tabindex=1 src="<%=url%>" width="<%=size%>" />'
    });

    // =========================================================================
    // link
    // =========================================================================
    module.LinkCommand = core.createDerivedClass(module.InsertBaseCommand,{    
        name : 'link',
        commandTemplate: 'link <target>',
        setParameters : function(parameters){
            if (parameters.length >= 1) {
                this.url = parameters[0];
            }
        },
        template : '<a href="jsedit.html?page=<%=url%>" tabindex=1>'+module.editableElement+'</a>'
    });

    // =========================================================================
    // h1
    // =========================================================================
    module.H1Command = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'h1',
        template : '<h1 tabindex=1>'+module.editableElement+'</h1>'
    });

    // =========================================================================
    // h2
    // =========================================================================
    module.H2Command = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'h2',
        template : '<h2 tabindex=1>'+module.editableElement+'</h2>'
    });

    // =========================================================================
    // h3
    // =========================================================================
    module.H3Command = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'h3',        
        template : '<h3 tabindex=1>'+module.editableElement+'</h3>'
    });

    // =========================================================================
    // ul
    // =========================================================================
    module.UlCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'ul',        
        button: 'ul',
        buttonGroup : 'list',
        template : '<ul tabindex=1><li tabindex=1>'+module.editableElement+'</li></ul>'
    });

    // =========================================================================
    // ol
    // =========================================================================
    module.OlCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'ol',
        button: 'ol',
        buttonGroup : 'list',

        template : '<ol tabindex=1><li tabindex=1>'+module.editableElement+'</li></ol>'
    });

    // =========================================================================
    // li
    // =========================================================================
    module.LiCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'li',
        char : 'i',
        button: 'li',
        buttonGroup : 'list',
        insert : function(){
            var sibling = this.editor.findSibling(this.element,"li");
            sibling.after(this.insertElement);
        },
        template : '<li tabindex=1>'+module.editableElement+'</li>'
     });

    // =========================================================================
    // div
    // =========================================================================
    module.DivCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'div',        
        template : '<div tabindex=1>'+module.editableElement+'</div>'
    });

    // =========================================================================
    // pre
    // =========================================================================
    module.PreCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'pre',        
        template : '<pre tabindex=1>'+module.editableElement+'</pre>'
    });

    // =========================================================================
    // bold
    // =========================================================================
    module.BoldCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'bold',        
        template : '<b tabindex=1>'+module.editableElement+'</b>'
    });

    // =========================================================================
    // span
    // =========================================================================
    module.SpanCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'span',        
        template : '<span tabindex=1>'+module.editableElement+'</span>'
    });

    // =========================================================================
    // table
    // =========================================================================
    module.TableCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'table',        
        template : '<table tabindex=1><tbody tabindex=1><tr tabindex=1><td tabindex=1>'+module.editableElement+'</td></tr></tbody></table>'
    });

    // =========================================================================
    // tr
    // =========================================================================
    module.TableRowCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'tr',        
        template : '<tr tabindex=1><td tabindex=1>'+module.editableElement+'</td></tr>'
    });

    // =========================================================================
    // td
    // =========================================================================
    module.TableDataCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'td',        
        template : '<td tabindex=1>'+module.editableElement+'</td>'
    });

    // =========================================================================
    // -------------------------------------------------------------------------
    // =========================================================================

    // =========================================================================
    // eh1
    // =========================================================================
    module.EH1Command = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'eh1',
        button : 'h1',
        buttonGroup : 'simple',
        template : '<h1 tabindex=1 contenteditable=true></h1>'
    });

    // =========================================================================
    // eh2
    // =========================================================================
    module.EH2Command = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'eh2',
        button : 'h2',
        buttonGroup : 'simple',
        template : '<h2 tabindex=1 contenteditable=true></h2>'
    });

    // =========================================================================
    // eh3
    // =========================================================================
    module.EH3Command = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'eh3',        
        template : '<h3 tabindex=1 contenteditable=true></h3>'
    });

    // =========================================================================
    // ediv
    // =========================================================================
    module.EDivCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'espan',
        button:'text',
        buttonGroup : 'simple',
        template : '<span tabindex=1 contenteditable=true></span>'
    });

    // =========================================================================
    // ebold
    // =========================================================================
    module.EBoldCommand = core.createDerivedClass(module.InsertBaseCommand,{
        name : 'ebold',
        button:'bold',
        buttonGroup : 'simple',
        template : '<b tabindex=1 contenteditable=true></b>'
    });

    // =========================================================================
    // create map: command by key
    // =========================================================================
    (function(){
        
        module.commandByKey = {};
        
        for(var key in module){
            var command = module[key];
            if(!command.prototype){
                continue;
            }
            if(command.prototype.charCode){
                if(module.commandByKey[command.prototype.charCode]){
                    alert("duplicate key "+charCode);
                }
                module.commandByKey[command.prototype.charCode] = command;
                continue;
            }
            if(command.prototype.char){
                if(module.commandByKey[command.prototype.char.charCodeAt(0)]){
                    alert("duplicate key "+char);
                }
                module.commandByKey[command.prototype.char.charCodeAt(0)] = command;
                continue;
            }            
        }
        
    })();

    
    // =========================================================================
    // create map: command by name
    // =========================================================================
    (function(){
        
        module.commandByName = {};
        
        for(var key in module){
            var command = module[key];
            if(!command.prototype || !command.prototype.name){
                continue;
            }
            if(module.commandByName[command.prototype.name]){
                alert("duplicate command name "+command.prototype.name);
            }
            module.commandByName[command.prototype.name] = command;
        }
        
    })();
    
    
}(this));
