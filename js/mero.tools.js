(function (global) {
    "use strict";
    /*global window, Node */
    /*global $  */
    /*global document */

    // =========================================================================
    // packages
    // =========================================================================
    global.mero.tools = {};
    var tools = global.mero.tools;


    // =========================================================================
    // filter text node
    // =========================================================================
    var filterTextNode = function (node, index) {

        // collect following text nodes / remove text nodes from dom
        var textNodes = [];
        for (var i = index; i < node.childNodes.length; ++i) {
            var child = node.childNodes.item(i);
            if (child.nodeType === Node.TEXT_NODE) {
                node.removeChild(child);
                textNodes.push(child);
                i-=1;
            } else {
                break;
            }
        }
        
        // wrap text nodes in span
        var spanNode = document.createElement('span');
        spanNode.setAttribute('contenteditable','true');
        for(i=0;i<textNodes.length;++i){
            var textNode = textNodes[i];
            spanNode.appendChild(textNode);
        }
        
        
        // insert span into dom
        if(index<node.childNodes.length){
            var refNode = node.childNodes.item(index);
            node.insertBefore(spanNode,refNode);
        }else{
            node.appendChild(spanNode);
        }
        

    };

    // =========================================================================
    // filter node
    // =========================================================================
    var filterNode = function (node) {

        node.removeAttribute('style');
        node.removeAttribute('class');
        node.setAttribute('tabindex',1);
        
        var hasChildElements = (node.children.length > 0);
        if (!hasChildElements) {
            node.setAttribute('contenteditable', 'true');
            return;
        }

        for (var i = 0; i < node.childNodes.length; ++i) {
            var child = node.childNodes.item(i);
            if (child.nodeType === Node.TEXT_NODE) {
                filterTextNode(node, i);
            } else {
                filterNode(child);
            }
        }
    };

    // =========================================================================
    // filterHtml
    // =========================================================================
    tools.filterHtml = function (html) {
        
        // wrap html into div
        var node = document.createElement('div');
        node.setAttribute('tabindex',1);
        node.innerHTML = html;
        
        // filter
        filterNode(node);
        
        return node;
    };

})(this);