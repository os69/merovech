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
    var commands = global.jsedit.commands;
    global.jsedit.help = {};
    var module = global.jsedit.help;

    // =========================================================================
    // helper for generating html table
    // =========================================================================
    module.Table = core.createClass({
        init : function(parentNode) {
            this.parentNode = parentNode;
            this.table = $("<table></table>");
            this.parentNode.append(this.table);
        },
        addLine : function(line) {
            var row = $("<tr></tr>");
            this.table.append(row);
            for ( var i = 0; i < line.length; ++i) {
                var data = line[i];
                var col = $("<td>" + data + "</td>");
                row.append(col);
            }
        }
    });

    // =========================================================================
    // creates documentation for a command
    // =========================================================================
    module.CommandHelp = core.createClass({

        init : function(parentNode, command) {
            this.parentNode = parentNode;
            this.command = command;
            this.render();
        },

        synopsis : function() {
            var synopsis = "";
            if (this.command.prototype.synopsis) {
                synopsis += this.command.prototype.synopsis;
            } else {
                synopsis += this.command.prototype.name;
            }
            if (this.command.prototype instanceof commands.InsertBaseCommand) {
                if (this.command.prototype.siblingType) {
                    synopsis += " [prepend|append|before|after|sibling] [container|leaf]";
                } else {
                    synopsis += " [prepend|append|before|after] [container|leaf]";
                }
            }
            return synopsis;
        },

        shortcut : function() {
            var result = "";
            if (this.command.prototype.charLabel) {
                result = this.command.prototype.charLabel;
            } else if (this.command.prototype.char) {
                result = "Alt+" + this.command.prototype.char;
            }
            return result;
        },

        renderDescription : function(parentNode) {

            var descr;
            if (this.command.prototype.doc) {
                descr = this.command.prototype.doc;
                parentNode.append("<p>" + descr + "</p>");
            } else if (this.command.prototype instanceof commands.InsertBaseCommand) {
                descr = "Insert tag '" + this.command.prototype.name + "'";
                parentNode.append("<p>" + descr + "</p>");
            }

        },

        renderOptions : function(parentNode){
            if (this.command.prototype instanceof commands.InsertBaseCommand) {

                parentNode.append("<p>Insertion options:</p>");
                var table = module.Table(parentNode);
                table.addLine([ "after", "Inserts new element after focused dom element." ]);
                table.addLine([ "before", "Inserts new element before focused dom element." ]);
                table.addLine([ "prepend", "Inserts new element as first child of focused dom element." ]);
                table.addLine([ "append", "Inserts new element as last child of focused dom element." ]);
                if (this.command.prototype.siblingType) {
                    table.addLine([ "sibling", "Inserts new element as a sibling of next '" + this.command.prototype.siblingType + "' element." ]);
                }
                parentNode.append("<p>Default is " + this.command.prototype.insertMode + ".</p>");

                parentNode.append("<p>Container options:</p>");
                table = module.Table(parentNode);
                table.addLine([ "leaf", "New element is inserted as a contenteditable element which cannot have child elements." ]);
                table.addLine([ "container", "New element is inserted as a NOT contenteditable element. By default a contenteditable child element of type span is created." ]);
                parentNode.append("<p>Default is leaf.</p>");
            }            
        },
        
        render : function() {

            // heading
            this.parentNode.append("<h2>" + this.command.prototype.name + "</h2>");

            // table with synopsis and keyboard shortcur
            var table = module.Table(this.parentNode);
            table.addLine([ 'Synopsis', this.synopsis() ]);
            var shortcut = this.shortcut();
            if (shortcut) {
                table.addLine([ 'Shortcut', shortcut ]);
            }

            // description
            this.renderDescription(this.parentNode);

            // parameters
            if (this.command.prototype.parameterDoc) {
                this.parentNode.append("<p>Parameters:</p>");
                var parameterDoc = this.command.prototype.parameterDoc;
                table = new module.Table(this.parentNode);
                for ( var parameterName in parameterDoc) {
                    var parameterDescription = parameterDoc[parameterName];
                    table.addLine([ "<i>" + parameterName + "</i>", parameterDescription ]);
                }
            }
            
            // options
            this.renderOptions(this.parentNode);
        }

    });

    // =========================================================================
    // main function for generating documentation
    // =========================================================================
    module.generate = function() {

        var rootNode = $("<div></div>");
        $("body").append(rootNode);

        for ( var commandName in commands) {
            var command = commands[commandName];
            if (!command.prototype || !command.prototype.name) {
                continue;
            }
            if (command.prototype.name === 'insertbasecommand') {
                continue;
            }
            module.CommandHelp(rootNode, command);
        }
    };

})(window);