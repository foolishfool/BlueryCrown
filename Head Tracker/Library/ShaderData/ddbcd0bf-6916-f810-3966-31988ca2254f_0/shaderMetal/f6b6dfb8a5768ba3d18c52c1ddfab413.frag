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
    spvUnsafeArray<float, 3> u_DirLightsEnabled;
    spvUnsafeArray<float4, 3> u_DirLightsDirection;
    spvUnsafeArray<float4, 3> u_DirLightsColor;
    spvUnsafeArray<float, 3> u_DirLightsIntensity;
    spvUnsafeArray<float, 2> u_PointLightsEnabled;
    spvUnsafeArray<float4, 2> u_PointLightsPosition;
    spvUnsafeArray<float4, 2> u_PointLightsColor;
    spvUnsafeArray<float, 2> u_PointLightsIntensity;
    spvUnsafeArray<float, 2> u_PointLightsAttenRangeInv;
    spvUnsafeArray<float, 2> u_SpotLightsEnabled;
    spvUnsafeArray<float4, 2> u_SpotLightsPosition;
    spvUnsafeArray<float4, 2> u_SpotLightsColor;
    spvUnsafeArray<float, 2> u_SpotLightsIntensity;
    spvUnsafeArray<float, 2> u_SpotLightsAttenRangeInv;
    spvUnsafeArray<float4, 2> u_SpotLightsDirection;
    spvUnsafeArray<float, 2> u_SpotLightsOuterAngleCos;
    spvUnsafeArray<float, 2> u_SpotLightsInnerAngleCos;
    spvUnsafeArray<float, 2> u_AreaLightsEnabled;
    spvUnsafeArray<float4, 2> u_AreaLightsColor;
    spvUnsafeArray<float, 2> u_AreaLightsIntensity;
    spvUnsafeArray<float4, 2> u_AreaLightsPoint0;
    spvUnsafeArray<float4, 2> u_AreaLightsPoint1;
    spvUnsafeArray<float4, 2> u_AreaLightsPoint2;
    spvUnsafeArray<float4, 2> u_AreaLightsPoint3;
    spvUnsafeArray<float, 2> u_AreaLightsShape;
    spvUnsafeArray<float, 2> u_AreaLightsTwoSide;
    float _Env;
    float _EnvRot;
    float4 u_WorldSpaceCameraPos;
    float4 _AlbedoColor;
    float _Metallic;
    float _Roughness;
};

constant float3 _12854 = {};
constant float _12935 = {};
constant float4 _15940 = {};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float3 v_posWS [[user(locn1)]];
    float3 v_nDirWS [[user(locn2)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_ltc_mat [[texture(0)]], texture2d<float> u_ltc_mag [[texture(1)]], texture2d<float> _EnvTex [[texture(2)]], sampler u_ltc_matSmplr [[sampler(0)]], sampler u_ltc_magSmplr [[sampler(1)]], sampler _EnvTexSmplr [[sampler(2)]])
{
    main0_out out = {};
    float3 _3664 = fast::normalize(in.v_nDirWS);
    float3 _3669 = fast::normalize(buffer.u_WorldSpaceCameraPos.xyz - in.v_posWS);
    float3 _12852;
    if (dot(_3669, _3664) < (-0.0500000007450580596923828125))
    {
        _12852 = -_3664;
    }
    else
    {
        _12852 = _3664;
    }
    float3 _3762 = pow(fast::max(buffer._AlbedoColor.xyz, float3(9.9999997473787516355514526367188e-06)), float3(2.2000000476837158203125));
    float _3766 = fast::clamp(buffer._Metallic, 0.0, 1.0);
    float _3702 = fast::clamp(buffer._Roughness, 0.0, 1.0);
    float _3771 = _3702 * _3702;
    float _3776 = _3771 * _3771;
    float3 _3716 = _3762 * (1.0 - _3766);
    float _3727 = fast::max(0.0, dot(_12852, _3669));
    float3 _3745 = mix(float3(0.0400000028312206268310546875), _3762, float3(_3766));
    float3 _4063 = fast::normalize(_12852);
    float _4066 = -_4063.z;
    float _4068 = _4063.x;
    float _4107 = fast::clamp(_4066 / length(float2(_4068, _4066)), -1.0, 1.0);
    float _4116 = abs(_4107);
    float _4119 = fma(-0.15658299624919891357421875, _4116, 1.57079601287841796875);
    float _4122 = sqrt(1.0 - _4116);
    float _12855;
    if (_4107 >= 0.0)
    {
        _12855 = _4119 * _4122;
    }
    else
    {
        _12855 = fma(-_4119, _4122, 3.1415927410125732421875);
    }
    float _4075 = acos(_4063.y);
    float _4081 = fma(fma((_4068 < 0.0) ? (-1.0) : 1.0, _12855, -1.57079637050628662109375), 0.15915493667125701904296875, buffer._EnvRot);
    float _4090 = fract((_4081 + floor(_4081)) + 1.0);
    float _4143 = floor(7.0);
    float2 _12859;
    float2 _12866;
    if (abs(_4143) < 0.001000000047497451305389404296875)
    {
        _12866 = float2(fma(_4090, 0.99609375, 0.001953125) * 0.5, fma(fma(_4075, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _12859 = float2(fma(_4090, 0.998046875, 0.0009765625), fma(_4075, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _12860;
        float2 _12867;
        if (abs(_4143 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _4196 = fma(_4090, 0.99609375, 0.001953125);
            float _4206 = fma(fma(_4075, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _12867 = float2(fma(_4196, 0.5, 0.5), _4206);
            _12860 = float2(_4196 * 0.5, _4206);
        }
        else
        {
            float2 _12861;
            float2 _12868;
            if (abs(_4143 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _4234 = fma(_4090, 0.99609375, 0.001953125);
                float _4242 = fma(_4075, 0.315823078155517578125, 0.00390625);
                _12868 = float2(_4234 * 0.5, fma(_4242, 0.25, 0.75));
                _12861 = float2(fma(_4234, 0.5, 0.5), fma(_4242, 0.25, 0.5));
            }
            else
            {
                float2 _12862;
                float2 _12869;
                if (abs(_4143 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _12869 = float2(fma(fma(_4090, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_4075, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _12862 = float2(fma(_4090, 0.99609375, 0.001953125) * 0.5, fma(fma(_4075, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _12863;
                    float2 _12870;
                    if (abs(_4143 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _4310 = fma(_4090, 0.9921875, 0.00390625);
                        float _4320 = fma(fma(_4075, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _12870 = float2(fma(_4310, 0.25, 0.75), _4320);
                        _12863 = float2(fma(_4310, 0.25, 0.5), _4320);
                    }
                    else
                    {
                        float2 _12864;
                        float2 _12871;
                        if (abs(_4143 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _4348 = fma(_4090, 0.9921875, 0.00390625);
                            float _4356 = fma(_4075, 0.3133362829685211181640625, 0.0078125);
                            _12871 = float2(fma(_4348, 0.25, 0.5), fma(_4356, 0.125, 0.875));
                            _12864 = float2(fma(_4348, 0.25, 0.75), fma(_4356, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _12865;
                            float2 _12872;
                            if (abs(_4143 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _4386 = fma(_4090, 0.9921875, 0.00390625);
                                float _4396 = fma(fma(_4075, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _12872 = float2(fma(_4386, 0.25, 0.75), _4396);
                                _12865 = float2(fma(_4386, 0.25, 0.5), _4396);
                            }
                            else
                            {
                                float2 _15836 = float2(fma(fma(_4090, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_4075, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                _12872 = _15836;
                                _12865 = _15836;
                            }
                            _12871 = _12872;
                            _12864 = _12865;
                        }
                        _12870 = _12871;
                        _12863 = _12864;
                    }
                    _12869 = _12870;
                    _12862 = _12863;
                }
                _12868 = _12869;
                _12861 = _12862;
            }
            _12867 = _12868;
            _12860 = _12861;
        }
        _12866 = _12867;
        _12859 = _12860;
    }
    float4 _4456 = _EnvTex.sample(_EnvTexSmplr, _12859);
    float4 _4459 = _EnvTex.sample(_EnvTexSmplr, _12866);
    float4 _4462 = mix(_4456, _4459, float4(7.0 - _4143));
    float3 _4006 = ((_3716 * ((_4462.xyz / float3(_4462.w)) * buffer._Env)) * fast::max(float3(1.0), ((((((_3716 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * 1.0) + ((_3716 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * 1.0) + ((_3716 * 2.755199909210205078125) + float3(0.69029998779296875))) * 1.0)) * 1.0;
    float3 _4565 = fast::normalize(mix(fast::normalize(reflect(-_3669, _12852)), _12852, float3(_3702 * _3771)));
    float _4568 = -_4565.z;
    float _4570 = _4565.x;
    float _4609 = fast::clamp(_4568 / length(float2(_4570, _4568)), -1.0, 1.0);
    float _4618 = abs(_4609);
    float _4621 = fma(-0.15658299624919891357421875, _4618, 1.57079601287841796875);
    float _4624 = sqrt(1.0 - _4618);
    float _12881;
    if (_4609 >= 0.0)
    {
        _12881 = _4621 * _4624;
    }
    else
    {
        _12881 = fma(-_4621, _4624, 3.1415927410125732421875);
    }
    float _4577 = acos(_4565.y);
    float _4583 = fma(fma((_4570 < 0.0) ? (-1.0) : 1.0, _12881, -1.57079637050628662109375), 0.15915493667125701904296875, buffer._EnvRot);
    float _4592 = fract((_4583 + floor(_4583)) + 1.0);
    float _4645 = floor(_3702 * 7.0);
    float2 _12892;
    float2 _12899;
    if (abs(_4645) < 0.001000000047497451305389404296875)
    {
        _12899 = float2(fma(_4592, 0.99609375, 0.001953125) * 0.5, fma(fma(_4577, 0.315823078155517578125, 0.00390625), 0.25, 0.5));
        _12892 = float2(fma(_4592, 0.998046875, 0.0009765625), fma(_4577, 0.3170664608478546142578125, 0.001953125) * 0.5);
    }
    else
    {
        float2 _12893;
        float2 _12900;
        if (abs(_4645 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _4698 = fma(_4592, 0.99609375, 0.001953125);
            float _4708 = fma(fma(_4577, 0.315823078155517578125, 0.00390625), 0.25, 0.5);
            _12900 = float2(fma(_4698, 0.5, 0.5), _4708);
            _12893 = float2(_4698 * 0.5, _4708);
        }
        else
        {
            float2 _12894;
            float2 _12901;
            if (abs(_4645 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _4736 = fma(_4592, 0.99609375, 0.001953125);
                float _4744 = fma(_4577, 0.315823078155517578125, 0.00390625);
                _12901 = float2(_4736 * 0.5, fma(_4744, 0.25, 0.75));
                _12894 = float2(fma(_4736, 0.5, 0.5), fma(_4744, 0.25, 0.5));
            }
            else
            {
                float2 _12895;
                float2 _12902;
                if (abs(_4645 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _12902 = float2(fma(fma(_4592, 0.9921875, 0.00390625), 0.25, 0.5), fma(fma(_4577, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75));
                    _12895 = float2(fma(_4592, 0.99609375, 0.001953125) * 0.5, fma(fma(_4577, 0.315823078155517578125, 0.00390625), 0.25, 0.75));
                }
                else
                {
                    float2 _12896;
                    float2 _12903;
                    if (abs(_4645 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _4812 = fma(_4592, 0.9921875, 0.00390625);
                        float _4822 = fma(fma(_4577, 0.3133362829685211181640625, 0.0078125), 0.125, 0.75);
                        _12903 = float2(fma(_4812, 0.25, 0.75), _4822);
                        _12896 = float2(fma(_4812, 0.25, 0.5), _4822);
                    }
                    else
                    {
                        float2 _12897;
                        float2 _12904;
                        if (abs(_4645 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _4850 = fma(_4592, 0.9921875, 0.00390625);
                            float _4858 = fma(_4577, 0.3133362829685211181640625, 0.0078125);
                            _12904 = float2(fma(_4850, 0.25, 0.5), fma(_4858, 0.125, 0.875));
                            _12897 = float2(fma(_4850, 0.25, 0.75), fma(_4858, 0.125, 0.75));
                        }
                        else
                        {
                            float2 _12898;
                            float2 _12905;
                            if (abs(_4645 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _4888 = fma(_4592, 0.9921875, 0.00390625);
                                float _4898 = fma(fma(_4577, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875);
                                _12905 = float2(fma(_4888, 0.25, 0.75), _4898);
                                _12898 = float2(fma(_4888, 0.25, 0.5), _4898);
                            }
                            else
                            {
                                float2 _15861 = float2(fma(fma(_4592, 0.9921875, 0.00390625), 0.25, 0.75), fma(fma(_4577, 0.3133362829685211181640625, 0.0078125), 0.125, 0.875));
                                _12905 = _15861;
                                _12898 = _15861;
                            }
                            _12904 = _12905;
                            _12897 = _12898;
                        }
                        _12903 = _12904;
                        _12896 = _12897;
                    }
                    _12902 = _12903;
                    _12895 = _12896;
                }
                _12901 = _12902;
                _12894 = _12895;
            }
            _12900 = _12901;
            _12893 = _12894;
        }
        _12899 = _12900;
        _12892 = _12893;
    }
    float4 _4964 = mix(_EnvTex.sample(_EnvTexSmplr, _12892), _EnvTex.sample(_EnvTexSmplr, _12899), float4(fma(_3702, 7.0, -_4645)));
    float4 _4991 = (float4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _3702) + float4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float _4993 = _4991.x;
    float2 _5011 = (float2(-1.03999996185302734375, 1.03999996185302734375) * fma(fast::min(_4993 * _4993, exp2((-9.27999973297119140625) * _3727)), _4993, _4991.y)) + _4991.zw;
    float3 _4013 = ((((_3745 * _5011.x) + float3(_5011.y * fast::clamp(50.0 * _3745.y, 0.0, 1.0))) * fast::max(float3(1.0), ((((((_3745 * 2.040400028228759765625) - float3(0.3323999941349029541015625)) * 1.0) + ((_3745 * (-4.79510021209716796875)) + float3(0.6417000293731689453125))) * 1.0) + ((_3745 * 2.755199909210205078125) + float3(0.69029998779296875))) * 1.0)) * ((_4964.xyz / float3(_4964.w)) * buffer._Env)) * 1.0;
    float3 _5075 = fast::normalize(-buffer.u_DirLightsDirection[0].xyz);
    float _5089 = (buffer.u_DirLightsIntensity[0] * buffer.u_DirLightsEnabled[0]) * 3.1415920257568359375;
    float3 _5103 = fast::normalize(_5075 + _3669);
    float _5117 = fast::max(0.0, dot(_12852, _5075));
    float _5124 = fast::max(0.0, dot(_12852, _5103));
    float3 _13118;
    float3 _13119;
    if (buffer.u_DirLightsEnabled[0] > 0.5)
    {
        float _5268 = 1.0 - fast::max(0.0, fast::max(0.0, dot(_3669, _5103)));
        float _5282 = _5268 * _5268;
        float _5295 = 1.0 - _5117;
        float _5323 = fma(fma(_5124, _3776, -_5124), _5124, 1.0);
        _13119 = _4013 + ((((((_3745 + ((float3(1.0) - _3745) * ((_5282 * _5282) * _5268))) * (((_3776 * 0.31830990314483642578125) / fma(_5323, _5323, 1.0000000116860974230803549289703e-07)) * (0.5 / (fma(_3771, fma(_3727, _5295, _5117), _3727 * fma(_3771, _5295, _5117)) + 9.9999997473787516355514526367188e-06)))) * _5117) * buffer.u_DirLightsColor[0].xyz) * _5089) * 1.0);
        _13118 = _4006 + ((((_3716 * buffer.u_DirLightsColor[0].xyz) * _5089) * (_5117 * 0.31830990314483642578125)) * 1.0);
    }
    else
    {
        _13119 = _4013;
        _13118 = _4006;
    }
    float3 _5343 = fast::normalize(-buffer.u_DirLightsDirection[1].xyz);
    float _5357 = (buffer.u_DirLightsIntensity[1] * buffer.u_DirLightsEnabled[1]) * 3.1415920257568359375;
    float3 _5371 = fast::normalize(_5343 + _3669);
    float _5385 = fast::max(0.0, dot(_12852, _5343));
    float _5392 = fast::max(0.0, dot(_12852, _5371));
    float3 _13318;
    float3 _13319;
    if (buffer.u_DirLightsEnabled[1] > 0.5)
    {
        float _5528 = 1.0 - fast::max(0.0, fast::max(0.0, dot(_3669, _5371)));
        float _5542 = _5528 * _5528;
        float _5560 = fma(fma(_5392, _3776, -_5392), _5392, 1.0);
        _13319 = _13119 + ((((((_3745 + ((float3(1.0) - _3745) * ((_5542 * _5542) * _5528))) * (((_3776 * 0.31830990314483642578125) / fma(_5560, _5560, 1.0000000116860974230803549289703e-07)) * 0.25)) * _5385) * buffer.u_DirLightsColor[1].xyz) * _5357) * 1.0);
        _13318 = _13118 + ((((_3716 * buffer.u_DirLightsColor[1].xyz) * _5357) * (_5385 * 0.31830990314483642578125)) * 1.0);
    }
    else
    {
        _13319 = _13119;
        _13318 = _13118;
    }
    float3 _5580 = fast::normalize(-buffer.u_DirLightsDirection[2].xyz);
    float _5594 = (buffer.u_DirLightsIntensity[2] * buffer.u_DirLightsEnabled[2]) * 3.1415920257568359375;
    float3 _5608 = fast::normalize(_5580 + _3669);
    float _5622 = fast::max(0.0, dot(_12852, _5580));
    float _5629 = fast::max(0.0, dot(_12852, _5608));
    float3 _13529;
    float3 _13530;
    if (buffer.u_DirLightsEnabled[2] > 0.5)
    {
        float _5765 = 1.0 - fast::max(0.0, fast::max(0.0, dot(_3669, _5608)));
        float _5779 = _5765 * _5765;
        float _5797 = fma(fma(_5629, _3776, -_5629), _5629, 1.0);
        _13530 = _13319 + ((((((_3745 + ((float3(1.0) - _3745) * ((_5779 * _5779) * _5765))) * (((_3776 * 0.31830990314483642578125) / fma(_5797, _5797, 1.0000000116860974230803549289703e-07)) * 0.25)) * _5622) * buffer.u_DirLightsColor[2].xyz) * _5594) * 1.0);
        _13529 = _13318 + ((((_3716 * buffer.u_DirLightsColor[2].xyz) * _5594) * (_5622 * 0.31830990314483642578125)) * 1.0);
    }
    else
    {
        _13530 = _13319;
        _13529 = _13318;
    }
    float3 _5826 = buffer.u_PointLightsPosition[0].xyz - in.v_posWS;
    float _5828 = length(_5826);
    float3 _5832 = _5826 / float3(_5828);
    float _5846 = (buffer.u_PointLightsIntensity[0] * buffer.u_PointLightsEnabled[0]) * 3.1415920257568359375;
    float _5853 = _5828 * buffer.u_PointLightsAttenRangeInv[0];
    float _5879 = _5853 * _5853;
    float _5886 = fast::clamp(fma(-_5879, _5879, 1.0), 0.0, 1.0);
    float3 _5867 = float3(((_5886 * _5886) * fma(_5853, _5853, 1.0)) * 0.25);
    float3 _5903 = fast::normalize(_5832 + _3669);
    float _5917 = fast::max(0.0, dot(_12852, _5832));
    float _5924 = fast::max(0.0, dot(_12852, _5903));
    float3 _13751;
    float3 _13752;
    if (buffer.u_PointLightsEnabled[0] > 0.5)
    {
        float _6068 = 1.0 - fast::max(0.0, fast::max(0.0, dot(_3669, _5903)));
        float _6082 = _6068 * _6068;
        float _6095 = 1.0 - _5917;
        float _6123 = fma(fma(_5924, _3776, -_5924), _5924, 1.0);
        _13752 = _13530 + (((((((_3745 + ((float3(1.0) - _3745) * ((_6082 * _6082) * _6068))) * (((_3776 * 0.31830990314483642578125) / fma(_6123, _6123, 1.0000000116860974230803549289703e-07)) * (0.5 / (fma(_3771, fma(_3727, _6095, _5917), _3727 * fma(_3771, _6095, _5917)) + 9.9999997473787516355514526367188e-06)))) * _5917) * buffer.u_PointLightsColor[0].xyz) * _5846) * _5867) * 1.0);
        _13751 = _13529 + (((((_3716 * buffer.u_PointLightsColor[0].xyz) * _5846) * _5867) * (_5917 * 0.31830990314483642578125)) * 1.0);
    }
    else
    {
        _13752 = _13530;
        _13751 = _13529;
    }
    float3 _6152 = buffer.u_PointLightsPosition[1].xyz - in.v_posWS;
    float _6154 = length(_6152);
    float3 _6158 = _6152 / float3(_6154);
    float _6172 = (buffer.u_PointLightsIntensity[1] * buffer.u_PointLightsEnabled[1]) * 3.1415920257568359375;
    float _6179 = _6154 * buffer.u_PointLightsAttenRangeInv[1];
    float _6205 = _6179 * _6179;
    float _6212 = fast::clamp(fma(-_6205, _6205, 1.0), 0.0, 1.0);
    float3 _6193 = float3(((_6212 * _6212) * fma(_6179, _6179, 1.0)) * 0.25);
    float3 _6229 = fast::normalize(_6158 + _3669);
    float _6243 = fast::max(0.0, dot(_12852, _6158));
    float _6250 = fast::max(0.0, dot(_12852, _6229));
    float3 _13984;
    float3 _13985;
    if (buffer.u_PointLightsEnabled[1] > 0.5)
    {
        float _6386 = 1.0 - fast::max(0.0, fast::max(0.0, dot(_3669, _6229)));
        float _6400 = _6386 * _6386;
        float _6418 = fma(fma(_6250, _3776, -_6250), _6250, 1.0);
        _13985 = _13752 + (((((((_3745 + ((float3(1.0) - _3745) * ((_6400 * _6400) * _6386))) * (((_3776 * 0.31830990314483642578125) / fma(_6418, _6418, 1.0000000116860974230803549289703e-07)) * 0.25)) * _6243) * buffer.u_PointLightsColor[1].xyz) * _6172) * _6193) * 1.0);
        _13984 = _13751 + (((((_3716 * buffer.u_PointLightsColor[1].xyz) * _6172) * _6193) * (_6243 * 0.31830990314483642578125)) * 1.0);
    }
    else
    {
        _13985 = _13752;
        _13984 = _13751;
    }
    float3 _6449 = buffer.u_SpotLightsPosition[0].xyz - in.v_posWS;
    float _6451 = length(_6449);
    float3 _6455 = _6449 / float3(_6451);
    float _6469 = (buffer.u_SpotLightsIntensity[0] * buffer.u_SpotLightsEnabled[0]) * 3.1415920257568359375;
    float _6476 = _6451 * buffer.u_SpotLightsAttenRangeInv[0];
    float _6523 = _6476 * _6476;
    float _6530 = fast::clamp(fma(-_6523, _6523, 1.0), 0.0, 1.0);
    float3 _6511 = float3((((_6530 * _6530) * fma(_6476, _6476, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[0], buffer.u_SpotLightsInnerAngleCos[0], fast::max(0.0, dot(_6455, fast::normalize(-buffer.u_SpotLightsDirection[0].xyz)))));
    float3 _6547 = fast::normalize(_6455 + _3669);
    float _6561 = fast::max(0.0, dot(_12852, _6455));
    float _6568 = fast::max(0.0, dot(_12852, _6547));
    float3 _14228;
    float3 _14229;
    if (buffer.u_SpotLightsEnabled[0] > 0.5)
    {
        float _6712 = 1.0 - fast::max(0.0, fast::max(0.0, dot(_3669, _6547)));
        float _6726 = _6712 * _6712;
        float _6739 = 1.0 - _6561;
        float _6767 = fma(fma(_6568, _3776, -_6568), _6568, 1.0);
        _14229 = _13985 + (((((((_3745 + ((float3(1.0) - _3745) * ((_6726 * _6726) * _6712))) * (((_3776 * 0.31830990314483642578125) / fma(_6767, _6767, 1.0000000116860974230803549289703e-07)) * (0.5 / (fma(_3771, fma(_3727, _6739, _6561), _3727 * fma(_3771, _6739, _6561)) + 9.9999997473787516355514526367188e-06)))) * _6561) * buffer.u_SpotLightsColor[0].xyz) * _6469) * _6511) * 1.0);
        _14228 = _13984 + (((((_3716 * buffer.u_SpotLightsColor[0].xyz) * _6469) * _6511) * (_6561 * 0.31830990314483642578125)) * 1.0);
    }
    else
    {
        _14229 = _13985;
        _14228 = _13984;
    }
    float3 _6798 = buffer.u_SpotLightsPosition[1].xyz - in.v_posWS;
    float _6800 = length(_6798);
    float3 _6804 = _6798 / float3(_6800);
    float _6818 = (buffer.u_SpotLightsIntensity[1] * buffer.u_SpotLightsEnabled[1]) * 3.1415920257568359375;
    float _6825 = _6800 * buffer.u_SpotLightsAttenRangeInv[1];
    float _6872 = _6825 * _6825;
    float _6879 = fast::clamp(fma(-_6872, _6872, 1.0), 0.0, 1.0);
    float3 _6860 = float3((((_6879 * _6879) * fma(_6825, _6825, 1.0)) * 0.25) * smoothstep(buffer.u_SpotLightsOuterAngleCos[1], buffer.u_SpotLightsInnerAngleCos[1], fast::max(0.0, dot(_6804, fast::normalize(-buffer.u_SpotLightsDirection[1].xyz)))));
    float3 _6896 = fast::normalize(_6804 + _3669);
    float _6910 = fast::max(0.0, dot(_12852, _6804));
    float _6917 = fast::max(0.0, dot(_12852, _6896));
    float3 _14483;
    float3 _14484;
    if (buffer.u_SpotLightsEnabled[1] > 0.5)
    {
        float _7053 = 1.0 - fast::max(0.0, fast::max(0.0, dot(_3669, _6896)));
        float _7067 = _7053 * _7053;
        float _7085 = fma(fma(_6917, _3776, -_6917), _6917, 1.0);
        _14484 = _14229 + (((((((_3745 + ((float3(1.0) - _3745) * ((_7067 * _7067) * _7053))) * (((_3776 * 0.31830990314483642578125) / fma(_7085, _7085, 1.0000000116860974230803549289703e-07)) * 0.25)) * _6910) * buffer.u_SpotLightsColor[1].xyz) * _6818) * _6860) * 1.0);
        _14483 = _14228 + (((((_3716 * buffer.u_SpotLightsColor[1].xyz) * _6818) * _6860) * (_6910 * 0.31830990314483642578125)) * 1.0);
    }
    else
    {
        _14484 = _14229;
        _14483 = _14228;
    }
    float _7115 = (buffer.u_AreaLightsIntensity[0] * buffer.u_AreaLightsEnabled[0]) * 3.1415920257568359375;
    float3 _15245;
    float3 _15286;
    if (buffer.u_AreaLightsEnabled[0] > 0.5)
    {
        float3 _7275;
        float3 _7279;
        bool _7282;
        float3 _14838;
        do
        {
            _7275 = fast::normalize(_3669 - (_12852 * _3727));
            _7279 = cross(_12852, _7275);
            _7282 = buffer.u_AreaLightsShape[0] > 0.5;
            if (_7282)
            {
                float3x3 _7301 = transpose(float3x3(_7275, _7279, _12852));
                float3 _7308 = _7301 * (buffer.u_AreaLightsPoint0[0].xyz - in.v_posWS);
                float3 _7316 = _7301 * (buffer.u_AreaLightsPoint1[0].xyz - in.v_posWS);
                float3 _7324 = _7301 * (buffer.u_AreaLightsPoint2[0].xyz - in.v_posWS);
                float3 _7346 = float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3(0.0, 0.0, 1.0)) * ((_7308 + _7324) * 0.5);
                float3 _7349 = float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3(0.0, 0.0, 1.0)) * ((_7316 - _7324) * 0.5);
                float3 _7352 = float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3(0.0, 0.0, 1.0)) * ((_7316 - _7308) * 0.5);
                if (buffer.u_AreaLightsTwoSide[0] < 0.5)
                {
                    if (dot(cross(_7349, _7352), _7346) < 0.0)
                    {
                        _14838 = float3(0.0);
                        break;
                    }
                }
                float _7368 = dot(_7349, _7349);
                float _7371 = dot(_7352, _7352);
                float _7374 = dot(_7349, _7352);
                float _7379 = _7368 * _7371;
                float3 _14793;
                float3 _14794;
                float _14799;
                float _14801;
                if ((abs(_7374) / sqrt(_7379)) > 9.9999997473787516355514526367188e-05)
                {
                    float _7386 = _7368 + _7371;
                    float _7396 = sqrt(fma(-_7374, _7374, _7379));
                    float _7401 = sqrt(fma(-2.0, _7396, _7386));
                    float _7407 = sqrt(fma(2.0, _7396, _7386));
                    float _7411 = fma(0.5, _7401, 0.5 * _7407);
                    float _7415 = fma(0.5, _7401, _7407 * (-0.5));
                    float3 _14791;
                    float3 _14792;
                    if (_7368 > _7371)
                    {
                        float3 _7423 = _7349 * _7374;
                        float _15901 = -_7368;
                        _14792 = _7423 + (_7352 * fma(_7415, _7415, _15901));
                        _14791 = _7423 + (_7352 * fma(_7411, _7411, _15901));
                    }
                    else
                    {
                        float3 _7442 = _7352 * _7374;
                        float _15899 = -_7371;
                        _14792 = _7442 + (_7349 * fma(_7415, _7415, _15899));
                        _14791 = _7442 + (_7349 * fma(_7411, _7411, _15899));
                    }
                    _14801 = 1.0 / (_7415 * _7415);
                    _14799 = 1.0 / (_7411 * _7411);
                    _14794 = fast::normalize(_14792);
                    _14793 = fast::normalize(_14791);
                }
                else
                {
                    float _7471 = 1.0 / _7368;
                    float _7475 = 1.0 / _7371;
                    _14801 = _7475;
                    _14799 = _7471;
                    _14794 = _7352 * sqrt(_7475);
                    _14793 = _7349 * sqrt(_7471);
                }
                float3 _7487 = cross(_14793, _14794);
                float3 _14795;
                if (dot(_7346, _7487) < 0.0)
                {
                    _14795 = _7487 * (-1.0);
                }
                else
                {
                    _14795 = _7487;
                }
                float _7498 = dot(_14795, _7346);
                float _7503 = dot(_14793, _7346) / _7498;
                float _7508 = dot(_14794, _7346) / _7498;
                float _7515 = _7498 * _7498;
                float _7517 = _14799 * _7515;
                float _7522 = _14801 * _7515;
                float _7525 = _7517 * _7522;
                float _7532 = fma(_7503, _7503, 1.0);
                float _15903 = -_7517;
                float4 _12628 = _15940;
                _12628.x = _7525;
                float4 _12630 = _12628;
                _12630.y = fma(-_14801, _7515, fma(_7525, fma(_7508, _7508, _7532), _15903));
                float4 _12632 = _12630;
                _12632.z = fma(-_7522, fma(_7508, _7508, 1.0), fma(_15903, _7532, 1.0));
                float2 _7839 = _12632.yz * float2(0.3333333432674407958984375);
                float _7841 = _7839.x;
                float4 _12634 = _12632;
                _12634.y = _7841;
                float _7843 = _7839.y;
                float _7854 = -_7843;
                float _7860 = fma(_7854, _7843, _7841);
                float _7863 = -_7841;
                float _7869 = fma(_7863, _7843, _7525);
                float _7878 = dot(float2(_7843, _7863), _12634.xy);
                float _7901 = sqrt(dot(float2(4.0 * _7860, -_7869), float3(_7860, _7869, _7878).zy));
                float _7904 = precise::atan2(_7901, -fma((-2.0) * _7843, _7860, _7869));
                float _7909 = 2.0 * sqrt(-_7860);
                float _7911 = cos(_7904 * 0.3333333432674407958984375);
                float _7920 = _7909 * cos(fma(_7904, 0.3333333432674407958984375, 2.094395160675048828125));
                float _7934 = ((fma(_7909, _7911, _7920) > (2.0 * _7843)) ? (_7909 * _7911) : _7920) - _7843;
                float _7941 = -_7525;
                float _7946 = 2.0 * _7841;
                float _7957 = precise::atan2(_7525 * _7901, -fma(_7941, _7869, _7946 * _7878));
                float _7962 = 2.0 * sqrt(-_7878);
                float _7964 = cos(_7957 * 0.3333333432674407958984375);
                float _7973 = _7962 * cos(fma(_7957, 0.3333333432674407958984375, 2.094395160675048828125));
                float _7989 = ((fma(_7962, _7964, _7973) < _7946) ? (_7962 * _7964) : _7973) + _7841;
                float _8007 = fma(-_7934, _7989, _7525);
                float _8033 = _7941 / _7989;
                float _8038 = fma(_7841, _8007, -(_7843 * (_7934 * _7941))) / fma(_7854, _8007, _7841 * _7989);
                float3 _8044 = float3(_8033, _8038, _7934);
                bool _8049 = _8033 < _8038;
                bool _8057;
                if (_8049)
                {
                    _8057 = _8033 < _7934;
                }
                else
                {
                    _8057 = _8049;
                }
                float3 _14806;
                if (_8057)
                {
                    _14806 = _8044.yxz;
                }
                else
                {
                    bool _8066 = _7934 < _8033;
                    bool _8074;
                    if (_8066)
                    {
                        _8074 = _7934 < _8038;
                    }
                    else
                    {
                        _8074 = _8066;
                    }
                    float3 _14807;
                    if (_8074)
                    {
                        _14807 = _8044.xzy;
                    }
                    else
                    {
                        _14807 = _8044;
                    }
                    _14806 = _14807;
                }
                float _15911 = -_14806.y;
                float _7608 = sqrt(_15911 / _14806.z);
                float _7613 = sqrt(_15911 / _14806.x);
                float _7627 = (_7608 * _7613) * rsqrt(fma(_7608, _7608, 1.0) * fma(_7613, _7613, 1.0));
                _14838 = float3(_7627 * u_ltc_mag.sample(u_ltc_magSmplr, ((float2(fma(fast::normalize(float3x3(_14793, _14794, _14795) * float3((_7517 * _7503) / fma(_14799, _7515, _15911), (_7522 * _7508) / fma(_14801, _7515, _15911), 1.0)).z, 0.5, 0.5), _7627) * 0.984375) + float2(0.0078125))).w);
                break;
            }
            else
            {
                float3x3 _7667 = float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3(0.0, 0.0, 1.0)) * transpose(float3x3(_7275, _7279, _12852));
                float3 _7674 = _7667 * (buffer.u_AreaLightsPoint0[0].xyz - in.v_posWS);
                float3 _7682 = _7667 * (buffer.u_AreaLightsPoint1[0].xyz - in.v_posWS);
                float3 _7690 = _7667 * (buffer.u_AreaLightsPoint2[0].xyz - in.v_posWS);
                float3 _7698 = _7667 * (buffer.u_AreaLightsPoint3[0].xyz - in.v_posWS);
                float _8084 = _7674.z;
                int _15941 = int(_8084 > 0.0);
                float _8091 = _7682.z;
                int _14633;
                if (_8091 > 0.0)
                {
                    _14633 = _15941 + 2;
                }
                else
                {
                    _14633 = _15941;
                }
                float _8098 = _7690.z;
                int _14637;
                if (_8098 > 0.0)
                {
                    _14637 = _14633 + 4;
                }
                else
                {
                    _14637 = _14633;
                }
                float _8105 = _7698.z;
                int _14638;
                if (_8105 > 0.0)
                {
                    _14638 = _14637 + 8;
                }
                else
                {
                    _14638 = _14637;
                }
                int _14649;
                float3 _14665;
                float3 _14685;
                float3 _14707;
                float3 _14725;
                float3 _14743;
                if (_14638 == 0)
                {
                    _14743 = _7682;
                    _14725 = _7690;
                    _14707 = _7698;
                    _14685 = _12854;
                    _14665 = _7674;
                    _14649 = 0;
                }
                else
                {
                    int _14650;
                    float3 _14666;
                    float3 _14690;
                    float3 _14708;
                    float3 _14726;
                    float3 _14744;
                    if (_14638 == 1)
                    {
                        _14744 = (_7674 * (-_8091)) + (_7682 * _8084);
                        _14726 = (_7674 * (-_8105)) + (_7698 * _8084);
                        _14708 = _7698;
                        _14690 = _12854;
                        _14666 = _7674;
                        _14650 = 3;
                    }
                    else
                    {
                        int _14651;
                        float3 _14667;
                        float3 _14691;
                        float3 _14709;
                        float3 _14727;
                        float3 _14745;
                        if (_14638 == 2)
                        {
                            _14745 = _7682;
                            _14727 = (_7682 * (-_8098)) + (_7690 * _8091);
                            _14709 = _7698;
                            _14691 = _12854;
                            _14667 = (_7682 * (-_8084)) + (_7674 * _8091);
                            _14651 = 3;
                        }
                        else
                        {
                            int _14652;
                            float3 _14668;
                            float3 _14692;
                            float3 _14710;
                            float3 _14728;
                            float3 _14746;
                            if (_14638 == 3)
                            {
                                _14746 = _7682;
                                _14728 = (_7682 * (-_8098)) + (_7690 * _8091);
                                _14710 = (_7674 * (-_8105)) + (_7698 * _8084);
                                _14692 = _12854;
                                _14668 = _7674;
                                _14652 = 4;
                            }
                            else
                            {
                                int _14653;
                                float3 _14669;
                                float3 _14693;
                                float3 _14711;
                                float3 _14729;
                                float3 _14747;
                                if (_14638 == 4)
                                {
                                    _14747 = (_7690 * (-_8091)) + (_7682 * _8098);
                                    _14729 = _7690;
                                    _14711 = _7698;
                                    _14693 = _12854;
                                    _14669 = (_7690 * (-_8105)) + (_7698 * _8098);
                                    _14653 = 3;
                                }
                                else
                                {
                                    int _14654;
                                    float3 _14670;
                                    float3 _14694;
                                    float3 _14712;
                                    float3 _14730;
                                    float3 _14748;
                                    if (_14638 == 5)
                                    {
                                        _14748 = _7682;
                                        _14730 = _7690;
                                        _14712 = _7698;
                                        _14694 = _12854;
                                        _14670 = _7674;
                                        _14654 = 0;
                                    }
                                    else
                                    {
                                        int _14655;
                                        float3 _14671;
                                        float3 _14695;
                                        float3 _14713;
                                        float3 _14731;
                                        float3 _14749;
                                        if (_14638 == 6)
                                        {
                                            _14749 = _7682;
                                            _14731 = _7690;
                                            _14713 = (_7690 * (-_8105)) + (_7698 * _8098);
                                            _14695 = _12854;
                                            _14671 = (_7682 * (-_8084)) + (_7674 * _8091);
                                            _14655 = 4;
                                        }
                                        else
                                        {
                                            int _14656;
                                            float3 _14672;
                                            float3 _14696;
                                            float3 _14714;
                                            float3 _14732;
                                            float3 _14750;
                                            if (_14638 == 7)
                                            {
                                                float _8274 = -_8105;
                                                _14750 = _7682;
                                                _14732 = _7690;
                                                _14714 = (_7690 * _8274) + (_7698 * _8098);
                                                _14696 = (_7674 * _8274) + (_7698 * _8084);
                                                _14672 = _7674;
                                                _14656 = 5;
                                            }
                                            else
                                            {
                                                int _14657;
                                                float3 _14673;
                                                float3 _14697;
                                                float3 _14715;
                                                float3 _14733;
                                                float3 _14751;
                                                if (_14638 == 8)
                                                {
                                                    _14751 = (_7698 * (-_8098)) + (_7690 * _8105);
                                                    _14733 = _7698;
                                                    _14715 = _7698;
                                                    _14697 = _12854;
                                                    _14673 = (_7698 * (-_8084)) + (_7674 * _8105);
                                                    _14657 = 3;
                                                }
                                                else
                                                {
                                                    int _14658;
                                                    float3 _14674;
                                                    float3 _14698;
                                                    float3 _14716;
                                                    float3 _14734;
                                                    float3 _14752;
                                                    if (_14638 == 9)
                                                    {
                                                        _14752 = (_7674 * (-_8091)) + (_7682 * _8084);
                                                        _14734 = (_7698 * (-_8098)) + (_7690 * _8105);
                                                        _14716 = _7698;
                                                        _14698 = _12854;
                                                        _14674 = _7674;
                                                        _14658 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _14659;
                                                        float3 _14675;
                                                        float3 _14699;
                                                        float3 _14717;
                                                        float3 _14735;
                                                        float3 _14753;
                                                        if (_14638 == 10)
                                                        {
                                                            _14753 = _7682;
                                                            _14735 = _7690;
                                                            _14717 = _7698;
                                                            _14699 = _12854;
                                                            _14675 = _7674;
                                                            _14659 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _14660;
                                                            float3 _14676;
                                                            float3 _14700;
                                                            float3 _14718;
                                                            float3 _14736;
                                                            float3 _14754;
                                                            if (_14638 == 11)
                                                            {
                                                                float _8374 = -_8098;
                                                                _14754 = _7682;
                                                                _14736 = (_7682 * _8374) + (_7690 * _8091);
                                                                _14718 = (_7698 * _8374) + (_7690 * _8105);
                                                                _14700 = _7698;
                                                                _14676 = _7674;
                                                                _14660 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _14661;
                                                                float3 _14677;
                                                                float3 _14701;
                                                                float3 _14719;
                                                                float3 _14737;
                                                                float3 _14755;
                                                                if (_14638 == 12)
                                                                {
                                                                    _14755 = (_7690 * (-_8091)) + (_7682 * _8098);
                                                                    _14737 = _7690;
                                                                    _14719 = _7698;
                                                                    _14701 = _12854;
                                                                    _14677 = (_7698 * (-_8084)) + (_7674 * _8105);
                                                                    _14661 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _8430 = _14638 == 13;
                                                                    int _14662;
                                                                    float3 _14678;
                                                                    float3 _14702;
                                                                    float3 _14738;
                                                                    float3 _14756;
                                                                    if (_8430)
                                                                    {
                                                                        float _8440 = -_8091;
                                                                        _14756 = (_7674 * _8440) + (_7682 * _8084);
                                                                        _14738 = (_7690 * _8440) + (_7682 * _8098);
                                                                        _14702 = _7698;
                                                                        _14678 = _7674;
                                                                        _14662 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _14663;
                                                                        float3 _14679;
                                                                        float3 _14703;
                                                                        if (_14638 == 14)
                                                                        {
                                                                            float _8470 = -_8084;
                                                                            _14703 = (_7698 * _8470) + (_7674 * _8105);
                                                                            _14679 = (_7682 * _8470) + (_7674 * _8091);
                                                                            _14663 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _14703 = _12854;
                                                                            _14679 = _7674;
                                                                            _14663 = (_14638 == 15) ? 4 : 0;
                                                                        }
                                                                        _14756 = _7682;
                                                                        _14738 = _7690;
                                                                        _14702 = _14703;
                                                                        _14678 = _14679;
                                                                        _14662 = _14663;
                                                                    }
                                                                    _14755 = _14756;
                                                                    _14737 = _14738;
                                                                    _14719 = select(_7698, _7690, bool3(_8430));
                                                                    _14701 = _14702;
                                                                    _14677 = _14678;
                                                                    _14661 = _14662;
                                                                }
                                                                _14754 = _14755;
                                                                _14736 = _14737;
                                                                _14718 = _14719;
                                                                _14700 = _14701;
                                                                _14676 = _14677;
                                                                _14660 = _14661;
                                                            }
                                                            _14753 = _14754;
                                                            _14735 = _14736;
                                                            _14717 = _14718;
                                                            _14699 = _14700;
                                                            _14675 = _14676;
                                                            _14659 = _14660;
                                                        }
                                                        _14752 = _14753;
                                                        _14734 = _14735;
                                                        _14716 = _14717;
                                                        _14698 = _14699;
                                                        _14674 = _14675;
                                                        _14658 = _14659;
                                                    }
                                                    _14751 = _14752;
                                                    _14733 = _14734;
                                                    _14715 = _14716;
                                                    _14697 = _14698;
                                                    _14673 = _14674;
                                                    _14657 = _14658;
                                                }
                                                _14750 = _14751;
                                                _14732 = _14733;
                                                _14714 = _14715;
                                                _14696 = _14697;
                                                _14672 = _14673;
                                                _14656 = _14657;
                                            }
                                            _14749 = _14750;
                                            _14731 = _14732;
                                            _14713 = _14714;
                                            _14695 = _14696;
                                            _14671 = _14672;
                                            _14655 = _14656;
                                        }
                                        _14748 = _14749;
                                        _14730 = _14731;
                                        _14712 = _14713;
                                        _14694 = _14695;
                                        _14670 = _14671;
                                        _14654 = _14655;
                                    }
                                    _14747 = _14748;
                                    _14729 = _14730;
                                    _14711 = _14712;
                                    _14693 = _14694;
                                    _14669 = _14670;
                                    _14653 = _14654;
                                }
                                _14746 = _14747;
                                _14728 = _14729;
                                _14710 = _14711;
                                _14692 = _14693;
                                _14668 = _14669;
                                _14652 = _14653;
                            }
                            _14745 = _14746;
                            _14727 = _14728;
                            _14709 = _14710;
                            _14691 = _14692;
                            _14667 = _14668;
                            _14651 = _14652;
                        }
                        _14744 = _14745;
                        _14726 = _14727;
                        _14708 = _14709;
                        _14690 = _14691;
                        _14666 = _14667;
                        _14650 = _14651;
                    }
                    _14743 = _14744;
                    _14725 = _14726;
                    _14707 = _14708;
                    _14685 = _14690;
                    _14665 = _14666;
                    _14649 = _14650;
                }
                if (_14649 == 0)
                {
                    _14838 = float3(0.0);
                    break;
                }
                float3 _7710 = fast::normalize(_14665);
                float3 _7714 = fast::normalize(_14743);
                float3 _7718 = fast::normalize(_14725);
                float3 _7722 = fast::normalize(select(_14707, _14665, bool3(_14649 == 3)));
                float3 _7726 = fast::normalize(select(_14685, _14665, bool3(_14649 == 4)));
                float _8547 = dot(_7710, _7714);
                float _8549 = abs(_8547);
                float _8563 = fma(fma(0.01452060043811798095703125, _8549, 0.4965155124664306640625), _8549, 0.8543984889984130859375) / fma(4.1616725921630859375 + _8549, _8549, 3.41759395599365234375);
                float _14761;
                if (_8547 > 0.0)
                {
                    _14761 = _8563;
                }
                else
                {
                    _14761 = fma(0.5, rsqrt(fast::max(fma(-_8547, _8547, 1.0), 1.0000000116860974230803549289703e-07)), -_8563);
                }
                float _8604 = dot(_7714, _7718);
                float _8606 = abs(_8604);
                float _8620 = fma(fma(0.01452060043811798095703125, _8606, 0.4965155124664306640625), _8606, 0.8543984889984130859375) / fma(4.1616725921630859375 + _8606, _8606, 3.41759395599365234375);
                float _14765;
                if (_8604 > 0.0)
                {
                    _14765 = _8620;
                }
                else
                {
                    _14765 = fma(0.5, rsqrt(fast::max(fma(-_8604, _8604, 1.0), 1.0000000116860974230803549289703e-07)), -_8620);
                }
                float _8661 = dot(_7718, _7722);
                float _8663 = abs(_8661);
                float _8677 = fma(fma(0.01452060043811798095703125, _8663, 0.4965155124664306640625), _8663, 0.8543984889984130859375) / fma(4.1616725921630859375 + _8663, _8663, 3.41759395599365234375);
                float _14770;
                if (_8661 > 0.0)
                {
                    _14770 = _8677;
                }
                else
                {
                    _14770 = fma(0.5, rsqrt(fast::max(fma(-_8661, _8661, 1.0), 1.0000000116860974230803549289703e-07)), -_8677);
                }
                float _7748 = ((cross(_7710, _7714) * _14761).z + (cross(_7714, _7718) * _14765).z) + (cross(_7718, _7722) * _14770).z;
                float _14787;
                if (_14649 >= 4)
                {
                    float _8718 = dot(_7722, _7726);
                    float _8720 = abs(_8718);
                    float _8734 = fma(fma(0.01452060043811798095703125, _8720, 0.4965155124664306640625), _8720, 0.8543984889984130859375) / fma(4.1616725921630859375 + _8720, _8720, 3.41759395599365234375);
                    float _14776;
                    if (_8718 > 0.0)
                    {
                        _14776 = _8734;
                    }
                    else
                    {
                        _14776 = fma(0.5, rsqrt(fast::max(fma(-_8718, _8718, 1.0), 1.0000000116860974230803549289703e-07)), -_8734);
                    }
                    _14787 = _7748 + (cross(_7722, _7726) * _14776).z;
                }
                else
                {
                    _14787 = _7748;
                }
                float _14788;
                if (_14649 == 5)
                {
                    float _8775 = dot(_7726, _7710);
                    float _8777 = abs(_8775);
                    float _8791 = fma(fma(0.01452060043811798095703125, _8777, 0.4965155124664306640625), _8777, 0.8543984889984130859375) / fma(4.1616725921630859375 + _8777, _8777, 3.41759395599365234375);
                    float _14785;
                    if (_8775 > 0.0)
                    {
                        _14785 = _8791;
                    }
                    else
                    {
                        _14785 = fma(0.5, rsqrt(fast::max(fma(-_8775, _8775, 1.0), 1.0000000116860974230803549289703e-07)), -_8791);
                    }
                    _14788 = _14787 + (cross(_7726, _7710) * _14785).z;
                }
                else
                {
                    _14788 = _14787;
                }
                if (buffer.u_AreaLightsTwoSide[0] > 0.5)
                {
                    _14838 = float3(abs(_14788));
                    break;
                }
                _14838 = float3(fast::max(0.0, _14788));
                break;
            }
        } while(false);
        float2 _8835 = fast::clamp((float2(_3702, sqrt(1.0 - _3727)) * 0.984375) + float2(0.0078125), float2(0.0), float2(1.0));
        float4 _8895 = u_ltc_mat.sample(u_ltc_matSmplr, _8835);
        float4 _8899 = (_8895 - float4(0.5)) * 4.0;
        float3x3 _8922 = float3x3(float3(_8899.x, 0.0, _8899.y), float3(0.0, 1.0, 0.0), float3(_8899.z, 0.0, _8899.w));
        float4 _8928 = u_ltc_mag.sample(u_ltc_magSmplr, _8835);
        float3 _15152;
        do
        {
            if (_7282)
            {
                float3x3 _9030 = transpose(float3x3(_7275, _7279, _12852));
                float3 _9037 = _9030 * (buffer.u_AreaLightsPoint0[0].xyz - in.v_posWS);
                float3 _9045 = _9030 * (buffer.u_AreaLightsPoint1[0].xyz - in.v_posWS);
                float3 _9053 = _9030 * (buffer.u_AreaLightsPoint2[0].xyz - in.v_posWS);
                float3 _9075 = _8922 * ((_9037 + _9053) * 0.5);
                float3 _9078 = _8922 * ((_9045 - _9053) * 0.5);
                float3 _9081 = _8922 * ((_9045 - _9037) * 0.5);
                if (buffer.u_AreaLightsTwoSide[0] < 0.5)
                {
                    if (dot(cross(_9078, _9081), _9075) < 0.0)
                    {
                        _15152 = float3(0.0);
                        break;
                    }
                }
                float _9097 = dot(_9078, _9078);
                float _9100 = dot(_9081, _9081);
                float _9103 = dot(_9078, _9081);
                float _9108 = _9097 * _9100;
                float3 _15107;
                float3 _15108;
                float _15113;
                float _15115;
                if ((abs(_9103) / sqrt(_9108)) > 9.9999997473787516355514526367188e-05)
                {
                    float _9115 = _9097 + _9100;
                    float _9125 = sqrt(fma(-_9103, _9103, _9108));
                    float _9130 = sqrt(fma(-2.0, _9125, _9115));
                    float _9136 = sqrt(fma(2.0, _9125, _9115));
                    float _9140 = fma(0.5, _9130, 0.5 * _9136);
                    float _9144 = fma(0.5, _9130, _9136 * (-0.5));
                    float3 _15105;
                    float3 _15106;
                    if (_9097 > _9100)
                    {
                        float3 _9152 = _9078 * _9103;
                        float _15927 = -_9097;
                        _15106 = _9152 + (_9081 * fma(_9144, _9144, _15927));
                        _15105 = _9152 + (_9081 * fma(_9140, _9140, _15927));
                    }
                    else
                    {
                        float3 _9171 = _9081 * _9103;
                        float _15925 = -_9100;
                        _15106 = _9171 + (_9078 * fma(_9144, _9144, _15925));
                        _15105 = _9171 + (_9078 * fma(_9140, _9140, _15925));
                    }
                    _15115 = 1.0 / (_9144 * _9144);
                    _15113 = 1.0 / (_9140 * _9140);
                    _15108 = fast::normalize(_15106);
                    _15107 = fast::normalize(_15105);
                }
                else
                {
                    float _9200 = 1.0 / _9097;
                    float _9204 = 1.0 / _9100;
                    _15115 = _9204;
                    _15113 = _9200;
                    _15108 = _9081 * sqrt(_9204);
                    _15107 = _9078 * sqrt(_9200);
                }
                float3 _9216 = cross(_15107, _15108);
                float3 _15109;
                if (dot(_9075, _9216) < 0.0)
                {
                    _15109 = _9216 * (-1.0);
                }
                else
                {
                    _15109 = _9216;
                }
                float _9227 = dot(_15109, _9075);
                float _9232 = dot(_15107, _9075) / _9227;
                float _9237 = dot(_15108, _9075) / _9227;
                float _9244 = _9227 * _9227;
                float _9246 = _15113 * _9244;
                float _9251 = _15115 * _9244;
                float _9254 = _9246 * _9251;
                float _9261 = fma(_9232, _9232, 1.0);
                float _15929 = -_9246;
                float4 _12744 = _15940;
                _12744.x = _9254;
                float4 _12746 = _12744;
                _12746.y = fma(-_15115, _9244, fma(_9254, fma(_9237, _9237, _9261), _15929));
                float4 _12748 = _12746;
                _12748.z = fma(-_9251, fma(_9237, _9237, 1.0), fma(_15929, _9261, 1.0));
                float2 _9568 = _12748.yz * float2(0.3333333432674407958984375);
                float _9570 = _9568.x;
                float4 _12750 = _12748;
                _12750.y = _9570;
                float _9572 = _9568.y;
                float _9583 = -_9572;
                float _9589 = fma(_9583, _9572, _9570);
                float _9592 = -_9570;
                float _9598 = fma(_9592, _9572, _9254);
                float _9607 = dot(float2(_9572, _9592), _12750.xy);
                float _9630 = sqrt(dot(float2(4.0 * _9589, -_9598), float3(_9589, _9598, _9607).zy));
                float _9633 = precise::atan2(_9630, -fma((-2.0) * _9572, _9589, _9598));
                float _9638 = 2.0 * sqrt(-_9589);
                float _9640 = cos(_9633 * 0.3333333432674407958984375);
                float _9649 = _9638 * cos(fma(_9633, 0.3333333432674407958984375, 2.094395160675048828125));
                float _9663 = ((fma(_9638, _9640, _9649) > (2.0 * _9572)) ? (_9638 * _9640) : _9649) - _9572;
                float _9670 = -_9254;
                float _9675 = 2.0 * _9570;
                float _9686 = precise::atan2(_9254 * _9630, -fma(_9670, _9598, _9675 * _9607));
                float _9691 = 2.0 * sqrt(-_9607);
                float _9693 = cos(_9686 * 0.3333333432674407958984375);
                float _9702 = _9691 * cos(fma(_9686, 0.3333333432674407958984375, 2.094395160675048828125));
                float _9718 = ((fma(_9691, _9693, _9702) < _9675) ? (_9691 * _9693) : _9702) + _9570;
                float _9736 = fma(-_9663, _9718, _9254);
                float _9762 = _9670 / _9718;
                float _9767 = fma(_9570, _9736, -(_9572 * (_9663 * _9670))) / fma(_9583, _9736, _9570 * _9718);
                float3 _9773 = float3(_9762, _9767, _9663);
                bool _9778 = _9762 < _9767;
                bool _9786;
                if (_9778)
                {
                    _9786 = _9762 < _9663;
                }
                else
                {
                    _9786 = _9778;
                }
                float3 _15120;
                if (_9786)
                {
                    _15120 = _9773.yxz;
                }
                else
                {
                    bool _9795 = _9663 < _9762;
                    bool _9803;
                    if (_9795)
                    {
                        _9803 = _9663 < _9767;
                    }
                    else
                    {
                        _9803 = _9795;
                    }
                    float3 _15121;
                    if (_9803)
                    {
                        _15121 = _9773.xzy;
                    }
                    else
                    {
                        _15121 = _9773;
                    }
                    _15120 = _15121;
                }
                float _15935 = -_15120.y;
                float _9337 = sqrt(_15935 / _15120.z);
                float _9342 = sqrt(_15935 / _15120.x);
                float _9356 = (_9337 * _9342) * rsqrt(fma(_9337, _9337, 1.0) * fma(_9342, _9342, 1.0));
                _15152 = float3(_9356 * u_ltc_mag.sample(u_ltc_magSmplr, ((float2(fma(fast::normalize(float3x3(_15107, _15108, _15109) * float3((_9246 * _9232) / fma(_15113, _9244, _15935), (_9251 * _9237) / fma(_15115, _9244, _15935), 1.0)).z, 0.5, 0.5), _9356) * 0.984375) + float2(0.0078125))).w);
                break;
            }
            else
            {
                float3x3 _9396 = _8922 * transpose(float3x3(_7275, _7279, _12852));
                float3 _9403 = _9396 * (buffer.u_AreaLightsPoint0[0].xyz - in.v_posWS);
                float3 _9411 = _9396 * (buffer.u_AreaLightsPoint1[0].xyz - in.v_posWS);
                float3 _9419 = _9396 * (buffer.u_AreaLightsPoint2[0].xyz - in.v_posWS);
                float3 _9427 = _9396 * (buffer.u_AreaLightsPoint3[0].xyz - in.v_posWS);
                float _9813 = _9403.z;
                int _15952 = int(_9813 > 0.0);
                float _9820 = _9411.z;
                int _14947;
                if (_9820 > 0.0)
                {
                    _14947 = _15952 + 2;
                }
                else
                {
                    _14947 = _15952;
                }
                float _9827 = _9419.z;
                int _14951;
                if (_9827 > 0.0)
                {
                    _14951 = _14947 + 4;
                }
                else
                {
                    _14951 = _14947;
                }
                float _9834 = _9427.z;
                int _14952;
                if (_9834 > 0.0)
                {
                    _14952 = _14951 + 8;
                }
                else
                {
                    _14952 = _14951;
                }
                int _14963;
                float3 _14979;
                float3 _14999;
                float3 _15021;
                float3 _15039;
                float3 _15057;
                if (_14952 == 0)
                {
                    _15057 = _9411;
                    _15039 = _9419;
                    _15021 = _9427;
                    _14999 = _12854;
                    _14979 = _9403;
                    _14963 = 0;
                }
                else
                {
                    int _14964;
                    float3 _14980;
                    float3 _15004;
                    float3 _15022;
                    float3 _15040;
                    float3 _15058;
                    if (_14952 == 1)
                    {
                        _15058 = (_9403 * (-_9820)) + (_9411 * _9813);
                        _15040 = (_9403 * (-_9834)) + (_9427 * _9813);
                        _15022 = _9427;
                        _15004 = _12854;
                        _14980 = _9403;
                        _14964 = 3;
                    }
                    else
                    {
                        int _14965;
                        float3 _14981;
                        float3 _15005;
                        float3 _15023;
                        float3 _15041;
                        float3 _15059;
                        if (_14952 == 2)
                        {
                            _15059 = _9411;
                            _15041 = (_9411 * (-_9827)) + (_9419 * _9820);
                            _15023 = _9427;
                            _15005 = _12854;
                            _14981 = (_9411 * (-_9813)) + (_9403 * _9820);
                            _14965 = 3;
                        }
                        else
                        {
                            int _14966;
                            float3 _14982;
                            float3 _15006;
                            float3 _15024;
                            float3 _15042;
                            float3 _15060;
                            if (_14952 == 3)
                            {
                                _15060 = _9411;
                                _15042 = (_9411 * (-_9827)) + (_9419 * _9820);
                                _15024 = (_9403 * (-_9834)) + (_9427 * _9813);
                                _15006 = _12854;
                                _14982 = _9403;
                                _14966 = 4;
                            }
                            else
                            {
                                int _14967;
                                float3 _14983;
                                float3 _15007;
                                float3 _15025;
                                float3 _15043;
                                float3 _15061;
                                if (_14952 == 4)
                                {
                                    _15061 = (_9419 * (-_9820)) + (_9411 * _9827);
                                    _15043 = _9419;
                                    _15025 = _9427;
                                    _15007 = _12854;
                                    _14983 = (_9419 * (-_9834)) + (_9427 * _9827);
                                    _14967 = 3;
                                }
                                else
                                {
                                    int _14968;
                                    float3 _14984;
                                    float3 _15008;
                                    float3 _15026;
                                    float3 _15044;
                                    float3 _15062;
                                    if (_14952 == 5)
                                    {
                                        _15062 = _9411;
                                        _15044 = _9419;
                                        _15026 = _9427;
                                        _15008 = _12854;
                                        _14984 = _9403;
                                        _14968 = 0;
                                    }
                                    else
                                    {
                                        int _14969;
                                        float3 _14985;
                                        float3 _15009;
                                        float3 _15027;
                                        float3 _15045;
                                        float3 _15063;
                                        if (_14952 == 6)
                                        {
                                            _15063 = _9411;
                                            _15045 = _9419;
                                            _15027 = (_9419 * (-_9834)) + (_9427 * _9827);
                                            _15009 = _12854;
                                            _14985 = (_9411 * (-_9813)) + (_9403 * _9820);
                                            _14969 = 4;
                                        }
                                        else
                                        {
                                            int _14970;
                                            float3 _14986;
                                            float3 _15010;
                                            float3 _15028;
                                            float3 _15046;
                                            float3 _15064;
                                            if (_14952 == 7)
                                            {
                                                float _10003 = -_9834;
                                                _15064 = _9411;
                                                _15046 = _9419;
                                                _15028 = (_9419 * _10003) + (_9427 * _9827);
                                                _15010 = (_9403 * _10003) + (_9427 * _9813);
                                                _14986 = _9403;
                                                _14970 = 5;
                                            }
                                            else
                                            {
                                                int _14971;
                                                float3 _14987;
                                                float3 _15011;
                                                float3 _15029;
                                                float3 _15047;
                                                float3 _15065;
                                                if (_14952 == 8)
                                                {
                                                    _15065 = (_9427 * (-_9827)) + (_9419 * _9834);
                                                    _15047 = _9427;
                                                    _15029 = _9427;
                                                    _15011 = _12854;
                                                    _14987 = (_9427 * (-_9813)) + (_9403 * _9834);
                                                    _14971 = 3;
                                                }
                                                else
                                                {
                                                    int _14972;
                                                    float3 _14988;
                                                    float3 _15012;
                                                    float3 _15030;
                                                    float3 _15048;
                                                    float3 _15066;
                                                    if (_14952 == 9)
                                                    {
                                                        _15066 = (_9403 * (-_9820)) + (_9411 * _9813);
                                                        _15048 = (_9427 * (-_9827)) + (_9419 * _9834);
                                                        _15030 = _9427;
                                                        _15012 = _12854;
                                                        _14988 = _9403;
                                                        _14972 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _14973;
                                                        float3 _14989;
                                                        float3 _15013;
                                                        float3 _15031;
                                                        float3 _15049;
                                                        float3 _15067;
                                                        if (_14952 == 10)
                                                        {
                                                            _15067 = _9411;
                                                            _15049 = _9419;
                                                            _15031 = _9427;
                                                            _15013 = _12854;
                                                            _14989 = _9403;
                                                            _14973 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _14974;
                                                            float3 _14990;
                                                            float3 _15014;
                                                            float3 _15032;
                                                            float3 _15050;
                                                            float3 _15068;
                                                            if (_14952 == 11)
                                                            {
                                                                float _10103 = -_9827;
                                                                _15068 = _9411;
                                                                _15050 = (_9411 * _10103) + (_9419 * _9820);
                                                                _15032 = (_9427 * _10103) + (_9419 * _9834);
                                                                _15014 = _9427;
                                                                _14990 = _9403;
                                                                _14974 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _14975;
                                                                float3 _14991;
                                                                float3 _15015;
                                                                float3 _15033;
                                                                float3 _15051;
                                                                float3 _15069;
                                                                if (_14952 == 12)
                                                                {
                                                                    _15069 = (_9419 * (-_9820)) + (_9411 * _9827);
                                                                    _15051 = _9419;
                                                                    _15033 = _9427;
                                                                    _15015 = _12854;
                                                                    _14991 = (_9427 * (-_9813)) + (_9403 * _9834);
                                                                    _14975 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _10159 = _14952 == 13;
                                                                    int _14976;
                                                                    float3 _14992;
                                                                    float3 _15016;
                                                                    float3 _15052;
                                                                    float3 _15070;
                                                                    if (_10159)
                                                                    {
                                                                        float _10169 = -_9820;
                                                                        _15070 = (_9403 * _10169) + (_9411 * _9813);
                                                                        _15052 = (_9419 * _10169) + (_9411 * _9827);
                                                                        _15016 = _9427;
                                                                        _14992 = _9403;
                                                                        _14976 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _14977;
                                                                        float3 _14993;
                                                                        float3 _15017;
                                                                        if (_14952 == 14)
                                                                        {
                                                                            float _10199 = -_9813;
                                                                            _15017 = (_9427 * _10199) + (_9403 * _9834);
                                                                            _14993 = (_9411 * _10199) + (_9403 * _9820);
                                                                            _14977 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _15017 = _12854;
                                                                            _14993 = _9403;
                                                                            _14977 = (_14952 == 15) ? 4 : 0;
                                                                        }
                                                                        _15070 = _9411;
                                                                        _15052 = _9419;
                                                                        _15016 = _15017;
                                                                        _14992 = _14993;
                                                                        _14976 = _14977;
                                                                    }
                                                                    _15069 = _15070;
                                                                    _15051 = _15052;
                                                                    _15033 = select(_9427, _9419, bool3(_10159));
                                                                    _15015 = _15016;
                                                                    _14991 = _14992;
                                                                    _14975 = _14976;
                                                                }
                                                                _15068 = _15069;
                                                                _15050 = _15051;
                                                                _15032 = _15033;
                                                                _15014 = _15015;
                                                                _14990 = _14991;
                                                                _14974 = _14975;
                                                            }
                                                            _15067 = _15068;
                                                            _15049 = _15050;
                                                            _15031 = _15032;
                                                            _15013 = _15014;
                                                            _14989 = _14990;
                                                            _14973 = _14974;
                                                        }
                                                        _15066 = _15067;
                                                        _15048 = _15049;
                                                        _15030 = _15031;
                                                        _15012 = _15013;
                                                        _14988 = _14989;
                                                        _14972 = _14973;
                                                    }
                                                    _15065 = _15066;
                                                    _15047 = _15048;
                                                    _15029 = _15030;
                                                    _15011 = _15012;
                                                    _14987 = _14988;
                                                    _14971 = _14972;
                                                }
                                                _15064 = _15065;
                                                _15046 = _15047;
                                                _15028 = _15029;
                                                _15010 = _15011;
                                                _14986 = _14987;
                                                _14970 = _14971;
                                            }
                                            _15063 = _15064;
                                            _15045 = _15046;
                                            _15027 = _15028;
                                            _15009 = _15010;
                                            _14985 = _14986;
                                            _14969 = _14970;
                                        }
                                        _15062 = _15063;
                                        _15044 = _15045;
                                        _15026 = _15027;
                                        _15008 = _15009;
                                        _14984 = _14985;
                                        _14968 = _14969;
                                    }
                                    _15061 = _15062;
                                    _15043 = _15044;
                                    _15025 = _15026;
                                    _15007 = _15008;
                                    _14983 = _14984;
                                    _14967 = _14968;
                                }
                                _15060 = _15061;
                                _15042 = _15043;
                                _15024 = _15025;
                                _15006 = _15007;
                                _14982 = _14983;
                                _14966 = _14967;
                            }
                            _15059 = _15060;
                            _15041 = _15042;
                            _15023 = _15024;
                            _15005 = _15006;
                            _14981 = _14982;
                            _14965 = _14966;
                        }
                        _15058 = _15059;
                        _15040 = _15041;
                        _15022 = _15023;
                        _15004 = _15005;
                        _14980 = _14981;
                        _14964 = _14965;
                    }
                    _15057 = _15058;
                    _15039 = _15040;
                    _15021 = _15022;
                    _14999 = _15004;
                    _14979 = _14980;
                    _14963 = _14964;
                }
                if (_14963 == 0)
                {
                    _15152 = float3(0.0);
                    break;
                }
                float3 _9439 = fast::normalize(_14979);
                float3 _9443 = fast::normalize(_15057);
                float3 _9447 = fast::normalize(_15039);
                float3 _9451 = fast::normalize(select(_15021, _14979, bool3(_14963 == 3)));
                float3 _9455 = fast::normalize(select(_14999, _14979, bool3(_14963 == 4)));
                float _10276 = dot(_9439, _9443);
                float _10278 = abs(_10276);
                float _10292 = fma(fma(0.01452060043811798095703125, _10278, 0.4965155124664306640625), _10278, 0.8543984889984130859375) / fma(4.1616725921630859375 + _10278, _10278, 3.41759395599365234375);
                float _15075;
                if (_10276 > 0.0)
                {
                    _15075 = _10292;
                }
                else
                {
                    _15075 = fma(0.5, rsqrt(fast::max(fma(-_10276, _10276, 1.0), 1.0000000116860974230803549289703e-07)), -_10292);
                }
                float _10333 = dot(_9443, _9447);
                float _10335 = abs(_10333);
                float _10349 = fma(fma(0.01452060043811798095703125, _10335, 0.4965155124664306640625), _10335, 0.8543984889984130859375) / fma(4.1616725921630859375 + _10335, _10335, 3.41759395599365234375);
                float _15079;
                if (_10333 > 0.0)
                {
                    _15079 = _10349;
                }
                else
                {
                    _15079 = fma(0.5, rsqrt(fast::max(fma(-_10333, _10333, 1.0), 1.0000000116860974230803549289703e-07)), -_10349);
                }
                float _10390 = dot(_9447, _9451);
                float _10392 = abs(_10390);
                float _10406 = fma(fma(0.01452060043811798095703125, _10392, 0.4965155124664306640625), _10392, 0.8543984889984130859375) / fma(4.1616725921630859375 + _10392, _10392, 3.41759395599365234375);
                float _15084;
                if (_10390 > 0.0)
                {
                    _15084 = _10406;
                }
                else
                {
                    _15084 = fma(0.5, rsqrt(fast::max(fma(-_10390, _10390, 1.0), 1.0000000116860974230803549289703e-07)), -_10406);
                }
                float _9477 = ((cross(_9439, _9443) * _15075).z + (cross(_9443, _9447) * _15079).z) + (cross(_9447, _9451) * _15084).z;
                float _15101;
                if (_14963 >= 4)
                {
                    float _10447 = dot(_9451, _9455);
                    float _10449 = abs(_10447);
                    float _10463 = fma(fma(0.01452060043811798095703125, _10449, 0.4965155124664306640625), _10449, 0.8543984889984130859375) / fma(4.1616725921630859375 + _10449, _10449, 3.41759395599365234375);
                    float _15090;
                    if (_10447 > 0.0)
                    {
                        _15090 = _10463;
                    }
                    else
                    {
                        _15090 = fma(0.5, rsqrt(fast::max(fma(-_10447, _10447, 1.0), 1.0000000116860974230803549289703e-07)), -_10463);
                    }
                    _15101 = _9477 + (cross(_9451, _9455) * _15090).z;
                }
                else
                {
                    _15101 = _9477;
                }
                float _15102;
                if (_14963 == 5)
                {
                    float _10504 = dot(_9455, _9439);
                    float _10506 = abs(_10504);
                    float _10520 = fma(fma(0.01452060043811798095703125, _10506, 0.4965155124664306640625), _10506, 0.8543984889984130859375) / fma(4.1616725921630859375 + _10506, _10506, 3.41759395599365234375);
                    float _15099;
                    if (_10504 > 0.0)
                    {
                        _15099 = _10520;
                    }
                    else
                    {
                        _15099 = fma(0.5, rsqrt(fast::max(fma(-_10504, _10504, 1.0), 1.0000000116860974230803549289703e-07)), -_10520);
                    }
                    _15102 = _15101 + (cross(_9455, _9439) * _15099).z;
                }
                else
                {
                    _15102 = _15101;
                }
                if (buffer.u_AreaLightsTwoSide[0] > 0.5)
                {
                    _15152 = float3(abs(_15102));
                    break;
                }
                _15152 = float3(fast::max(0.0, _15102));
                break;
            }
        } while(false);
        _15286 = _14484 + (((buffer.u_AreaLightsColor[0].xyz * _7115) * (((_3745 * _8928.x) + ((float3(1.0) - _3745) * _8928.y)) * _15152)) * 1.0);
        _15245 = _14483 + ((((_3716 * buffer.u_AreaLightsColor[0].xyz) * _7115) * _14838) * 1.0);
    }
    else
    {
        _15286 = _14484;
        _15245 = _14483;
    }
    float _10564 = (buffer.u_AreaLightsIntensity[1] * buffer.u_AreaLightsEnabled[1]) * 3.1415920257568359375;
    float3 _15812;
    float3 _15813;
    if (buffer.u_AreaLightsEnabled[1] > 0.5)
    {
        float _10717 = 1.0 - fast::max(0.0, _12935);
        float _10731 = _10717 * _10717;
        float _10749 = fma(fma(_12935, _3776, -_12935), _12935, 1.0);
        _15813 = _15286 + (((((_3745 + ((float3(1.0) - _3745) * ((_10731 * _10731) * _10717))) * (((_3776 * 0.31830990314483642578125) / fma(_10749, _10749, 1.0000000116860974230803549289703e-07)) * 0.25)) * _12935) * buffer.u_AreaLightsColor[1].xyz) * _10564);
        _15812 = _15245 + (((_3716 * buffer.u_AreaLightsColor[1].xyz) * _10564) * (_12935 * 0.31830990314483642578125));
    }
    else
    {
        _15813 = _15286;
        _15812 = _15245;
    }
    out.o_fragColor = float4(pow(fast::max(_15812 + _15813, float3(9.9999997473787516355514526367188e-06)), float3(0.4545454680919647216796875)), buffer._AlbedoColor.w);
    return out;
}

