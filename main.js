import Canvas from "./Canvas.js";
import ShaderProgram from "./ShaderProgram.js";
import {defaultVertexShader, defaultFragmentShader} from "./shaders/DefaultShader.js";

const positions =
[
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
];

const texcoords =
[
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1,
];

let canvas = new Canvas(document.querySelector("#canvas"));
globalThis.gl = canvas.context;
if (!gl) console.error("no webgl :(");

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.clearColor(0, 0, 0, 1);

let program = new ShaderProgram(defaultVertexShader, defaultFragmentShader)
program.use();
program.setUniform1i("u_texture", 0);

let vao = gl.createVertexArray();
gl.bindVertexArray(vao);

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
let positionAttributeLocation = program.getAttributeLocation("a_position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

let texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
let texcoordAttributeLocation = program.getAttributeLocation("a_texcoord");
gl.enableVertexAttribArray(texcoordAttributeLocation);
gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

let textureA = gl.createTexture();
const texWidth = 256;
const texHeight = 256;
let numMipmapLevels = Math.floor(Math.log2(Math.max(texWidth, texHeight))) + 1;
let image = new Image();
image.src = "assets/f-texture.png";
image.addEventListener('load', function()
{
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureA);

    // specify mutable storage and upload image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, texWidth, texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // specify immutable storage and upload image
    // gl.texStorage2D(gl.TEXTURE_2D, numMipmapLevels, gl.RGBA8, texWidth, texHeight);
    // gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, texWidth, texHeight, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.generateMipmap(gl.TEXTURE_2D);
});

function frame(time)
{
    canvas.resizeToDisplaySize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
