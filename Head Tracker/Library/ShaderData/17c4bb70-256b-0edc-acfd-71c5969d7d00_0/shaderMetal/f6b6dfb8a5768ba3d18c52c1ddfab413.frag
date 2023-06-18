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

constant float _6695 = {};

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

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _AlbedoTexture [[texture(0)]], texture2d<float> _AmbientTexture [[texture(1)]], sampler _AlbedoTextureSmplr [[sampler(0)]], sampler _AmbientTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _2076 = _AlbedoTexture.sample(_AlbedoTextureSmplr, in.v_uv0);
    float3 _2082 = float3(pow(buffer._AlbedoColor.x, 2.2000000476837158203125), pow(buffer._AlbedoColor.y, 2.2000000476837158203125), pow(buffer._AlbedoColor.z, 2.2000000476837158203125)) * float3(pow(_2076.x, 2.2000000476837158203125), pow(_2076.y, 2.2000000476837158203125), pow(_2076.z, 2.2000000476837158203125));
    float3 _2100 = fast::normalize(in.v_nDirWS);
    float _2472 = fast::clamp(buffer._Metallic, 0.0, 1.0);
    float _2371 = fast::clamp(buffer._Roughness, 0.07999999821186065673828125, 1.0);
    float _2477 = _2371 * _2371;
    float _2482 = _2477 * _2477;
    float3 _2395 = _2082 * (0.959999978542327880859375 * (1.0 - _2472));
    float3 _2402 = mix(float3(0.039999999105930328369140625), _2082, float3(_2472));
    float3 _2437 = fast::normalize(buffer.u_WorldSpaceCameraPos.xyz - in.v_posWS);
    float3 _6528;
    if (dot(_2437, _2100) < 0.0)
    {
        _6528 = reflect(_2437, _2100);
    }
    else
    {
        _6528 = _2437;
    }
    float3 _2463 = fast::normalize(reflect(-_6528, _2100));
    float _2505 = fast::max(0.0, dot(_2100, _6528));
    float _2528 = fast::min(1.0 + dot(_2463, _2100), 1.0);
    float _2534 = fast::clamp(pow(_2505 + 1.0, exp2(fma(-16.0, _2371, -1.0))), 0.0, 1.0) * (_2528 * _2528);
    float _2598 = buffer.u_DirLightsEnabled[0] * step(0.5, buffer.u_DirLightNum);
    float3 _2605 = fast::normalize(-buffer.u_DirLightsDirection[0].xyz);
    float _2617 = buffer.u_DirLightsIntensity[0] * _2598;
    float _2632 = buffer.u_DirLightsEnabled[1] * step(1.5, buffer.u_DirLightNum);
    float3 _2639 = fast::normalize(-buffer.u_DirLightsDirection[1].xyz);
    float _2651 = buffer.u_DirLightsIntensity[1] * _2632;
    float _2666 = buffer.u_DirLightsEnabled[2] * step(2.5, buffer.u_DirLightNum);
    float3 _2673 = fast::normalize(-buffer.u_DirLightsDirection[2].xyz);
    float _2685 = buffer.u_DirLightsIntensity[2] * _2666;
    float _2707 = buffer.u_PointLightsEnabled[0] * step(0.5, buffer.u_PointLightNum);
    float3 _2715 = buffer.u_PointLightsPosition[0].xyz - in.v_posWS;
    float _2717 = length(_2715);
    float3 _2721 = _2715 / float3(_2717);
    float _2733 = buffer.u_PointLightsIntensity[0] * _2707;
    float _2739 = _2717 * buffer.u_PointLightsAttenRangeInv[0];
    float _2761 = _2739 * _2739;
    float _2768 = fast::clamp(fma(-_2761, _2761, 1.0), 0.0, 1.0);
    float3 _2753 = float3(((_2768 * _2768) * fma(_2739, _2739, 1.0)) * 0.25);
    float _2797 = buffer.u_PointLightsEnabled[1] * step(1.5, buffer.u_PointLightNum);
    float3 _2805 = buffer.u_PointLightsPosition[1].xyz - in.v_posWS;
    float _2807 = length(_2805);
    float3 _2811 = _2805 / float3(_2807);
    float _2823 = buffer.u_PointLightsIntensity[1] * _2797;
    float _2829 = _2807 * buffer.u_PointLightsAttenRangeInv[1];
    float _2851 = _2829 * _2829;
    float _2858 = fast::clamp(fma(-_2851, _2851, 1.0), 0.0, 1.0);
    float3 _2843 = float3(((_2858 * _2858) * fma(_2829, _2829, 1.0)) * 0.25);
    float _2889 = buffer.u_SpotLightsEnabled[0] * step(0.5, buffer.u_SpotLightNum);
    float3 _2897 = buffer.u_SpotLightsPosition[0].xyz - in.v_posWS;
    float _2899 = length(_2897);
    float3 _2903 = _2897 / float3(_2899);
    float _2915 = buffer.u_SpotLightsIntensity[0] * _2889;
    float _2921 = _2899 * buffer.u_SpotLightsAttenRangeInv[0];
    float _2964 = _2921 * _2921;
    float _2971 = fast::clamp(fma(-_2964, _2964, 1.0), 0.0, 1.0);
    float3 _2956 = float3((((_2971 * _2971) * fma(_2921, _2921, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[0], buffer.u_SpotLightsInnerAngleCos[0], fast::max(0.0, dot(_2903, fast::normalize(-buffer.u_SpotLightsDirection[0].xyz)))));
    float _3002 = buffer.u_SpotLightsEnabled[1] * step(1.5, buffer.u_SpotLightNum);
    float3 _3010 = buffer.u_SpotLightsPosition[1].xyz - in.v_posWS;
    float _3012 = length(_3010);
    float3 _3016 = _3010 / float3(_3012);
    float _3028 = buffer.u_SpotLightsIntensity[1] * _3002;
    float _3034 = _3012 * buffer.u_SpotLightsAttenRangeInv[1];
    float _3077 = _3034 * _3034;
    float _3084 = fast::clamp(fma(-_3077, _3077, 1.0), 0.0, 1.0);
    float3 _3069 = float3((((_3084 * _3084) * fma(_3034, _3034, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[1], buffer.u_SpotLightsInnerAngleCos[1], fast::max(0.0, dot(_3016, fast::normalize(-buffer.u_SpotLightsDirection[1].xyz)))));
    float3 _3356 = fast::normalize(_2100);
    float _3359 = -_3356.z;
    float _3361 = _3356.x;
    float _3368 = acos(_3356.y);
    float _3374 = fma(fma((_3361 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3359 / length(float2(_3361, _3359)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3383 = fract((_3374 + floor(_3374)) + 1.0);
    float2 _6287 = float2(_6695, _3368 * 0.3183098733425140380859375);
    _6287.x = _3383;
    float _3411 = floor(7.0);
    float2 _6535;
    float2 _6543;
    if (abs(_3411) < 0.001000000047497451305389404296875)
    {
        _6543 = float2(fma(_3383, 0.99609375, 0.001953125) * 0.5, fma(fma(_3368, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6535 = float2(fma(_3383, 0.998046875, 0.0009765625), fma(_3368, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6536;
        float2 _6544;
        if (abs(_3411 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _3464 = fma(_3383, 0.99609375, 0.001953125);
            float _3474 = fma(fma(_3368, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6544 = float2(fma(_3464, 0.5, 0.5), _3474);
            _6536 = float2(_3464 * 0.5, _3474);
        }
        else
        {
            float2 _6537;
            float2 _6545;
            if (abs(_3411 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _3502 = fma(_3383, 0.99609375, 0.001953125);
                float _3510 = fma(_3368, 0.315823078155517578125, 0.00390625);
                _6545 = float2(_3502 * 0.5, fma(_3510, 0.25, 0.75));
                _6537 = float2(fma(_3502, 0.5, 0.5), fma(_3510, 0.25, 0.5));
            }
            else
            {
                float2 _6538;
                float2 _6546;
                if (abs(_3411 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6546 = float2(fma(fma(_3383, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3368, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6538 = float2(fma(_3383, 0.99609375, 0.001953125) * 0.5, fma(fma(_3368, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6539;
                    float2 _6547;
                    if (abs(_3411 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _3578 = fma(_3383, 0.9921875, 0.00390625);
                        float _3588 = fma(fma(_3368, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6547 = float2(fma(_3578, 0.25, 0.75), _3588);
                        _6539 = float2(fma(_3578, 0.25, 0.5), _3588);
                    }
                    else
                    {
                        float2 _6540;
                        float2 _6548;
                        if (abs(_3411 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _3616 = fma(_3383, 0.9921875, 0.00390625);
                            float _3624 = fma(_3368, 0.3133362829685211181640625, 0.0078125);
                            _6548 = float2(fma(_3616, 0.25, 0.5), fma(_3624, 0.125, 0.875));
                            _6540 = float2(fma(_3616, 0.25, 0.75), fma(_3624, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6541;
                            float2 _6549;
                            if (abs(_3411 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _3654 = fma(_3383, 0.9921875, 0.00390625);
                                float _3664 = fma(fma(_3368, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6549 = float2(fma(_3654, 0.25, 0.75), _3664);
                                _6541 = float2(fma(_3654, 0.25, 0.5), _3664);
                            }
                            else
                            {
                                float2 _6550;
                                if (abs(_3411 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6550 = float2(fma(fma(_3383, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3368, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6550 = _6287;
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
    float4 _3730 = _AmbientTexture.sample(_AmbientTextureSmplr, _6535);
    float4 _3733 = _AmbientTexture.sample(_AmbientTextureSmplr, _6543);
    float4 _3736 = mix(_3730, _3733, float4(7.0 - _3411));
    float3 _3148 = ((((_3736.xyz / float3(_3736.w)) * _2395) * fast::max(float3(1.0), ((((((_2395 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * 1.0) + ((_2395 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * 1.0) + ((_2395 * 2.755199909210205078125) + float3(0.69029998779296875))) * 1.0)) * buffer._AmbientIntensity) * 1.0;
    float _3799 = _2371 - 0.07999999821186065673828125;
    float3 _3839 = fast::normalize(mix(_2463, _2100, float3(_2371 * _2477)));
    float _3842 = -_3839.z;
    float _3844 = _3839.x;
    float _3851 = acos(_3839.y);
    float _3857 = fma(fma((_3844 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3842 / length(float2(_3844, _3842)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3866 = fract((_3857 + floor(_3857)) + 1.0);
    float2 _6402 = float2(_6695, _3851 * 0.3183098733425140380859375);
    _6402.x = _3866;
    float _3894 = floor(_3799 * 7.0);
    float2 _6568;
    float2 _6576;
    if (abs(_3894) < 0.001000000047497451305389404296875)
    {
        _6576 = float2(fma(_3866, 0.99609375, 0.001953125) * 0.5, fma(fma(_3851, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6568 = float2(fma(_3866, 0.998046875, 0.0009765625), fma(_3851, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6569;
        float2 _6577;
        if (abs(_3894 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _3947 = fma(_3866, 0.99609375, 0.001953125);
            float _3957 = fma(fma(_3851, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6577 = float2(fma(_3947, 0.5, 0.5), _3957);
            _6569 = float2(_3947 * 0.5, _3957);
        }
        else
        {
            float2 _6570;
            float2 _6578;
            if (abs(_3894 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _3985 = fma(_3866, 0.99609375, 0.001953125);
                float _3993 = fma(_3851, 0.315823078155517578125, 0.00390625);
                _6578 = float2(_3985 * 0.5, fma(_3993, 0.25, 0.75));
                _6570 = float2(fma(_3985, 0.5, 0.5), fma(_3993, 0.25, 0.5));
            }
            else
            {
                float2 _6571;
                float2 _6579;
                if (abs(_3894 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6579 = float2(fma(fma(_3866, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3851, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6571 = float2(fma(_3866, 0.99609375, 0.001953125) * 0.5, fma(fma(_3851, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6572;
                    float2 _6580;
                    if (abs(_3894 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _4061 = fma(_3866, 0.9921875, 0.00390625);
                        float _4071 = fma(fma(_3851, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6580 = float2(fma(_4061, 0.25, 0.75), _4071);
                        _6572 = float2(fma(_4061, 0.25, 0.5), _4071);
                    }
                    else
                    {
                        float2 _6573;
                        float2 _6581;
                        if (abs(_3894 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _4099 = fma(_3866, 0.9921875, 0.00390625);
                            float _4107 = fma(_3851, 0.3133362829685211181640625, 0.0078125);
                            _6581 = float2(fma(_4099, 0.25, 0.5), fma(_4107, 0.125, 0.875));
                            _6573 = float2(fma(_4099, 0.25, 0.75), fma(_4107, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6574;
                            float2 _6582;
                            if (abs(_3894 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _4137 = fma(_3866, 0.9921875, 0.00390625);
                                float _4147 = fma(fma(_3851, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6582 = float2(fma(_4137, 0.25, 0.75), _4147);
                                _6574 = float2(fma(_4137, 0.25, 0.5), _4147);
                            }
                            else
                            {
                                float2 _6583;
                                if (abs(_3894 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6583 = float2(fma(fma(_3866, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3851, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6583 = _6402;
                                }
                                _6582 = _6583;
                                _6574 = _6583;
                            }
                            _6581 = _6582;
                            _6573 = _6574;
                        }
                        _6580 = _6581;
                        _6572 = _6573;
                    }
                    _6579 = _6580;
                    _6571 = _6572;
                }
                _6578 = _6579;
                _6570 = _6571;
            }
            _6577 = _6578;
            _6569 = _6570;
        }
        _6576 = _6577;
        _6568 = _6569;
    }
    float4 _4219 = mix(_AmbientTexture.sample(_AmbientTextureSmplr, _6568), _AmbientTexture.sample(_AmbientTextureSmplr, _6576), float4(fma(_3799, 7.0, -_3894)));
    float4 _4244 = (float4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _2371) + float4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float _4246 = _4244.x;
    float2 _4264 = (float2(-1.03999996185302734375, 1.03999996185302734375) * fma(fast::min(_4246 * _4246, exp2((-9.27999973297119140625) * _2505)), _4246, _4244.y)) + _4244.zw;
    float3 _3155 = (((((_2402 * _4264.x) + float3(_4264.y * fast::clamp(50.0 * _2402.y, 0.0, 1.0))) * (_4219.xyz / float3(_4219.w))) * fast::max(float3(_2534), ((((((_2402 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * _2534) + ((_2402 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * _2534) + ((_2402 * 2.755199909210205078125) + float3(0.69029998779296875))) * _2534)) * buffer._AmbientIntensity) * 1.0;
    float3 _6611;
    float3 _6612;
    if (_2598 > 0.5)
    {
        float3 _4337 = fast::normalize(_2605 + _6528);
        float _4343 = fast::max(0.0, dot(_2100, _2605));
        float _4354 = fast::max(0.0, dot(_6528, _4337));
        float _4370 = fma(-_2505, _4343, fma(2.0 * _4354, _4354, -1.0));
        float _6600;
        if (_4370 >= 0.0)
        {
            _6600 = 1.0 / fast::max(_4343, _2505);
        }
        else
        {
            _6600 = 1.0;
        }
        float _4448 = fast::max(0.0, dot(_2100, _4337));
        float _4506 = 1.0 - _4343;
        float _4534 = fma(fma(_4448, _2482, -_4448), _4448, 1.0);
        float _4547 = 1.0 - _4354;
        float _4561 = _4547 * _4547;
        _6612 = _3155 + ((((((((_2402 + ((float3(1.0) - _2402) * ((_4561 * _4561) * _4547))) * (0.5 / (fma(_2477, fma(_2505, _4506, _4343), _2505 * fma(_2477, _4506, _4343)) + 9.9999997473787516355514526367188e-06))) * ((_2482 * 0.31830990314483642578125) / fma(_4534, _4534, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4343) * buffer.u_DirLightsColor[0].xyz) * _2617) * 1.0);
        _6611 = _3148 + ((((_2395 * buffer.u_DirLightsColor[0].xyz) * _2617) * ((fma(((0.449999988079071044921875 * _2482) / fma(_2477, _2477, 0.0900000035762786865234375)) * _4370, _6600, 1.0 - ((0.5 * _2482) / fma(_2477, _2477, 0.3300000131130218505859375))) * fma(_2371, 0.5, 1.0)) * _4343)) * 1.0);
    }
    else
    {
        _6612 = _3155;
        _6611 = _3148;
    }
    float3 _6613;
    float3 _6614;
    if (_2632 > 0.5)
    {
        float _4576 = fast::max(0.0, dot(_2100, _2639));
        float3 _4612 = fast::normalize(_2639 + _6528);
        float _4617 = fast::max(0.0, dot(_2100, _4612));
        float _4671 = fma(fma(_4617, _2482, -_4617), _4617, 1.0);
        float _4684 = 1.0 - fast::max(0.0, dot(_6528, _4612));
        float _4698 = _4684 * _4684;
        _6614 = _6612 + ((((((((_2402 + ((float3(1.0) - _2402) * ((_4698 * _4698) * _4684))) * 0.25) * ((_2482 * 0.31830990314483642578125) / fma(_4671, _4671, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4576) * buffer.u_DirLightsColor[1].xyz) * _2651) * 1.0);
        _6613 = _6611 + ((((_2395 * buffer.u_DirLightsColor[1].xyz) * _2651) * _4576) * 1.0);
    }
    else
    {
        _6614 = _6612;
        _6613 = _6611;
    }
    float3 _6615;
    float3 _6616;
    if (_2666 > 0.5)
    {
        float _4713 = fast::max(0.0, dot(_2100, _2673));
        float3 _4749 = fast::normalize(_2673 + _6528);
        float _4754 = fast::max(0.0, dot(_2100, _4749));
        float _4808 = fma(fma(_4754, _2482, -_4754), _4754, 1.0);
        float _4821 = 1.0 - fast::max(0.0, dot(_6528, _4749));
        float _4835 = _4821 * _4821;
        _6616 = _6614 + ((((((((_2402 + ((float3(1.0) - _2402) * ((_4835 * _4835) * _4821))) * 0.25) * ((_2482 * 0.31830990314483642578125) / fma(_4808, _4808, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4713) * buffer.u_DirLightsColor[2].xyz) * _2685) * 1.0);
        _6615 = _6613 + ((((_2395 * buffer.u_DirLightsColor[2].xyz) * _2685) * _4713) * 1.0);
    }
    else
    {
        _6616 = _6614;
        _6615 = _6613;
    }
    float3 _6617;
    float3 _6618;
    if (_2707 > 0.5)
    {
        float _4850 = fast::max(0.0, dot(_2100, _2721));
        float3 _4886 = fast::normalize(_2721 + _6528);
        float _4891 = fast::max(0.0, dot(_2100, _4886));
        float _4945 = fma(fma(_4891, _2482, -_4891), _4891, 1.0);
        float _4958 = 1.0 - fast::max(0.0, dot(_6528, _4886));
        float _4972 = _4958 * _4958;
        _6618 = _6616 + (((((((((_2402 + ((float3(1.0) - _2402) * ((_4972 * _4972) * _4958))) * 0.25) * ((_2482 * 0.31830990314483642578125) / fma(_4945, _4945, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4850) * buffer.u_PointLightsColor[0].xyz) * _2733) * _2753) * 1.0);
        _6617 = _6615 + (((((_2395 * buffer.u_PointLightsColor[0].xyz) * _2733) * _2753) * _4850) * 1.0);
    }
    else
    {
        _6618 = _6616;
        _6617 = _6615;
    }
    float3 _6619;
    float3 _6620;
    if (_2797 > 0.5)
    {
        float _4987 = fast::max(0.0, dot(_2100, _2811));
        float3 _5023 = fast::normalize(_2811 + _6528);
        float _5028 = fast::max(0.0, dot(_2100, _5023));
        float _5082 = fma(fma(_5028, _2482, -_5028), _5028, 1.0);
        float _5095 = 1.0 - fast::max(0.0, dot(_6528, _5023));
        float _5109 = _5095 * _5095;
        _6620 = _6618 + (((((((((_2402 + ((float3(1.0) - _2402) * ((_5109 * _5109) * _5095))) * 0.25) * ((_2482 * 0.31830990314483642578125) / fma(_5082, _5082, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4987) * buffer.u_PointLightsColor[1].xyz) * _2823) * _2843) * 1.0);
        _6619 = _6617 + (((((_2395 * buffer.u_PointLightsColor[1].xyz) * _2823) * _2843) * _4987) * 1.0);
    }
    else
    {
        _6620 = _6618;
        _6619 = _6617;
    }
    float3 _6621;
    float3 _6622;
    if (_2889 > 0.5)
    {
        float _5124 = fast::max(0.0, dot(_2100, _2903));
        float3 _5160 = fast::normalize(_2903 + _6528);
        float _5165 = fast::max(0.0, dot(_2100, _5160));
        float _5219 = fma(fma(_5165, _2482, -_5165), _5165, 1.0);
        float _5232 = 1.0 - fast::max(0.0, dot(_6528, _5160));
        float _5246 = _5232 * _5232;
        _6622 = _6620 + (((((((((_2402 + ((float3(1.0) - _2402) * ((_5246 * _5246) * _5232))) * 0.25) * ((_2482 * 0.31830990314483642578125) / fma(_5219, _5219, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5124) * buffer.u_SpotLightsColor[0].xyz) * _2915) * _2956) * 1.0);
        _6621 = _6619 + (((((_2395 * buffer.u_SpotLightsColor[0].xyz) * _2915) * _2956) * _5124) * 1.0);
    }
    else
    {
        _6622 = _6620;
        _6621 = _6619;
    }
    float3 _6623;
    float3 _6624;
    if (_3002 > 0.5)
    {
        float _5261 = fast::max(0.0, dot(_2100, _3016));
        float3 _5297 = fast::normalize(_3016 + _6528);
        float _5302 = fast::max(0.0, dot(_2100, _5297));
        float _5356 = fma(fma(_5302, _2482, -_5302), _5302, 1.0);
        float _5369 = 1.0 - fast::max(0.0, dot(_6528, _5297));
        float _5383 = _5369 * _5369;
        _6624 = _6622 + (((((((((_2402 + ((float3(1.0) - _2402) * ((_5383 * _5383) * _5369))) * 0.25) * ((_2482 * 0.31830990314483642578125) / fma(_5356, _5356, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5261) * buffer.u_SpotLightsColor[1].xyz) * _3028) * _3069) * 1.0);
        _6623 = _6621 + (((((_2395 * buffer.u_SpotLightsColor[1].xyz) * _3028) * _3069) * _5261) * 1.0);
    }
    else
    {
        _6624 = _6622;
        _6623 = _6621;
    }
    float3 _3307 = _6623 + _6624;
    out.glResult = float4(pow(_3307.x, 0.4545449912548065185546875), pow(_3307.y, 0.4545449912548065185546875), pow(_3307.z, 0.4545449912548065185546875), buffer._AlbedoColor.w * _2076.w);
    return out;
}

