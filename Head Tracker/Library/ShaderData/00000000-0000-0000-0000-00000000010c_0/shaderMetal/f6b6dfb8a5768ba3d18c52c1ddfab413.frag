#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 samplerEnvSize;
    float roughnessScale;
};

struct main0_out
{
    float4 fragColor [[color(0)]];
};

struct main0_in
{
    float2 varScreenTexturePos [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> samplerEnv [[texture(0)]], sampler samplerEnvSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _522 = 6.283185482025146484375 * in.varScreenTexturePos.x;
    float _525 = 3.1415927410125732421875 * (1.0 - in.varScreenTexturePos.y);
    float _529 = sin(_525);
    float _530 = sin(_522) * _529;
    float3 _541 = float3(cos(_522) * _529, cos(_525), _530);
    float4 _905;
    float _906;
    _906 = 0.0;
    _905 = float4(0.0);
    float4 _925;
    float _926;
    for (int _904 = 0; _904 < 4096; _906 = _926, _905 = _925, _904++)
    {
        int _907;
        float _908;
        float _924;
        _924 = 0.5;
        _908 = 0.0;
        _907 = _904;
        for (; _907 > 0; )
        {
            int _688 = _907 / 2;
            float _696 = fma(float(_907 - (_688 * 2)), _924, _908);
            _924 *= 0.5;
            _908 = _696;
            _907 = _688;
            continue;
        }
        float _719 = float(_904) * 0.001533980830572545528411865234375;
        float _732 = sqrt(1.0 - _908);
        float _737 = sqrt(fma(-_732, _732, 1.0));
        float3 _759 = fast::normalize(cross(select(float3(1.0, 0.0, 0.0), float3(0.0, 0.0, 1.0), bool3(abs(_530) < 0.999000012874603271484375)), _541));
        float3 _777 = fast::normalize(((_759 * (_737 * cos(_719))) + (cross(_541, _759) * (_737 * sin(_719)))) + (_541 * _732));
        float _586 = dot(_541, _777);
        float3 _591 = (_777 * (2.0 * _586)) - _541;
        float _595 = fast::clamp(dot(_541, _591), 0.0, 1.0);
        if (_595 > 0.0)
        {
            float _819 = -_591.z;
            float _821 = _591.x;
            float2 _830 = float2(fma((_821 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_819 / length(float2(_821, _819)), -1.0, 1.0)), -1.57079637050628662109375), acos(_591.y)) * float2(0.15915493667125701904296875, 0.3183098733425140380859375);
            float2 _900 = _830;
            _900.y = 1.0 - _830.y;
            _926 = _906 + _595;
            _925 = _905 + (samplerEnv.sample(samplerEnvSmplr, _900, level(fma(0.5, log2((1.0 / fma(4096.0, ((0.3183098733425140380859375 * fast::max(_586, 0.0)) / (4.0 * fast::max(dot(_777, _541), 0.0))) + 9.9999997473787516355514526367188e-05, 9.9999997473787516355514526367188e-05)) / (12.56637096405029296875 / (buffer.samplerEnvSize.x * buffer.samplerEnvSize.y))), buffer.roughnessScale))) * _595);
        }
        else
        {
            _926 = _906;
            _925 = _905;
        }
    }
    float4 _662 = _905 / float4(_906);
    float _864 = 1.0 / fast::max(1.0, fast::max(_662.x, fast::max(_662.y, _662.z)));
    out.fragColor = float4(_662.xyz * _864, _864);
    return out;
}

