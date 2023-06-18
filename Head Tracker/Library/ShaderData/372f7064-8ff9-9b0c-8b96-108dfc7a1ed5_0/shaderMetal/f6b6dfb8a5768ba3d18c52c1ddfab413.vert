#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4x4 u_Model;
    float4x4 u_TransposeInvModel;
    float4x4 u_MVP;
};

struct main0_out
{
    float4 v_gl_pos;
    float3 v_posWS;
    float3 v_nDirWS;
    float2 v_uv0;
    float2 v_uv0_src;
    float2 v_uv1;
    float3 v_tDirWS;
    float3 v_bDirWS;
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 attPosition [[attribute(0)]];
    float3 attNormal [[attribute(1)]];
    float2 attTexcoord0 [[attribute(2)]];
    float2 attTexcoord1 [[attribute(3)]];
    float4 attTangent [[attribute(4)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float2 _23 = float2(in.attTexcoord0.x, 1.0 - in.attTexcoord0.y);
    out.v_uv0 = _23;
    out.v_uv0_src = _23;
    out.v_uv1 = float2(in.attTexcoord1.x, 1.0 - in.attTexcoord1.y);
    float3 attBinormal = normalize(cross(in.attNormal, in.attTangent.xyz)) * in.attTangent.w;
    float3 usedPosition = in.attPosition;
    float3 usedNormal = in.attNormal;
    float3 usedTangent = in.attTangent.xyz;
    float3 usedBinormal = attBinormal;
    out.v_posWS = (buffer.u_Model * float4(usedPosition, 1.0)).xyz;
    out.v_nDirWS = (buffer.u_TransposeInvModel * float4(usedNormal, 0.0)).xyz;
    out.v_tDirWS = (buffer.u_Model * float4(usedTangent, 0.0)).xyz;
    out.v_bDirWS = (buffer.u_Model * float4(usedBinormal, 0.0)).xyz;
    out.gl_Position = buffer.u_MVP * float4(usedPosition, 1.0);
    out.v_gl_pos = out.gl_Position;
    out.v_gl_pos = out.gl_Position;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

