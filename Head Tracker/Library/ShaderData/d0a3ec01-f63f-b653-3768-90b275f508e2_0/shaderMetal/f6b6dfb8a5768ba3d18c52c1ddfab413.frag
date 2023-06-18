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
    int _LeftEyes;
    int _RightEyes;
    float _OpacityEnable;
    float4 _Color;
    float _ReflectionEnable;
};

constant spvUnsafeArray<float2, 10> _107 = spvUnsafeArray<float2, 10>({ float2(1.440000057220458984375, 1.2999999523162841796875), float2(1.440000057220458984375, 3.8599998950958251953125), float2(1.46000003814697265625, 6.570000171661376953125), float2(1.57700002193450927734375, 9.3500003814697265625), float2(1.53400003910064697265625, 11.8500003814697265625), float2(5.21000003814697265625, 1.35000002384185791015625), float2(5.27600002288818359375, 3.8599998950958251953125), float2(5.235000133514404296875, 6.5799999237060546875), float2(5.11999988555908203125, 9.3500003814697265625), float2(5.2189998626708984375, 11.89000034332275390625) });

struct main0_out
{
    float4 o_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _EyeTex [[texture(0)]], texture2d<float> _ReflectionTex [[texture(1)]], sampler _EyeTexSmplr [[sampler(0)]], sampler _ReflectionTexSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _288;
    _288 = float4(0.0);
    for (int _285 = buffer._LeftEyes; _285 < buffer._RightEyes; )
    {
        float2 _113 = fma(in.uv0, float2(7.650000095367431640625, 13.59999370574951171875), -_107[_285]);
        _288 += (_EyeTex.sample(_EyeTexSmplr, _113) * step(distance(in.uv0, _113), 1.0));
        _285++;
        continue;
    }
    float4 _290;
    if (buffer._OpacityEnable > 0.5)
    {
        _290 = _288 * buffer._Color;
    }
    else
    {
        _290 = _288;
    }
    float3 _293;
    if (buffer._ReflectionEnable > 0.5)
    {
        float4 _292;
        _292 = float4(0.0);
        for (int _291 = buffer._LeftEyes; _291 < buffer._RightEyes; )
        {
            float2 _226 = fma(in.uv0, float2(7.650000095367431640625, 13.59999370574951171875), -_107[_291]);
            _292 += (_ReflectionTex.sample(_ReflectionTexSmplr, _226) * step(distance(in.uv0, _226), 1.0));
            _291++;
            continue;
        }
        _293 = _292.xyz;
    }
    else
    {
        _293 = _290.xyz;
    }
    out.o_FragColor = float4(_293, 1.0);
    return out;
}

