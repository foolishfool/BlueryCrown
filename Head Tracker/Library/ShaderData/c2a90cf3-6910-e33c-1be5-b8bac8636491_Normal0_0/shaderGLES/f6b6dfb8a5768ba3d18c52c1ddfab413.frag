#version 300 es
precision highp float;
precision highp int;

uniform mediump sampler2D _MainTex;
uniform vec4 u_color;
uniform float u_opacity;

in vec2 v_texCoord;
layout(location = 0) out vec4 o_fragColor;

void main()
{
    o_fragColor = (texture(_MainTex, v_texCoord) * u_color) * u_opacity;
}

