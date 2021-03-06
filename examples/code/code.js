var myCodeMirror = CodeMirror(document.getElementById("codeColumn"), {
	value: "",
	mode:  "javascript",
	lineNumbers: true,
	theme: "mdn-like"
}).on('change', (editor,event) => {
	// console.log( editor.getValue() );
	try{
		resetCP();
		eval(editor.getValue());
		project.draw();
		// success
		consoleDiv.innerHTML = "";
	}
	catch(err){
		consoleDiv.innerHTML = err;
		console.log(err);
	}
});

var consoleDiv = document.createElement("div");
consoleDiv.id = "code-console";
document.getElementById("codeColumn").appendChild(consoleDiv)

var cp = new CreasePattern();
var project = new OrigamiPaper("canvas", cp);
project.setPadding(0.05);

//reflection
// programmatically inspect object
// inspecting an object and doing something with it
function getAllMethods(object) {
	return Object.getOwnPropertyNames(object).filter(function(property) {
		return typeof object[property] == 'function';
	});
}
console.log(getAllMethods(CreasePattern.prototype));

// var boundCrease = cp.crease.bind(cp)
// window.creaseRay = cp.creaseRay;
window.crease = cp.crease.bind(cp);

// console.log(window.cp);
// function creaseRay(ray) {
// 		cp.creaseRay(ray);
// }

// console.log(Object.getOwnPropertyNames(CreasePattern));

function resetCP(){
	project.cp.clear();
}

project.onFrame = function(event){ }
project.onResize = function(event){ }
project.onMouseMove = function(event){ }
project.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point);
	console.log(nearest);
	var keys = Object.keys(nearest);
	var consoleString = "";
	for(var i = 0; i < keys.length; i++){
		if(nearest[keys[i]] !== undefined){
			var cpObject = "cp." + keys[i] + "s[" + nearest[keys[i]].index + "]";
			consoleString += keys[i] + ": <a href='#' onclick='injectCode(\"" + cpObject + "\")'>" + cpObject + "</a><br>";
		}
	}
	consoleDiv.innerHTML = consoleString;
	// var nearestEdge = this.cp.nearest(event.point).edge || {};
	// if(nearestEdge !== undefined){
	// 	updateCodeMirror("cp.edges[" + nearestEdge.edge.index + "]");
	// 	// console.log( nearest.edge.edge.index );
	// }
}

function injectCode(string){
	var cm = document.getElementsByClassName("CodeMirror")[0].CodeMirror;
	var doc = cm.getDoc();
	var cursor = doc.getCursor();
	var line = doc.getLine(cursor.line);
	var newline = '\n';
	if(cursor.ch == 0){ newline = ''; }
	var pos = { // create a new object to avoid mutation of the original selection
		line: (doc.size+5),
		ch: line.length - 1 // set the character position to the end of the line
	}
	doc.replaceRange(newline+string, pos);

}
