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
        init : function(parentNode){
            this.parentNode = parentNode;
            this.table = $("<table></table>");
            this.parentNode.append(this.table);
        },
        addLine : function(line){
            var row = $("<tr></tr>");
            this.table.append(row);
            for(var i=0;i<line.length;++i){
                var data = line[i];
                var col = $("<td>"+data+"</td>");
                row.append(col);
            }
        }
    });
    
    // =========================================================================
    // creates documentation for a command
    // =========================================================================
    module.CommandHelp = core.createClass({
        
        init : function(parentNode,command){
            this.parentNode = parentNode;
            this.command    = command;
            this.render();
        },
    
        synopsis : function(){
            var synopsis="";
            if(this.command.prototype.synopsis){
                synopsis += this.command.prototype.synopsis;
            }else{
                synopsis += this.command.prototype.name;
            }
            if(this.command.prototype instanceof commands.InsertBaseCommand){
                synopsis += " [prepend|append|before|after] [container]";
            }
            return synopsis;
        },
        
        shortcut : function(){
            var result = "";
            if(this.command.prototype.charLabel){
                result = this.command.prototype.charLabel;
            }else if(this.command.prototype.char){
                result = this.command.prototype.char;
            }
            return result;
        },
        
        render : function(){

            // heading
            this.parentNode.append("<h2>"+this.command.prototype.name+"</h2>");

            // table with synopsis and keyboard shortcur
            var table = module.Table(this.parentNode);
            table.addLine(['Synopsis',this.synopsis()]);
            table.addLine(['Shortcut',this.shortcut()]);
            
            // description
            if(this.command.prototype.doc){
                this.parentNode.append("<p>"+this.command.prototype.doc+"</p>");    
            }
            
            // parameters
            if(this.command.prototype.parameterDoc){
                var parameterDoc = this.command.prototype.parameterDoc;
                table = new module.Table(this.parentNode);
                for(var parameterName in parameterDoc){
                    var parameterDescription = parameterDoc[parameterName];
                    table.addLine([parameterName, parameterDescription]);
                }
            }
        }
    
    });
    
    // =========================================================================
    // main function for generating documentation
    // =========================================================================
    module.generate = function(){
      
        var rootNode = $("<div></div>");
        $("body").append(rootNode);
        
        for (var commandName in commands){
            var command = commands[commandName];
            if(!command.prototype || !command.prototype.name){
                continue;
            }
            module.CommandHelp(rootNode,command);
        }
    };
    
})(window);