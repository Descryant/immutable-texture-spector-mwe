export const defaultVertexShader = `#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

out vec2 v_texcoord;

void main()
{
    gl_Position = a_position;
    v_texcoord = a_texcoord;
}
`;

export const defaultFragmentShader = `#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 o_color;

void main()
{
    o_color = texture(u_texture, v_texcoord);
}
`;