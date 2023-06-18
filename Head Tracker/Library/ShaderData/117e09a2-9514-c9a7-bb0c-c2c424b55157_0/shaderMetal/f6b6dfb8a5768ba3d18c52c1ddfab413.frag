#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 _BaseColor;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 g_vary_uv0;
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _BaseTexture [[texture(0)]], texture2d<float> _OpacityTexture [[texture(1)]], sampler _BaseTextureSmplr [[sampler(0)]], sampler _OpacityTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 uv = in.g_vary_uv0;
    uv.y = 1.0 - uv.y;
    float4 texColor = _BaseTexture.sample(_BaseTextureSmplr, uv) * buffer._BaseColor;
    float4 t_OpacityTex = _OpacityTexture.sample(_OpacityTextureSmplr, uv);
    texColor.w *= t_OpacityTex.x;
    out.o_fragColor = texColor;
    return out;
}

