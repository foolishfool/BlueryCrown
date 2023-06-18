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
};

constant float _6662 = {};

struct main0_out
{
    float4 glResult [[color(0)]];
};

struct main0_in
{
    float3 v_posWS [[user(locn0)]];
    float3 v_nDirWS [[user(locn1)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _AmbientTexture [[texture(0)]], sampler _AmbientTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float3 _2207 = float3(pow(buffer._AlbedoColor.x, 2.2000000476837158203125), pow(buffer._AlbedoColor.y, 2.2000000476837158203125), pow(buffer._AlbedoColor.z, 2.2000000476837158203125));
    float3 _2082 = fast::normalize(in.v_nDirWS);
    float _2443 = fast::clamp(buffer._Metallic, 0.0, 1.0);
    float _2342 = fast::clamp(buffer._Roughness, 0.07999999821186065673828125, 1.0);
    float _2448 = _2342 * _2342;
    float _2453 = _2448 * _2448;
    float3 _2366 = _2207 * (0.959999978542327880859375 * (1.0 - _2443));
    float3 _2373 = mix(float3(0.039999999105930328369140625), _2207, float3(_2443));
    float3 _2408 = fast::normalize(buffer.u_WorldSpaceCameraPos.xyz - in.v_posWS);
    float3 _6495;
    if (dot(_2408, _2082) < 0.0)
    {
        _6495 = reflect(_2408, _2082);
    }
    else
    {
        _6495 = _2408;
    }
    float3 _2434 = fast::normalize(reflect(-_6495, _2082));
    float _2476 = fast::max(0.0, dot(_2082, _6495));
    float _2499 = fast::min(1.0 + dot(_2434, _2082), 1.0);
    float _2505 = fast::clamp(pow(_2476 + 1.0, exp2(fma(-16.0, _2342, -1.0))), 0.0, 1.0) * (_2499 * _2499);
    float _2569 = buffer.u_DirLightsEnabled[0] * step(0.5, buffer.u_DirLightNum);
    float3 _2576 = fast::normalize(-buffer.u_DirLightsDirection[0].xyz);
    float _2588 = buffer.u_DirLightsIntensity[0] * _2569;
    float _2603 = buffer.u_DirLightsEnabled[1] * step(1.5, buffer.u_DirLightNum);
    float3 _2610 = fast::normalize(-buffer.u_DirLightsDirection[1].xyz);
    float _2622 = buffer.u_DirLightsIntensity[1] * _2603;
    float _2637 = buffer.u_DirLightsEnabled[2] * step(2.5, buffer.u_DirLightNum);
    float3 _2644 = fast::normalize(-buffer.u_DirLightsDirection[2].xyz);
    float _2656 = buffer.u_DirLightsIntensity[2] * _2637;
    float _2678 = buffer.u_PointLightsEnabled[0] * step(0.5, buffer.u_PointLightNum);
    float3 _2686 = buffer.u_PointLightsPosition[0].xyz - in.v_posWS;
    float _2688 = length(_2686);
    float3 _2692 = _2686 / float3(_2688);
    float _2704 = buffer.u_PointLightsIntensity[0] * _2678;
    float _2710 = _2688 * buffer.u_PointLightsAttenRangeInv[0];
    float _2732 = _2710 * _2710;
    float _2739 = fast::clamp(fma(-_2732, _2732, 1.0), 0.0, 1.0);
    float3 _2724 = float3(((_2739 * _2739) * fma(_2710, _2710, 1.0)) * 0.25);
    float _2768 = buffer.u_PointLightsEnabled[1] * step(1.5, buffer.u_PointLightNum);
    float3 _2776 = buffer.u_PointLightsPosition[1].xyz - in.v_posWS;
    float _2778 = length(_2776);
    float3 _2782 = _2776 / float3(_2778);
    float _2794 = buffer.u_PointLightsIntensity[1] * _2768;
    float _2800 = _2778 * buffer.u_PointLightsAttenRangeInv[1];
    float _2822 = _2800 * _2800;
    float _2829 = fast::clamp(fma(-_2822, _2822, 1.0), 0.0, 1.0);
    float3 _2814 = float3(((_2829 * _2829) * fma(_2800, _2800, 1.0)) * 0.25);
    float _2860 = buffer.u_SpotLightsEnabled[0] * step(0.5, buffer.u_SpotLightNum);
    float3 _2868 = buffer.u_SpotLightsPosition[0].xyz - in.v_posWS;
    float _2870 = length(_2868);
    float3 _2874 = _2868 / float3(_2870);
    float _2886 = buffer.u_SpotLightsIntensity[0] * _2860;
    float _2892 = _2870 * buffer.u_SpotLightsAttenRangeInv[0];
    float _2935 = _2892 * _2892;
    float _2942 = fast::clamp(fma(-_2935, _2935, 1.0), 0.0, 1.0);
    float3 _2927 = float3((((_2942 * _2942) * fma(_2892, _2892, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[0], buffer.u_SpotLightsInnerAngleCos[0], fast::max(0.0, dot(_2874, fast::normalize(-buffer.u_SpotLightsDirection[0].xyz)))));
    float _2973 = buffer.u_SpotLightsEnabled[1] * step(1.5, buffer.u_SpotLightNum);
    float3 _2981 = buffer.u_SpotLightsPosition[1].xyz - in.v_posWS;
    float _2983 = length(_2981);
    float3 _2987 = _2981 / float3(_2983);
    float _2999 = buffer.u_SpotLightsIntensity[1] * _2973;
    float _3005 = _2983 * buffer.u_SpotLightsAttenRangeInv[1];
    float _3048 = _3005 * _3005;
    float _3055 = fast::clamp(fma(-_3048, _3048, 1.0), 0.0, 1.0);
    float3 _3040 = float3((((_3055 * _3055) * fma(_3005, _3005, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[1], buffer.u_SpotLightsInnerAngleCos[1], fast::max(0.0, dot(_2987, fast::normalize(-buffer.u_SpotLightsDirection[1].xyz)))));
    float3 _3327 = fast::normalize(_2082);
    float _3330 = -_3327.z;
    float _3332 = _3327.x;
    float _3339 = acos(_3327.y);
    float _3345 = fma(fma((_3332 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3330 / length(float2(_3332, _3330)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3354 = fract((_3345 + floor(_3345)) + 1.0);
    float2 _6254 = float2(_6662, _3339 * 0.3183098733425140380859375);
    _6254.x = _3354;
    float _3382 = floor(7.0);
    float2 _6502;
    float2 _6510;
    if (abs(_3382) < 0.001000000047497451305389404296875)
    {
        _6510 = float2(fma(_3354, 0.99609375, 0.001953125) * 0.5, fma(fma(_3339, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6502 = float2(fma(_3354, 0.998046875, 0.0009765625), fma(_3339, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6503;
        float2 _6511;
        if (abs(_3382 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _3435 = fma(_3354, 0.99609375, 0.001953125);
            float _3445 = fma(fma(_3339, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6511 = float2(fma(_3435, 0.5, 0.5), _3445);
            _6503 = float2(_3435 * 0.5, _3445);
        }
        else
        {
            float2 _6504;
            float2 _6512;
            if (abs(_3382 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _3473 = fma(_3354, 0.99609375, 0.001953125);
                float _3481 = fma(_3339, 0.315823078155517578125, 0.00390625);
                _6512 = float2(_3473 * 0.5, fma(_3481, 0.25, 0.75));
                _6504 = float2(fma(_3473, 0.5, 0.5), fma(_3481, 0.25, 0.5));
            }
            else
            {
                float2 _6505;
                float2 _6513;
                if (abs(_3382 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6513 = float2(fma(fma(_3354, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3339, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6505 = float2(fma(_3354, 0.99609375, 0.001953125) * 0.5, fma(fma(_3339, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6506;
                    float2 _6514;
                    if (abs(_3382 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _3549 = fma(_3354, 0.9921875, 0.00390625);
                        float _3559 = fma(fma(_3339, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6514 = float2(fma(_3549, 0.25, 0.75), _3559);
                        _6506 = float2(fma(_3549, 0.25, 0.5), _3559);
                    }
                    else
                    {
                        float2 _6507;
                        float2 _6515;
                        if (abs(_3382 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _3587 = fma(_3354, 0.9921875, 0.00390625);
                            float _3595 = fma(_3339, 0.3133362829685211181640625, 0.0078125);
                            _6515 = float2(fma(_3587, 0.25, 0.5), fma(_3595, 0.125, 0.875));
                            _6507 = float2(fma(_3587, 0.25, 0.75), fma(_3595, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6508;
                            float2 _6516;
                            if (abs(_3382 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _3625 = fma(_3354, 0.9921875, 0.00390625);
                                float _3635 = fma(fma(_3339, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6516 = float2(fma(_3625, 0.25, 0.75), _3635);
                                _6508 = float2(fma(_3625, 0.25, 0.5), _3635);
                            }
                            else
                            {
                                float2 _6517;
                                if (abs(_3382 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6517 = float2(fma(fma(_3354, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3339, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6517 = _6254;
                                }
                                _6516 = _6517;
                                _6508 = _6517;
                            }
                            _6515 = _6516;
                            _6507 = _6508;
                        }
                        _6514 = _6515;
                        _6506 = _6507;
                    }
                    _6513 = _6514;
                    _6505 = _6506;
                }
                _6512 = _6513;
                _6504 = _6505;
            }
            _6511 = _6512;
            _6503 = _6504;
        }
        _6510 = _6511;
        _6502 = _6503;
    }
    float4 _3701 = _AmbientTexture.sample(_AmbientTextureSmplr, _6502);
    float4 _3704 = _AmbientTexture.sample(_AmbientTextureSmplr, _6510);
    float4 _3707 = mix(_3701, _3704, float4(7.0 - _3382));
    float3 _3119 = ((((_3707.xyz / float3(_3707.w)) * _2366) * fast::max(float3(1.0), ((((((_2366 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * 1.0) + ((_2366 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * 1.0) + ((_2366 * 2.755199909210205078125) + float3(0.69029998779296875))) * 1.0)) * buffer._AmbientIntensity) * 1.0;
    float _3770 = _2342 - 0.07999999821186065673828125;
    float3 _3810 = fast::normalize(mix(_2434, _2082, float3(_2342 * _2448)));
    float _3813 = -_3810.z;
    float _3815 = _3810.x;
    float _3822 = acos(_3810.y);
    float _3828 = fma(fma((_3815 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3813 / length(float2(_3815, _3813)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3837 = fract((_3828 + floor(_3828)) + 1.0);
    float2 _6369 = float2(_6662, _3822 * 0.3183098733425140380859375);
    _6369.x = _3837;
    float _3865 = floor(_3770 * 7.0);
    float2 _6535;
    float2 _6543;
    if (abs(_3865) < 0.001000000047497451305389404296875)
    {
        _6543 = float2(fma(_3837, 0.99609375, 0.001953125) * 0.5, fma(fma(_3822, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6535 = float2(fma(_3837, 0.998046875, 0.0009765625), fma(_3822, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6536;
        float2 _6544;
        if (abs(_3865 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _3918 = fma(_3837, 0.99609375, 0.001953125);
            float _3928 = fma(fma(_3822, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6544 = float2(fma(_3918, 0.5, 0.5), _3928);
            _6536 = float2(_3918 * 0.5, _3928);
        }
        else
        {
            float2 _6537;
            float2 _6545;
            if (abs(_3865 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _3956 = fma(_3837, 0.99609375, 0.001953125);
                float _3964 = fma(_3822, 0.315823078155517578125, 0.00390625);
                _6545 = float2(_3956 * 0.5, fma(_3964, 0.25, 0.75));
                _6537 = float2(fma(_3956, 0.5, 0.5), fma(_3964, 0.25, 0.5));
            }
            else
            {
                float2 _6538;
                float2 _6546;
                if (abs(_3865 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6546 = float2(fma(fma(_3837, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3822, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6538 = float2(fma(_3837, 0.99609375, 0.001953125) * 0.5, fma(fma(_3822, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6539;
                    float2 _6547;
                    if (abs(_3865 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _4032 = fma(_3837, 0.9921875, 0.00390625);
                        float _4042 = fma(fma(_3822, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6547 = float2(fma(_4032, 0.25, 0.75), _4042);
                        _6539 = float2(fma(_4032, 0.25, 0.5), _4042);
                    }
                    else
                    {
                        float2 _6540;
                        float2 _6548;
                        if (abs(_3865 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _4070 = fma(_3837, 0.9921875, 0.00390625);
                            float _4078 = fma(_3822, 0.3133362829685211181640625, 0.0078125);
                            _6548 = float2(fma(_4070, 0.25, 0.5), fma(_4078, 0.125, 0.875));
                            _6540 = float2(fma(_4070, 0.25, 0.75), fma(_4078, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6541;
                            float2 _6549;
                            if (abs(_3865 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _4108 = fma(_3837, 0.9921875, 0.00390625);
                                float _4118 = fma(fma(_3822, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6549 = float2(fma(_4108, 0.25, 0.75), _4118);
                                _6541 = float2(fma(_4108, 0.25, 0.5), _4118);
                            }
                            else
                            {
                                float2 _6550;
                                if (abs(_3865 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6550 = float2(fma(fma(_3837, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3822, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6550 = _6369;
                                }
                                _6549 = _6550;
                                _6541 = _6550;
                            }
                            _6548 = _6549;
                            _6540 = _6541;
                        }
                        _6547 = _6548;
                        _6539 = _6540;
                    }
                    _6546 = _6547;
                    _6538 = _6539;
                }
                _6545 = _6546;
                _6537 = _6538;
            }
            _6544 = _6545;
            _6536 = _6537;
        }
        _6543 = _6544;
        _6535 = _6536;
    }
    float4 _4190 = mix(_AmbientTexture.sample(_AmbientTextureSmplr, _6535), _AmbientTexture.sample(_AmbientTextureSmplr, _6543), float4(fma(_3770, 7.0, -_3865)));
    float4 _4215 = (float4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _2342) + float4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float _4217 = _4215.x;
    float2 _4235 = (float2(-1.03999996185302734375, 1.03999996185302734375) * fma(fast::min(_4217 * _4217, exp2((-9.27999973297119140625) * _2476)), _4217, _4215.y)) + _4215.zw;
    float3 _3126 = (((((_2373 * _4235.x) + float3(_4235.y * fast::clamp(50.0 * _2373.y, 0.0, 1.0))) * (_4190.xyz / float3(_4190.w))) * fast::max(float3(_2505), ((((((_2373 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * _2505) + ((_2373 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * _2505) + ((_2373 * 2.755199909210205078125) + float3(0.69029998779296875))) * _2505)) * buffer._AmbientIntensity) * 1.0;
    float3 _6578;
    float3 _6579;
    if (_2569 > 0.5)
    {
        float3 _4308 = fast::normalize(_2576 + _6495);
        float _4314 = fast::max(0.0, dot(_2082, _2576));
        float _4325 = fast::max(0.0, dot(_6495, _4308));
        float _4341 = fma(-_2476, _4314, fma(2.0 * _4325, _4325, -1.0));
        float _6567;
        if (_4341 >= 0.0)
        {
            _6567 = 1.0 / fast::max(_4314, _2476);
        }
        else
        {
            _6567 = 1.0;
        }
        float _4419 = fast::max(0.0, dot(_2082, _4308));
        float _4477 = 1.0 - _4314;
        float _4505 = fma(fma(_4419, _2453, -_4419), _4419, 1.0);
        float _4518 = 1.0 - _4325;
        float _4532 = _4518 * _4518;
        _6579 = _3126 + ((((((((_2373 + ((float3(1.0) - _2373) * ((_4532 * _4532) * _4518))) * (0.5 / (fma(_2448, fma(_2476, _4477, _4314), _2476 * fma(_2448, _4477, _4314)) + 9.9999997473787516355514526367188e-06))) * ((_2453 * 0.31830990314483642578125) / fma(_4505, _4505, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4314) * buffer.u_DirLightsColor[0].xyz) * _2588) * 1.0);
        _6578 = _3119 + ((((_2366 * buffer.u_DirLightsColor[0].xyz) * _2588) * ((fma(((0.449999988079071044921875 * _2453) / fma(_2448, _2448, 0.0900000035762786865234375)) * _4341, _6567, 1.0 - ((0.5 * _2453) / fma(_2448, _2448, 0.3300000131130218505859375))) * fma(_2342, 0.5, 1.0)) * _4314)) * 1.0);
    }
    else
    {
        _6579 = _3126;
        _6578 = _3119;
    }
    float3 _6580;
    float3 _6581;
    if (_2603 > 0.5)
    {
        float _4547 = fast::max(0.0, dot(_2082, _2610));
        float3 _4583 = fast::normalize(_2610 + _6495);
        float _4588 = fast::max(0.0, dot(_2082, _4583));
        float _4642 = fma(fma(_4588, _2453, -_4588), _4588, 1.0);
        float _4655 = 1.0 - fast::max(0.0, dot(_6495, _4583));
        float _4669 = _4655 * _4655;
        _6581 = _6579 + ((((((((_2373 + ((float3(1.0) - _2373) * ((_4669 * _4669) * _4655))) * 0.25) * ((_2453 * 0.31830990314483642578125) / fma(_4642, _4642, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4547) * buffer.u_DirLightsColor[1].xyz) * _2622) * 1.0);
        _6580 = _6578 + ((((_2366 * buffer.u_DirLightsColor[1].xyz) * _2622) * _4547) * 1.0);
    }
    else
    {
        _6581 = _6579;
        _6580 = _6578;
    }
    float3 _6582;
    float3 _6583;
    if (_2637 > 0.5)
    {
        float _4684 = fast::max(0.0, dot(_2082, _2644));
        float3 _4720 = fast::normalize(_2644 + _6495);
        float _4725 = fast::max(0.0, dot(_2082, _4720));
        float _4779 = fma(fma(_4725, _2453, -_4725), _4725, 1.0);
        float _4792 = 1.0 - fast::max(0.0, dot(_6495, _4720));
        float _4806 = _4792 * _4792;
        _6583 = _6581 + ((((((((_2373 + ((float3(1.0) - _2373) * ((_4806 * _4806) * _4792))) * 0.25) * ((_2453 * 0.31830990314483642578125) / fma(_4779, _4779, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4684) * buffer.u_DirLightsColor[2].xyz) * _2656) * 1.0);
        _6582 = _6580 + ((((_2366 * buffer.u_DirLightsColor[2].xyz) * _2656) * _4684) * 1.0);
    }
    else
    {
        _6583 = _6581;
        _6582 = _6580;
    }
    float3 _6584;
    float3 _6585;
    if (_2678 > 0.5)
    {
        float _4821 = fast::max(0.0, dot(_2082, _2692));
        float3 _4857 = fast::normalize(_2692 + _6495);
        float _4862 = fast::max(0.0, dot(_2082, _4857));
        float _4916 = fma(fma(_4862, _2453, -_4862), _4862, 1.0);
        float _4929 = 1.0 - fast::max(0.0, dot(_6495, _4857));
        float _4943 = _4929 * _4929;
        _6585 = _6583 + (((((((((_2373 + ((float3(1.0) - _2373) * ((_4943 * _4943) * _4929))) * 0.25) * ((_2453 * 0.31830990314483642578125) / fma(_4916, _4916, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4821) * buffer.u_PointLightsColor[0].xyz) * _2704) * _2724) * 1.0);
        _6584 = _6582 + (((((_2366 * buffer.u_PointLightsColor[0].xyz) * _2704) * _2724) * _4821) * 1.0);
    }
    else
    {
        _6585 = _6583;
        _6584 = _6582;
    }
    float3 _6586;
    float3 _6587;
    if (_2768 > 0.5)
    {
        float _4958 = fast::max(0.0, dot(_2082, _2782));
        float3 _4994 = fast::normalize(_2782 + _6495);
        float _4999 = fast::max(0.0, dot(_2082, _4994));
        float _5053 = fma(fma(_4999, _2453, -_4999), _4999, 1.0);
        float _5066 = 1.0 - fast::max(0.0, dot(_6495, _4994));
        float _5080 = _5066 * _5066;
        _6587 = _6585 + (((((((((_2373 + ((float3(1.0) - _2373) * ((_5080 * _5080) * _5066))) * 0.25) * ((_2453 * 0.31830990314483642578125) / fma(_5053, _5053, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4958) * buffer.u_PointLightsColor[1].xyz) * _2794) * _2814) * 1.0);
        _6586 = _6584 + (((((_2366 * buffer.u_PointLightsColor[1].xyz) * _2794) * _2814) * _4958) * 1.0);
    }
    else
    {
        _6587 = _6585;
        _6586 = _6584;
    }
    float3 _6588;
    float3 _6589;
    if (_2860 > 0.5)
    {
        float _5095 = fast::max(0.0, dot(_2082, _2874));
        float3 _5131 = fast::normalize(_2874 + _6495);
        float _5136 = fast::max(0.0, dot(_2082, _5131));
        float _5190 = fma(fma(_5136, _2453, -_5136), _5136, 1.0);
        float _5203 = 1.0 - fast::max(0.0, dot(_6495, _5131));
        float _5217 = _5203 * _5203;
        _6589 = _6587 + (((((((((_2373 + ((float3(1.0) - _2373) * ((_5217 * _5217) * _5203))) * 0.25) * ((_2453 * 0.31830990314483642578125) / fma(_5190, _5190, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5095) * buffer.u_SpotLightsColor[0].xyz) * _2886) * _2927) * 1.0);
        _6588 = _6586 + (((((_2366 * buffer.u_SpotLightsColor[0].xyz) * _2886) * _2927) * _5095) * 1.0);
    }
    else
    {
        _6589 = _6587;
        _6588 = _6586;
    }
    float3 _6590;
    float3 _6591;
    if (_2973 > 0.5)
    {
        float _5232 = fast::max(0.0, dot(_2082, _2987));
        float3 _5268 = fast::normalize(_2987 + _6495);
        float _5273 = fast::max(0.0, dot(_2082, _5268));
        float _5327 = fma(fma(_5273, _2453, -_5273), _5273, 1.0);
        float _5340 = 1.0 - fast::max(0.0, dot(_6495, _5268));
        float _5354 = _5340 * _5340;
        _6591 = _6589 + (((((((((_2373 + ((float3(1.0) - _2373) * ((_5354 * _5354) * _5340))) * 0.25) * ((_2453 * 0.31830990314483642578125) / fma(_5327, _5327, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5232) * buffer.u_SpotLightsColor[1].xyz) * _2999) * _3040) * 1.0);
        _6590 = _6588 + (((((_2366 * buffer.u_SpotLightsColor[1].xyz) * _2999) * _3040) * _5232) * 1.0);
    }
    else
    {
        _6591 = _6589;
        _6590 = _6588;
    }
    float3 _3278 = _6590 + _6591;
    out.glResult = float4(pow(_3278.x, 0.4545449912548065185546875), pow(_3278.y, 0.4545449912548065185546875), pow(_3278.z, 0.4545449912548065185546875), buffer._AlbedoColor.w);
    return out;
}

