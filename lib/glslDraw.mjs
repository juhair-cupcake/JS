function createShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  } else {
    gl.deleteShader(shader);
    throw new Error(gl.getShaderInfoLog(shader));
  }
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  } else {
    gl.deleteProgram(program);
    throw new Error(gl.getProgramInfoLog(program));
  }
}

// mian-function
function draw(canvas, fragmentShaderSource) {
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("webgl not supported!!!");

  const positionBuffer = gl.createBuffer();
  const program = createProgram(
    gl,
    createShader(
      gl,
      gl.VERTEX_SHADER,
      "attribute vec4 p; void main() { gl_Position = p; }",
    ),
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource),
  );
  let TIME = 0,
    MOUSE_X = 0,
    MOUSE_Y = 0;

  // draw the shape
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1.0, -1.0, +1.0, -1.0, +1.0, +1.0, -1.0, +1.0]),
    gl.STATIC_DRAW,
  );

  // vertex attribute
  const positionAttributeLocation = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // get mouse value
  canvas.onmousemove = (e) => {
    MOUSE_X = e.offsetX;
    MOUSE_Y = e.offsetY;
  };

  //clean the viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  //drawing loop
  (function loop() {
    //fragment attributes
    gl.uniform1f(gl.getUniformLocation(program, "u_time"), TIME++);
    gl.uniform2f(
      gl.getUniformLocation(program, "u_resolution"),
      canvas.width,
      canvas.height,
    );
    gl.uniform2f(gl.getUniformLocation(program, "u_mouse"), MOUSE_X, MOUSE_Y);

    //draw and draw
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(loop);
  })();
}

export default draw;
