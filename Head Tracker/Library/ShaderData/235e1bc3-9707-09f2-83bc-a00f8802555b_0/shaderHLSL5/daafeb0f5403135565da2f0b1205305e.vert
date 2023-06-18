row_major uniform float4x4 u_Palatte[50];
row_major uniform float4x4 u_Model;
row_major uniform float4x4 u_TransposeInvModel;
row_major uniform float4x4 u_MVP;
row_major uniform float4x4 u_InvModel;
uniform float4 u_Time;
uniform float4 u_WorldSpaceCameraPos;
uniform float4 u_ScreenParams;

static float4 gl_Position;
static float4 attBoneIds;
static float4 attWeights;
static float2 v_uv0_src;
static float2 v_uv0;
static float2 attTexcoord0;
static float2 v_uv1;
static float2 attTexcoord1;
static float3 attNormal;
static float4 attTangent;
static float3 attPosition;
static float3 v_posWS;
static float3 v_nDirWS;
static float3 v_tDirWS;
static float3 v_bDirWS;
static float4 v_gl_pos;
static float3 attColor;

struct SPIRV_Cross_Input
{
    float3 attPosition : attPosition;
    float3 attNormal : attNormal;
    float2 attTexcoord0 : attTexcoord0;
    float2 attTexcoord1 : attTexcoord1;
    float4 attTangent : attTangent;
    float3 attColor : attColor;
    float4 attBoneIds : attBoneIds;
    float4 attWeights : attWeights;
};

struct SPIRV_Cross_Output
{
    float4 v_gl_pos : v_gl_pos;
    float3 v_posWS : v_posWS;
    float3 v_nDirWS : v_nDirWS;
    float2 v_uv0 : v_uv0;
    float2 v_uv0_src : v_uv0_src;
    float2 v_uv1 : v_uv1;
    float3 v_tDirWS : v_tDirWS;
    float3 v_bDirWS : v_bDirWS;
    float4 gl_Position : SV_Position;
};

float4x4 BoneTransform()
{
    float4x4 _33 = u_Palatte[int(attBoneIds.x)] * attWeights.x;
    float4x4 _42 = u_Palatte[int(attBoneIds.y)] * attWeights.y;
    float4x4 _55 = float4x4(_33[0] + _42[0], _33[1] + _42[1], _33[2] + _42[2], _33[3] + _42[3]);
    float4x4 _64 = u_Palatte[int(attBoneIds.z)] * attWeights.z;
    float4x4 _77 = float4x4(_55[0] + _64[0], _55[1] + _64[1], _55[2] + _64[2], _55[3] + _64[3]);
    float4x4 _86 = u_Palatte[int(attBoneIds.w)] * attWeights.w;
    float4x4 boneTransform = float4x4(_77[0] + _86[0], _77[1] + _86[1], _77[2] + _86[2], _77[3] + _86[3]);
    return boneTransform;
}

void vert_main()
{
    float2 _115 = float2(attTexcoord0.x, 1.0f - attTexcoord0.y);
    v_uv0 = _115;
    v_uv0_src = _115;
    v_uv1 = float2(attTexcoord1.x, 1.0f - attTexcoord1.y);
    float3 attBinormal = normalize(cross(attNormal, attTangent.xyz)) * attTangent.w;
    float4x4 boneTransform = BoneTransform();
    float4 bm_postiton = mul(float4(attPosition, 1.0f), boneTransform);
    float3 bn_normal = mul(float4(attNormal, 0.0f), boneTransform).xyz;
    v_posWS = mul(bm_postiton, u_Model).xyz;
    v_nDirWS = mul(float4(bn_normal, 0.0f), u_TransposeInvModel).xyz;
    float3 bm_tangent = mul(float4(attTangent.xyz, 0.0f), boneTransform).xyz;
    float3 bm_binormal = mul(float4(attBinormal, 0.0f), boneTransform).xyz;
    v_tDirWS = mul(float4(bm_tangent, 0.0f), u_Model).xyz;
    v_bDirWS = mul(float4(bm_binormal, 0.0f), u_Model).xyz;
    gl_Position = mul(bm_postiton, u_MVP);
    v_gl_pos = gl_Position;
    gl_Position.y = -gl_Position.y;
    gl_Position.z = (gl_Position.z + gl_Position.w) * 0.5;
}

SPIRV_Cross_Output main(SPIRV_Cross_Input stage_input)
{
    attBoneIds = stage_input.attBoneIds;
    attWeights = stage_input.attWeights;
    attTexcoord0 = stage_input.attTexcoord0;
    attTexcoord1 = stage_input.attTexcoord1;
    attNormal = stage_input.attNormal;
    attTangent = stage_input.attTangent;
    attPosition = stage_input.attPosition;
    attColor = stage_input.attColor;
    vert_main();
    SPIRV_Cross_Output stage_output;
    stage_output.gl_Position = gl_Position;
    stage_output.v_uv0_src = v_uv0_src;
    stage_output.v_uv0 = v_uv0;
    stage_output.v_uv1 = v_uv1;
    stage_output.v_posWS = v_posWS;
    stage_output.v_nDirWS = v_nDirWS;
    stage_output.v_tDirWS = v_tDirWS;
    stage_output.v_bDirWS = v_bDirWS;
    stage_output.v_gl_pos = v_gl_pos;
    return stage_output;
}
