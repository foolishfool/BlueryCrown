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
    float4 u_WorldSpaceCameraPos;
    spvUnsafeArray<float, 3> u_DirLightsEnabled;
    float u_DirLightNum;
    spvUnsafeArray<float4, 3> u_DirLightsDirection;
    spvUnsafeArray<float4, 3> u_DirLightsColor;
    spvUnsafeArray<float, 3> u_DirLightsIntensity;
    spvUnsafeArray<float, 2> u_PointLightsEnabled;
    float u_PointLightNum;
    spvUnsafeArray<float4, 2> u_PointLightsPosition;
    spvUnsafeArray<float4, 2> u_PointLightsColor;
    spvUnsafeArray<float, 2> u_PointLightsIntensity;
    spvUnsafeArray<float, 2> u_PointLightsAttenRangeInv;
    spvUnsafeArray<float, 2> u_SpotLightsEnabled;
    float u_SpotLightNum;
    spvUnsafeArray<float4, 2> u_SpotLightsPosition;
    spvUnsafeArray<float4, 2> u_SpotLightsColor;
    spvUnsafeArray<float, 2> u_SpotLightsIntensity;
    spvUnsafeArray<float, 2> u_SpotLightsAttenRangeInv;
    spvUnsafeArray<float4, 2> u_SpotLightsDirection;
    spvUnsafeArray<float, 2> u_SpotLightsOuterAngleCos;
    spvUnsafeArray<float, 2> u_SpotLightsInnerAngleCos;
    float _AmbientIntensity;
    float _AmbientRotation;
    float4 _AlbedoColor;
    float _Metallic;
    float _Roughness;
    float4 _EmissiveColor;
    float _EmissiveIntensity;
};

constant float _6766 = {};

struct main0_out
{
    float4 glResult [[color(0)]];
};

struct main0_in
{
    float3 v_posWS [[user(locn0)]];
    float3 v_nDirWS [[user(locn1)]];
    float2 v_uv0 [[user(locn2)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _AlbedoTexture [[texture(0)]], texture2d<float> _EmissiveTexture [[texture(1)]], texture2d<float> _AmbientTexture [[texture(2)]], sampler _AlbedoTextureSmplr [[sampler(0)]], sampler _EmissiveTextureSmplr [[sampler(1)]], sampler _AmbientTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float4 _2088 = _AlbedoTexture.sample(_AlbedoTextureSmplr, in.v_uv0);
    float3 _2094 = float3(pow(buffer._AlbedoColor.x, 2.2000000476837158203125), pow(buffer._AlbedoColor.y, 2.2000000476837158203125), pow(buffer._AlbedoColor.z, 2.2000000476837158203125)) * float3(pow(_2088.x, 2.2000000476837158203125), pow(_2088.y, 2.2000000476837158203125), pow(_2088.z, 2.2000000476837158203125));
    float3 _2112 = fast::normalize(in.v_nDirWS);
    float4 _2117 = _EmissiveTexture.sample(_EmissiveTextureSmplr, in.v_uv0);
    float _2526 = fast::clamp(buffer._Metallic, 0.0, 1.0);
    float _2425 = fast::clamp(buffer._Roughness, 0.07999999821186065673828125, 1.0);
    float _2531 = _2425 * _2425;
    float _2536 = _2531 * _2531;
    float3 _2449 = _2094 * (0.959999978542327880859375 * (1.0 - _2526));
    float3 _2456 = mix(float3(0.039999999105930328369140625), _2094, float3(_2526));
    float3 _2491 = fast::normalize(buffer.u_WorldSpaceCameraPos.xyz - in.v_posWS);
    float3 _6599;
    if (dot(_2491, _2112) < 0.0)
    {
        _6599 = reflect(_2491, _2112);
    }
    else
    {
        _6599 = _2491;
    }
    float3 _2517 = fast::normalize(reflect(-_6599, _2112));
    float _2559 = fast::max(0.0, dot(_2112, _6599));
    float _2582 = fast::min(1.0 + dot(_2517, _2112), 1.0);
    float _2588 = fast::clamp(pow(_2559 + 1.0, exp2(fma(-16.0, _2425, -1.0))), 0.0, 1.0) * (_2582 * _2582);
    float _2652 = buffer.u_DirLightsEnabled[0] * step(0.5, buffer.u_DirLightNum);
    float3 _2659 = fast::normalize(-buffer.u_DirLightsDirection[0].xyz);
    float _2671 = buffer.u_DirLightsIntensity[0] * _2652;
    float _2686 = buffer.u_DirLightsEnabled[1] * step(1.5, buffer.u_DirLightNum);
    float3 _2693 = fast::normalize(-buffer.u_DirLightsDirection[1].xyz);
    float _2705 = buffer.u_DirLightsIntensity[1] * _2686;
    float _2720 = buffer.u_DirLightsEnabled[2] * step(2.5, buffer.u_DirLightNum);
    float3 _2727 = fast::normalize(-buffer.u_DirLightsDirection[2].xyz);
    float _2739 = buffer.u_DirLightsIntensity[2] * _2720;
    float _2761 = buffer.u_PointLightsEnabled[0] * step(0.5, buffer.u_PointLightNum);
    float3 _2769 = buffer.u_PointLightsPosition[0].xyz - in.v_posWS;
    float _2771 = length(_2769);
    float3 _2775 = _2769 / float3(_2771);
    float _2787 = buffer.u_PointLightsIntensity[0] * _2761;
    float _2793 = _2771 * buffer.u_PointLightsAttenRangeInv[0];
    float _2815 = _2793 * _2793;
    float _2822 = fast::clamp(fma(-_2815, _2815, 1.0), 0.0, 1.0);
    float3 _2807 = float3(((_2822 * _2822) * fma(_2793, _2793, 1.0)) * 0.25);
    float _2851 = buffer.u_PointLightsEnabled[1] * step(1.5, buffer.u_PointLightNum);
    float3 _2859 = buffer.u_PointLightsPosition[1].xyz - in.v_posWS;
    float _2861 = length(_2859);
    float3 _2865 = _2859 / float3(_2861);
    float _2877 = buffer.u_PointLightsIntensity[1] * _2851;
    float _2883 = _2861 * buffer.u_PointLightsAttenRangeInv[1];
    float _2905 = _2883 * _2883;
    float _2912 = fast::clamp(fma(-_2905, _2905, 1.0), 0.0, 1.0);
    float3 _2897 = float3(((_2912 * _2912) * fma(_2883, _2883, 1.0)) * 0.25);
    float _2943 = buffer.u_SpotLightsEnabled[0] * step(0.5, buffer.u_SpotLightNum);
    float3 _2951 = buffer.u_SpotLightsPosition[0].xyz - in.v_posWS;
    float _2953 = length(_2951);
    float3 _2957 = _2951 / float3(_2953);
    float _2969 = buffer.u_SpotLightsIntensity[0] * _2943;
    float _2975 = _2953 * buffer.u_SpotLightsAttenRangeInv[0];
    float _3018 = _2975 * _2975;
    float _3025 = fast::clamp(fma(-_3018, _3018, 1.0), 0.0, 1.0);
    float3 _3010 = float3((((_3025 * _3025) * fma(_2975, _2975, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[0], buffer.u_SpotLightsInnerAngleCos[0], fast::max(0.0, dot(_2957, fast::normalize(-buffer.u_SpotLightsDirection[0].xyz)))));
    float _3056 = buffer.u_SpotLightsEnabled[1] * step(1.5, buffer.u_SpotLightNum);
    float3 _3064 = buffer.u_SpotLightsPosition[1].xyz - in.v_posWS;
    float _3066 = length(_3064);
    float3 _3070 = _3064 / float3(_3066);
    float _3082 = buffer.u_SpotLightsIntensity[1] * _3056;
    float _3088 = _3066 * buffer.u_SpotLightsAttenRangeInv[1];
    float _3131 = _3088 * _3088;
    float _3138 = fast::clamp(fma(-_3131, _3131, 1.0), 0.0, 1.0);
    float3 _3123 = float3((((_3138 * _3138) * fma(_3088, _3088, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[1], buffer.u_SpotLightsInnerAngleCos[1], fast::max(0.0, dot(_3070, fast::normalize(-buffer.u_SpotLightsDirection[1].xyz)))));
    float3 _3415 = fast::normalize(_2112);
    float _3418 = -_3415.z;
    float _3420 = _3415.x;
    float _3427 = acos(_3415.y);
    float _3433 = fma(fma((_3420 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3418 / length(float2(_3420, _3418)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3442 = fract((_3433 + floor(_3433)) + 1.0);
    float2 _6358 = float2(_6766, _3427 * 0.3183098733425140380859375);
    _6358.x = _3442;
    float _3470 = floor(7.0);
    float2 _6606;
    float2 _6614;
    if (abs(_3470) < 0.001000000047497451305389404296875)
    {
        _6614 = float2(fma(_3442, 0.99609375, 0.001953125) * 0.5, fma(fma(_3427, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6606 = float2(fma(_3442, 0.998046875, 0.0009765625), fma(_3427, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6607;
        float2 _6615;
        if (abs(_3470 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _3523 = fma(_3442, 0.99609375, 0.001953125);
            float _3533 = fma(fma(_3427, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6615 = float2(fma(_3523, 0.5, 0.5), _3533);
            _6607 = float2(_3523 * 0.5, _3533);
        }
        else
        {
            float2 _6608;
            float2 _6616;
            if (abs(_3470 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _3561 = fma(_3442, 0.99609375, 0.001953125);
                float _3569 = fma(_3427, 0.315823078155517578125, 0.00390625);
                _6616 = float2(_3561 * 0.5, fma(_3569, 0.25, 0.75));
                _6608 = float2(fma(_3561, 0.5, 0.5), fma(_3569, 0.25, 0.5));
            }
            else
            {
                float2 _6609;
                float2 _6617;
                if (abs(_3470 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6617 = float2(fma(fma(_3442, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3427, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6609 = float2(fma(_3442, 0.99609375, 0.001953125) * 0.5, fma(fma(_3427, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6610;
                    float2 _6618;
                    if (abs(_3470 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _3637 = fma(_3442, 0.9921875, 0.00390625);
                        float _3647 = fma(fma(_3427, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6618 = float2(fma(_3637, 0.25, 0.75), _3647);
                        _6610 = float2(fma(_3637, 0.25, 0.5), _3647);
                    }
                    else
                    {
                        float2 _6611;
                        float2 _6619;
                        if (abs(_3470 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _3675 = fma(_3442, 0.9921875, 0.00390625);
                            float _3683 = fma(_3427, 0.3133362829685211181640625, 0.0078125);
                            _6619 = float2(fma(_3675, 0.25, 0.5), fma(_3683, 0.125, 0.875));
                            _6611 = float2(fma(_3675, 0.25, 0.75), fma(_3683, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6612;
                            float2 _6620;
                            if (abs(_3470 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _3713 = fma(_3442, 0.9921875, 0.00390625);
                                float _3723 = fma(fma(_3427, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6620 = float2(fma(_3713, 0.25, 0.75), _3723);
                                _6612 = float2(fma(_3713, 0.25, 0.5), _3723);
                            }
                            else
                            {
                                float2 _6621;
                                if (abs(_3470 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6621 = float2(fma(fma(_3442, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3427, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6621 = _6358;
                                }
                                _6620 = _6621;
                                _6612 = _6621;
                            }
                            _6619 = _6620;
                            _6611 = _6612;
                        }
                        _6618 = _6619;
                        _6610 = _6611;
                    }
                    _6617 = _6618;
                    _6609 = _6610;
                }
                _6616 = _6617;
                _6608 = _6609;
            }
            _6615 = _6616;
            _6607 = _6608;
        }
        _6614 = _6615;
        _6606 = _6607;
    }
    float4 _3789 = _AmbientTexture.sample(_AmbientTextureSmplr, _6606);
    float4 _3792 = _AmbientTexture.sample(_AmbientTextureSmplr, _6614);
    float4 _3795 = mix(_3789, _3792, float4(7.0 - _3470));
    float3 _3203 = ((((_3795.xyz / float3(_3795.w)) * _2449) * fast::max(float3(1.0), ((((((_2449 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * 1.0) + ((_2449 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * 1.0) + ((_2449 * 2.755199909210205078125) + float3(0.69029998779296875))) * 1.0)) * buffer._AmbientIntensity) * 1.0;
    float _3858 = _2425 - 0.07999999821186065673828125;
    float3 _3898 = fast::normalize(mix(_2517, _2112, float3(_2425 * _2531)));
    float _3901 = -_3898.z;
    float _3903 = _3898.x;
    float _3910 = acos(_3898.y);
    float _3916 = fma(fma((_3903 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3901 / length(float2(_3903, _3901)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3925 = fract((_3916 + floor(_3916)) + 1.0);
    float2 _6473 = float2(_6766, _3910 * 0.3183098733425140380859375);
    _6473.x = _3925;
    float _3953 = floor(_3858 * 7.0);
    float2 _6639;
    float2 _6647;
    if (abs(_3953) < 0.001000000047497451305389404296875)
    {
        _6647 = float2(fma(_3925, 0.99609375, 0.001953125) * 0.5, fma(fma(_3910, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6639 = float2(fma(_3925, 0.998046875, 0.0009765625), fma(_3910, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6640;
        float2 _6648;
        if (abs(_3953 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _4006 = fma(_3925, 0.99609375, 0.001953125);
            float _4016 = fma(fma(_3910, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6648 = float2(fma(_4006, 0.5, 0.5), _4016);
            _6640 = float2(_4006 * 0.5, _4016);
        }
        else
        {
            float2 _6641;
            float2 _6649;
            if (abs(_3953 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _4044 = fma(_3925, 0.99609375, 0.001953125);
                float _4052 = fma(_3910, 0.315823078155517578125, 0.00390625);
                _6649 = float2(_4044 * 0.5, fma(_4052, 0.25, 0.75));
                _6641 = float2(fma(_4044, 0.5, 0.5), fma(_4052, 0.25, 0.5));
            }
            else
            {
                float2 _6642;
                float2 _6650;
                if (abs(_3953 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6650 = float2(fma(fma(_3925, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3910, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6642 = float2(fma(_3925, 0.99609375, 0.001953125) * 0.5, fma(fma(_3910, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6643;
                    float2 _6651;
                    if (abs(_3953 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _4120 = fma(_3925, 0.9921875, 0.00390625);
                        float _4130 = fma(fma(_3910, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6651 = float2(fma(_4120, 0.25, 0.75), _4130);
                        _6643 = float2(fma(_4120, 0.25, 0.5), _4130);
                    }
                    else
                    {
                        float2 _6644;
                        float2 _6652;
                        if (abs(_3953 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _4158 = fma(_3925, 0.9921875, 0.00390625);
                            float _4166 = fma(_3910, 0.3133362829685211181640625, 0.0078125);
                            _6652 = float2(fma(_4158, 0.25, 0.5), fma(_4166, 0.125, 0.875));
                            _6644 = float2(fma(_4158, 0.25, 0.75), fma(_4166, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6645;
                            float2 _6653;
                            if (abs(_3953 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _4196 = fma(_3925, 0.9921875, 0.00390625);
                                float _4206 = fma(fma(_3910, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6653 = float2(fma(_4196, 0.25, 0.75), _4206);
                                _6645 = float2(fma(_4196, 0.25, 0.5), _4206);
                            }
                            else
                            {
                                float2 _6654;
                                if (abs(_3953 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6654 = float2(fma(fma(_3925, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3910, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6654 = _6473;
                                }
                                _6653 = _6654;
                                _6645 = _6654;
                            }
                            _6652 = _6653;
                            _6644 = _6645;
                        }
                        _6651 = _6652;
                        _6643 = _6644;
                    }
                    _6650 = _6651;
                    _6642 = _6643;
                }
                _6649 = _6650;
                _6641 = _6642;
            }
            _6648 = _6649;
            _6640 = _6641;
        }
        _6647 = _6648;
        _6639 = _6640;
    }
    float4 _4278 = mix(_AmbientTexture.sample(_AmbientTextureSmplr, _6639), _AmbientTexture.sample(_AmbientTextureSmplr, _6647), float4(fma(_3858, 7.0, -_3953)));
    float4 _4303 = (float4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _2425) + float4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float _4305 = _4303.x;
    float2 _4323 = (float2(-1.03999996185302734375, 1.03999996185302734375) * fma(fast::min(_4305 * _4305, exp2((-9.27999973297119140625) * _2559)), _4305, _4303.y)) + _4303.zw;
    float3 _3210 = (((((_2456 * _4323.x) + float3(_4323.y * fast::clamp(50.0 * _2456.y, 0.0, 1.0))) * (_4278.xyz / float3(_4278.w))) * fast::max(float3(_2588), ((((((_2456 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * _2588) + ((_2456 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * _2588) + ((_2456 * 2.755199909210205078125) + float3(0.69029998779296875))) * _2588)) * buffer._AmbientIntensity) * 1.0;
    float3 _6682;
    float3 _6683;
    if (_2652 > 0.5)
    {
        float3 _4396 = fast::normalize(_2659 + _6599);
        float _4402 = fast::max(0.0, dot(_2112, _2659));
        float _4413 = fast::max(0.0, dot(_6599, _4396));
        float _4429 = fma(-_2559, _4402, fma(2.0 * _4413, _4413, -1.0));
        float _6671;
        if (_4429 >= 0.0)
        {
            _6671 = 1.0 / fast::max(_4402, _2559);
        }
        else
        {
            _6671 = 1.0;
        }
        float _4507 = fast::max(0.0, dot(_2112, _4396));
        float _4565 = 1.0 - _4402;
        float _4593 = fma(fma(_4507, _2536, -_4507), _4507, 1.0);
        float _4606 = 1.0 - _4413;
        float _4620 = _4606 * _4606;
        _6683 = _3210 + ((((((((_2456 + ((float3(1.0) - _2456) * ((_4620 * _4620) * _4606))) * (0.5 / (fma(_2531, fma(_2559, _4565, _4402), _2559 * fma(_2531, _4565, _4402)) + 9.9999997473787516355514526367188e-06))) * ((_2536 * 0.31830990314483642578125) / fma(_4593, _4593, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4402) * buffer.u_DirLightsColor[0].xyz) * _2671) * 1.0);
        _6682 = _3203 + ((((_2449 * buffer.u_DirLightsColor[0].xyz) * _2671) * ((fma(((0.449999988079071044921875 * _2536) / fma(_2531, _2531, 0.0900000035762786865234375)) * _4429, _6671, 1.0 - ((0.5 * _2536) / fma(_2531, _2531, 0.3300000131130218505859375))) * fma(_2425, 0.5, 1.0)) * _4402)) * 1.0);
    }
    else
    {
        _6683 = _3210;
        _6682 = _3203;
    }
    float3 _6684;
    float3 _6685;
    if (_2686 > 0.5)
    {
        float _4635 = fast::max(0.0, dot(_2112, _2693));
        float3 _4671 = fast::normalize(_2693 + _6599);
        float _4676 = fast::max(0.0, dot(_2112, _4671));
        float _4730 = fma(fma(_4676, _2536, -_4676), _4676, 1.0);
        float _4743 = 1.0 - fast::max(0.0, dot(_6599, _4671));
        float _4757 = _4743 * _4743;
        _6685 = _6683 + ((((((((_2456 + ((float3(1.0) - _2456) * ((_4757 * _4757) * _4743))) * 0.25) * ((_2536 * 0.31830990314483642578125) / fma(_4730, _4730, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4635) * buffer.u_DirLightsColor[1].xyz) * _2705) * 1.0);
        _6684 = _6682 + ((((_2449 * buffer.u_DirLightsColor[1].xyz) * _2705) * _4635) * 1.0);
    }
    else
    {
        _6685 = _6683;
        _6684 = _6682;
    }
    float3 _6686;
    float3 _6687;
    if (_2720 > 0.5)
    {
        float _4772 = fast::max(0.0, dot(_2112, _2727));
        float3 _4808 = fast::normalize(_2727 + _6599);
        float _4813 = fast::max(0.0, dot(_2112, _4808));
        float _4867 = fma(fma(_4813, _2536, -_4813), _4813, 1.0);
        float _4880 = 1.0 - fast::max(0.0, dot(_6599, _4808));
        float _4894 = _4880 * _4880;
        _6687 = _6685 + ((((((((_2456 + ((float3(1.0) - _2456) * ((_4894 * _4894) * _4880))) * 0.25) * ((_2536 * 0.31830990314483642578125) / fma(_4867, _4867, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4772) * buffer.u_DirLightsColor[2].xyz) * _2739) * 1.0);
        _6686 = _6684 + ((((_2449 * buffer.u_DirLightsColor[2].xyz) * _2739) * _4772) * 1.0);
    }
    else
    {
        _6687 = _6685;
        _6686 = _6684;
    }
    float3 _6688;
    float3 _6689;
    if (_2761 > 0.5)
    {
        float _4909 = fast::max(0.0, dot(_2112, _2775));
        float3 _4945 = fast::normalize(_2775 + _6599);
        float _4950 = fast::max(0.0, dot(_2112, _4945));
        float _5004 = fma(fma(_4950, _2536, -_4950), _4950, 1.0);
        float _5017 = 1.0 - fast::max(0.0, dot(_6599, _4945));
        float _5031 = _5017 * _5017;
        _6689 = _6687 + (((((((((_2456 + ((float3(1.0) - _2456) * ((_5031 * _5031) * _5017))) * 0.25) * ((_2536 * 0.31830990314483642578125) / fma(_5004, _5004, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4909) * buffer.u_PointLightsColor[0].xyz) * _2787) * _2807) * 1.0);
        _6688 = _6686 + (((((_2449 * buffer.u_PointLightsColor[0].xyz) * _2787) * _2807) * _4909) * 1.0);
    }
    else
    {
        _6689 = _6687;
        _6688 = _6686;
    }
    float3 _6690;
    float3 _6691;
    if (_2851 > 0.5)
    {
        float _5046 = fast::max(0.0, dot(_2112, _2865));
        float3 _5082 = fast::normalize(_2865 + _6599);
        float _5087 = fast::max(0.0, dot(_2112, _5082));
        float _5141 = fma(fma(_5087, _2536, -_5087), _5087, 1.0);
        float _5154 = 1.0 - fast::max(0.0, dot(_6599, _5082));
        float _5168 = _5154 * _5154;
        _6691 = _6689 + (((((((((_2456 + ((float3(1.0) - _2456) * ((_5168 * _5168) * _5154))) * 0.25) * ((_2536 * 0.31830990314483642578125) / fma(_5141, _5141, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5046) * buffer.u_PointLightsColor[1].xyz) * _2877) * _2897) * 1.0);
        _6690 = _6688 + (((((_2449 * buffer.u_PointLightsColor[1].xyz) * _2877) * _2897) * _5046) * 1.0);
    }
    else
    {
        _6691 = _6689;
        _6690 = _6688;
    }
    float3 _6692;
    float3 _6693;
    if (_2943 > 0.5)
    {
        float _5183 = fast::max(0.0, dot(_2112, _2957));
        float3 _5219 = fast::normalize(_2957 + _6599);
        float _5224 = fast::max(0.0, dot(_2112, _5219));
        float _5278 = fma(fma(_5224, _2536, -_5224), _5224, 1.0);
        float _5291 = 1.0 - fast::max(0.0, dot(_6599, _5219));
        float _5305 = _5291 * _5291;
        _6693 = _6691 + (((((((((_2456 + ((float3(1.0) - _2456) * ((_5305 * _5305) * _5291))) * 0.25) * ((_2536 * 0.31830990314483642578125) / fma(_5278, _5278, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5183) * buffer.u_SpotLightsColor[0].xyz) * _2969) * _3010) * 1.0);
        _6692 = _6690 + (((((_2449 * buffer.u_SpotLightsColor[0].xyz) * _2969) * _3010) * _5183) * 1.0);
    }
    else
    {
        _6693 = _6691;
        _6692 = _6690;
    }
    float3 _6694;
    float3 _6695;
    if (_3056 > 0.5)
    {
        float _5320 = fast::max(0.0, dot(_2112, _3070));
        float3 _5356 = fast::normalize(_3070 + _6599);
        float _5361 = fast::max(0.0, dot(_2112, _5356));
        float _5415 = fma(fma(_5361, _2536, -_5361), _5361, 1.0);
        float _5428 = 1.0 - fast::max(0.0, dot(_6599, _5356));
        float _5442 = _5428 * _5428;
        _6695 = _6693 + (((((((((_2456 + ((float3(1.0) - _2456) * ((_5442 * _5442) * _5428))) * 0.25) * ((_2536 * 0.31830990314483642578125) / fma(_5415, _5415, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5320) * buffer.u_SpotLightsColor[1].xyz) * _3082) * _3123) * 1.0);
        _6694 = _6692 + (((((_2449 * buffer.u_SpotLightsColor[1].xyz) * _3082) * _3123) * _5320) * 1.0);
    }
    else
    {
        _6695 = _6693;
        _6694 = _6692;
    }
    float3 _3366 = (_6694 + ((float3(pow(buffer._EmissiveColor.x, 2.2000000476837158203125), pow(buffer._EmissiveColor.y, 2.2000000476837158203125), pow(buffer._EmissiveColor.z, 2.2000000476837158203125)) * float3(pow(_2117.x, 2.2000000476837158203125), pow(_2117.y, 2.2000000476837158203125), pow(_2117.z, 2.2000000476837158203125))) * buffer._EmissiveIntensity)) + _6695;
    out.glResult = float4(pow(_3366.x, 0.4545449912548065185546875), pow(_3366.y, 0.4545449912548065185546875), pow(_3366.z, 0.4545449912548065185546875), buffer._AlbedoColor.w * _2088.w);
    return out;
}

