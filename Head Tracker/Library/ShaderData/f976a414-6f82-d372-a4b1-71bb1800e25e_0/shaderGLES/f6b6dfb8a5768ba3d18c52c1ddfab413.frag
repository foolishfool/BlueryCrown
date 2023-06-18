#version 300 es
precision highp float;
precision highp int;

uniform mediump sampler2D _BaseTexture;
uniform vec4 _BaseColor;
uniform mediump sampler2D _OpacityTexture;
uniform vec4 u_WorldSpaceCameraPos;

in vec2 g_vary_uv0;
layout(location = 0) out vec4 o_fragColor;
in vec4 v_sampling_pos;
in vec4 v_background_pos;
in vec3 v_worldPos;
in vec3 v_Normal;

void main()
{
    vec2 uv = g_vary_uv0;
    uv.y = 1.0 - uv.y;
    vec4 texColor = texture(_BaseTexture, uv) * _BaseColor;
    vec4 t_OpacityTex = texture(_OpacityTexture, uv);
    texColor.w *= t_OpacityTex.x;
    o_fragColor = texColor;
}

