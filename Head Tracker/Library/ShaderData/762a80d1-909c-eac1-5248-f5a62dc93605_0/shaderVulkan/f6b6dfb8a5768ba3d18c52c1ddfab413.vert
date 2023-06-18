#version 300 es

uniform u_Model { mat4 _u_Model; };
uniform u_TransposeInvModel { mat4 _u_TransposeInvModel; };
uniform u_MVP { mat4 _u_MVP; };

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
    vec2 _23 = vec2(attTexcoord0.x, 1.0 - attTexcoord0.y);
    v_uv0 = _23;
    v_uv0_src = _23;
    v_uv1 = vec2(attTexcoord1.x, 1.0 - attTexcoord1.y);
    vec4 _69 = vec4(attPosition, 1.0);
    v_posWS = (_u_Model * _69).xyz;
    v_nDirWS = (_u_TransposeInvModel * vec4(attNormal, 0.0)).xyz;
    v_tDirWS = (_u_Model * vec4(attTangent.xyz, 0.0)).xyz;
    v_bDirWS = (_u_Model * vec4(normalize(cross(attNormal, attTangent.xyz)) * attTangent.w, 0.0)).xyz;
    gl_Position = _u_MVP * _69;
    v_gl_pos = gl_Position;
    v_gl_pos = gl_Position;
    gl_Position.z = (gl_Position.z + gl_Position.w) * 0.5f;
}

