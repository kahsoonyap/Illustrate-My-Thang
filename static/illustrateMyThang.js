/* --------------------------- DRAWING & FORMATTING -----------------------*/
var timer = document.getElementById("timer");
var timerC = timer.getContext("2d");
timer.style.left = "1200px";
timer.style.top = "20px";
timer.style.position = "absolute";
timerC.font="30px Impact";

var countdown = 60;
var canvas = document.getElementById("drawcanvas");
var context = canvas.getContext("2d");
context.strokeStyle="black";
context.lineWidth="5";
var rect = canvas.getBoundingClientRect(); 
var timerInterval = setInterval(function(){
    if (countdown == 0){
	clearInterval(timerInterval);
	canvas.removeEventListener("mousemove",changeColor);
	canvas.removeEventListener("mousedown",drawing);
	canvas.removeEventListener("mouseup",notDraw);
	canvas.style.cursor="default";
    };
    timerC.fillStyle = "blue";
    timerC.arc(50,50,40,0,360);
    timerC.fill();
    timerC.fillStyle = "white";
    if (countdown < 10){
	timerC.fillText(countdown,40,60);
    }
    else{
	timerC.fillText(countdown,35,60);
    }
    countdown-=1;
},1000);
var isDrawing=false;
var pencil = document.getElementById("pencil");
pencil.addEventListener("mousedown",function(e){
    context.lineWidth="6";
    context.strokeStyle="black";
});
pencil.style.top = "50px";
pencil.style.left = "900px";
pencil.style.position = "absolute";
var eraser = document.getElementById("eraser");
eraser.style.top = "150px";
eraser.style.left = "900px";
eraser.style.position = "absolute";
eraser.addEventListener("mousedown",function(e){
    context.strokeStyle="white";
    context.lineWidth="15";
});
var blue = document.getElementById("blue");
blue.addEventListener("mousedown",function(e){
    context.strokeStyle="blue";
});
blue.style.top="250px";
blue.style.left="900px";
blue.style.position="absolute";

var red = document.getElementById("red");
red.addEventListener("mousedown",function(e){
    context.strokeStyle="red";
});
red.style.top="350px";
red.style.left="900px";
red.style.position="absolute";

var green = document.getElementById("green");
green.addEventListener("mousedown",function(e){
    context.strokeStyle="green";
});
green.style.top="450px";
green.style.left="900px";
green.style.position="absolute";

var yellow = document.getElementById("yellow");
yellow.addEventListener("mousedown",function(e){
    context.strokeStyle="yellow";
});
yellow.style.top="550px";
yellow.style.left="900px";
yellow.style.position="absolute";
var xPos;
var yPos;
var lastX;
var lastY;
var changeColor = function changeColor(event){
    xPos=(event.clientX-rect.left)/(rect.right-rect.left)*canvas.width;
    yPos=(event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height;
    if (isDrawing){
	context.beginPath();
	context.lineJoin="round";
	context.moveTo(lastX,lastY);
	context.lineTo(xPos,yPos);
	context.closePath();
	context.stroke();
    };
    lastX = xPos;
    lastY = yPos;
};

var drawing = function drawing(e){
    canvas.style.cursor="crosshair";
    isDrawing=true;
};

var notDraw = function notDraw(e){
    canvas.style.cursor="default";
    isDrawing=false;
    
};
canvas.addEventListener("mousemove",changeColor);
canvas.addEventListener("mousedown",drawing);
canvas.addEventListener("mouseup",notDraw);

/* ------------------------ SocketIO ------------------------------- */


$(document).ready(function(){
    //var ws = io.connect("ws://104.131.91.167:5000");
    
    //load on connection
    var ws  = io.connect("localhost:5000");
    var id = -1;
    var name = "";
    var person = prompt("Please enter your name");
    
    var joined = function joined(){
	//console.log("doing");
	ws.emit("joined", "testip");
	person;
	name = person;
	//console.log(name);
    }
    $(window).load(joined);
    ws.on("tooMany", function(){
	console.log("toomany");
	ws.disconnect();
    });

    //round/game setup
    ws.on("drawerID", function(idNumber){
	id = idNumber;
	if (id == 4){
	    ws.emit("gameStart")
	}
    });

    //chat
    ws.on("serverMessage", function(data){
	$("#chat").append("<p>" + data.nam + ": " + data.msg + "</p>");
    });

    var sendMessage = function sendMessage(){
	ws.emit("clientMessage", {msg: document.getElementById("chatBar").value, nam: name});
	document.getElementById("chatBar").value="";
	//console.log('good');
    }

    var sendMsg = document.getElementById("sendMsg");
    sendMsg.addEventListener("click", sendMessage);
    //enter key submission not working
    if (event.keyCode == 13){
	sendMessage;
    }
});
