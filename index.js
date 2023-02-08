var gl;

var theta;
var thetaLoc;

var start=false;

var isDirClockwise = false;
var delay = 100;

var RedLoc;
var GreenLoc;
var BlueLoc;
var OpaklikLoc;
var redv;
var greenv;
var bluev;
var opaklikv;

var translationX = 0;
var translationY = 0;
var translationLoc;

var scalinv = 1;
var scalinLoc;

window.onload = function init() {

	const canvas = document.querySelector("#glcanvas");
	// Initialize the GL context
	gl = WebGLUtils.setupWebGL(canvas);	
	// Only continue if WebGL is available and working
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}  
  
	var program = initShaders(gl, "vertex-shader" , "fragment-shader" );  
	gl.useProgram( program );
	
	// Button.
	var StarStop = document.getElementById("ControlButton"); 
	ControlButton.addEventListener("click", function() { start= !start  });
	
	// Menü.
	var m = document.getElementById("mymenu");
	m.addEventListener("click", function() {
		switch (m.selectedIndex) {
			case 0:
				isDirClockwise = !isDirClockwise;
				break;
			case 1:
				delay /= 2.0;
				break;
			case 2:
				delay *= 2.0;
				break;
		}
	});

	// Sliders
	document.getElementById("slideR").onchange = function() { redv=this.value;	
	RedLoc = gl.getUniformLocation(program, "Red");
	gl.uniform1f(RedLoc, redv);
	};	
	document.getElementById("slideG").onchange = function() { greenv=this.value;
	GreenLoc = gl.getUniformLocation(program, "Green");
	gl.uniform1f(GreenLoc, greenv);
	};
	document.getElementById("slideB").onchange = function() { bluev=this.value;
	BlueLoc = gl.getUniformLocation(program, "Blue");
	gl.uniform1f(BlueLoc, bluev);
	};
	document.getElementById("slideO").onchange = function() { opaklikv=this.value;
	OpaklikLoc = gl.getUniformLocation(program, "Opaklik");
	gl.uniform1f(OpaklikLoc, opaklikv);	
	};
	
	// Scaling
	window.addEventListener("keydown", function (event) {
        switch (event.key) {
          case "-":
            scalinv -= 0.05;
            break;
          case "+":
            scalinv += 0.05;
            break;
           default:
            return;
        };
    })	

	// Translation
	window.addEventListener("keydown", function (event) {
        switch (event.key) {
          case "s":
            translationY -= 0.05;
            break;
          case "w":
            translationY += 0.05;
            break;
          case "a":
              translationX -= 0.05;
            break;
          case "d":
            translationX += 0.05;
            break;
          default:
            return;
        };
    })	
	
	// Description the letter Ü and İ 	
	var vertices = [	
		              vec2(-0.2,0.3),vec2(-0.4,0.3),vec2(-0.2,-0.5)
					  ,vec2(-0.2,-0.5),vec2(-0.4,0.3),vec2(-0.4,-0.5)
					  ,vec2(-1.0,0.3),vec2(-0.8,0.3),vec2(-0.8,-0.5)
					  ,vec2(-1.0,0.3),vec2(-0.8,-0.5),vec2(-1.0,-0.5)
					  
					  ,vec2(-0.4,-0.3),vec2(-0.8,-0.3),vec2(-0.8,-0.5)
					  ,vec2(-0.4,-0.3),vec2(-0.4,-0.5),vec2(-0.8,-0.5)
					  
					  ,vec2(-0.9,0.8),vec2(-0.9,0.6),vec2(-0.7,0.6)
					  ,vec2(-0.9,0.8),vec2(-0.7,0.8),vec2(-0.7,0.6)
					  ,vec2(-0.5,0.8),vec2(-0.3,0.6),vec2(-0.3,0.8)
					  ,vec2(-0.5,0.8),vec2(-0.3,0.6),vec2(-0.5,0.6)


					  ,vec2(0.4,0.8),vec2(0.4,0.6),vec2(0.2,0.6)
					  ,vec2(0.2,0.8),vec2(0.4,0.8),vec2(0.2,0.6)

					  ,vec2(0.2,0.3),vec2(0.4,0.3),vec2(0.2,-0.5)
					  ,vec2(0.4,0.3),vec2(0.2,-0.5),vec2(0.4,-0.5)
					];
					
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
	
	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	thetaLoc = gl.getUniformLocation(program, "theta");
	theta = 0;
	gl.uniform1f(thetaLoc, theta);
	
	// Set the scaling
	scalinLoc = gl.getUniformLocation(program, "scaling");
	gl.uniform1f(scalinLoc,scalinv);			
	
	// Set the translation
	translationLoc = gl.getUniformLocation(program, "translation");
	gl.uniform4f(translationLoc, translationX, translationY, 0.0, 0.0);	
			
	//Set the color
	RedLoc = gl.getUniformLocation(program, "Red");
	gl.uniform1f(RedLoc, 0);
	GreenLoc = gl.getUniformLocation(program, "Green");
	gl.uniform1f(GreenLoc, 0);	
	BlueLoc = gl.getUniformLocation(program, "Blue");
	gl.uniform1f(BlueLoc, 0);	
	OpaklikLoc = gl.getUniformLocation(program, "Opaklik");
	gl.uniform1f(OpaklikLoc, 1);
		
	// Set clear color to black, fully opaque
	gl.clearColor( 0.9 , 0.9 , 0.9 , 1.0 );
	
	requestAnimFrame(render);	
};

function render(){	
	
	setTimeout(function()
	{
	gl.uniform1f(scalinLoc,scalinv);	
	gl.uniform4f(translationLoc, translationX, translationY, 0.0, 0.0);	
	gl.clear(gl.COLOR_BUFFER_BIT);
	if(start){
	theta += (isDirClockwise ? 0.2 : -0.2);
	}
	gl.uniform1f(thetaLoc, theta);
	gl.drawArrays(gl.TRIANGLES, 0, 48);
	
	requestAnimFrame(render);
	}, delay);

}