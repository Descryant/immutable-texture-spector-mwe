export default class ShaderProgram
{
    constructor(vertexShaderSource, fragmentShaderSource)
    {
        this._program = null;
        this._attributes = new Map();
        this._uniforms = new Map();

        this.create(vertexShaderSource, fragmentShaderSource);
    }

    get program()
    {
        return this._program;
    }

    create(vertexShaderSource, fragmentShaderSource)
    {
        if (this._program) gl.deleteProgram(this._program);

        let vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
        let fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
        let program = this._program = createProgram(vertexShader, fragmentShader);

        const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        this._attributes.clear();
        for (let i = 0; i < numAttributes; ++i)
        {
            const info = gl.getActiveAttrib(program, i);
            this._attributes.set(info.name, gl.getAttribLocation(program, info.name));
        }

        const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        this._uniforms.clear();
        for (let i = 0; i < numUniforms; ++i)
        {
            const info = gl.getActiveAttrib(program, i);
            this._uniforms.set(info.name, gl.getUniformLocation(program, info.name));
        }
    }

    getAttributeLocation(name)
    {
        return this._attributes.get(name);
    }

    setUniform1i(name, value)
    {
        gl.uniform1i(this._uniforms.get(name), value);
    }

    use()
    {
        gl.useProgram(this.program);
    }
}

function createShader(shaderSource, shaderType)
{
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.error("could not compile shader:" + gl.getShaderInfoLog(shader));
    }

    return shader;
}

function createProgram(vertexShader, fragmentShader)
{
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error("program failed to link:" + gl.getProgramInfoLog(program));
    }

    return program;
};