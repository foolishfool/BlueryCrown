#version 300 es

uniform mat4 u_Model;
uniform mat4 u_TransposeInvModel;
uniform mat4 u_MVP;
uniform mat4 u_InvModel;
uniform vec4 u_Time;
uniform vec4 u_WorldSpaceCameraPos;
uniform vec4 u_ScreenParams;

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
layout(location = 5) in vec3 attColor;

void main()
{
    vec2 _23 = vec2(attTexcoord0.x, 1.0 - attTexcoord0.y);
    v_uv0 = _23;
    v_uv0_src = _23;
    v_uv1 = vec2(attTexcoord1.x, 1.0 - attTexcoord1.y);
    vec3 attBinormal = normalize(cross(attNormal, attTangent.xyz)) * attTangent.w;
    vec3 usedPosition = attPosition;
    vec3 usedNormal = attNormal;
    vec3 usedTangent = attTangent.xyz;
    vec3 usedBinormal = attBinormal;
    v_posWS = (u_Model * vec4(usedPosition, 1.0)).xyz;
    v_nDirWS = (u_TransposeInvModel * vec4(usedNormal, 0.0)).xyz;
    v_tDirWS = (u_Model * vec4(usedTangent, 0.0)).xyz;
    v_bDirWS = (u_Model * vec4(usedBinormal, 0.0)).xyz;
    gl_Position = u_MVP * vec4(usedPosition, 1.0);
    v_gl_pos = gl_Position;
    v_gl_pos = gl_Position;
}

