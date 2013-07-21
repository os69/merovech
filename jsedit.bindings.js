(function(global) {
    "use strict";

    // =========================================================================
    // packages
    // =========================================================================
    global.jsedit.bindings = {};
    var commands = global.jsedit.commands;
    var bindings = global.jsedit.bindings;
    var module = bindings;

    // =========================================================================
    // command bindings
    // =========================================================================
    module.commandBindings = [ {
        // ---------------------------------------------------------------------
        label : 'Tools',
        // ---------------------------------------------------------------------
        bindings : [{
            key : 38,
            keyLabel : 'CursorLeft',
            commandClass : commands.PrevCommand
        }, {
            key : 40,
            keyLabel : 'CursorRight',
            commandClass : commands.NextCommand
        }, {
            key : 39,
            keyLabel : 'CursorUp',
            commandClass : commands.FirstChildCommand
        }, {
            key : 37,
            keyLabel : 'CursorDown',
            commandClass : commands.ParentCommand
        }, {
            key : 'c'.charCodeAt(0),
            commandClass : commands.CopyCommand
        }, {
            key : 'v'.charCodeAt(0),
            commandClass : commands.PasteCommand
        }, {
            key : 'x'.charCodeAt(0),
            commandClass : commands.CutCommand
        },  {
            commandClass : commands.UnCutCommand
        }, {
            key : 'd'.charCodeAt(0),
            commandClass : commands.DeleteCommand
        }, {
            key : 'z'.charCodeAt(0),
            commandClass : commands.UndoCommand
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
            commandClass : commands.StaticCommand
        } ]
    }, {
        // ---------------------------------------------------------------------        
        label : 'Container',
        // ---------------------------------------------------------------------
        bindings : [ {
            commandClass : commands.TableCommand
        }, {
            commandClass : commands.TableRowCommand
        }, {
            commandClass : commands.TableDataCommand
        }, {
            key : 'u'.charCodeAt(0),
            commandClass : commands.UnOrderedListCommand
        }, {
            key : 'o'.charCodeAt(0),
            commandClass : commands.OrderedListCommand
        }, {
            key : 'i'.charCodeAt(0),
            commandClass : commands.ItemCommand
        } ]
    }, {
        // ---------------------------------------------------------------------
        label : 'Simple',
        // ---------------------------------------------------------------------
        bindings : [  {
            commandClass : commands.H1Command
        }, {
            commandClass : commands.H2Command
        }, {
            commandClass : commands.H3Command
        }, {
            commandClass : commands.DivCommand
        },{
            commandClass : commands.SpanCommand
        }, {
            commandClass : commands.PreCommand
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
        } ]
    }

    ];
    
    module.commandBindingsList = (function(){
        var list = [];
        for(var i=0;i<module.commandBindings.length;++i){
            var group = module.commandBindings[i];
            for(var j=0;j<group.bindings.length;++j){
                var binding = group.bindings[j];
                list.push(binding);
            }
        }
        return list;
    })();

}(this));
