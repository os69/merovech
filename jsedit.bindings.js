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
        bindings : [ {
            key : 38,
            keyLabel : 'CursorLeft',
            button : false,
            commandClass : commands.PrevCommand
        }, {
            key : 40,
            keyLabel : 'CursorRight',
            button : false,
            commandClass : commands.NextCommand
        }, {
            key : 39,
            keyLabel : 'CursorUp',
            button : false,
            commandClass : commands.FirstChildCommand
        }, {
            key : 37,
            keyLabel : 'CursorDown',
            button : false,
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
        }, {
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
            button : false,
            commandClass : commands.StaticCommand
        } ]
    }, {
        // ---------------------------------------------------------------------
        label : 'Container',
        // ---------------------------------------------------------------------
        bindings : [ {
            key : 'u'.charCodeAt(0),
            commandClass : commands.UnOrderedListCommand
        }, {
            key : 'o'.charCodeAt(0),
            commandClass : commands.OrderedListCommand
        }, {
            key : 'i'.charCodeAt(0),
            commandClass : commands.ItemCommand
        }, {
            commandClass : commands.DivCommand
        }, {
            commandClass : commands.PreCommand
        }, {
            button : false,
            commandClass : commands.TableCommand
        }, {
            button : false,
            commandClass : commands.TableRowCommand
        }, {
            button : false,
            commandClass : commands.TableDataCommand
        } ]
    }, {
        // ---------------------------------------------------------------------
        label : 'Simple',
        // ---------------------------------------------------------------------
        bindings : [ {
            commandClass : commands.H1Command
        }, {
            commandClass : commands.H2Command
        }, {
            button : false,
            commandClass : commands.H3Command
        }, {
            commandClass : commands.TextCommand
        }, {
            commandClass : commands.ImageCommand,
            template : 'img <size> <name>',
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
    }, {
        label : 'Inline',
        bindings : [ {
            commandClass : commands.LinkCommand,
            template : 'link <pagename>',
            createCommandFromParameters : function(context, parameters) {
                if (parameters.length >= 1) {
                    context.pageName = parameters[0];
                }
                return new this.commandClass(context);
            }
        }, {
            key : 'b'.charCodeAt(0),
            commandClass : commands.BoldCommand
        } ]
    }

    ];

    module.commandBindingsList = (function() {
        var list = [];
        for ( var i = 0; i < module.commandBindings.length; ++i) {
            var group = module.commandBindings[i];
            for ( var j = 0; j < group.bindings.length; ++j) {
                var binding = group.bindings[j];
                list.push(binding);
            }
        }
        return list;
    })();

}(this));
