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
    float4 v_gl_pos [[user(locn0)]];
    float3 v_posWS [[user(locn1)]];
    float3 v_nDirWS [[user(locn2)]];
    float2 v_uv0 [[user(locn3)]];
    float2 v_uv0_src [[user(locn4)]];
    float2 v_uv1 [[user(locn5)]];
    float3 v_tDirWS [[user(locn6)]];
    float3 v_bDirWS [[user(locn7)]];
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

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float2 _115 = float2(in.attTexcoord0.x, 1.0 - in.attTexcoord0.y);
    out.v_uv0 = _115;
    out.v_uv0_src = _115;
    out.v_uv1 = float2(in.attTexcoord1.x, 1.0 - in.attTexcoord1.y);
    float4x4 _242 = buffer.u_Palatte[int(in.attBoneIds.x)] * in.attWeights.x;
    float4x4 _250 = buffer.u_Palatte[int(in.attBoneIds.y)] * in.attWeights.y;
    float4x4 _271 = buffer.u_Palatte[int(in.attBoneIds.z)] * in.attWeights.z;
    float4x4 _292 = buffer.u_Palatte[int(in.attBoneIds.w)] * in.attWeights.w;
    float4x4 _305 = float4x4(((_242[0] + _250[0]) + _271[0]) + _292[0], ((_242[1] + _250[1]) + _271[1]) + _292[1], ((_242[2] + _250[2]) + _271[2]) + _292[2], ((_242[3] + _250[3]) + _271[3]) + _292[3]);
    float4 _149 = _305 * float4(in.attPosition, 1.0);
    float4 _158 = _305 * float4(in.attNormal, 0.0);
    out.v_posWS = (buffer.u_Model * _149).xyz;
    out.v_nDirWS = (buffer.u_TransposeInvModel * float4(_158.xyz, 0.0)).xyz;
    float4 _185 = _305 * float4(in.attTangent.xyz, 0.0);
    float4 _194 = _305 * float4(fast::normalize(cross(in.attNormal, in.attTangent.xyz)) * in.attTangent.w, 0.0);
    out.v_tDirWS = (buffer.u_Model * float4(_185.xyz, 0.0)).xyz;
    out.v_bDirWS = (buffer.u_Model * float4(_194.xyz, 0.0)).xyz;
    out.gl_Position = buffer.u_MVP * _149;
    out.v_gl_pos = out.gl_Position;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

