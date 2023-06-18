#version 300 es

uniform u_Palatte { mat4 _u_Palatte[50]; };
uniform u_Model { mat4 _u_Model; };
uniform u_TransposeInvModel { mat4 _u_TransposeInvModel; };
uniform u_MVP { mat4 _u_MVP; };
uniform u_InvModel { mat4 _u_InvModel; };
uniform u_Time { vec4 _u_Time; };
uniform u_WorldSpaceCameraPos { vec4 _u_WorldSpaceCameraPos; };
uniform u_ScreenParams { vec4 _u_ScreenParams; };

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
layout(location = 5) in vec3 attColor;

mat4 BoneTransform()
{
    mat4 _33 = _u_Palatte[int(attBoneIds.x)] * attWeights.x;
    mat4 _42 = _u_Palatte[int(attBoneIds.y)] * attWeights.y;
    mat4 _55 = mat4(_33[0] + _42[0], _33[1] + _42[1], _33[2] + _42[2], _33[3] + _42[3]);
    mat4 _64 = _u_Palatte[int(attBoneIds.z)] * attWeights.z;
    mat4 _77 = mat4(_55[0] + _64[0], _55[1] + _64[1], _55[2] + _64[2], _55[3] + _64[3]);
    mat4 _86 = _u_Palatte[int(attBoneIds.w)] * attWeights.w;
    mat4 boneTransform = mat4(_77[0] + _86[0], _77[1] + _86[1], _77[2] + _86[2], _77[3] + _86[3]);
    return boneTransform;
}

void main()
{
    vec2 _115 = vec2(attTexcoord0.x, 1.0 - attTexcoord0.y);
    v_uv0 = _115;
    v_uv0_src = _115;
    v_uv1 = vec2(attTexcoord1.x, 1.0 - attTexcoord1.y);
    vec3 attBinormal = normalize(cross(attNormal, attTangent.xyz)) * attTangent.w;
    mat4 boneTransform = BoneTransform();
    vec4 bm_postiton = boneTransform * vec4(attPosition, 1.0);
    vec3 bn_normal = (boneTransform * vec4(attNormal, 0.0)).xyz;
    v_posWS = (_u_Model * bm_postiton).xyz;
    v_nDirWS = (_u_TransposeInvModel * vec4(bn_normal, 0.0)).xyz;
    vec3 bm_tangent = (boneTransform * vec4(attTangent.xyz, 0.0)).xyz;
    vec3 bm_binormal = (boneTransform * vec4(attBinormal, 0.0)).xyz;
    v_tDirWS = (_u_Model * vec4(bm_tangent, 0.0)).xyz;
    v_bDirWS = (_u_Model * vec4(bm_binormal, 0.0)).xyz;
    gl_Position = _u_MVP * bm_postiton;
    v_gl_pos = gl_Position;
    gl_Position.z = (gl_Position.z + gl_Position.w) * 0.5f;
}

