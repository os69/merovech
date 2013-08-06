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
    
    module.formatCommandTemplate = function(template){
        var result = "";
        template = template.replace(/['>',' ']/g,'');
        var parts = template.split("<");
        for(var i=0;i<parts.length;++i){
            if(i>0){
                result+=" <i>"+parts[i]+"</i>";
            }else{
                result+=parts[i];    
            }            
        }
        return result;
    };
    
    module.generateCommandHelp = function(parentNode,command){
        parentNode.append("<h2>"+command.prototype.name+"</h2>");
        var doc="";
        if(command.prototype.doc){
            doc+=command.prototype.doc;
        }
        if(!command.prototype.doc && command.prototype instanceof commands.InsertBaseCommand){
            doc+="Insert "+command.prototype.name+ "tag.";
        }
        parentNode.append("<p>"+doc+"</p>");
        var synopsis = "Synopsis :";
        if(command.prototype.synopsis){
            synopsis += command.prototype.synopsis;
        }else{
            synopsis += command.prototype.name;
        }
        if(command.prototype instanceof commands.InsertBaseCommand){
            synopsis += " [prepend|append|before|after] [container]";
        }
        parentNode.append("<p>"+synopsis+"</p>");
        if(command.prototype.charLabel){
            parentNode.append("<p>Keyboard shortcut "+command.prototype.charLabel+"</p>");
        }else if(command.prototype.char){
            parentNode.append("<p>Keyboard shortcut Alt+"+command.prototype.char+"</p>");
        }
    };
    
    module.generate = function(){
      
        var rootNode = $("<div></div>");
        $("body").append(rootNode);
        
        for (var commandName in commands){
            var command = commands[commandName];
            if(!command.prototype || !command.prototype.name){
                continue;
            }
            module.generateCommandHelp(rootNode,command);
        }
    };
    
})(window);