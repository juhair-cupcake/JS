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

// main-function
function draw(
  canvas,
  fragmentShaderSource,
  vertexShaderSource = "attribute vec4 a_position; void main() { gl_Position = a_position; }",
) {
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("webgl not supported!!!");

  // link the shaders with the program
  const program = gl.createProgram();
  gl.attachShader(
    program,
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
  );
  gl.attachShader(
    program,
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource),
  );
  gl.linkProgram(program);
  gl.useProgram(program);

  // draw two triangle
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1.0, -1.0, +1.0, -1.0, +1.0, +1.0, -1.0, +1.0]),
    gl.STATIC_DRAW,
  );

  // vertex attributes
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // get fragment attributes value
  let u_time = 0,
    u_mouse = [0, 0],
    u_resolution = [canvas.width, canvas.height];
  // update mouse data
  canvas.onmousemove = (e) => {
    u_mouse = [e.offsetX, e.offsetY];
  };

  //drawing loop
  (function loop() {
    //fragment attributes
    gl.uniform1f(gl.getUniformLocation(program, "u_time"), u_time);
    gl.uniform2f(
      gl.getUniformLocation(program, "u_mouse"),
      u_mouse[0],
      u_mouse[1],
    );
    gl.uniform2f(
      gl.getUniformLocation(program, "u_resolution"),
      u_resolution[0],
      u_resolution[1],
    );

    // update time data
    u_time > Number.MAX_SAFE_INTEGER ? (u_time = 0) : u_time++;

    //draw and draw
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(loop);
  })();
}

export default draw;
