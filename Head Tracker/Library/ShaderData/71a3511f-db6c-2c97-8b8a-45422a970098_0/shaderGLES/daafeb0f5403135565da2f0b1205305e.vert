#version 300 es

uniform mat4 u_Palatte[50];
uniform mat4 u_Model;
uniform mat4 u_TransposeInvModel;
uniform mat4 u_MVP;

layout(location = 6) in vec4 attBoneIds;
layout(location = 7) in vec4 attWeights;
out vec2 v_uv0_src;
out vec2 v_uv0;
layout(location = 2) in vec2 attTexcoord0;
out vec2 v_uv1;
layout(location = 3) in vec2 attTexcoord1;
layout(location = 1) in vec3 attNormal;
layout(location = 4) in vec4 attTangent;
layout(location = 0) in vec3 attPosition;
out vec3 v_posWS;
out vec3 v_nDirWS;
out vec3 v_tDirWS;
out vec3 v_bDirWS;
out vec4 v_gl_pos;

void main()
{
    vec2 _115 = vec2(attTexcoord0.x, 1.0 - attTexcoord0.y);
    v_uv0 = _115;
    v_uv0_src = _115;
    v_uv1 = vec2(attTexcoord1.x, 1.0 - attTexcoord1.y);
    mat4 _242 = u_Palatte[int(attBoneIds.x)] * attWeights.x;
    mat4 _250 = u_Palatte[int(attBoneIds.y)] * attWeights.y;
    mat4 _271 = u_Palatte[int(attBoneIds.z)] * attWeights.z;
    mat4 _292 = u_Palatte[int(attBoneIds.w)] * attWeights.w;
    mat4 _305 = mat4(((_242[0] + _250[0]) + _271[0]) + _292[0], ((_242[1] + _250[1]) + _271[1]) + _292[1], ((_242[2] + _250[2]) + _271[2]) + _292[2], ((_242[3] + _250[3]) + _271[3]) + _292[3]);
    vec4 _149 = _305 * vec4(attPosition, 1.0);
    vec4 _158 = _305 * vec4(attNormal, 0.0);
    v_posWS = (u_Model * _149).xyz;
    v_nDirWS = (u_TransposeInvModel * vec4(_158.xyz, 0.0)).xyz;
    vec4 _185 = _305 * vec4(attTangent.xyz, 0.0);
    vec4 _194 = _305 * vec4(normalize(cross(attNormal, attTangent.xyz)) * attTangent.w, 0.0);
    v_tDirWS = (u_Model * vec4(_185.xyz, 0.0)).xyz;
    v_bDirWS = (u_Model * vec4(_194.xyz, 0.0)).xyz;
    gl_Position = u_MVP * _149;
    v_gl_pos = gl_Position;
}

