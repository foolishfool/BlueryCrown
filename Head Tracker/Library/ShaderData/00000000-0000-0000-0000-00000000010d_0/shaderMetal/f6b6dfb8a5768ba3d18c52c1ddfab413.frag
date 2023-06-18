#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 samplerEnvSize;
    float roughnessScale;
    float perceptualRoughness;
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
    float _512 = 6.283185482025146484375 * in.varScreenTexturePos.x;
    float _515 = 3.1415927410125732421875 * (1.0 - in.varScreenTexturePos.y);
    float _519 = sin(_515);
    float3 _531 = float3(cos(_512) * _519, cos(_515), sin(_512) * _519);
    float4 _890;
    float _891;
    _891 = 0.0;
    _890 = float4(0.0);
    float4 _910;
    float _911;
    for (int _889 = 0; _889 < 512; _891 = _911, _890 = _910, _889++)
    {
        float _893;
        _893 = 0.0;
        int _892 = _889;
        float _909 = 0.5;
        for (; _892 > 0; )
        {
            int _680 = _892 / 2;
            float _688 = fma(float(_892 - (_680 * 2)), _909, _893);
            _909 *= 0.5;
            _893 = _688;
            _892 = _680;
            continue;
        }
        float _708 = buffer.perceptualRoughness * buffer.perceptualRoughness;
        float _711 = float(_889) * 0.012271846644580364227294921875;
        float _718 = fma(_708, _708, -1.0);
        float _724 = sqrt((1.0 - _893) / fma(_718, _893, 1.0));
        float _729 = sqrt(fma(-_724, _724, 1.0));
        float3 _745 = fast::normalize(cross(float3(0.0, 0.0, 1.0), _531));
        float3 _763 = fast::normalize(((_745 * (_729 * cos(_711))) + (cross(_531, _745) * (_729 * sin(_711)))) + (_531 * _724));
        float _576 = dot(_531, _763);
        float3 _581 = (_763 * (2.0 * _576)) - _531;
        float _585 = fast::clamp(dot(_531, _581), 0.0, 1.0);
        if (_585 > 0.0)
        {
            float _781 = fast::max(_576, 0.0);
            float _790 = fma(_781 * _781, _718, 1.0);
            float _897;
            if (buffer.perceptualRoughness == 0.0)
            {
                _897 = 0.0;
            }
            else
            {
                _897 = 0.5 * log2((1.0 / fma(512.0, ((((_708 * _708) / ((3.1415927410125732421875 * _790) * _790)) * _781) / (4.0 * fast::max(dot(_763, _531), 0.0))) + 9.9999997473787516355514526367188e-05, 9.9999997473787516355514526367188e-05)) / (12.56637096405029296875 / (buffer.samplerEnvSize.x * buffer.samplerEnvSize.y)));
            }
            float _805 = -_581.z;
            float _807 = _581.x;
            float2 _816 = float2(fma((_807 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_805 / length(float2(_807, _805)), -1.0, 1.0)), -1.57079637050628662109375), acos(_581.y)) * float2(0.15915493667125701904296875, 0.3183098733425140380859375);
            float2 _885 = _816;
            _885.y = 1.0 - _816.y;
            _911 = _891 + _585;
            _910 = fast::min(_890 + (samplerEnv.sample(samplerEnvSmplr, _885, level(_897 + buffer.roughnessScale)) * _585), float4(10000.0));
        }
        else
        {
            _911 = _891;
            _910 = _890;
        }
    }
    float4 _654 = _890 / float4(_891);
    float _850 = 1.0 / fast::max(1.0, fast::max(_654.x, fast::max(_654.y, _654.z)));
    out.fragColor = float4(_654.xyz * _850, _850);
    return out;
}

