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
    var core = global.mero.core;
    var commands = global.mero.commands;
    global.mero.help = {};
    var module = global.mero.help;

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
    module.CommandHelp = core
            .createClass({

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
                        if (this.command.prototype.switchEditable) {
                            synopsis += " [container|leaf]";
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
                    } else if (this.command.prototype instanceof commands.InsertNewElementCommand) {
                        descr = "Insert tag '" + this.command.prototype.name + "'.";
                        parentNode.append("<p class='section'>Description:<p>");
                        parentNode.append("<p>" + descr + "</p>");
                    }

                },

                renderOptions : function(parentNode) {
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
                        parentNode.append("<p>Default is '" + this.command.prototype.insertMode + "'.</p>");
                    }
                    if (this.command.prototype instanceof commands.InsertNewElementCommand) {
                        if (this.command.prototype.switchEditable) {
                            parentNode.append("<p class='section'>Container options:</p>");
                            table = module.Table(parentNode);
                            //table.addLine([ "editable", "New element is inserted as a contenteditable element which cannot have child elements." ]);
                            //table.addLine([ "not-editable",
                            //        "New element is inserted as a NOT contenteditable element. By default a contenteditable child element of type span is created." ]);
                            table.addLine([ "leaf", "New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements." ]);
                            table.addLine([ "container", "New element is inserted as a container which can have child elements. By default an editable SPAN child element is created." ]);
                            if(this.command.prototype.editable){
                                // 1 h1, div
                                parentNode.append("<p>Default is 'leaf'.</p>");    
                            }else{
                                // 2 li
                                parentNode.append("<p>Default is 'container'.</p>");
                            }                            
                        }else{
                            parentNode.append("<p class='section'>Container options:</p>");
                            if(this.command.prototype.editable){
                                // 3 span
                                parentNode.append("<p>Element is directly editable. It cannot have child elements.</p>");    
                            }else{
                                if(this.command.prototype.container){
                                    // 4 tr
                                    parentNode.append("<p>Element is not direclty editable. The element can have child elements which may be directly editable. By default a editable SPAN element is inserted</p>");    
                                }else{
                                    // 5 img
                                    parentNode.append("<p>Element is not direclty editable. It is a simple element which cannot have child elements.</p>");
                                }                                
                            }                            
                            
                        }
                    }
                },

                render : function() {

                    this.containerNode = $("<div class='command-container'></div>");
                    this.parentNode.append(this.containerNode);

                    // heading
                    this.containerNode.append("<a id=\""+this.command.prototype.name+"\"></a><h2>Command " + this.command.prototype.name + "</h2>");

                    // synopsis
                    this.containerNode.append("<p class='section'>Synopsis:</p>");
                    this.containerNode.append("<p>" + this.synopsis() + "</p>");

                    // keyboard shortcut
                    var shortcut = this.shortcut();
                    if (shortcut) {
                        this.containerNode.append("<p class='section'>Keyboard Shortcut:</p>");
                        this.containerNode.append("<p>" + shortcut + "</p>");
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

        // collect groups
        var groups = {};
        for (var commandName in commands) {
            var command = commands[commandName];
            if (!command.prototype || !command.prototype.name) {
                continue;
            }
            if (command.prototype.name === 'insertnewelementcommand') {
                continue;
            }
            var groupName = command.prototype.group;
            if(!groupName){
                groupName='General';
            }
            var commandList = groups[groupName];
            if(!commandList){
                commandList = groups[groupName] = [];
            }
            commandList.push(command);
        }
        
        // render toc
        var tocNode = $("#toc");
        tocNode.append("<h1>TOC</h1>");
        for(var groupName in groups){    
            tocNode.append("<p><a href=\"#"+groupName+"\">"+groupName+" Commands:</a><p>");
            var commandList = groups[groupName];
            var listNode = $("<ul></ul>");
            tocNode.append(listNode);
            for(var i=0;i<commandList.length;++i){
                command = commandList[i];
                listNode.append("<li><a href=\"#"+command.prototype.name+"\">"+command.prototype.name+"</a></li>");                
            }
        }
        
        // render groups
        var commandReferenceNode = $("#commandreference");
        for(var groupName in groups){
            commandReferenceNode.append("<a id=\""+groupName+"\"></a><h1>"+groupName+" Commands</h1>");
            var commandList = groups[groupName];
            for(var i=0;i<commandList.length;++i){
                command = commandList[i];
                module.CommandHelp(commandReferenceNode,command);
            }
        }
        
        
    };

})(window);