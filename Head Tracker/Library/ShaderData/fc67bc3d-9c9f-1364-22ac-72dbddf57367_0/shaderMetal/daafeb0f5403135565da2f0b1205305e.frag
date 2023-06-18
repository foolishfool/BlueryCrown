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
    float _Occlusion;
};

constant float _6756 = {};

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

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _AlbedoTexture [[texture(0)]], texture2d<float> _MRAOTexture [[texture(1)]], texture2d<float> _AmbientTexture [[texture(2)]], sampler _AlbedoTextureSmplr [[sampler(0)]], sampler _MRAOTextureSmplr [[sampler(1)]], sampler _AmbientTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float4 _2095 = _AlbedoTexture.sample(_AlbedoTextureSmplr, in.v_uv0);
    float3 _2101 = float3(pow(buffer._AlbedoColor.x, 2.2000000476837158203125), pow(buffer._AlbedoColor.y, 2.2000000476837158203125), pow(buffer._AlbedoColor.z, 2.2000000476837158203125)) * float3(pow(_2095.x, 2.2000000476837158203125), pow(_2095.y, 2.2000000476837158203125), pow(_2095.z, 2.2000000476837158203125));
    float4 _2113 = _MRAOTexture.sample(_MRAOTextureSmplr, in.v_uv0);
    float3 _2142 = fast::normalize(in.v_nDirWS);
    float _2530 = fast::clamp((_2113.x + buffer._Metallic) - 0.5, 0.0, 1.0);
    float _2429 = fast::clamp((_2113.y + buffer._Roughness) - 0.5, 0.07999999821186065673828125, 1.0);
    float _2535 = _2429 * _2429;
    float _2540 = _2535 * _2535;
    float _2544 = fast::clamp(mix(1.0, _2113.z, buffer._Occlusion), 0.0, 1.0);
    float3 _2453 = _2101 * (0.959999978542327880859375 * (1.0 - _2530));
    float3 _2460 = mix(float3(0.039999999105930328369140625), _2101, float3(_2530));
    float3 _2495 = fast::normalize(buffer.u_WorldSpaceCameraPos.xyz - in.v_posWS);
    float3 _6589;
    if (dot(_2495, _2142) < 0.0)
    {
        _6589 = reflect(_2495, _2142);
    }
    else
    {
        _6589 = _2495;
    }
    float3 _2521 = fast::normalize(reflect(-_6589, _2142));
    float _2563 = fast::max(0.0, dot(_2142, _6589));
    float _2586 = fast::min(1.0 + dot(_2521, _2142), 1.0);
    float _2592 = fast::clamp((pow(_2563 + _2544, exp2(fma(-16.0, _2429, -1.0))) - 1.0) + _2544, 0.0, 1.0) * (_2586 * _2586);
    float _2656 = buffer.u_DirLightsEnabled[0] * step(0.5, buffer.u_DirLightNum);
    float3 _2663 = fast::normalize(-buffer.u_DirLightsDirection[0].xyz);
    float _2675 = buffer.u_DirLightsIntensity[0] * _2656;
    float _2690 = buffer.u_DirLightsEnabled[1] * step(1.5, buffer.u_DirLightNum);
    float3 _2697 = fast::normalize(-buffer.u_DirLightsDirection[1].xyz);
    float _2709 = buffer.u_DirLightsIntensity[1] * _2690;
    float _2724 = buffer.u_DirLightsEnabled[2] * step(2.5, buffer.u_DirLightNum);
    float3 _2731 = fast::normalize(-buffer.u_DirLightsDirection[2].xyz);
    float _2743 = buffer.u_DirLightsIntensity[2] * _2724;
    float _2765 = buffer.u_PointLightsEnabled[0] * step(0.5, buffer.u_PointLightNum);
    float3 _2773 = buffer.u_PointLightsPosition[0].xyz - in.v_posWS;
    float _2775 = length(_2773);
    float3 _2779 = _2773 / float3(_2775);
    float _2791 = buffer.u_PointLightsIntensity[0] * _2765;
    float _2797 = _2775 * buffer.u_PointLightsAttenRangeInv[0];
    float _2819 = _2797 * _2797;
    float _2826 = fast::clamp(fma(-_2819, _2819, 1.0), 0.0, 1.0);
    float3 _2811 = float3(((_2826 * _2826) * fma(_2797, _2797, 1.0)) * 0.25);
    float _2855 = buffer.u_PointLightsEnabled[1] * step(1.5, buffer.u_PointLightNum);
    float3 _2863 = buffer.u_PointLightsPosition[1].xyz - in.v_posWS;
    float _2865 = length(_2863);
    float3 _2869 = _2863 / float3(_2865);
    float _2881 = buffer.u_PointLightsIntensity[1] * _2855;
    float _2887 = _2865 * buffer.u_PointLightsAttenRangeInv[1];
    float _2909 = _2887 * _2887;
    float _2916 = fast::clamp(fma(-_2909, _2909, 1.0), 0.0, 1.0);
    float3 _2901 = float3(((_2916 * _2916) * fma(_2887, _2887, 1.0)) * 0.25);
    float _2947 = buffer.u_SpotLightsEnabled[0] * step(0.5, buffer.u_SpotLightNum);
    float3 _2955 = buffer.u_SpotLightsPosition[0].xyz - in.v_posWS;
    float _2957 = length(_2955);
    float3 _2961 = _2955 / float3(_2957);
    float _2973 = buffer.u_SpotLightsIntensity[0] * _2947;
    float _2979 = _2957 * buffer.u_SpotLightsAttenRangeInv[0];
    float _3022 = _2979 * _2979;
    float _3029 = fast::clamp(fma(-_3022, _3022, 1.0), 0.0, 1.0);
    float3 _3014 = float3((((_3029 * _3029) * fma(_2979, _2979, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[0], buffer.u_SpotLightsInnerAngleCos[0], fast::max(0.0, dot(_2961, fast::normalize(-buffer.u_SpotLightsDirection[0].xyz)))));
    float _3060 = buffer.u_SpotLightsEnabled[1] * step(1.5, buffer.u_SpotLightNum);
    float3 _3068 = buffer.u_SpotLightsPosition[1].xyz - in.v_posWS;
    float _3070 = length(_3068);
    float3 _3074 = _3068 / float3(_3070);
    float _3086 = buffer.u_SpotLightsIntensity[1] * _3060;
    float _3092 = _3070 * buffer.u_SpotLightsAttenRangeInv[1];
    float _3135 = _3092 * _3092;
    float _3142 = fast::clamp(fma(-_3135, _3135, 1.0), 0.0, 1.0);
    float3 _3127 = float3((((_3142 * _3142) * fma(_3092, _3092, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[1], buffer.u_SpotLightsInnerAngleCos[1], fast::max(0.0, dot(_3074, fast::normalize(-buffer.u_SpotLightsDirection[1].xyz)))));
    float3 _3414 = fast::normalize(_2142);
    float _3417 = -_3414.z;
    float _3419 = _3414.x;
    float _3426 = acos(_3414.y);
    float _3432 = fma(fma((_3419 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3417 / length(float2(_3419, _3417)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3441 = fract((_3432 + floor(_3432)) + 1.0);
    float2 _6348 = float2(_6756, _3426 * 0.3183098733425140380859375);
    _6348.x = _3441;
    float _3469 = floor(7.0);
    float2 _6596;
    float2 _6604;
    if (abs(_3469) < 0.001000000047497451305389404296875)
    {
        _6604 = float2(fma(_3441, 0.99609375, 0.001953125) * 0.5, fma(fma(_3426, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6596 = float2(fma(_3441, 0.998046875, 0.0009765625), fma(_3426, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6597;
        float2 _6605;
        if (abs(_3469 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _3522 = fma(_3441, 0.99609375, 0.001953125);
            float _3532 = fma(fma(_3426, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6605 = float2(fma(_3522, 0.5, 0.5), _3532);
            _6597 = float2(_3522 * 0.5, _3532);
        }
        else
        {
            float2 _6598;
            float2 _6606;
            if (abs(_3469 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _3560 = fma(_3441, 0.99609375, 0.001953125);
                float _3568 = fma(_3426, 0.315823078155517578125, 0.00390625);
                _6606 = float2(_3560 * 0.5, fma(_3568, 0.25, 0.75));
                _6598 = float2(fma(_3560, 0.5, 0.5), fma(_3568, 0.25, 0.5));
            }
            else
            {
                float2 _6599;
                float2 _6607;
                if (abs(_3469 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6607 = float2(fma(fma(_3441, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3426, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6599 = float2(fma(_3441, 0.99609375, 0.001953125) * 0.5, fma(fma(_3426, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6600;
                    float2 _6608;
                    if (abs(_3469 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _3636 = fma(_3441, 0.9921875, 0.00390625);
                        float _3646 = fma(fma(_3426, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6608 = float2(fma(_3636, 0.25, 0.75), _3646);
                        _6600 = float2(fma(_3636, 0.25, 0.5), _3646);
                    }
                    else
                    {
                        float2 _6601;
                        float2 _6609;
                        if (abs(_3469 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _3674 = fma(_3441, 0.9921875, 0.00390625);
                            float _3682 = fma(_3426, 0.3133362829685211181640625, 0.0078125);
                            _6609 = float2(fma(_3674, 0.25, 0.5), fma(_3682, 0.125, 0.875));
                            _6601 = float2(fma(_3674, 0.25, 0.75), fma(_3682, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6602;
                            float2 _6610;
                            if (abs(_3469 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _3712 = fma(_3441, 0.9921875, 0.00390625);
                                float _3722 = fma(fma(_3426, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6610 = float2(fma(_3712, 0.25, 0.75), _3722);
                                _6602 = float2(fma(_3712, 0.25, 0.5), _3722);
                            }
                            else
                            {
                                float2 _6611;
                                if (abs(_3469 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6611 = float2(fma(fma(_3441, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3426, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6611 = _6348;
                                }
                                _6610 = _6611;
                                _6602 = _6611;
                            }
                            _6609 = _6610;
                            _6601 = _6602;
                        }
                        _6608 = _6609;
                        _6600 = _6601;
                    }
                    _6607 = _6608;
                    _6599 = _6600;
                }
                _6606 = _6607;
                _6598 = _6599;
            }
            _6605 = _6606;
            _6597 = _6598;
        }
        _6604 = _6605;
        _6596 = _6597;
    }
    float4 _3788 = _AmbientTexture.sample(_AmbientTextureSmplr, _6596);
    float4 _3791 = _AmbientTexture.sample(_AmbientTextureSmplr, _6604);
    float4 _3794 = mix(_3788, _3791, float4(7.0 - _3469));
    float3 _3206 = ((((_3794.xyz / float3(_3794.w)) * _2453) * fast::max(float3(_2544), ((((((_2453 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * _2544) + ((_2453 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * _2544) + ((_2453 * 2.755199909210205078125) + float3(0.69029998779296875))) * _2544)) * buffer._AmbientIntensity) * 1.0;
    float _3857 = _2429 - 0.07999999821186065673828125;
    float3 _3897 = fast::normalize(mix(_2521, _2142, float3(_2429 * _2535)));
    float _3900 = -_3897.z;
    float _3902 = _3897.x;
    float _3909 = acos(_3897.y);
    float _3915 = fma(fma((_3902 < 0.0) ? (-1.0) : 1.0, acos(fast::clamp(_3900 / length(float2(_3902, _3900)), -1.0, 1.0)), -1.57079637050628662109375), 0.15915493667125701904296875, buffer._AmbientRotation);
    float _3924 = fract((_3915 + floor(_3915)) + 1.0);
    float2 _6463 = float2(_6756, _3909 * 0.3183098733425140380859375);
    _6463.x = _3924;
    float _3952 = floor(_3857 * 7.0);
    float2 _6629;
    float2 _6637;
    if (abs(_3952) < 0.001000000047497451305389404296875)
    {
        _6637 = float2(fma(_3924, 0.99609375, 0.001953125) * 0.5, fma(fma(_3909, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _6629 = float2(fma(_3924, 0.998046875, 0.0009765625), fma(_3909, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _6630;
        float2 _6638;
        if (abs(_3952 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _4005 = fma(_3924, 0.99609375, 0.001953125);
            float _4015 = fma(fma(_3909, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _6638 = float2(fma(_4005, 0.5, 0.5), _4015);
            _6630 = float2(_4005 * 0.5, _4015);
        }
        else
        {
            float2 _6631;
            float2 _6639;
            if (abs(_3952 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _4043 = fma(_3924, 0.99609375, 0.001953125);
                float _4051 = fma(_3909, 0.315823078155517578125, 0.00390625);
                _6639 = float2(_4043 * 0.5, fma(_4051, 0.25, 0.75));
                _6631 = float2(fma(_4043, 0.5, 0.5), fma(_4051, 0.25, 0.5));
            }
            else
            {
                float2 _6632;
                float2 _6640;
                if (abs(_3952 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6640 = float2(fma(fma(_3924, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_3909, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _6632 = float2(fma(_3924, 0.99609375, 0.001953125) * 0.5, fma(fma(_3909, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _6633;
                    float2 _6641;
                    if (abs(_3952 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _4119 = fma(_3924, 0.9921875, 0.00390625);
                        float _4129 = fma(fma(_3909, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _6641 = float2(fma(_4119, 0.25, 0.75), _4129);
                        _6633 = float2(fma(_4119, 0.25, 0.5), _4129);
                    }
                    else
                    {
                        float2 _6634;
                        float2 _6642;
                        if (abs(_3952 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _4157 = fma(_3924, 0.9921875, 0.00390625);
                            float _4165 = fma(_3909, 0.3133362829685211181640625, 0.0078125);
                            _6642 = float2(fma(_4157, 0.25, 0.5), fma(_4165, 0.125, 0.875));
                            _6634 = float2(fma(_4157, 0.25, 0.75), fma(_4165, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _6635;
                            float2 _6643;
                            if (abs(_3952 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _4195 = fma(_3924, 0.9921875, 0.00390625);
                                float _4205 = fma(fma(_3909, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _6643 = float2(fma(_4195, 0.25, 0.75), _4205);
                                _6635 = float2(fma(_4195, 0.25, 0.5), _4205);
                            }
                            else
                            {
                                float2 _6644;
                                if (abs(_3952 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6644 = float2(fma(fma(_3924, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_3909, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                }
                                else
                                {
                                    _6644 = _6463;
                                }
                                _6643 = _6644;
                                _6635 = _6644;
                            }
                            _6642 = _6643;
                            _6634 = _6635;
                        }
                        _6641 = _6642;
                        _6633 = _6634;
                    }
                    _6640 = _6641;
                    _6632 = _6633;
                }
                _6639 = _6640;
                _6631 = _6632;
            }
            _6638 = _6639;
            _6630 = _6631;
        }
        _6637 = _6638;
        _6629 = _6630;
    }
    float4 _4277 = mix(_AmbientTexture.sample(_AmbientTextureSmplr, _6629), _AmbientTexture.sample(_AmbientTextureSmplr, _6637), float4(fma(_3857, 7.0, -_3952)));
    float4 _4302 = (float4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _2429) + float4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float _4304 = _4302.x;
    float2 _4322 = (float2(-1.03999996185302734375, 1.03999996185302734375) * fma(fast::min(_4304 * _4304, exp2((-9.27999973297119140625) * _2563)), _4304, _4302.y)) + _4302.zw;
    float3 _3213 = (((((_2460 * _4322.x) + float3(_4322.y * fast::clamp(50.0 * _2460.y, 0.0, 1.0))) * (_4277.xyz / float3(_4277.w))) * fast::max(float3(_2592), ((((((_2460 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * _2592) + ((_2460 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * _2592) + ((_2460 * 2.755199909210205078125) + float3(0.69029998779296875))) * _2592)) * buffer._AmbientIntensity) * 1.0;
    float3 _6672;
    float3 _6673;
    if (_2656 > 0.5)
    {
        float3 _4395 = fast::normalize(_2663 + _6589);
        float _4401 = fast::max(0.0, dot(_2142, _2663));
        float _4412 = fast::max(0.0, dot(_6589, _4395));
        float _4428 = fma(-_2563, _4401, fma(2.0 * _4412, _4412, -1.0));
        float _6661;
        if (_4428 >= 0.0)
        {
            _6661 = 1.0 / fast::max(_4401, _2563);
        }
        else
        {
            _6661 = 1.0;
        }
        float _4506 = fast::max(0.0, dot(_2142, _4395));
        float _4564 = 1.0 - _4401;
        float _4592 = fma(fma(_4506, _2540, -_4506), _4506, 1.0);
        float _4605 = 1.0 - _4412;
        float _4619 = _4605 * _4605;
        _6673 = _3213 + ((((((((_2460 + ((float3(1.0) - _2460) * ((_4619 * _4619) * _4605))) * (0.5 / (fma(_2535, fma(_2563, _4564, _4401), _2563 * fma(_2535, _4564, _4401)) + 9.9999997473787516355514526367188e-06))) * ((_2540 * 0.31830990314483642578125) / fma(_4592, _4592, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4401) * buffer.u_DirLightsColor[0].xyz) * _2675) * 1.0);
        _6672 = _3206 + ((((_2453 * buffer.u_DirLightsColor[0].xyz) * _2675) * ((fma(((0.449999988079071044921875 * _2540) / fma(_2535, _2535, 0.0900000035762786865234375)) * _4428, _6661, 1.0 - ((0.5 * _2540) / fma(_2535, _2535, 0.3300000131130218505859375))) * fma(_2429, 0.5, 1.0)) * _4401)) * 1.0);
    }
    else
    {
        _6673 = _3213;
        _6672 = _3206;
    }
    float3 _6674;
    float3 _6675;
    if (_2690 > 0.5)
    {
        float _4634 = fast::max(0.0, dot(_2142, _2697));
        float3 _4670 = fast::normalize(_2697 + _6589);
        float _4675 = fast::max(0.0, dot(_2142, _4670));
        float _4729 = fma(fma(_4675, _2540, -_4675), _4675, 1.0);
        float _4742 = 1.0 - fast::max(0.0, dot(_6589, _4670));
        float _4756 = _4742 * _4742;
        _6675 = _6673 + ((((((((_2460 + ((float3(1.0) - _2460) * ((_4756 * _4756) * _4742))) * 0.25) * ((_2540 * 0.31830990314483642578125) / fma(_4729, _4729, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4634) * buffer.u_DirLightsColor[1].xyz) * _2709) * 1.0);
        _6674 = _6672 + ((((_2453 * buffer.u_DirLightsColor[1].xyz) * _2709) * _4634) * 1.0);
    }
    else
    {
        _6675 = _6673;
        _6674 = _6672;
    }
    float3 _6676;
    float3 _6677;
    if (_2724 > 0.5)
    {
        float _4771 = fast::max(0.0, dot(_2142, _2731));
        float3 _4807 = fast::normalize(_2731 + _6589);
        float _4812 = fast::max(0.0, dot(_2142, _4807));
        float _4866 = fma(fma(_4812, _2540, -_4812), _4812, 1.0);
        float _4879 = 1.0 - fast::max(0.0, dot(_6589, _4807));
        float _4893 = _4879 * _4879;
        _6677 = _6675 + ((((((((_2460 + ((float3(1.0) - _2460) * ((_4893 * _4893) * _4879))) * 0.25) * ((_2540 * 0.31830990314483642578125) / fma(_4866, _4866, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4771) * buffer.u_DirLightsColor[2].xyz) * _2743) * 1.0);
        _6676 = _6674 + ((((_2453 * buffer.u_DirLightsColor[2].xyz) * _2743) * _4771) * 1.0);
    }
    else
    {
        _6677 = _6675;
        _6676 = _6674;
    }
    float3 _6678;
    float3 _6679;
    if (_2765 > 0.5)
    {
        float _4908 = fast::max(0.0, dot(_2142, _2779));
        float3 _4944 = fast::normalize(_2779 + _6589);
        float _4949 = fast::max(0.0, dot(_2142, _4944));
        float _5003 = fma(fma(_4949, _2540, -_4949), _4949, 1.0);
        float _5016 = 1.0 - fast::max(0.0, dot(_6589, _4944));
        float _5030 = _5016 * _5016;
        _6679 = _6677 + (((((((((_2460 + ((float3(1.0) - _2460) * ((_5030 * _5030) * _5016))) * 0.25) * ((_2540 * 0.31830990314483642578125) / fma(_5003, _5003, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4908) * buffer.u_PointLightsColor[0].xyz) * _2791) * _2811) * 1.0);
        _6678 = _6676 + (((((_2453 * buffer.u_PointLightsColor[0].xyz) * _2791) * _2811) * _4908) * 1.0);
    }
    else
    {
        _6679 = _6677;
        _6678 = _6676;
    }
    float3 _6680;
    float3 _6681;
    if (_2855 > 0.5)
    {
        float _5045 = fast::max(0.0, dot(_2142, _2869));
        float3 _5081 = fast::normalize(_2869 + _6589);
        float _5086 = fast::max(0.0, dot(_2142, _5081));
        float _5140 = fma(fma(_5086, _2540, -_5086), _5086, 1.0);
        float _5153 = 1.0 - fast::max(0.0, dot(_6589, _5081));
        float _5167 = _5153 * _5153;
        _6681 = _6679 + (((((((((_2460 + ((float3(1.0) - _2460) * ((_5167 * _5167) * _5153))) * 0.25) * ((_2540 * 0.31830990314483642578125) / fma(_5140, _5140, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5045) * buffer.u_PointLightsColor[1].xyz) * _2881) * _2901) * 1.0);
        _6680 = _6678 + (((((_2453 * buffer.u_PointLightsColor[1].xyz) * _2881) * _2901) * _5045) * 1.0);
    }
    else
    {
        _6681 = _6679;
        _6680 = _6678;
    }
    float3 _6682;
    float3 _6683;
    if (_2947 > 0.5)
    {
        float _5182 = fast::max(0.0, dot(_2142, _2961));
        float3 _5218 = fast::normalize(_2961 + _6589);
        float _5223 = fast::max(0.0, dot(_2142, _5218));
        float _5277 = fma(fma(_5223, _2540, -_5223), _5223, 1.0);
        float _5290 = 1.0 - fast::max(0.0, dot(_6589, _5218));
        float _5304 = _5290 * _5290;
        _6683 = _6681 + (((((((((_2460 + ((float3(1.0) - _2460) * ((_5304 * _5304) * _5290))) * 0.25) * ((_2540 * 0.31830990314483642578125) / fma(_5277, _5277, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5182) * buffer.u_SpotLightsColor[0].xyz) * _2973) * _3014) * 1.0);
        _6682 = _6680 + (((((_2453 * buffer.u_SpotLightsColor[0].xyz) * _2973) * _3014) * _5182) * 1.0);
    }
    else
    {
        _6683 = _6681;
        _6682 = _6680;
    }
    float3 _6684;
    float3 _6685;
    if (_3060 > 0.5)
    {
        float _5319 = fast::max(0.0, dot(_2142, _3074));
        float3 _5355 = fast::normalize(_3074 + _6589);
        float _5360 = fast::max(0.0, dot(_2142, _5355));
        float _5414 = fma(fma(_5360, _2540, -_5360), _5360, 1.0);
        float _5427 = 1.0 - fast::max(0.0, dot(_6589, _5355));
        float _5441 = _5427 * _5427;
        _6685 = _6683 + (((((((((_2460 + ((float3(1.0) - _2460) * ((_5441 * _5441) * _5427))) * 0.25) * ((_2540 * 0.31830990314483642578125) / fma(_5414, _5414, 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5319) * buffer.u_SpotLightsColor[1].xyz) * _3086) * _3127) * 1.0);
        _6684 = _6682 + (((((_2453 * buffer.u_SpotLightsColor[1].xyz) * _3086) * _3127) * _5319) * 1.0);
    }
    else
    {
        _6685 = _6683;
        _6684 = _6682;
    }
    float3 _3365 = _6684 + _6685;
    out.glResult = float4(pow(_3365.x, 0.4545449912548065185546875), pow(_3365.y, 0.4545449912548065185546875), pow(_3365.z, 0.4545449912548065185546875), buffer._AlbedoColor.w * _2095.w);
    return out;
}

