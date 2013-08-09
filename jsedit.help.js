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
                    synopsis += " [prepend|append|before|after|sibling]";
                } else {
                    synopsis += " [prepend|append|before|after]"; 
                }
                if(this.command.prototype.leafLocked){
                    synopsis += "";
                }else{
                    synopsis += " [leaf|container]";
                }
            }
            return synopsis;
        },

        shortcut : function() {
            var result = "";
            if (this.command.prototype.charLabel) {
                result = this.command.prototype.charLabel;
            } else if (this.command.prototype.char) {
                result = "Alt+" + this.command.prototype.char.toUpperCase();
            }
            return result;
        },

        renderDescription : function(parentNode) {

            var descr;
            if (this.command.prototype.doc) {
                descr = this.command.prototype.doc;
                parentNode.append("<p class='section'>Description:<p>");
                parentNode.append("<p>" + descr + "</p>");
            } else if (this.command.prototype instanceof commands.InsertBaseCommand) {
                descr = "Insert tag '" + this.command.prototype.name + "'.";
                parentNode.append("<p class='section'>Description:<p>");
                parentNode.append("<p>" + descr + "</p>");
            }

        },

        renderOptions : function(parentNode){
            if (this.command.prototype instanceof commands.InsertBaseCommand) {

                parentNode.append("<p class='section'>Insertion options:</p>");
                var table = module.Table(parentNode);
                table.addLine([ "after", "Inserts new element after focused dom element." ]);
                table.addLine([ "before", "Inserts new element before focused dom element." ]);
                table.addLine([ "prepend", "Inserts new element as first child of focused dom element." ]);
                table.addLine([ "append", "Inserts new element as last child of focused dom element." ]);
                if (this.command.prototype.siblingType) {
                    table.addLine([ "sibling", "Inserts new element as a sibling of next '" + this.command.prototype.siblingType + "' element." ]);
                }
                parentNode.append("<p>Default is " + this.command.prototype.insertMode + ".</p>");

                parentNode.append("<p class='section'>Container options:</p>");
                table = module.Table(parentNode);
                table.addLine([ "leaf", "New element is inserted as a contenteditable element which cannot have child elements." ]);
                table.addLine([ "container", "New element is inserted as a NOT contenteditable element. By default a contenteditable child element of type span is created." ]);
                parentNode.append("<p>Default is leaf.</p>");
            }            
        },
        
        render : function() {

            this.containerNode = $("<div class='command-container'></div>");
            this.parentNode.append(this.containerNode);
            
            // heading
            this.containerNode.append("<h2>Command " + this.command.prototype.name + "</h2>");

            // synopsis
            this.containerNode.append("<p class='section'>Synopsis:</p>");
            this.containerNode.append("<p>"+this.synopsis()+"</p>");
    
            // keyboard shortcut
            var shortcut = this.shortcut();
            if (shortcut) {
                this.containerNode.append("<p class='section'>Keyboard Shortcut</p>");
                this.containerNode.append("<p>"+shortcut+"</p>");
            }

            // description
            this.renderDescription(this.containerNode);

            // parameters
            if (this.command.prototype.parameterDoc) {
                this.containerNode.append("<p class='section'>Parameters:</p>");
                var parameterDoc = this.command.prototype.parameterDoc;
                var tableParagraph = $("<p></p>");
                this.containerNode.append(tableParagraph);
                var table = new module.Table(tableParagraph);
                for ( var parameterName in parameterDoc) {
                    var parameterDescription = parameterDoc[parameterName];
                    table.addLine([ "<i>" + parameterName + "</i>", parameterDescription ]);
                }
            }
            
            // options
            this.renderOptions(this.containerNode);
        }

    });

    // =========================================================================
    // main function for generating documentation
    // =========================================================================
    module.generate = function() {

        var rootNode = $("<div class='help-container'></div>");
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