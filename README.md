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
<div>
    <a name="Introduction"></a>
    <h1>Introduction</h1>
    <i>Merowech</i>is a HTML WYSIWYG DOM tree editor:
    <ul>
        <li>Edit HTML in your browser.</li>
        <li>It is WYSIWYG because you can see the result directly.</li>
        <li>The DOM tree is not hidden from the user. Actually you edit the DOM directly. Also the DOM tree is esential for navigation within
            <i>Merowech</i>.
        </li>
    </ul>
    <i>Merowech</i>originated from the need of a personal wiki. I tested some of the available solutions but found that the process of (1) editing wiki markup (2) change mode and then view the result HTML page does not make sense for a personal wiki. For a personal note taking software I would prefer WYSIWYG. On the other hand I like technical markup languages (HTML, markdown) because they are very precise and allow you to do a lot of more things than in a WYSIWYG editor. So would it be possible to combine the technical approach of markup languages with the WYSIWYG approach?
    <i>Merovech</i>tries to do this. Modern browsers support editing of DOM nodes.
    <i>Merovech</i>
    uses this functionality to allow editing of simple text in the browser.
    <i>Merovech</i>adds functionality for navigating the DOM. By the (Alt+) cursor keys you can move to th enext/previous/parent/child node of a DOM node. Also functionalities for copying, cutting, deleting DOM nodes are supported. viewing the rendered result page
    <h1>Installation</h1>
    <h1>Browser Support</h1>
    <h1>General Usage Concepts</h1>
    <h2>Navigation</h2>
    <h2>Executing Commands</h2>
</div>

<div id="commandreference">
    <a id="Navigation"></a>
    <h1>Navigation Commands</h1>
    <div class="command-container">
        <a id="prev"></a>
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
        <a id="next"></a>
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
        <a id="parent"></a>
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
        <a id="child"></a>
        <h2>Command child</h2>
        <b class="section">Synopsis:</b>
        <p>child</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Move focus to first child.</p>
    </div>
    <a id="Tools"></a>
    <h1>Tools Commands</h1>
    <div class="command-container">
        <a id="copy"></a>
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
        <a id="paste"></a>
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
        <a id="cut"></a>
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
        <a id="uncut"></a>
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
        <a id="undo"></a>
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
        <a id="del"></a>
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
        <a id="attr"></a>
        <h2>Command attr</h2>
        <b class="section">Synopsis:</b>
        <p>attr</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Opens a dialog for editing the attributes of the focused element.</p>
    </div>
    <div class="command-container">
        <a id="static"></a>
        <h2>Command static</h2>
        <b class="section">Synopsis:</b>
        <p>static</p>
        <b class="section">Description:
            <b></b>
        </b>
        <p>Disable editor function an switch to static HTML. This is useful for copying marked text.</p>
    </div>
    <a id="Load &amp; Save"></a>
    <h1>Load &amp; Save Commands</h1>
    <div class="command-container">
        <a id="load"></a>
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
        <a id="save"></a>
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
    <a id="General"></a>
    <h1>General Commands</h1>
    <div class="command-container">
        <a id="link"></a>
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
        <a id="img"></a>
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
        <a id="h1"></a>
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
        <a id="h2"></a>
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
        <a id="h3"></a>
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
        <a id="div"></a>
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
        <a id="pre"></a>
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
        <a id="bold"></a>
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
        <a id="span"></a>
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
        <a id="paragraph"></a>
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
        <a id="italic"></a>
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
        <a id="icon"></a>
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
    <a id="Lists"></a>
    <h1>Lists Commands</h1>
    <div class="command-container">
        <a id="ol"></a>
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
        <a id="ul"></a>
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
        <a id="li"></a>
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
    <a id="Tables"></a>
    <h1>Tables Commands</h1>
    <div class="command-container">
        <a id="table"></a>
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
        <a id="tr"></a>
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
        <a id="td"></a>
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