row_major uniform float4x4 u_Model;
row_major uniform float4x4 u_TransposeInvModel;
row_major uniform float4x4 u_MVP;

static float4 gl_Position;
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
    float2 _23 = float2(attTexcoord0.x, 1.0f - attTexcoord0.y);
    v_uv0 = _23;
    v_uv0_src = _23;
    v_uv1 = float2(attTexcoord1.x, 1.0f - attTexcoord1.y);
    float4 _69 = float4(attPosition, 1.0f);
    v_posWS = mul(_69, u_Model).xyz;
    v_nDirWS = mul(float4(attNormal, 0.0f), u_TransposeInvModel).xyz;
    v_tDirWS = mul(float4(attTangent.xyz, 0.0f), u_Model).xyz;
    v_bDirWS = mul(float4(normalize(cross(attNormal, attTangent.xyz)) * attTangent.w, 0.0f), u_Model).xyz;
    gl_Position = mul(_69, u_MVP);
    v_gl_pos = gl_Position;
    v_gl_pos = gl_Position;
    gl_Position.y = -gl_Position.y;
    gl_Position.z = (gl_Position.z + gl_Position.w) * 0.5;
}

SPIRV_Cross_Output main(SPIRV_Cross_Input stage_input)
{
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
