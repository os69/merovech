<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns:hx="http://purl.org/NET/hinclude">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet/less" type="text/css" href="css/help.less">

<script src="lib/less.js" type="text/javascript"></script>
<script src="lib/jquery-1.8.0.min.js" type="text/javascript"></script>
<script src="js/mero.core.js"></script>
<script src="js/mero.commands.js"></script>


<title>Help</title>

</head>

<body>

	<div class="help-container">
		<div id="toc"></div>
		<div>
			<h1>Introduction</h1>
			<i>Merowech</i> is a HTML WYSIWYG DOM tree editor:
			<ul>
				<li>Edit HTML in your browser.</li>
				<li>It is WYSIWYG because you can see the result directly.</li>
				<li>The DOM tree is not hidden from the user. Actually you edit
					the DOM directly. Also the DOM tree is esential for navigation
					within <i>Merowech</i>.
				</li>
			</ul>
			<i>Merowech</i> originated from the need of a personal wiki. I tested
			some of the available solutions but found that the process of (1)
			editing wiki markup (2) change mode and then view the result HTML
			page does not make sense for a personal wiki. For a personal note
			taking software I would prefer WYSIWYG. On the other hand I like
			technical markup languages (HTML, markdown) because they are very
			precise and allow you to do a lot of more things than in a WYSIWYG
			editor. So would it be possible to combine the technical approach of
			markup languages with the WYSIWYG approach? <i>Merovech</i> tries to
			do this. Modern browsers support editing of DOM nodes. <i>Merovech</i>
			uses this functionality to allow editing of simple text in the
			browser. <i>Merovech</i> adds functionality for navigating the DOM.
			By the (Alt+) cursor keys you can move to th
			enext/previous/parent/child node of a DOM node. Also functionalities
			for copying, cutting, deleting DOM nodes are supported. viewing the
			rendered result page
			<h1>Installation</h1>
			<h1>Browser Support</h1>
			<h1>General Usage Concepts</h1>
			<h2>Navigation</h2>
			<h2>Executing Commands</h2>
		</div>

		<div id="commandreference"></div>
	</div>

	<script src="js/mero.edit.js"></script>
	<script src="js/mero.help.js"></script>

	<script type="text/javascript">
        window.mero.help.generate();
    </script>

</body>
</html>