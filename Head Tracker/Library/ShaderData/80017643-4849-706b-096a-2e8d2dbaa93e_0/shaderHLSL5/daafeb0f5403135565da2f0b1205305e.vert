row_major uniform float4x4 u_Palatte[50];
row_major uniform float4x4 u_Model;
row_major uniform float4x4 u_TransposeInvModel;
row_major uniform float4x4 u_MVP;

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

struct SPIRV_Cross_Input
{
    float3 attPosition : attPosition;
    float3 attNormal : attNormal;
    float2 attTexcoord0 : attTexcoord0;
    float2 attTexcoord1 : attTexcoord1;
    float4 attTangent : attTangent;
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

void vert_main()
{
    float2 _115 = float2(attTexcoord0.x, 1.0f - attTexcoord0.y);
    v_uv0 = _115;
    v_uv0_src = _115;
    v_uv1 = float2(attTexcoord1.x, 1.0f - attTexcoord1.y);
    float4x4 _242 = u_Palatte[int(attBoneIds.x)] * attWeights.x;
    float4x4 _250 = u_Palatte[int(attBoneIds.y)] * attWeights.y;
    float4x4 _271 = u_Palatte[int(attBoneIds.z)] * attWeights.z;
    float4x4 _292 = u_Palatte[int(attBoneIds.w)] * attWeights.w;
    float4x4 _305 = float4x4(((_242[0] + _250[0]) + _271[0]) + _292[0], ((_242[1] + _250[1]) + _271[1]) + _292[1], ((_242[2] + _250[2]) + _271[2]) + _292[2], ((_242[3] + _250[3]) + _271[3]) + _292[3]);
    float4 _149 = mul(float4(attPosition, 1.0f), _305);
    float4 _158 = mul(float4(attNormal, 0.0f), _305);
    v_posWS = mul(_149, u_Model).xyz;
    v_nDirWS = mul(float4(_158.xyz, 0.0f), u_TransposeInvModel).xyz;
    float4 _185 = mul(float4(attTangent.xyz, 0.0f), _305);
    float4 _194 = mul(float4(normalize(cross(attNormal, attTangent.xyz)) * attTangent.w, 0.0f), _305);
    v_tDirWS = mul(float4(_185.xyz, 0.0f), u_Model).xyz;
    v_bDirWS = mul(float4(_194.xyz, 0.0f), u_Model).xyz;
    gl_Position = mul(_149, u_MVP);
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
