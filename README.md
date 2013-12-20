<div id="toc">
    <h1>TOC</h1>
    <p>
        <a href="#Introduction">Introduction</a>
    </p>
    <p></p>
    <p>
        <a href="#Installation">Installation</a>
    </p>
    <p></p>
    <p>
        <a href="#Technology">Technology</a>
    </p>
    <p></p>
    <p>
        <a href="#Browser Support">Browser Support</a>
    </p>
    <p></p>
    <p>
        <a href="#General Usage Concepts">General Usage Concepts</a>
    </p>
    <p></p>
    <p>
        <a href="#Navigation">Navigation Commands</a>
    </p>
    <p></p>
    <ul>
        <li>
            <a href="#prev">prev</a>
        </li>
        <li>
            <a href="#next">next</a>
        </li>
        <li>
            <a href="#parent">parent</a>
        </li>
        <li>
            <a href="#child">child</a>
        </li>
    </ul>
    <p>
        <a href="#Tools">Tools Commands</a>
    </p>
    <p></p>
    <ul>
        <li>
            <a href="#copy">copy</a>
        </li>
        <li>
            <a href="#paste">paste</a>
        </li>
        <li>
            <a href="#cut">cut</a>
        </li>
        <li>
            <a href="#uncut">uncut</a>
        </li>
        <li>
            <a href="#undo">undo</a>
        </li>
        <li>
            <a href="#del">del</a>
        </li>
        <li>
            <a href="#attr">attr</a>
        </li>
        <li>
            <a href="#static">static</a>
        </li>
    </ul>
    <p>
        <a href="#Load &amp; Save">Load &amp; Save Commands</a>
    </p>
    <p></p>
    <ul>
        <li>
            <a href="#load">load</a>
        </li>
        <li>
            <a href="#save">save</a>
        </li>
    </ul>
    <p>
        <a href="#General">General Commands</a>
    </p>
    <p></p>
    <ul>
        <li>
            <a href="#link">link</a>
        </li>
        <li>
            <a href="#img">img</a>
        </li>
        <li>
            <a href="#h1">h1</a>
        </li>
        <li>
            <a href="#h2">h2</a>
        </li>
        <li>
            <a href="#h3">h3</a>
        </li>
        <li>
            <a href="#div">div</a>
        </li>
        <li>
            <a href="#pre">pre</a>
        </li>
        <li>
            <a href="#bold">bold</a>
        </li>
        <li>
            <a href="#span">span</a>
        </li>
        <li>
            <a href="#paragraph">paragraph</a>
        </li>
        <li>
            <a href="#italic">italic</a>
        </li>
        <li>
            <a href="#icon">icon</a>
        </li>
    </ul>
    <p>
        <a href="#Lists">Lists Commands</a>
    </p>
    <p></p>
    <ul>
        <li>
            <a href="#ol">ol</a>
        </li>
        <li>
            <a href="#ul">ul</a>
        </li>
        <li>
            <a href="#li">li</a>
        </li>
    </ul>
    <p>
        <a href="#Tables">Tables Commands</a>
    </p>
    <p></p>
    <ul>
        <li>
            <a href="#table">table</a>
        </li>
        <li>
            <a href="#tr">tr</a>
        </li>
        <li>
            <a href="#td">td</a>
        </li>
    </ul>
</div>

<a name="Introduction"></a>
<h1>Introduction</h1>
<i>Merowech</i>
is a HTML WYSIWYG DOM tree editor:
<ul>
    <li>Edit HTML documents in your browser.</li>
    <li>It is WYSIWYG because you can see the result directly.</li>
    <li>On the other hand
        <i>Merowech</i>
        is also very technical. The DOM tree is not hidden from the user which does allow you to make use of the all HTML features.</li>
    <li>Navigation is based on the DOM tree. You can navigate to the next or the previous sibling of an element or to parent or child elements.</li>
</ul>

<p>
    <i>Merowech</i>
    originated from the need of a personal wiki. I tested some of the available solutions but found that the process of (1) editing wiki markup (2) change mode and then view the result HTML page does not make sense for a personal wiki.
</p>

<p>
    For a personal note taking software I would prefer WYSIWYG. On the other hand I like technical markup languages (HTML, markdown) because they are very precise and allow you to do a lot of more things than in a WYSIWYG editor.
</p>

<p>
    So would it be possible to combine the technical approach of markup languages with the WYSIWYG approach?
</p>

<p>
    <i>Merovech</i>
    tries to do this.
</p>

<p>Modern browsers support editing of DOM nodes.
    <i>Merovech</i>
    uses this functionality to allow editing of simple text in the browser.
    <i>Merovech</i>
    adds functionality for navigating the DOM. By the (Alt+) cursor keys you can move to th enext/previous/parent/child node of a DOM node. Also functionalities for copying, cutting, deleting DOM nodes are supported. viewing the rendered result page.
</p>

<a name="Installation"></a>
<h1>Installation</h1>
<h2>Using Included Node-Webserver</h2>
<ol>
    <li>Download and extract the
        <a href="https://github.com/os69/merovech/archive/master.zip">archive</a>. Or clone the git repository by
        <pre>git clone https://github.com/os69/merovech
        </pre>
    </li>
    <li>
        Switch to the
        <i>Merovech</i>
        directory and start the server by
        <pre>node server/server.js serverconfig.json
        </pre>
        Precondition is that you have
        <a href="http://nodejs.org/">node.js</a>
        installed. In the serverconfig.json configuration file you can adjust some parameters of the web servers
        <pre>{ address : "localhost", port : 50000, loadPaths : [".","doc"], savePath : "doc" }
        </pre>
        <table>
            <tbody>
                <tr>
                    <td>address</td>
                    <td>Server address.</td>
                </tr>
                <tr>
                    <td>port</td>
                    <td>Port on which the server will listen.</td>
                </tr>
                <tr>
                    <td>loadPaths</td>
                    <td>List of paths where the server os searching for documents.</td>
                </tr>
                <tr>
                    <td>savePath</td>
                    <td>Path were documents are stored.</td>
                </tr>
            </tbody>
        </table>
    </li>
    <li>
        Open
        <a href="http://localhost:50000/mero.html?page=doc1">http://localhost:50000/mero.html?page=doc1</a>in your Webbrowser.
    </li>
</ol>
<h2>Using Own Webserver</h2>
You can use
<i>Merovech</i>
also with other web servers. Just deploy the
<i>Merovech</i>
directory to the www directory of your web server. For saving documents the web browser does need to support POST requests.

<a name="Technology"></a>
<h1>Technology</h1>
<i>Merovech</i>
is implemented in Javascript and runs in the browser.

<a name="Browser Support"></a>
<h1>Browser Support</h1>
<i>Merovech</i>
supports Firefox and Chrome.

<a name="General Usage Concepts"></a>
<h1>General Usage Concepts</h1>

<a name="Navigation"></a>
<h2>Navigation</h2>
In the first section of the test document
<i>doc1</i>
you can see some nested divs. Click on a div. Now you can navigate by
<table>
    <tbody>
        <tr>
            <td>Alt+CursorLeft</td>
            <td>Previous sibling element.</td>
        </tr>
        <tr>
            <td>Alt+CursorRight</td>
            <td>Next sibling element.</td>
        </tr>
        <tr>
            <td>Alt+Up</td>
            <td>Parent element.</td>
        </tr>
        <tr>
            <td>Alt+Down</td>
            <td>First child element.</td>
        </tr>
    </tbody>
</table>

<a name="Executing Commands"></a>
<h2>Executing Commands</h2>
<ul>
    <li>Type
        <i>Escape</i>
        key</li>
    <li>Cursor is now in the command field (upper left corner).</li>
    <li>Enter command. For instance
        <i>h1</i>.</li>
    <li>Type
        <i>Enter</i>. A new H1-Element is inserted.</li>
</ul>

<h2>Editable versus Container Elements</h2>
<p>Typically whenever you insert a new element, the element is inserted as a editable element. Editable does mean that you can insert text. Editable elements cannot have child elements.</p>
<p>In case you want an element to have child elements append the option
    <i>container</i>
    to the insert command. In case you use the
    <i>container</i>
    option the desired element is created and in addition an editable SPAN child element. Example:</p>
<pre>div container
</pre>

<h2>Insertion Position</h2>
By default new elements are inserted after the current element. You can change this by the following options:
<table>
    <tbody>
        <tr>
            <td>after</td>
            <td>Insert after current element.</td>
        </tr>
        <tr>
            <td>before</td>
            <td>Insert before current element.</td>
        </tr>
        <tr>
            <td>append</td>
            <td>Append new element as last child of current element.</td>
        </tr>
        <tr>
            <td>preend</td>
            <td>Append new element as first child of current element.</td>
        </tr>
    </tbody>
</table>

<h2>Copy &amp; Paste</h2>
<p>Within an editable element you can use the default keyboard shortcuts CTRL-C, CTRL-V.</p>
<p>In addition using ALT-C, ALT-V you can copy complete DOM elements.</p>
<p>In case you want to move or copy many DOM elements:
</p>
<ul>
    <li>Use the cut command several times.</li>
    <li>Use the uncut command to paste all cut elements.</li>
</ul>
<p></p>
<div id="commandreference">
    <a name="Navigation"></a>
    <h1>Navigation Commands</h1>
    <div class="command-container">
        <a name="prev"></a>
        <h2>Command prev</h2>
        <b class="section">Synopsis:</b>
        <p>prev</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+CursorLeft</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Move focus to preceding dom element.</p>
    </div>
    <div class="command-container">
        <a name="next"></a>
        <h2>Command next</h2>
        <b class="section">Synopsis:</b>
        <p>next</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+CursorRight</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Move focus to next dom element.</p>
    </div>
    <div class="command-container">
        <a name="parent"></a>
        <h2>Command parent</h2>
        <b class="section">Synopsis:</b>
        <p>parent</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+CursorUp</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Move focus to parent dom element.</p>
    </div>
    <div class="command-container">
        <a name="child"></a>
        <h2>Command child</h2>
        <b class="section">Synopsis:</b>
        <p>child</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Move focus to first child.</p>
    </div>
    <a name="Tools"></a>
    <h1>Tools Commands</h1>
    <div class="command-container">
        <a name="copy"></a>
        <h2>Command copy</h2>
        <b class="section">Synopsis:</b>
        <p>copy</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+C</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Copy focused element to buffer.</p>
    </div>
    <div class="command-container">
        <a name="paste"></a>
        <h2>Command paste</h2>
        <b class="section">Synopsis:</b>
        <p>paste [prepend|append|before|after]</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+V</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Paste buffer after focused element.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
    </div>
    <div class="command-container">
        <a name="cut"></a>
        <h2>Command cut</h2>
        <b class="section">Synopsis:</b>
        <p>cut</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+X</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Cut focused element.</p>
    </div>
    <div class="command-container">
        <a name="uncut"></a>
        <h2>Command uncut</h2>
        <b class="section">Synopsis:</b>
        <p>uncut [prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert cut elements before focused element.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'before'.</p>
    </div>
    <div class="command-container">
        <a name="undo"></a>
        <h2>Command undo</h2>
        <b class="section">Synopsis:</b>
        <p>undo</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+Z</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Undo of DOM operations (insertion, deletion, ... of DOM nodes).</p>
    </div>
    <div class="command-container">
        <a name="del"></a>
        <h2>Command del</h2>
        <b class="section">Synopsis:</b>
        <p>del</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+D</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Delete focused element</p>
    </div>
    <div class="command-container">
        <a name="attr"></a>
        <h2>Command attr</h2>
        <b class="section">Synopsis:</b>
        <p>attr</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Opens a dialog for editing the attributes of the focused element.</p>
    </div>
    <div class="command-container">
        <a name="static"></a>
        <h2>Command static</h2>
        <b class="section">Synopsis:</b>
        <p>static</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Disable editor function an switch to static HTML. This is useful for copying marked text.</p>
    </div>
    <a name="Load &amp; Save"></a>
    <h1>Load &amp; Save Commands</h1>
    <div class="command-container">
        <a name="load"></a>
        <h2>Command load</h2>
        <b class="section">Synopsis:</b>
        <p>load [
            <i>pagename</i>]</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+L</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Load page.</p>
        <b class="section">Parameters:</b>
        <p>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <i>pagename</i>
                        </td>
                        <td>Name of page.</td>
                    </tr>
                </tbody>
            </table>
        </p>
    </div>
    <div class="command-container">
        <a name="save"></a>
        <h2>Command save</h2>
        <b class="section">Synopsis:</b>
        <p>save [
            <i>pagename</i>]</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+S</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Save page.</p>
        <b class="section">Parameters:</b>
        <p>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <i>pagename</i>
                        </td>
                        <td>Name of page.</td>
                    </tr>
                </tbody>
            </table>
        </p>
    </div>
    <a name="General"></a>
    <h1>General Commands</h1>
    <div class="command-container">
        <a name="link"></a>
        <h2>Command link</h2>
        <b class="section">Synopsis:</b>
        <p>link
            <i>target</i>[prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'link'.</p>
        <b class="section">Parameters:</b>
        <p>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <i>target</i>
                        </td>
                        <td>Target URL.</td>
                    </tr>
                </tbody>
            </table>
        </p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="img"></a>
        <h2>Command img</h2>
        <b class="section">Synopsis:</b>
        <p>img
            <i>width</i>
            <i>url</i>[prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert an image.</p>
        <b class="section">Parameters:</b>
        <p>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <i>width</i>
                        </td>
                        <td>Width of image.</td>
                    </tr>
                    <tr>
                        <td>
                            <i>url</i>
                        </td>
                        <td>Url of image.</td>
                    </tr>
                </tbody>
            </table>
        </p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <p>Element is not direclty editable. It is a simple element which cannot have child elements.</p>
    </div>
    <div class="command-container">
        <a name="h1"></a>
        <h2>Command h1</h2>
        <b class="section">Synopsis:</b>
        <p>h1 [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'h1'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="h2"></a>
        <h2>Command h2</h2>
        <b class="section">Synopsis:</b>
        <p>h2 [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'h2'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="h3"></a>
        <h2>Command h3</h2>
        <b class="section">Synopsis:</b>
        <p>h3 [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'h3'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="div"></a>
        <h2>Command div</h2>
        <b class="section">Synopsis:</b>
        <p>div [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'div'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="pre"></a>
        <h2>Command pre</h2>
        <b class="section">Synopsis:</b>
        <p>pre [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'pre'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="bold"></a>
        <h2>Command bold</h2>
        <b class="section">Synopsis:</b>
        <p>bold [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'bold'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="span"></a>
        <h2>Command span</h2>
        <b class="section">Synopsis:</b>
        <p>span [prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'span'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <p>Element is directly editable. It cannot have child elements.</p>
    </div>
    <div class="command-container">
        <a name="paragraph"></a>
        <h2>Command paragraph</h2>
        <b class="section">Synopsis:</b>
        <p>paragraph [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'paragraph'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="italic"></a>
        <h2>Command italic</h2>
        <b class="section">Synopsis:</b>
        <p>italic [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'italic'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'leaf'.</p>
    </div>
    <div class="command-container">
        <a name="icon"></a>
        <h2>Command icon</h2>
        <b class="section">Synopsis:</b>
        <p>icon
            <i>name</i>[prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert Bootstrap icon.</p>
        <b class="section">Parameters:</b>
        <p>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <i>name</i>
                        </td>
                        <td>Name of icon (heart, glass,...)</td>
                    </tr>
                </tbody>
            </table>
        </p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <p>Element is not direclty editable. It is a simple element which cannot have child elements.</p>
    </div>
    <a name="Lists"></a>
    <h1>Lists Commands</h1>
    <div class="command-container">
        <a name="ol"></a>
        <h2>Command ol</h2>
        <b class="section">Synopsis:</b>
        <p>ol [prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'ol'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <p>Element is not direclty editable. The element can have child elements which may be directly editable. By default a editable SPAN element is inserted</p>
    </div>
    <div class="command-container">
        <a name="ul"></a>
        <h2>Command ul</h2>
        <b class="section">Synopsis:</b>
        <p>ul [prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'ul'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <p>Element is not direclty editable. The element can have child elements which may be directly editable. By default a editable SPAN element is inserted</p>
    </div>
    <div class="command-container">
        <a name="li"></a>
        <h2>Command li</h2>
        <b class="section">Synopsis:</b>
        <p>li [prepend|append|before|after|sibling] [container|leaf]</p>
        <b class="section">Keyboard Shortcut:</b>
        <p>Alt+I</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'li'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
                <tr>
                    <td>sibling</td>
                    <td>Inserts new element as a sibling of next 'li' element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'sibling'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'container'.</p>
    </div>
    <a name="Tables"></a>
    <h1>Tables Commands</h1>
    <div class="command-container">
        <a name="table"></a>
        <h2>Command table</h2>
        <b class="section">Synopsis:</b>
        <p>table [prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'table'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <p>Element is not direclty editable. The element can have child elements which may be directly editable. By default a editable SPAN element is inserted</p>
    </div>
    <div class="command-container">
        <a name="tr"></a>
        <h2>Command tr</h2>
        <b class="section">Synopsis:</b>
        <p>tr [prepend|append|before|after]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'tr'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <p>Element is not direclty editable. The element can have child elements which may be directly editable. By default a editable SPAN element is inserted</p>
    </div>
    <div class="command-container">
        <a name="td"></a>
        <h2>Command td</h2>
        <b class="section">Synopsis:</b>
        <p>td [prepend|append|before|after] [container|leaf]</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Insert tag 'td'.</p>
        <b class="section">Insertion options:</b>
        <table>
            <tbody>
                <tr>
                    <td>after</td>
                    <td>Inserts new element after focused dom element.</td>
                </tr>
                <tr>
                    <td>before</td>
                    <td>Inserts new element before focused dom element.</td>
                </tr>
                <tr>
                    <td>prepend</td>
                    <td>Inserts new element as first child of focused dom element.</td>
                </tr>
                <tr>
                    <td>append</td>
                    <td>Inserts new element as last child of focused dom element.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'after'.</p>
        <b class="section">Container options:</b>
        <table>
            <tbody>
                <tr>
                    <td>leaf</td>
                    <td>New element is inserted as a direclty editable leaf element. The leaf element cannot have child elements.</td>
                </tr>
                <tr>
                    <td>container</td>
                    <td>New element is inserted as a container which can have child elements. By default an editable SPAN child element is created.</td>
                </tr>
            </tbody>
        </table>
        <p>Default is 'container'.</p>
    </div>
</div>