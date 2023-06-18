#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

struct buffer_t
{
    spvUnsafeArray<float4x4, 50> u_Palatte;
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
    float4 attBoneIds [[attribute(6)]];
    float4 attWeights [[attribute(7)]];
};

static inline __attribute__((always_inline))
float4x4 BoneTransform(constant spvUnsafeArray<float4x4, 50>& u_Palatte, thread float4& attBoneIds, thread float4& attWeights)
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

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float2 _115 = float2(in.attTexcoord0.x, 1.0 - in.attTexcoord0.y);
    out.v_uv0 = _115;
    out.v_uv0_src = _115;
    out.v_uv1 = float2(in.attTexcoord1.x, 1.0 - in.attTexcoord1.y);
    float3 attBinormal = normalize(cross(in.attNormal, in.attTangent.xyz)) * in.attTangent.w;
    float4x4 boneTransform = BoneTransform(buffer.u_Palatte, in.attBoneIds, in.attWeights);
    float4 bm_postiton = boneTransform * float4(in.attPosition, 1.0);
    float3 bn_normal = (boneTransform * float4(in.attNormal, 0.0)).xyz;
    out.v_posWS = (buffer.u_Model * bm_postiton).xyz;
    out.v_nDirWS = (buffer.u_TransposeInvModel * float4(bn_normal, 0.0)).xyz;
    float3 bm_tangent = (boneTransform * float4(in.attTangent.xyz, 0.0)).xyz;
    float3 bm_binormal = (boneTransform * float4(attBinormal, 0.0)).xyz;
    out.v_tDirWS = (buffer.u_Model * float4(bm_tangent, 0.0)).xyz;
    out.v_bDirWS = (buffer.u_Model * float4(bm_binormal, 0.0)).xyz;
    out.gl_Position = buffer.u_MVP * bm_postiton;
    out.v_gl_pos = out.gl_Position;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

