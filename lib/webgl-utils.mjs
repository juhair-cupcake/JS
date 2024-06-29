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

export function compiler(gl, vShader, fShader) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vShader);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fShader);
  const program = gl.createProgram();

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);

  gl.linkProgram(program);
  gl.useProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  } else {
    gl.deleteProgram(program);
    throw new Error(gl.getProgramInfoLog(program));
  }
}

export function bufferGenerator(
  gl,
  program,
  vertices,
  attrName,
  attrSize,
  attrType,
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const attribute = gl.getAttribLocation(program, attrName);
  gl.vertexAttribPointer(attribute, attrSize, attrType, false, 0, 0);
  gl.enableVertexAttribArray(attribute);
}

export function glslDraw(canvas, glsl) {
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("webgl not supported!!!");

  //variables
  const startingTime = new Date().getTime();
  let deltaTime = 0;
  let mouse = { x: 0, y: 0 };

  //update cursor position info
  canvas.onmousemove = (e) => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
  };

  //link the shaders with the program
  const vertexShaderSource =
    "attribute vec4 a_position; void main() { gl_Position = a_position; }";
  const fragmentShaderSource = glsl;
  const program = compiler(gl, vertexShaderSource, fragmentShaderSource);

  //triangle fan buffer
  bufferGenerator(
    gl,
    program,
    new Float32Array([-1.0, -1.0, +1.0, -1.0, +1.0, +1.0, -1.0, +1.0]),
    "a_position",
    2,
    gl.FLOAT,
  );

  //attributes
  const unRes = gl.getUniformLocation(program, "u_resolution");
  const unTime = gl.getUniformLocation(program, "u_time");
  const unMouse = gl.getUniformLocation(program, "u_mouse");

  //update attributes
  gl.uniform2f(unRes, canvas.width, canvas.height);

  //drawing loop
  (function loop() {
    deltaTime = new Date().getTime() - startingTime;

    //update attributes
    gl.uniform1f(unTime, deltaTime);
    gl.uniform2f(unMouse, mouse.x, mouse.y);

    //draw and draw
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(loop);
  })();
}
