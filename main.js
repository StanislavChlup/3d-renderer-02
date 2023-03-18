var canvas;
var context;
var points = JSON.parse('[{"x":-100,"y":-100,"z":-100},{"x":-100,"y":100,"z":-100},{"x":100,"y":-100,"z":-100},{"x":100,"y":100,"z":-100},{"x":-100,"y":-100,"z":100},{"x":-100,"y":100,"z":100},{"x":100,"y":-100,"z":100},{"x":100,"y":100,"z":100},{"x":-200,"y":-200,"z":-200},{"x":-200,"y":200,"z":-200},{"x":200,"y":-200,"z":-200},{"x":200,"y":200,"z":-200},{"x":-200,"y":-200,"z":200},{"x":-200,"y":200,"z":200},{"x":200,"y":-200,"z":200},{"x":200,"y":200,"z":200}]');
var edges = JSON.parse('[{"a":0,"b":1},{"a":1,"b":3},{"a":3,"b":2},{"a":2,"b":0},{"a":0,"b":4},{"a":1,"b":5},{"a":2,"b":6},{"a":3,"b":7},{"a":4,"b":5},{"a":5,"b":7},{"a":7,"b":6},{"a":6,"b":4},{"a":0,"b":8},{"a":1,"b":9},{"a":2,"b":10},{"a":3,"b":11},{"a":4,"b":12},{"a":5,"b":13},{"a":6,"b":14},{"a":7,"b":15},{"a":8,"b":9},{"a":9,"b":11},{"a":11,"b":10},{"a":10,"b":8},{"a":8,"b":12},{"a":9,"b":13},{"a":10,"b":14},{"a":11,"b":15},{"a":12,"b":13},{"a":13,"b":15},{"a":15,"b":14},{"a":14,"b":12}]');
var cam = 1000;
var rotx = 0;
var roty = 0;
var rotz = 0;

window.onload = function(){
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	context.translate(500,500);
	render();
}
function render(){
cam = +document.getElementById('cam').value;
rotx = +document.getElementById('rotx').value;
roty = +document.getElementById('roty').value;
rotz = +document.getElementById('rotz').value;

clear();
drawpoints(camera(cam,rotate(points,rotx,roty,rotz)));
drawedges(camera(cam,rotate(points,rotx,roty,rotz)),edges);
}

function reset(){
	cam=1000;rotx=0;roty=0;rotz=0;
	document.getElementById('cam').value=cam;
	document.getElementById('rotx').value=rotx;
	document.getElementById('roty').value=roty;
	document.getElementById('rotz').value=rotz;
	render();
}

function rgb(r,g,b){
	r = r % 256;
	g = g % 256;
	b = b % 256;
	rr = r.toString(16);
	gg = g.toString(16);
	bb = b.toString(16);
	if (r<16) {rr = '0' + rr;}
	if (g<16) {gg = '0' + gg;}
	if (b<16) {bb = '0' + bb;}
	return '#' + rr + gg + bb;
}

function rotate(points,rotx,roty,rotz){
	
	roty *= -1;
	rotx *= -1;

	var pointsx = Array.from({length: points.length}, () => ({x:undefined,y:undefined,z:undefined}));
	var pointsy = Array.from({length: points.length}, () => ({x:undefined,y:undefined,z:undefined}));
	var pointsz = Array.from({length: points.length}, () => ({x:undefined,y:undefined,z:undefined}));

	while (rotx > 360) {rotx -= 360;}
	rotx = rotx * (Math.PI / 180);
	while (roty > 360) {roty -= 360;}
	roty = -1 * roty * (Math.PI / 180);
	while (rotz > 360) {rotz -= 360;}
	rotz = rotz * (Math.PI / 180);

	for (var i in points) {
		pointsz[i].x = points[i].x*Math.cos(rotz)-points[i].y*Math.sin(rotz);
		pointsz[i].y = points[i].x*Math.sin(rotz)+points[i].y*Math.cos(rotz);
		pointsz[i].z = points[i].z;
	}
	
	for (var i in points) {
		pointsy[i].x = pointsz[i].x*Math.cos(roty)-pointsz[i].z*Math.sin(roty);
		pointsy[i].z = pointsz[i].x*Math.sin(roty)+pointsz[i].z*Math.cos(roty);
		pointsy[i].y = pointsz[i].y;
	}
	
	for (var i in points) {
		pointsx[i].y = pointsy[i].y*Math.cos(rotx)-pointsy[i].z*Math.sin(rotx);
		pointsx[i].z = pointsy[i].y*Math.sin(rotx)+pointsy[i].z*Math.cos(rotx);
		pointsx[i].x = pointsy[i].x;
	}
	
	return pointsx;
}
	
function camera(cam,points){
	var pointsc = Array.from({length: points.length}, () => ({x:undefined,y:undefined,z:undefined}));

	for (var i in points) {
		pointsc[i].x = ((cam*points[i].x)/(cam+points[i].z));
		pointsc[i].y = ((cam*points[i].y)/(cam+points[i].z));
		pointsc[i].z = points[i].z;
	}
	return pointsc;
}

function clear(){
	context.beginPath();
	context.rect(-500,-500,1000,1000);
	context.fillStyle = '#000000ff';
	context.fill();
}

function drawpoints(points){
	for(i=0;i<points.length;i++){
		context.beginPath();
		context.arc(points[i].x,points[i].y,10,0,2*Math.PI);
		context.fillStyle = rgb(255,255,255);
		context.fill();
	}
}

function drawedges(points,edges){
	for(i=0;i<edges.length;i++){
		context.beginPath();
		context.moveTo(points[edges[i].a].x,points[edges[i].a].y);
		context.lineTo(points[edges[i].b].x,points[edges[i].b].y);
		context.lineWidth = 3;
		context.strokeStyle = rgb(200,200,200);
		context.stroke();
	}
}
