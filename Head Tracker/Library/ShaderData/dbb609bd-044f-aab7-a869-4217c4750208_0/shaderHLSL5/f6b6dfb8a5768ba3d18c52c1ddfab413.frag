Texture2D<float4> u_ltc_mat : register(t1);
SamplerState _u_ltc_mat_sampler : register(s1);
Texture2D<float4> u_ltc_mag : register(t2);
SamplerState _u_ltc_mag_sampler : register(s2);
uniform float u_DirLightsEnabled[3];
uniform float4 u_DirLightsDirection[3];
uniform float4 u_DirLightsColor[3];
uniform float u_DirLightsIntensity[3];
uniform float u_PointLightsEnabled[2];
uniform float4 u_PointLightsPosition[2];
uniform float4 u_PointLightsColor[2];
uniform float u_PointLightsIntensity[2];
uniform float u_PointLightsAttenRangeInv[2];
uniform float u_SpotLightsEnabled[2];
uniform float4 u_SpotLightsPosition[2];
uniform float4 u_SpotLightsColor[2];
uniform float u_SpotLightsIntensity[2];
uniform float u_SpotLightsAttenRangeInv[2];
uniform float4 u_SpotLightsDirection[2];
uniform float u_SpotLightsOuterAngleCos[2];
uniform float u_SpotLightsInnerAngleCos[2];
uniform float u_AreaLightsEnabled[2];
uniform float4 u_AreaLightsColor[2];
uniform float u_AreaLightsIntensity[2];
uniform float4 u_AreaLightsPoint0[2];
uniform float4 u_AreaLightsPoint1[2];
uniform float4 u_AreaLightsPoint2[2];
uniform float4 u_AreaLightsPoint3[2];
uniform float u_AreaLightsShape[2];
uniform float u_AreaLightsTwoSide[2];
Texture2D<float4> _EnvTex : register(t3);
SamplerState __EnvTex_sampler : register(s3);
uniform float _Env;
uniform float _EnvRot;
uniform float4 u_WorldSpaceCameraPos;
uniform float4 _AlbedoColor;
Texture2D<float4> _AlbedoTexture : register(t0);
SamplerState __AlbedoTexture_sampler : register(s0);
uniform float _Metallic;
uniform float _Roughness;
uniform float _Cutoff;

static float3 v_nDirWS;
static float3 v_posWS;
static float2 v_uv0;
static float4 o_fragColor;

struct SPIRV_Cross_Input
{
    float3 v_posWS : v_posWS;
    float3 v_nDirWS : v_nDirWS;
    float2 v_uv0 : v_uv0;
};

struct SPIRV_Cross_Output
{
    float4 o_fragColor : SV_Target0;
};

static float3 _12914;
static float _12995;
static float4 _16000;

void frag_main()
{
    float3 _3689 = normalize(v_nDirWS);
    float3 _3694 = normalize(u_WorldSpaceCameraPos.xyz - v_posWS);
    float3 _12912;
    if (dot(_3694, _3689) < (-0.0500000007450580596923828125f))
    {
        _12912 = -_3689;
    }
    else
    {
        _12912 = _3689;
    }
    float4 _3717 = _AlbedoTexture.Sample(__AlbedoTexture_sampler, v_uv0);
    float3 _3722 = pow(max(_AlbedoColor.xyz, 9.9999997473787516355514526367188e-06f.xxx), 2.2000000476837158203125f.xxx) * pow(max(_3717.xyz, 9.9999997473787516355514526367188e-06f.xxx), 2.2000000476837158203125f.xxx);
    float _3726 = _AlbedoColor.w * _3717.w;
    if (_3726 < _Cutoff)
    {
        discard;
    }
    float _3825 = clamp(_Metallic, 0.0f, 1.0f);
    float _3745 = clamp(_Roughness, 0.0f, 1.0f);
    float _3830 = _3745 * _3745;
    float _3835 = _3830 * _3830;
    float3 _3759 = _3722 * (1.0f - _3825);
    float _3770 = max(0.0f, dot(_12912, _3694));
    float3 _3788 = lerp(0.0400000028312206268310546875f.xxx, _3722, _3825.xxx);
    float3 _4122 = normalize(_12912);
    float _4125 = -_4122.z;
    float _4127 = _4122.x;
    float _4166 = clamp(_4125 / length(float2(_4127, _4125)), -1.0f, 1.0f);
    float _4175 = abs(_4166);
    float _4178 = mad(-0.15658299624919891357421875f, _4175, 1.57079601287841796875f);
    float _4181 = sqrt(1.0f - _4175);
    float _12915;
    if (_4166 >= 0.0f)
    {
        _12915 = _4178 * _4181;
    }
    else
    {
        _12915 = mad(-_4178, _4181, 3.1415927410125732421875f);
    }
    float _4134 = acos(_4122.y);
    float _4140 = mad(mad((_4127 < 0.0f) ? (-1.0f) : 1.0f, _12915, -1.57079637050628662109375f), 0.15915493667125701904296875f, _EnvRot);
    float _4149 = frac((_4140 + floor(_4140)) + 1.0f);
    float _4202 = floor(7.0f);
    float2 _12919;
    float2 _12926;
    if (abs(_4202) < 0.001000000047497451305389404296875f)
    {
        _12926 = float2(mad(_4149, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4134, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f));
        _12919 = float2(mad(_4149, 0.998046875f, 0.0009765625f), mad(_4134, 0.3170664608478546142578125f, 0.001953125f) * 0.5f);
    }
    else
    {
        float2 _12920;
        float2 _12927;
        if (abs(_4202 - 1.0f) < 0.001000000047497451305389404296875f)
        {
            float _4255 = mad(_4149, 0.99609375f, 0.001953125f);
            float _4265 = mad(mad(_4134, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f);
            _12927 = float2(mad(_4255, 0.5f, 0.5f), _4265);
            _12920 = float2(_4255 * 0.5f, _4265);
        }
        else
        {
            float2 _12921;
            float2 _12928;
            if (abs(_4202 - 2.0f) < 0.001000000047497451305389404296875f)
            {
                float _4293 = mad(_4149, 0.99609375f, 0.001953125f);
                float _4301 = mad(_4134, 0.315823078155517578125f, 0.00390625f);
                _12928 = float2(_4293 * 0.5f, mad(_4301, 0.25f, 0.75f));
                _12921 = float2(mad(_4293, 0.5f, 0.5f), mad(_4301, 0.25f, 0.5f));
            }
            else
            {
                float2 _12922;
                float2 _12929;
                if (abs(_4202 - 3.0f) < 0.001000000047497451305389404296875f)
                {
                    _12929 = float2(mad(mad(_4149, 0.9921875f, 0.00390625f), 0.25f, 0.5f), mad(mad(_4134, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f));
                    _12922 = float2(mad(_4149, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4134, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.75f));
                }
                else
                {
                    float2 _12923;
                    float2 _12930;
                    if (abs(_4202 - 4.0f) < 0.001000000047497451305389404296875f)
                    {
                        float _4369 = mad(_4149, 0.9921875f, 0.00390625f);
                        float _4379 = mad(mad(_4134, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f);
                        _12930 = float2(mad(_4369, 0.25f, 0.75f), _4379);
                        _12923 = float2(mad(_4369, 0.25f, 0.5f), _4379);
                    }
                    else
                    {
                        float2 _12924;
                        float2 _12931;
                        if (abs(_4202 - 5.0f) < 0.001000000047497451305389404296875f)
                        {
                            float _4407 = mad(_4149, 0.9921875f, 0.00390625f);
                            float _4415 = mad(_4134, 0.3133362829685211181640625f, 0.0078125f);
                            _12931 = float2(mad(_4407, 0.25f, 0.5f), mad(_4415, 0.125f, 0.875f));
                            _12924 = float2(mad(_4407, 0.25f, 0.75f), mad(_4415, 0.125f, 0.75f));
                        }
                        else
                        {
                            float2 _12925;
                            float2 _12932;
                            if (abs(_4202 - 6.0f) < 0.001000000047497451305389404296875f)
                            {
                                float _4445 = mad(_4149, 0.9921875f, 0.00390625f);
                                float _4455 = mad(mad(_4134, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f);
                                _12932 = float2(mad(_4445, 0.25f, 0.75f), _4455);
                                _12925 = float2(mad(_4445, 0.25f, 0.5f), _4455);
                            }
                            else
                            {
                                float2 _15896 = float2(mad(mad(_4149, 0.9921875f, 0.00390625f), 0.25f, 0.75f), mad(mad(_4134, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f));
                                _12932 = _15896;
                                _12925 = _15896;
                            }
                            _12931 = _12932;
                            _12924 = _12925;
                        }
                        _12930 = _12931;
                        _12923 = _12924;
                    }
                    _12929 = _12930;
                    _12922 = _12923;
                }
                _12928 = _12929;
                _12921 = _12922;
            }
            _12927 = _12928;
            _12920 = _12921;
        }
        _12926 = _12927;
        _12919 = _12920;
    }
    float4 _4515 = _EnvTex.Sample(__EnvTex_sampler, _12919);
    float4 _4518 = _EnvTex.Sample(__EnvTex_sampler, _12926);
    float4 _4521 = lerp(_4515, _4518, (7.0f - _4202).xxxx);
    float3 _4065 = ((_3759 * ((_4521.xyz / _4521.w.xxx) * _Env)) * max(1.0f.xxx, ((((((_3759 * 2.040400028228759765625f) - 0.3323999941349029541015625f.xxx) * 1.0f) + ((_3759 * (-4.79510021209716796875f)) + 0.6417000293731689453125f.xxx)) * 1.0f) + ((_3759 * 2.755199909210205078125f) + 0.69029998779296875f.xxx)) * 1.0f)) * 1.0f;
    float3 _4624 = normalize(lerp(normalize(reflect(-_3694, _12912)), _12912, (_3745 * _3830).xxx));
    float _4627 = -_4624.z;
    float _4629 = _4624.x;
    float _4668 = clamp(_4627 / length(float2(_4629, _4627)), -1.0f, 1.0f);
    float _4677 = abs(_4668);
    float _4680 = mad(-0.15658299624919891357421875f, _4677, 1.57079601287841796875f);
    float _4683 = sqrt(1.0f - _4677);
    float _12941;
    if (_4668 >= 0.0f)
    {
        _12941 = _4680 * _4683;
    }
    else
    {
        _12941 = mad(-_4680, _4683, 3.1415927410125732421875f);
    }
    float _4636 = acos(_4624.y);
    float _4642 = mad(mad((_4629 < 0.0f) ? (-1.0f) : 1.0f, _12941, -1.57079637050628662109375f), 0.15915493667125701904296875f, _EnvRot);
    float _4651 = frac((_4642 + floor(_4642)) + 1.0f);
    float _4704 = floor(_3745 * 7.0f);
    float2 _12952;
    float2 _12959;
    if (abs(_4704) < 0.001000000047497451305389404296875f)
    {
        _12959 = float2(mad(_4651, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4636, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f));
        _12952 = float2(mad(_4651, 0.998046875f, 0.0009765625f), mad(_4636, 0.3170664608478546142578125f, 0.001953125f) * 0.5f);
    }
    else
    {
        float2 _12953;
        float2 _12960;
        if (abs(_4704 - 1.0f) < 0.001000000047497451305389404296875f)
        {
            float _4757 = mad(_4651, 0.99609375f, 0.001953125f);
            float _4767 = mad(mad(_4636, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f);
            _12960 = float2(mad(_4757, 0.5f, 0.5f), _4767);
            _12953 = float2(_4757 * 0.5f, _4767);
        }
        else
        {
            float2 _12954;
            float2 _12961;
            if (abs(_4704 - 2.0f) < 0.001000000047497451305389404296875f)
            {
                float _4795 = mad(_4651, 0.99609375f, 0.001953125f);
                float _4803 = mad(_4636, 0.315823078155517578125f, 0.00390625f);
                _12961 = float2(_4795 * 0.5f, mad(_4803, 0.25f, 0.75f));
                _12954 = float2(mad(_4795, 0.5f, 0.5f), mad(_4803, 0.25f, 0.5f));
            }
            else
            {
                float2 _12955;
                float2 _12962;
                if (abs(_4704 - 3.0f) < 0.001000000047497451305389404296875f)
                {
                    _12962 = float2(mad(mad(_4651, 0.9921875f, 0.00390625f), 0.25f, 0.5f), mad(mad(_4636, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f));
                    _12955 = float2(mad(_4651, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4636, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.75f));
                }
                else
                {
                    float2 _12956;
                    float2 _12963;
                    if (abs(_4704 - 4.0f) < 0.001000000047497451305389404296875f)
                    {
                        float _4871 = mad(_4651, 0.9921875f, 0.00390625f);
                        float _4881 = mad(mad(_4636, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f);
                        _12963 = float2(mad(_4871, 0.25f, 0.75f), _4881);
                        _12956 = float2(mad(_4871, 0.25f, 0.5f), _4881);
                    }
                    else
                    {
                        float2 _12957;
                        float2 _12964;
                        if (abs(_4704 - 5.0f) < 0.001000000047497451305389404296875f)
                        {
                            float _4909 = mad(_4651, 0.9921875f, 0.00390625f);
                            float _4917 = mad(_4636, 0.3133362829685211181640625f, 0.0078125f);
                            _12964 = float2(mad(_4909, 0.25f, 0.5f), mad(_4917, 0.125f, 0.875f));
                            _12957 = float2(mad(_4909, 0.25f, 0.75f), mad(_4917, 0.125f, 0.75f));
                        }
                        else
                        {
                            float2 _12958;
                            float2 _12965;
                            if (abs(_4704 - 6.0f) < 0.001000000047497451305389404296875f)
                            {
                                float _4947 = mad(_4651, 0.9921875f, 0.00390625f);
                                float _4957 = mad(mad(_4636, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f);
                                _12965 = float2(mad(_4947, 0.25f, 0.75f), _4957);
                                _12958 = float2(mad(_4947, 0.25f, 0.5f), _4957);
                            }
                            else
                            {
                                float2 _15921 = float2(mad(mad(_4651, 0.9921875f, 0.00390625f), 0.25f, 0.75f), mad(mad(_4636, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f));
                                _12965 = _15921;
                                _12958 = _15921;
                            }
                            _12964 = _12965;
                            _12957 = _12958;
                        }
                        _12963 = _12964;
                        _12956 = _12957;
                    }
                    _12962 = _12963;
                    _12955 = _12956;
                }
                _12961 = _12962;
                _12954 = _12955;
            }
            _12960 = _12961;
            _12953 = _12954;
        }
        _12959 = _12960;
        _12952 = _12953;
    }
    float4 _5023 = lerp(_EnvTex.Sample(__EnvTex_sampler, _12952), _EnvTex.Sample(__EnvTex_sampler, _12959), mad(_3745, 7.0f, -_4704).xxxx);
    float4 _5050 = (float4(-1.0f, -0.0274999998509883880615234375f, -0.572000026702880859375f, 0.02199999988079071044921875f) * _3745) + float4(1.0f, 0.0425000004470348358154296875f, 1.03999996185302734375f, -0.039999999105930328369140625f);
    float _5052 = _5050.x;
    float2 _5070 = (float2(-1.03999996185302734375f, 1.03999996185302734375f) * mad(min(_5052 * _5052, exp2((-9.27999973297119140625f) * _3770)), _5052, _5050.y)) + _5050.zw;
    float3 _4072 = ((((_3788 * _5070.x) + (_5070.y * clamp(50.0f * _3788.y, 0.0f, 1.0f)).xxx) * max(1.0f.xxx, ((((((_3788 * 2.040400028228759765625f) - 0.3323999941349029541015625f.xxx) * 1.0f) + ((_3788 * (-4.79510021209716796875f)) + 0.6417000293731689453125f.xxx)) * 1.0f) + ((_3788 * 2.755199909210205078125f) + 0.69029998779296875f.xxx)) * 1.0f)) * ((_5023.xyz / _5023.w.xxx) * _Env)) * 1.0f;
    float3 _5134 = normalize(-u_DirLightsDirection[0].xyz);
    float _5148 = (u_DirLightsIntensity[0] * u_DirLightsEnabled[0]) * 3.1415920257568359375f;
    float3 _5162 = normalize(_5134 + _3694);
    float _5176 = max(0.0f, dot(_12912, _5134));
    float _5183 = max(0.0f, dot(_12912, _5162));
    float3 _13178;
    float3 _13179;
    if (u_DirLightsEnabled[0] > 0.5f)
    {
        float _5327 = 1.0f - max(0.0f, max(0.0f, dot(_3694, _5162)));
        float _5341 = _5327 * _5327;
        float _5354 = 1.0f - _5176;
        float _5382 = mad(mad(_5183, _3835, -_5183), _5183, 1.0f);
        _13179 = _4072 + ((((((_3788 + ((1.0f.xxx - _3788) * ((_5341 * _5341) * _5327))) * (((_3835 * 0.31830990314483642578125f) / mad(_5382, _5382, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3830, mad(_3770, _5354, _5176), _3770 * mad(_3830, _5354, _5176)) + 9.9999997473787516355514526367188e-06f)))) * _5176) * u_DirLightsColor[0].xyz) * _5148) * 1.0f);
        _13178 = _4065 + ((((_3759 * u_DirLightsColor[0].xyz) * _5148) * (_5176 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13179 = _4072;
        _13178 = _4065;
    }
    float3 _5402 = normalize(-u_DirLightsDirection[1].xyz);
    float _5416 = (u_DirLightsIntensity[1] * u_DirLightsEnabled[1]) * 3.1415920257568359375f;
    float3 _5430 = normalize(_5402 + _3694);
    float _5444 = max(0.0f, dot(_12912, _5402));
    float _5451 = max(0.0f, dot(_12912, _5430));
    float3 _13378;
    float3 _13379;
    if (u_DirLightsEnabled[1] > 0.5f)
    {
        float _5587 = 1.0f - max(0.0f, max(0.0f, dot(_3694, _5430)));
        float _5601 = _5587 * _5587;
        float _5619 = mad(mad(_5451, _3835, -_5451), _5451, 1.0f);
        _13379 = _13179 + ((((((_3788 + ((1.0f.xxx - _3788) * ((_5601 * _5601) * _5587))) * (((_3835 * 0.31830990314483642578125f) / mad(_5619, _5619, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _5444) * u_DirLightsColor[1].xyz) * _5416) * 1.0f);
        _13378 = _13178 + ((((_3759 * u_DirLightsColor[1].xyz) * _5416) * (_5444 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13379 = _13179;
        _13378 = _13178;
    }
    float3 _5639 = normalize(-u_DirLightsDirection[2].xyz);
    float _5653 = (u_DirLightsIntensity[2] * u_DirLightsEnabled[2]) * 3.1415920257568359375f;
    float3 _5667 = normalize(_5639 + _3694);
    float _5681 = max(0.0f, dot(_12912, _5639));
    float _5688 = max(0.0f, dot(_12912, _5667));
    float3 _13589;
    float3 _13590;
    if (u_DirLightsEnabled[2] > 0.5f)
    {
        float _5824 = 1.0f - max(0.0f, max(0.0f, dot(_3694, _5667)));
        float _5838 = _5824 * _5824;
        float _5856 = mad(mad(_5688, _3835, -_5688), _5688, 1.0f);
        _13590 = _13379 + ((((((_3788 + ((1.0f.xxx - _3788) * ((_5838 * _5838) * _5824))) * (((_3835 * 0.31830990314483642578125f) / mad(_5856, _5856, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _5681) * u_DirLightsColor[2].xyz) * _5653) * 1.0f);
        _13589 = _13378 + ((((_3759 * u_DirLightsColor[2].xyz) * _5653) * (_5681 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13590 = _13379;
        _13589 = _13378;
    }
    float3 _5885 = u_PointLightsPosition[0].xyz - v_posWS;
    float _5887 = length(_5885);
    float3 _5891 = _5885 / _5887.xxx;
    float _5905 = (u_PointLightsIntensity[0] * u_PointLightsEnabled[0]) * 3.1415920257568359375f;
    float _5912 = _5887 * u_PointLightsAttenRangeInv[0];
    float _5938 = _5912 * _5912;
    float _5945 = clamp(mad(-_5938, _5938, 1.0f), 0.0f, 1.0f);
    float3 _5926 = (((_5945 * _5945) * mad(_5912, _5912, 1.0f)) * 0.25f).xxx;
    float3 _5962 = normalize(_5891 + _3694);
    float _5976 = max(0.0f, dot(_12912, _5891));
    float _5983 = max(0.0f, dot(_12912, _5962));
    float3 _13811;
    float3 _13812;
    if (u_PointLightsEnabled[0] > 0.5f)
    {
        float _6127 = 1.0f - max(0.0f, max(0.0f, dot(_3694, _5962)));
        float _6141 = _6127 * _6127;
        float _6154 = 1.0f - _5976;
        float _6182 = mad(mad(_5983, _3835, -_5983), _5983, 1.0f);
        _13812 = _13590 + (((((((_3788 + ((1.0f.xxx - _3788) * ((_6141 * _6141) * _6127))) * (((_3835 * 0.31830990314483642578125f) / mad(_6182, _6182, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3830, mad(_3770, _6154, _5976), _3770 * mad(_3830, _6154, _5976)) + 9.9999997473787516355514526367188e-06f)))) * _5976) * u_PointLightsColor[0].xyz) * _5905) * _5926) * 1.0f);
        _13811 = _13589 + (((((_3759 * u_PointLightsColor[0].xyz) * _5905) * _5926) * (_5976 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13812 = _13590;
        _13811 = _13589;
    }
    float3 _6211 = u_PointLightsPosition[1].xyz - v_posWS;
    float _6213 = length(_6211);
    float3 _6217 = _6211 / _6213.xxx;
    float _6231 = (u_PointLightsIntensity[1] * u_PointLightsEnabled[1]) * 3.1415920257568359375f;
    float _6238 = _6213 * u_PointLightsAttenRangeInv[1];
    float _6264 = _6238 * _6238;
    float _6271 = clamp(mad(-_6264, _6264, 1.0f), 0.0f, 1.0f);
    float3 _6252 = (((_6271 * _6271) * mad(_6238, _6238, 1.0f)) * 0.25f).xxx;
    float3 _6288 = normalize(_6217 + _3694);
    float _6302 = max(0.0f, dot(_12912, _6217));
    float _6309 = max(0.0f, dot(_12912, _6288));
    float3 _14044;
    float3 _14045;
    if (u_PointLightsEnabled[1] > 0.5f)
    {
        float _6445 = 1.0f - max(0.0f, max(0.0f, dot(_3694, _6288)));
        float _6459 = _6445 * _6445;
        float _6477 = mad(mad(_6309, _3835, -_6309), _6309, 1.0f);
        _14045 = _13812 + (((((((_3788 + ((1.0f.xxx - _3788) * ((_6459 * _6459) * _6445))) * (((_3835 * 0.31830990314483642578125f) / mad(_6477, _6477, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _6302) * u_PointLightsColor[1].xyz) * _6231) * _6252) * 1.0f);
        _14044 = _13811 + (((((_3759 * u_PointLightsColor[1].xyz) * _6231) * _6252) * (_6302 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14045 = _13812;
        _14044 = _13811;
    }
    float3 _6508 = u_SpotLightsPosition[0].xyz - v_posWS;
    float _6510 = length(_6508);
    float3 _6514 = _6508 / _6510.xxx;
    float _6528 = (u_SpotLightsIntensity[0] * u_SpotLightsEnabled[0]) * 3.1415920257568359375f;
    float _6535 = _6510 * u_SpotLightsAttenRangeInv[0];
    float _6582 = _6535 * _6535;
    float _6589 = clamp(mad(-_6582, _6582, 1.0f), 0.0f, 1.0f);
    float3 _6570 = ((((_6589 * _6589) * mad(_6535, _6535, 1.0f)) * 0.25f) * smoothstep(u_SpotLightsOuterAngleCos[0], u_SpotLightsInnerAngleCos[0], max(0.0f, dot(_6514, normalize(-u_SpotLightsDirection[0].xyz))))).xxx;
    float3 _6606 = normalize(_6514 + _3694);
    float _6620 = max(0.0f, dot(_12912, _6514));
    float _6627 = max(0.0f, dot(_12912, _6606));
    float3 _14288;
    float3 _14289;
    if (u_SpotLightsEnabled[0] > 0.5f)
    {
        float _6771 = 1.0f - max(0.0f, max(0.0f, dot(_3694, _6606)));
        float _6785 = _6771 * _6771;
        float _6798 = 1.0f - _6620;
        float _6826 = mad(mad(_6627, _3835, -_6627), _6627, 1.0f);
        _14289 = _14045 + (((((((_3788 + ((1.0f.xxx - _3788) * ((_6785 * _6785) * _6771))) * (((_3835 * 0.31830990314483642578125f) / mad(_6826, _6826, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3830, mad(_3770, _6798, _6620), _3770 * mad(_3830, _6798, _6620)) + 9.9999997473787516355514526367188e-06f)))) * _6620) * u_SpotLightsColor[0].xyz) * _6528) * _6570) * 1.0f);
        _14288 = _14044 + (((((_3759 * u_SpotLightsColor[0].xyz) * _6528) * _6570) * (_6620 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14289 = _14045;
        _14288 = _14044;
    }
    float3 _6857 = u_SpotLightsPosition[1].xyz - v_posWS;
    float _6859 = length(_6857);
    float3 _6863 = _6857 / _6859.xxx;
    float _6877 = (u_SpotLightsIntensity[1] * u_SpotLightsEnabled[1]) * 3.1415920257568359375f;
    float _6884 = _6859 * u_SpotLightsAttenRangeInv[1];
    float _6931 = _6884 * _6884;
    float _6938 = clamp(mad(-_6931, _6931, 1.0f), 0.0f, 1.0f);
    float3 _6919 = ((((_6938 * _6938) * mad(_6884, _6884, 1.0f)) * 0.25f) * smoothstep(u_SpotLightsOuterAngleCos[1], u_SpotLightsInnerAngleCos[1], max(0.0f, dot(_6863, normalize(-u_SpotLightsDirection[1].xyz))))).xxx;
    float3 _6955 = normalize(_6863 + _3694);
    float _6969 = max(0.0f, dot(_12912, _6863));
    float _6976 = max(0.0f, dot(_12912, _6955));
    float3 _14543;
    float3 _14544;
    if (u_SpotLightsEnabled[1] > 0.5f)
    {
        float _7112 = 1.0f - max(0.0f, max(0.0f, dot(_3694, _6955)));
        float _7126 = _7112 * _7112;
        float _7144 = mad(mad(_6976, _3835, -_6976), _6976, 1.0f);
        _14544 = _14289 + (((((((_3788 + ((1.0f.xxx - _3788) * ((_7126 * _7126) * _7112))) * (((_3835 * 0.31830990314483642578125f) / mad(_7144, _7144, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _6969) * u_SpotLightsColor[1].xyz) * _6877) * _6919) * 1.0f);
        _14543 = _14288 + (((((_3759 * u_SpotLightsColor[1].xyz) * _6877) * _6919) * (_6969 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14544 = _14289;
        _14543 = _14288;
    }
    float _7174 = (u_AreaLightsIntensity[0] * u_AreaLightsEnabled[0]) * 3.1415920257568359375f;
    float3 _15305;
    float3 _15346;
    if (u_AreaLightsEnabled[0] > 0.5f)
    {
        float3 _7334;
        float3 _7338;
        bool _7341;
        float3 _14898;
        do
        {
            _7334 = normalize(_3694 - (_12912 * _3770));
            _7338 = cross(_12912, _7334);
            _7341 = u_AreaLightsShape[0] > 0.5f;
            if (_7341)
            {
                float3x3 _7360 = transpose(float3x3(_7334, _7338, _12912));
                float3 _7367 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _7360);
                float3 _7375 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _7360);
                float3 _7383 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _7360);
                float3 _7405 = mul((_7367 + _7383) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7408 = mul((_7375 - _7383) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7411 = mul((_7375 - _7367) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                if (u_AreaLightsTwoSide[0] < 0.5f)
                {
                    if (dot(cross(_7408, _7411), _7405) < 0.0f)
                    {
                        _14898 = 0.0f.xxx;
                        break;
                    }
                }
                float _7427 = dot(_7408, _7408);
                float _7430 = dot(_7411, _7411);
                float _7433 = dot(_7408, _7411);
                float _7438 = _7427 * _7430;
                float3 _14853;
                float3 _14854;
                float _14859;
                float _14861;
                if ((abs(_7433) / sqrt(_7438)) > 9.9999997473787516355514526367188e-05f)
                {
                    float _7445 = _7427 + _7430;
                    float _7455 = sqrt(mad(-_7433, _7433, _7438));
                    float _7460 = sqrt(mad(-2.0f, _7455, _7445));
                    float _7466 = sqrt(mad(2.0f, _7455, _7445));
                    float _7470 = mad(0.5f, _7460, 0.5f * _7466);
                    float _7474 = mad(0.5f, _7460, _7466 * (-0.5f));
                    float3 _14851;
                    float3 _14852;
                    if (_7427 > _7430)
                    {
                        float3 _7482 = _7408 * _7433;
                        float _15961 = -_7427;
                        _14852 = _7482 + (_7411 * mad(_7474, _7474, _15961));
                        _14851 = _7482 + (_7411 * mad(_7470, _7470, _15961));
                    }
                    else
                    {
                        float3 _7501 = _7411 * _7433;
                        float _15959 = -_7430;
                        _14852 = _7501 + (_7408 * mad(_7474, _7474, _15959));
                        _14851 = _7501 + (_7408 * mad(_7470, _7470, _15959));
                    }
                    _14861 = 1.0f / (_7474 * _7474);
                    _14859 = 1.0f / (_7470 * _7470);
                    _14854 = normalize(_14852);
                    _14853 = normalize(_14851);
                }
                else
                {
                    float _7530 = 1.0f / _7427;
                    float _7534 = 1.0f / _7430;
                    _14861 = _7534;
                    _14859 = _7530;
                    _14854 = _7411 * sqrt(_7534);
                    _14853 = _7408 * sqrt(_7530);
                }
                float3 _7546 = cross(_14853, _14854);
                float3 _14855;
                if (dot(_7405, _7546) < 0.0f)
                {
                    _14855 = _7546 * (-1.0f);
                }
                else
                {
                    _14855 = _7546;
                }
                float _7557 = dot(_14855, _7405);
                float _7562 = dot(_14853, _7405) / _7557;
                float _7567 = dot(_14854, _7405) / _7557;
                float _7574 = _7557 * _7557;
                float _7576 = _14859 * _7574;
                float _7581 = _14861 * _7574;
                float _7584 = _7576 * _7581;
                float _7591 = mad(_7562, _7562, 1.0f);
                float _15963 = -_7576;
                float4 _12688 = _16000;
                _12688.x = _7584;
                float4 _12690 = _12688;
                _12690.y = mad(-_14861, _7574, mad(_7584, mad(_7567, _7567, _7591), _15963));
                float4 _12692 = _12690;
                _12692.z = mad(-_7581, mad(_7567, _7567, 1.0f), mad(_15963, _7591, 1.0f));
                float2 _7898 = _12692.yz * 0.3333333432674407958984375f.xx;
                float _7900 = _7898.x;
                float4 _12694 = _12692;
                _12694.y = _7900;
                float _7902 = _7898.y;
                float _7913 = -_7902;
                float _7919 = mad(_7913, _7902, _7900);
                float _7922 = -_7900;
                float _7928 = mad(_7922, _7902, _7584);
                float _7937 = dot(float2(_7902, _7922), _12694.xy);
                float _7960 = sqrt(dot(float2(4.0f * _7919, -_7928), float3(_7919, _7928, _7937).zy));
                float _7963 = atan2(_7960, -mad((-2.0f) * _7902, _7919, _7928));
                float _7968 = 2.0f * sqrt(-_7919);
                float _7970 = cos(_7963 * 0.3333333432674407958984375f);
                float _7979 = _7968 * cos(mad(_7963, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _7993 = ((mad(_7968, _7970, _7979) > (2.0f * _7902)) ? (_7968 * _7970) : _7979) - _7902;
                float _8000 = -_7584;
                float _8005 = 2.0f * _7900;
                float _8016 = atan2(_7584 * _7960, -mad(_8000, _7928, _8005 * _7937));
                float _8021 = 2.0f * sqrt(-_7937);
                float _8023 = cos(_8016 * 0.3333333432674407958984375f);
                float _8032 = _8021 * cos(mad(_8016, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _8048 = ((mad(_8021, _8023, _8032) < _8005) ? (_8021 * _8023) : _8032) + _7900;
                float _8066 = mad(-_7993, _8048, _7584);
                float _8092 = _8000 / _8048;
                float _8097 = mad(_7900, _8066, -(_7902 * (_7993 * _8000))) / mad(_7913, _8066, _7900 * _8048);
                float3 _8103 = float3(_8092, _8097, _7993);
                bool _8108 = _8092 < _8097;
                bool _8116;
                if (_8108)
                {
                    _8116 = _8092 < _7993;
                }
                else
                {
                    _8116 = _8108;
                }
                float3 _14866;
                if (_8116)
                {
                    _14866 = _8103.yxz;
                }
                else
                {
                    bool _8125 = _7993 < _8092;
                    bool _8133;
                    if (_8125)
                    {
                        _8133 = _7993 < _8097;
                    }
                    else
                    {
                        _8133 = _8125;
                    }
                    float3 _14867;
                    if (_8133)
                    {
                        _14867 = _8103.xzy;
                    }
                    else
                    {
                        _14867 = _8103;
                    }
                    _14866 = _14867;
                }
                float _15971 = -_14866.y;
                float _7667 = sqrt(_15971 / _14866.z);
                float _7672 = sqrt(_15971 / _14866.x);
                float _7686 = (_7667 * _7672) * rsqrt(mad(_7667, _7667, 1.0f) * mad(_7672, _7672, 1.0f));
                _14898 = (_7686 * u_ltc_mag.Sample(_u_ltc_mag_sampler, (float2(mad(normalize(mul(float3((_7576 * _7562) / mad(_14859, _7574, _15971), (_7581 * _7567) / mad(_14861, _7574, _15971), 1.0f), float3x3(_14853, _14854, _14855))).z, 0.5f, 0.5f), _7686) * 0.984375f) + 0.0078125f.xx).w).xxx;
                break;
            }
            else
            {
                float3x3 _7726 = mul(transpose(float3x3(_7334, _7338, _12912)), float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7733 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _7726);
                float3 _7741 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _7726);
                float3 _7749 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _7726);
                float3 _7757 = mul(u_AreaLightsPoint3[0].xyz - v_posWS, _7726);
                float _8143 = _7733.z;
                int _16001 = int(_8143 > 0.0f);
                float _8150 = _7741.z;
                int _14693;
                if (_8150 > 0.0f)
                {
                    _14693 = _16001 + 2;
                }
                else
                {
                    _14693 = _16001;
                }
                float _8157 = _7749.z;
                int _14697;
                if (_8157 > 0.0f)
                {
                    _14697 = _14693 + 4;
                }
                else
                {
                    _14697 = _14693;
                }
                float _8164 = _7757.z;
                int _14698;
                if (_8164 > 0.0f)
                {
                    _14698 = _14697 + 8;
                }
                else
                {
                    _14698 = _14697;
                }
                int _14709;
                float3 _14725;
                float3 _14745;
                float3 _14767;
                float3 _14785;
                float3 _14803;
                if (_14698 == 0)
                {
                    _14803 = _7741;
                    _14785 = _7749;
                    _14767 = _7757;
                    _14745 = _12914;
                    _14725 = _7733;
                    _14709 = 0;
                }
                else
                {
                    int _14710;
                    float3 _14726;
                    float3 _14750;
                    float3 _14768;
                    float3 _14786;
                    float3 _14804;
                    if (_14698 == 1)
                    {
                        _14804 = (_7733 * (-_8150)) + (_7741 * _8143);
                        _14786 = (_7733 * (-_8164)) + (_7757 * _8143);
                        _14768 = _7757;
                        _14750 = _12914;
                        _14726 = _7733;
                        _14710 = 3;
                    }
                    else
                    {
                        int _14711;
                        float3 _14727;
                        float3 _14751;
                        float3 _14769;
                        float3 _14787;
                        float3 _14805;
                        if (_14698 == 2)
                        {
                            _14805 = _7741;
                            _14787 = (_7741 * (-_8157)) + (_7749 * _8150);
                            _14769 = _7757;
                            _14751 = _12914;
                            _14727 = (_7741 * (-_8143)) + (_7733 * _8150);
                            _14711 = 3;
                        }
                        else
                        {
                            int _14712;
                            float3 _14728;
                            float3 _14752;
                            float3 _14770;
                            float3 _14788;
                            float3 _14806;
                            if (_14698 == 3)
                            {
                                _14806 = _7741;
                                _14788 = (_7741 * (-_8157)) + (_7749 * _8150);
                                _14770 = (_7733 * (-_8164)) + (_7757 * _8143);
                                _14752 = _12914;
                                _14728 = _7733;
                                _14712 = 4;
                            }
                            else
                            {
                                int _14713;
                                float3 _14729;
                                float3 _14753;
                                float3 _14771;
                                float3 _14789;
                                float3 _14807;
                                if (_14698 == 4)
                                {
                                    _14807 = (_7749 * (-_8150)) + (_7741 * _8157);
                                    _14789 = _7749;
                                    _14771 = _7757;
                                    _14753 = _12914;
                                    _14729 = (_7749 * (-_8164)) + (_7757 * _8157);
                                    _14713 = 3;
                                }
                                else
                                {
                                    int _14714;
                                    float3 _14730;
                                    float3 _14754;
                                    float3 _14772;
                                    float3 _14790;
                                    float3 _14808;
                                    if (_14698 == 5)
                                    {
                                        _14808 = _7741;
                                        _14790 = _7749;
                                        _14772 = _7757;
                                        _14754 = _12914;
                                        _14730 = _7733;
                                        _14714 = 0;
                                    }
                                    else
                                    {
                                        int _14715;
                                        float3 _14731;
                                        float3 _14755;
                                        float3 _14773;
                                        float3 _14791;
                                        float3 _14809;
                                        if (_14698 == 6)
                                        {
                                            _14809 = _7741;
                                            _14791 = _7749;
                                            _14773 = (_7749 * (-_8164)) + (_7757 * _8157);
                                            _14755 = _12914;
                                            _14731 = (_7741 * (-_8143)) + (_7733 * _8150);
                                            _14715 = 4;
                                        }
                                        else
                                        {
                                            int _14716;
                                            float3 _14732;
                                            float3 _14756;
                                            float3 _14774;
                                            float3 _14792;
                                            float3 _14810;
                                            if (_14698 == 7)
                                            {
                                                float _8333 = -_8164;
                                                _14810 = _7741;
                                                _14792 = _7749;
                                                _14774 = (_7749 * _8333) + (_7757 * _8157);
                                                _14756 = (_7733 * _8333) + (_7757 * _8143);
                                                _14732 = _7733;
                                                _14716 = 5;
                                            }
                                            else
                                            {
                                                int _14717;
                                                float3 _14733;
                                                float3 _14757;
                                                float3 _14775;
                                                float3 _14793;
                                                float3 _14811;
                                                if (_14698 == 8)
                                                {
                                                    _14811 = (_7757 * (-_8157)) + (_7749 * _8164);
                                                    _14793 = _7757;
                                                    _14775 = _7757;
                                                    _14757 = _12914;
                                                    _14733 = (_7757 * (-_8143)) + (_7733 * _8164);
                                                    _14717 = 3;
                                                }
                                                else
                                                {
                                                    int _14718;
                                                    float3 _14734;
                                                    float3 _14758;
                                                    float3 _14776;
                                                    float3 _14794;
                                                    float3 _14812;
                                                    if (_14698 == 9)
                                                    {
                                                        _14812 = (_7733 * (-_8150)) + (_7741 * _8143);
                                                        _14794 = (_7757 * (-_8157)) + (_7749 * _8164);
                                                        _14776 = _7757;
                                                        _14758 = _12914;
                                                        _14734 = _7733;
                                                        _14718 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _14719;
                                                        float3 _14735;
                                                        float3 _14759;
                                                        float3 _14777;
                                                        float3 _14795;
                                                        float3 _14813;
                                                        if (_14698 == 10)
                                                        {
                                                            _14813 = _7741;
                                                            _14795 = _7749;
                                                            _14777 = _7757;
                                                            _14759 = _12914;
                                                            _14735 = _7733;
                                                            _14719 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _14720;
                                                            float3 _14736;
                                                            float3 _14760;
                                                            float3 _14778;
                                                            float3 _14796;
                                                            float3 _14814;
                                                            if (_14698 == 11)
                                                            {
                                                                float _8433 = -_8157;
                                                                _14814 = _7741;
                                                                _14796 = (_7741 * _8433) + (_7749 * _8150);
                                                                _14778 = (_7757 * _8433) + (_7749 * _8164);
                                                                _14760 = _7757;
                                                                _14736 = _7733;
                                                                _14720 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _14721;
                                                                float3 _14737;
                                                                float3 _14761;
                                                                float3 _14779;
                                                                float3 _14797;
                                                                float3 _14815;
                                                                if (_14698 == 12)
                                                                {
                                                                    _14815 = (_7749 * (-_8150)) + (_7741 * _8157);
                                                                    _14797 = _7749;
                                                                    _14779 = _7757;
                                                                    _14761 = _12914;
                                                                    _14737 = (_7757 * (-_8143)) + (_7733 * _8164);
                                                                    _14721 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _8489 = _14698 == 13;
                                                                    int _14722;
                                                                    float3 _14738;
                                                                    float3 _14762;
                                                                    float3 _14798;
                                                                    float3 _14816;
                                                                    if (_8489)
                                                                    {
                                                                        float _8499 = -_8150;
                                                                        _14816 = (_7733 * _8499) + (_7741 * _8143);
                                                                        _14798 = (_7749 * _8499) + (_7741 * _8157);
                                                                        _14762 = _7757;
                                                                        _14738 = _7733;
                                                                        _14722 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _14723;
                                                                        float3 _14739;
                                                                        float3 _14763;
                                                                        if (_14698 == 14)
                                                                        {
                                                                            float _8529 = -_8143;
                                                                            _14763 = (_7757 * _8529) + (_7733 * _8164);
                                                                            _14739 = (_7741 * _8529) + (_7733 * _8150);
                                                                            _14723 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _14763 = _12914;
                                                                            _14739 = _7733;
                                                                            _14723 = (_14698 == 15) ? 4 : 0;
                                                                        }
                                                                        _14816 = _7741;
                                                                        _14798 = _7749;
                                                                        _14762 = _14763;
                                                                        _14738 = _14739;
                                                                        _14722 = _14723;
                                                                    }
                                                                    bool3 _16004 = _8489.xxx;
                                                                    _14815 = _14816;
                                                                    _14797 = _14798;
                                                                    _14779 = float3(_16004.x ? _7749.x : _7757.x, _16004.y ? _7749.y : _7757.y, _16004.z ? _7749.z : _7757.z);
                                                                    _14761 = _14762;
                                                                    _14737 = _14738;
                                                                    _14721 = _14722;
                                                                }
                                                                _14814 = _14815;
                                                                _14796 = _14797;
                                                                _14778 = _14779;
                                                                _14760 = _14761;
                                                                _14736 = _14737;
                                                                _14720 = _14721;
                                                            }
                                                            _14813 = _14814;
                                                            _14795 = _14796;
                                                            _14777 = _14778;
                                                            _14759 = _14760;
                                                            _14735 = _14736;
                                                            _14719 = _14720;
                                                        }
                                                        _14812 = _14813;
                                                        _14794 = _14795;
                                                        _14776 = _14777;
                                                        _14758 = _14759;
                                                        _14734 = _14735;
                                                        _14718 = _14719;
                                                    }
                                                    _14811 = _14812;
                                                    _14793 = _14794;
                                                    _14775 = _14776;
                                                    _14757 = _14758;
                                                    _14733 = _14734;
                                                    _14717 = _14718;
                                                }
                                                _14810 = _14811;
                                                _14792 = _14793;
                                                _14774 = _14775;
                                                _14756 = _14757;
                                                _14732 = _14733;
                                                _14716 = _14717;
                                            }
                                            _14809 = _14810;
                                            _14791 = _14792;
                                            _14773 = _14774;
                                            _14755 = _14756;
                                            _14731 = _14732;
                                            _14715 = _14716;
                                        }
                                        _14808 = _14809;
                                        _14790 = _14791;
                                        _14772 = _14773;
                                        _14754 = _14755;
                                        _14730 = _14731;
                                        _14714 = _14715;
                                    }
                                    _14807 = _14808;
                                    _14789 = _14790;
                                    _14771 = _14772;
                                    _14753 = _14754;
                                    _14729 = _14730;
                                    _14713 = _14714;
                                }
                                _14806 = _14807;
                                _14788 = _14789;
                                _14770 = _14771;
                                _14752 = _14753;
                                _14728 = _14729;
                                _14712 = _14713;
                            }
                            _14805 = _14806;
                            _14787 = _14788;
                            _14769 = _14770;
                            _14751 = _14752;
                            _14727 = _14728;
                            _14711 = _14712;
                        }
                        _14804 = _14805;
                        _14786 = _14787;
                        _14768 = _14769;
                        _14750 = _14751;
                        _14726 = _14727;
                        _14710 = _14711;
                    }
                    _14803 = _14804;
                    _14785 = _14786;
                    _14767 = _14768;
                    _14745 = _14750;
                    _14725 = _14726;
                    _14709 = _14710;
                }
                bool3 _16006 = (_14709 == 3).xxx;
                bool3 _16008 = (_14709 == 4).xxx;
                if (_14709 == 0)
                {
                    _14898 = 0.0f.xxx;
                    break;
                }
                float3 _7769 = normalize(_14725);
                float3 _7773 = normalize(_14803);
                float3 _7777 = normalize(_14785);
                float3 _7781 = normalize(float3(_16006.x ? _14725.x : _14767.x, _16006.y ? _14725.y : _14767.y, _16006.z ? _14725.z : _14767.z));
                float3 _7785 = normalize(float3(_16008.x ? _14725.x : _14745.x, _16008.y ? _14725.y : _14745.y, _16008.z ? _14725.z : _14745.z));
                float _8606 = dot(_7769, _7773);
                float _8608 = abs(_8606);
                float _8622 = mad(mad(0.01452060043811798095703125f, _8608, 0.4965155124664306640625f), _8608, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8608, _8608, 3.41759395599365234375f);
                float _14821;
                if (_8606 > 0.0f)
                {
                    _14821 = _8622;
                }
                else
                {
                    _14821 = mad(0.5f, rsqrt(max(mad(-_8606, _8606, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8622);
                }
                float _8663 = dot(_7773, _7777);
                float _8665 = abs(_8663);
                float _8679 = mad(mad(0.01452060043811798095703125f, _8665, 0.4965155124664306640625f), _8665, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8665, _8665, 3.41759395599365234375f);
                float _14825;
                if (_8663 > 0.0f)
                {
                    _14825 = _8679;
                }
                else
                {
                    _14825 = mad(0.5f, rsqrt(max(mad(-_8663, _8663, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8679);
                }
                float _8720 = dot(_7777, _7781);
                float _8722 = abs(_8720);
                float _8736 = mad(mad(0.01452060043811798095703125f, _8722, 0.4965155124664306640625f), _8722, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8722, _8722, 3.41759395599365234375f);
                float _14830;
                if (_8720 > 0.0f)
                {
                    _14830 = _8736;
                }
                else
                {
                    _14830 = mad(0.5f, rsqrt(max(mad(-_8720, _8720, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8736);
                }
                float _7807 = ((cross(_7769, _7773) * _14821).z + (cross(_7773, _7777) * _14825).z) + (cross(_7777, _7781) * _14830).z;
                float _14847;
                if (_14709 >= 4)
                {
                    float _8777 = dot(_7781, _7785);
                    float _8779 = abs(_8777);
                    float _8793 = mad(mad(0.01452060043811798095703125f, _8779, 0.4965155124664306640625f), _8779, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8779, _8779, 3.41759395599365234375f);
                    float _14836;
                    if (_8777 > 0.0f)
                    {
                        _14836 = _8793;
                    }
                    else
                    {
                        _14836 = mad(0.5f, rsqrt(max(mad(-_8777, _8777, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8793);
                    }
                    _14847 = _7807 + (cross(_7781, _7785) * _14836).z;
                }
                else
                {
                    _14847 = _7807;
                }
                float _14848;
                if (_14709 == 5)
                {
                    float _8834 = dot(_7785, _7769);
                    float _8836 = abs(_8834);
                    float _8850 = mad(mad(0.01452060043811798095703125f, _8836, 0.4965155124664306640625f), _8836, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8836, _8836, 3.41759395599365234375f);
                    float _14845;
                    if (_8834 > 0.0f)
                    {
                        _14845 = _8850;
                    }
                    else
                    {
                        _14845 = mad(0.5f, rsqrt(max(mad(-_8834, _8834, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8850);
                    }
                    _14848 = _14847 + (cross(_7785, _7769) * _14845).z;
                }
                else
                {
                    _14848 = _14847;
                }
                if (u_AreaLightsTwoSide[0] > 0.5f)
                {
                    _14898 = abs(_14848).xxx;
                    break;
                }
                _14898 = max(0.0f, _14848).xxx;
                break;
            }
        } while(false);
        float2 _8894 = clamp((float2(_3745, sqrt(1.0f - _3770)) * 0.984375f) + 0.0078125f.xx, 0.0f.xx, 1.0f.xx);
        float4 _8954 = u_ltc_mat.Sample(_u_ltc_mat_sampler, _8894);
        float4 _8958 = (_8954 - 0.5f.xxxx) * 4.0f;
        float3x3 _8981 = float3x3(float3(_8958.x, 0.0f, _8958.y), float3(0.0f, 1.0f, 0.0f), float3(_8958.z, 0.0f, _8958.w));
        float4 _8987 = u_ltc_mag.Sample(_u_ltc_mag_sampler, _8894);
        float3 _15212;
        do
        {
            if (_7341)
            {
                float3x3 _9089 = transpose(float3x3(_7334, _7338, _12912));
                float3 _9096 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _9089);
                float3 _9104 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _9089);
                float3 _9112 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _9089);
                float3 _9134 = mul((_9096 + _9112) * 0.5f, _8981);
                float3 _9137 = mul((_9104 - _9112) * 0.5f, _8981);
                float3 _9140 = mul((_9104 - _9096) * 0.5f, _8981);
                if (u_AreaLightsTwoSide[0] < 0.5f)
                {
                    if (dot(cross(_9137, _9140), _9134) < 0.0f)
                    {
                        _15212 = 0.0f.xxx;
                        break;
                    }
                }
                float _9156 = dot(_9137, _9137);
                float _9159 = dot(_9140, _9140);
                float _9162 = dot(_9137, _9140);
                float _9167 = _9156 * _9159;
                float3 _15167;
                float3 _15168;
                float _15173;
                float _15175;
                if ((abs(_9162) / sqrt(_9167)) > 9.9999997473787516355514526367188e-05f)
                {
                    float _9174 = _9156 + _9159;
                    float _9184 = sqrt(mad(-_9162, _9162, _9167));
                    float _9189 = sqrt(mad(-2.0f, _9184, _9174));
                    float _9195 = sqrt(mad(2.0f, _9184, _9174));
                    float _9199 = mad(0.5f, _9189, 0.5f * _9195);
                    float _9203 = mad(0.5f, _9189, _9195 * (-0.5f));
                    float3 _15165;
                    float3 _15166;
                    if (_9156 > _9159)
                    {
                        float3 _9211 = _9137 * _9162;
                        float _15987 = -_9156;
                        _15166 = _9211 + (_9140 * mad(_9203, _9203, _15987));
                        _15165 = _9211 + (_9140 * mad(_9199, _9199, _15987));
                    }
                    else
                    {
                        float3 _9230 = _9140 * _9162;
                        float _15985 = -_9159;
                        _15166 = _9230 + (_9137 * mad(_9203, _9203, _15985));
                        _15165 = _9230 + (_9137 * mad(_9199, _9199, _15985));
                    }
                    _15175 = 1.0f / (_9203 * _9203);
                    _15173 = 1.0f / (_9199 * _9199);
                    _15168 = normalize(_15166);
                    _15167 = normalize(_15165);
                }
                else
                {
                    float _9259 = 1.0f / _9156;
                    float _9263 = 1.0f / _9159;
                    _15175 = _9263;
                    _15173 = _9259;
                    _15168 = _9140 * sqrt(_9263);
                    _15167 = _9137 * sqrt(_9259);
                }
                float3 _9275 = cross(_15167, _15168);
                float3 _15169;
                if (dot(_9134, _9275) < 0.0f)
                {
                    _15169 = _9275 * (-1.0f);
                }
                else
                {
                    _15169 = _9275;
                }
                float _9286 = dot(_15169, _9134);
                float _9291 = dot(_15167, _9134) / _9286;
                float _9296 = dot(_15168, _9134) / _9286;
                float _9303 = _9286 * _9286;
                float _9305 = _15173 * _9303;
                float _9310 = _15175 * _9303;
                float _9313 = _9305 * _9310;
                float _9320 = mad(_9291, _9291, 1.0f);
                float _15989 = -_9305;
                float4 _12804 = _16000;
                _12804.x = _9313;
                float4 _12806 = _12804;
                _12806.y = mad(-_15175, _9303, mad(_9313, mad(_9296, _9296, _9320), _15989));
                float4 _12808 = _12806;
                _12808.z = mad(-_9310, mad(_9296, _9296, 1.0f), mad(_15989, _9320, 1.0f));
                float2 _9627 = _12808.yz * 0.3333333432674407958984375f.xx;
                float _9629 = _9627.x;
                float4 _12810 = _12808;
                _12810.y = _9629;
                float _9631 = _9627.y;
                float _9642 = -_9631;
                float _9648 = mad(_9642, _9631, _9629);
                float _9651 = -_9629;
                float _9657 = mad(_9651, _9631, _9313);
                float _9666 = dot(float2(_9631, _9651), _12810.xy);
                float _9689 = sqrt(dot(float2(4.0f * _9648, -_9657), float3(_9648, _9657, _9666).zy));
                float _9692 = atan2(_9689, -mad((-2.0f) * _9631, _9648, _9657));
                float _9697 = 2.0f * sqrt(-_9648);
                float _9699 = cos(_9692 * 0.3333333432674407958984375f);
                float _9708 = _9697 * cos(mad(_9692, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _9722 = ((mad(_9697, _9699, _9708) > (2.0f * _9631)) ? (_9697 * _9699) : _9708) - _9631;
                float _9729 = -_9313;
                float _9734 = 2.0f * _9629;
                float _9745 = atan2(_9313 * _9689, -mad(_9729, _9657, _9734 * _9666));
                float _9750 = 2.0f * sqrt(-_9666);
                float _9752 = cos(_9745 * 0.3333333432674407958984375f);
                float _9761 = _9750 * cos(mad(_9745, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _9777 = ((mad(_9750, _9752, _9761) < _9734) ? (_9750 * _9752) : _9761) + _9629;
                float _9795 = mad(-_9722, _9777, _9313);
                float _9821 = _9729 / _9777;
                float _9826 = mad(_9629, _9795, -(_9631 * (_9722 * _9729))) / mad(_9642, _9795, _9629 * _9777);
                float3 _9832 = float3(_9821, _9826, _9722);
                bool _9837 = _9821 < _9826;
                bool _9845;
                if (_9837)
                {
                    _9845 = _9821 < _9722;
                }
                else
                {
                    _9845 = _9837;
                }
                float3 _15180;
                if (_9845)
                {
                    _15180 = _9832.yxz;
                }
                else
                {
                    bool _9854 = _9722 < _9821;
                    bool _9862;
                    if (_9854)
                    {
                        _9862 = _9722 < _9826;
                    }
                    else
                    {
                        _9862 = _9854;
                    }
                    float3 _15181;
                    if (_9862)
                    {
                        _15181 = _9832.xzy;
                    }
                    else
                    {
                        _15181 = _9832;
                    }
                    _15180 = _15181;
                }
                float _15995 = -_15180.y;
                float _9396 = sqrt(_15995 / _15180.z);
                float _9401 = sqrt(_15995 / _15180.x);
                float _9415 = (_9396 * _9401) * rsqrt(mad(_9396, _9396, 1.0f) * mad(_9401, _9401, 1.0f));
                _15212 = (_9415 * u_ltc_mag.Sample(_u_ltc_mag_sampler, (float2(mad(normalize(mul(float3((_9305 * _9291) / mad(_15173, _9303, _15995), (_9310 * _9296) / mad(_15175, _9303, _15995), 1.0f), float3x3(_15167, _15168, _15169))).z, 0.5f, 0.5f), _9415) * 0.984375f) + 0.0078125f.xx).w).xxx;
                break;
            }
            else
            {
                float3x3 _9455 = mul(transpose(float3x3(_7334, _7338, _12912)), _8981);
                float3 _9462 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _9455);
                float3 _9470 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _9455);
                float3 _9478 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _9455);
                float3 _9486 = mul(u_AreaLightsPoint3[0].xyz - v_posWS, _9455);
                float _9872 = _9462.z;
                int _16012 = int(_9872 > 0.0f);
                float _9879 = _9470.z;
                int _15007;
                if (_9879 > 0.0f)
                {
                    _15007 = _16012 + 2;
                }
                else
                {
                    _15007 = _16012;
                }
                float _9886 = _9478.z;
                int _15011;
                if (_9886 > 0.0f)
                {
                    _15011 = _15007 + 4;
                }
                else
                {
                    _15011 = _15007;
                }
                float _9893 = _9486.z;
                int _15012;
                if (_9893 > 0.0f)
                {
                    _15012 = _15011 + 8;
                }
                else
                {
                    _15012 = _15011;
                }
                int _15023;
                float3 _15039;
                float3 _15059;
                float3 _15081;
                float3 _15099;
                float3 _15117;
                if (_15012 == 0)
                {
                    _15117 = _9470;
                    _15099 = _9478;
                    _15081 = _9486;
                    _15059 = _12914;
                    _15039 = _9462;
                    _15023 = 0;
                }
                else
                {
                    int _15024;
                    float3 _15040;
                    float3 _15064;
                    float3 _15082;
                    float3 _15100;
                    float3 _15118;
                    if (_15012 == 1)
                    {
                        _15118 = (_9462 * (-_9879)) + (_9470 * _9872);
                        _15100 = (_9462 * (-_9893)) + (_9486 * _9872);
                        _15082 = _9486;
                        _15064 = _12914;
                        _15040 = _9462;
                        _15024 = 3;
                    }
                    else
                    {
                        int _15025;
                        float3 _15041;
                        float3 _15065;
                        float3 _15083;
                        float3 _15101;
                        float3 _15119;
                        if (_15012 == 2)
                        {
                            _15119 = _9470;
                            _15101 = (_9470 * (-_9886)) + (_9478 * _9879);
                            _15083 = _9486;
                            _15065 = _12914;
                            _15041 = (_9470 * (-_9872)) + (_9462 * _9879);
                            _15025 = 3;
                        }
                        else
                        {
                            int _15026;
                            float3 _15042;
                            float3 _15066;
                            float3 _15084;
                            float3 _15102;
                            float3 _15120;
                            if (_15012 == 3)
                            {
                                _15120 = _9470;
                                _15102 = (_9470 * (-_9886)) + (_9478 * _9879);
                                _15084 = (_9462 * (-_9893)) + (_9486 * _9872);
                                _15066 = _12914;
                                _15042 = _9462;
                                _15026 = 4;
                            }
                            else
                            {
                                int _15027;
                                float3 _15043;
                                float3 _15067;
                                float3 _15085;
                                float3 _15103;
                                float3 _15121;
                                if (_15012 == 4)
                                {
                                    _15121 = (_9478 * (-_9879)) + (_9470 * _9886);
                                    _15103 = _9478;
                                    _15085 = _9486;
                                    _15067 = _12914;
                                    _15043 = (_9478 * (-_9893)) + (_9486 * _9886);
                                    _15027 = 3;
                                }
                                else
                                {
                                    int _15028;
                                    float3 _15044;
                                    float3 _15068;
                                    float3 _15086;
                                    float3 _15104;
                                    float3 _15122;
                                    if (_15012 == 5)
                                    {
                                        _15122 = _9470;
                                        _15104 = _9478;
                                        _15086 = _9486;
                                        _15068 = _12914;
                                        _15044 = _9462;
                                        _15028 = 0;
                                    }
                                    else
                                    {
                                        int _15029;
                                        float3 _15045;
                                        float3 _15069;
                                        float3 _15087;
                                        float3 _15105;
                                        float3 _15123;
                                        if (_15012 == 6)
                                        {
                                            _15123 = _9470;
                                            _15105 = _9478;
                                            _15087 = (_9478 * (-_9893)) + (_9486 * _9886);
                                            _15069 = _12914;
                                            _15045 = (_9470 * (-_9872)) + (_9462 * _9879);
                                            _15029 = 4;
                                        }
                                        else
                                        {
                                            int _15030;
                                            float3 _15046;
                                            float3 _15070;
                                            float3 _15088;
                                            float3 _15106;
                                            float3 _15124;
                                            if (_15012 == 7)
                                            {
                                                float _10062 = -_9893;
                                                _15124 = _9470;
                                                _15106 = _9478;
                                                _15088 = (_9478 * _10062) + (_9486 * _9886);
                                                _15070 = (_9462 * _10062) + (_9486 * _9872);
                                                _15046 = _9462;
                                                _15030 = 5;
                                            }
                                            else
                                            {
                                                int _15031;
                                                float3 _15047;
                                                float3 _15071;
                                                float3 _15089;
                                                float3 _15107;
                                                float3 _15125;
                                                if (_15012 == 8)
                                                {
                                                    _15125 = (_9486 * (-_9886)) + (_9478 * _9893);
                                                    _15107 = _9486;
                                                    _15089 = _9486;
                                                    _15071 = _12914;
                                                    _15047 = (_9486 * (-_9872)) + (_9462 * _9893);
                                                    _15031 = 3;
                                                }
                                                else
                                                {
                                                    int _15032;
                                                    float3 _15048;
                                                    float3 _15072;
                                                    float3 _15090;
                                                    float3 _15108;
                                                    float3 _15126;
                                                    if (_15012 == 9)
                                                    {
                                                        _15126 = (_9462 * (-_9879)) + (_9470 * _9872);
                                                        _15108 = (_9486 * (-_9886)) + (_9478 * _9893);
                                                        _15090 = _9486;
                                                        _15072 = _12914;
                                                        _15048 = _9462;
                                                        _15032 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _15033;
                                                        float3 _15049;
                                                        float3 _15073;
                                                        float3 _15091;
                                                        float3 _15109;
                                                        float3 _15127;
                                                        if (_15012 == 10)
                                                        {
                                                            _15127 = _9470;
                                                            _15109 = _9478;
                                                            _15091 = _9486;
                                                            _15073 = _12914;
                                                            _15049 = _9462;
                                                            _15033 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _15034;
                                                            float3 _15050;
                                                            float3 _15074;
                                                            float3 _15092;
                                                            float3 _15110;
                                                            float3 _15128;
                                                            if (_15012 == 11)
                                                            {
                                                                float _10162 = -_9886;
                                                                _15128 = _9470;
                                                                _15110 = (_9470 * _10162) + (_9478 * _9879);
                                                                _15092 = (_9486 * _10162) + (_9478 * _9893);
                                                                _15074 = _9486;
                                                                _15050 = _9462;
                                                                _15034 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _15035;
                                                                float3 _15051;
                                                                float3 _15075;
                                                                float3 _15093;
                                                                float3 _15111;
                                                                float3 _15129;
                                                                if (_15012 == 12)
                                                                {
                                                                    _15129 = (_9478 * (-_9879)) + (_9470 * _9886);
                                                                    _15111 = _9478;
                                                                    _15093 = _9486;
                                                                    _15075 = _12914;
                                                                    _15051 = (_9486 * (-_9872)) + (_9462 * _9893);
                                                                    _15035 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _10218 = _15012 == 13;
                                                                    int _15036;
                                                                    float3 _15052;
                                                                    float3 _15076;
                                                                    float3 _15112;
                                                                    float3 _15130;
                                                                    if (_10218)
                                                                    {
                                                                        float _10228 = -_9879;
                                                                        _15130 = (_9462 * _10228) + (_9470 * _9872);
                                                                        _15112 = (_9478 * _10228) + (_9470 * _9886);
                                                                        _15076 = _9486;
                                                                        _15052 = _9462;
                                                                        _15036 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _15037;
                                                                        float3 _15053;
                                                                        float3 _15077;
                                                                        if (_15012 == 14)
                                                                        {
                                                                            float _10258 = -_9872;
                                                                            _15077 = (_9486 * _10258) + (_9462 * _9893);
                                                                            _15053 = (_9470 * _10258) + (_9462 * _9879);
                                                                            _15037 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _15077 = _12914;
                                                                            _15053 = _9462;
                                                                            _15037 = (_15012 == 15) ? 4 : 0;
                                                                        }
                                                                        _15130 = _9470;
                                                                        _15112 = _9478;
                                                                        _15076 = _15077;
                                                                        _15052 = _15053;
                                                                        _15036 = _15037;
                                                                    }
                                                                    bool3 _16014 = _10218.xxx;
                                                                    _15129 = _15130;
                                                                    _15111 = _15112;
                                                                    _15093 = float3(_16014.x ? _9478.x : _9486.x, _16014.y ? _9478.y : _9486.y, _16014.z ? _9478.z : _9486.z);
                                                                    _15075 = _15076;
                                                                    _15051 = _15052;
                                                                    _15035 = _15036;
                                                                }
                                                                _15128 = _15129;
                                                                _15110 = _15111;
                                                                _15092 = _15093;
                                                                _15074 = _15075;
                                                                _15050 = _15051;
                                                                _15034 = _15035;
                                                            }
                                                            _15127 = _15128;
                                                            _15109 = _15110;
                                                            _15091 = _15092;
                                                            _15073 = _15074;
                                                            _15049 = _15050;
                                                            _15033 = _15034;
                                                        }
                                                        _15126 = _15127;
                                                        _15108 = _15109;
                                                        _15090 = _15091;
                                                        _15072 = _15073;
                                                        _15048 = _15049;
                                                        _15032 = _15033;
                                                    }
                                                    _15125 = _15126;
                                                    _15107 = _15108;
                                                    _15089 = _15090;
                                                    _15071 = _15072;
                                                    _15047 = _15048;
                                                    _15031 = _15032;
                                                }
                                                _15124 = _15125;
                                                _15106 = _15107;
                                                _15088 = _15089;
                                                _15070 = _15071;
                                                _15046 = _15047;
                                                _15030 = _15031;
                                            }
                                            _15123 = _15124;
                                            _15105 = _15106;
                                            _15087 = _15088;
                                            _15069 = _15070;
                                            _15045 = _15046;
                                            _15029 = _15030;
                                        }
                                        _15122 = _15123;
                                        _15104 = _15105;
                                        _15086 = _15087;
                                        _15068 = _15069;
                                        _15044 = _15045;
                                        _15028 = _15029;
                                    }
                                    _15121 = _15122;
                                    _15103 = _15104;
                                    _15085 = _15086;
                                    _15067 = _15068;
                                    _15043 = _15044;
                                    _15027 = _15028;
                                }
                                _15120 = _15121;
                                _15102 = _15103;
                                _15084 = _15085;
                                _15066 = _15067;
                                _15042 = _15043;
                                _15026 = _15027;
                            }
                            _15119 = _15120;
                            _15101 = _15102;
                            _15083 = _15084;
                            _15065 = _15066;
                            _15041 = _15042;
                            _15025 = _15026;
                        }
                        _15118 = _15119;
                        _15100 = _15101;
                        _15082 = _15083;
                        _15064 = _15065;
                        _15040 = _15041;
                        _15024 = _15025;
                    }
                    _15117 = _15118;
                    _15099 = _15100;
                    _15081 = _15082;
                    _15059 = _15064;
                    _15039 = _15040;
                    _15023 = _15024;
                }
                bool3 _16016 = (_15023 == 3).xxx;
                bool3 _16018 = (_15023 == 4).xxx;
                if (_15023 == 0)
                {
                    _15212 = 0.0f.xxx;
                    break;
                }
                float3 _9498 = normalize(_15039);
                float3 _9502 = normalize(_15117);
                float3 _9506 = normalize(_15099);
                float3 _9510 = normalize(float3(_16016.x ? _15039.x : _15081.x, _16016.y ? _15039.y : _15081.y, _16016.z ? _15039.z : _15081.z));
                float3 _9514 = normalize(float3(_16018.x ? _15039.x : _15059.x, _16018.y ? _15039.y : _15059.y, _16018.z ? _15039.z : _15059.z));
                float _10335 = dot(_9498, _9502);
                float _10337 = abs(_10335);
                float _10351 = mad(mad(0.01452060043811798095703125f, _10337, 0.4965155124664306640625f), _10337, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10337, _10337, 3.41759395599365234375f);
                float _15135;
                if (_10335 > 0.0f)
                {
                    _15135 = _10351;
                }
                else
                {
                    _15135 = mad(0.5f, rsqrt(max(mad(-_10335, _10335, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10351);
                }
                float _10392 = dot(_9502, _9506);
                float _10394 = abs(_10392);
                float _10408 = mad(mad(0.01452060043811798095703125f, _10394, 0.4965155124664306640625f), _10394, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10394, _10394, 3.41759395599365234375f);
                float _15139;
                if (_10392 > 0.0f)
                {
                    _15139 = _10408;
                }
                else
                {
                    _15139 = mad(0.5f, rsqrt(max(mad(-_10392, _10392, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10408);
                }
                float _10449 = dot(_9506, _9510);
                float _10451 = abs(_10449);
                float _10465 = mad(mad(0.01452060043811798095703125f, _10451, 0.4965155124664306640625f), _10451, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10451, _10451, 3.41759395599365234375f);
                float _15144;
                if (_10449 > 0.0f)
                {
                    _15144 = _10465;
                }
                else
                {
                    _15144 = mad(0.5f, rsqrt(max(mad(-_10449, _10449, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10465);
                }
                float _9536 = ((cross(_9498, _9502) * _15135).z + (cross(_9502, _9506) * _15139).z) + (cross(_9506, _9510) * _15144).z;
                float _15161;
                if (_15023 >= 4)
                {
                    float _10506 = dot(_9510, _9514);
                    float _10508 = abs(_10506);
                    float _10522 = mad(mad(0.01452060043811798095703125f, _10508, 0.4965155124664306640625f), _10508, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10508, _10508, 3.41759395599365234375f);
                    float _15150;
                    if (_10506 > 0.0f)
                    {
                        _15150 = _10522;
                    }
                    else
                    {
                        _15150 = mad(0.5f, rsqrt(max(mad(-_10506, _10506, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10522);
                    }
                    _15161 = _9536 + (cross(_9510, _9514) * _15150).z;
                }
                else
                {
                    _15161 = _9536;
                }
                float _15162;
                if (_15023 == 5)
                {
                    float _10563 = dot(_9514, _9498);
                    float _10565 = abs(_10563);
                    float _10579 = mad(mad(0.01452060043811798095703125f, _10565, 0.4965155124664306640625f), _10565, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10565, _10565, 3.41759395599365234375f);
                    float _15159;
                    if (_10563 > 0.0f)
                    {
                        _15159 = _10579;
                    }
                    else
                    {
                        _15159 = mad(0.5f, rsqrt(max(mad(-_10563, _10563, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10579);
                    }
                    _15162 = _15161 + (cross(_9514, _9498) * _15159).z;
                }
                else
                {
                    _15162 = _15161;
                }
                if (u_AreaLightsTwoSide[0] > 0.5f)
                {
                    _15212 = abs(_15162).xxx;
                    break;
                }
                _15212 = max(0.0f, _15162).xxx;
                break;
            }
        } while(false);
        _15346 = _14544 + (((u_AreaLightsColor[0].xyz * _7174) * (((_3788 * _8987.x) + ((1.0f.xxx - _3788) * _8987.y)) * _15212)) * 1.0f);
        _15305 = _14543 + ((((_3759 * u_AreaLightsColor[0].xyz) * _7174) * _14898) * 1.0f);
    }
    else
    {
        _15346 = _14544;
        _15305 = _14543;
    }
    float _10623 = (u_AreaLightsIntensity[1] * u_AreaLightsEnabled[1]) * 3.1415920257568359375f;
    float3 _15872;
    float3 _15873;
    if (u_AreaLightsEnabled[1] > 0.5f)
    {
        float _10776 = 1.0f - max(0.0f, _12995);
        float _10790 = _10776 * _10776;
        float _10808 = mad(mad(_12995, _3835, -_12995), _12995, 1.0f);
        _15873 = _15346 + (((((_3788 + ((1.0f.xxx - _3788) * ((_10790 * _10790) * _10776))) * (((_3835 * 0.31830990314483642578125f) / mad(_10808, _10808, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _12995) * u_AreaLightsColor[1].xyz) * _10623);
        _15872 = _15305 + (((_3759 * u_AreaLightsColor[1].xyz) * _10623) * (_12995 * 0.31830990314483642578125f));
    }
    else
    {
        _15873 = _15346;
        _15872 = _15305;
    }
    o_fragColor = float4(pow(max(_15872 + _15873, 9.9999997473787516355514526367188e-06f.xxx), 0.4545454680919647216796875f.xxx), _3726);
}

SPIRV_Cross_Output main(SPIRV_Cross_Input stage_input)
{
    v_nDirWS = stage_input.v_nDirWS;
    v_posWS = stage_input.v_posWS;
    v_uv0 = stage_input.v_uv0;
    frag_main();
    SPIRV_Cross_Output stage_output;
    stage_output.o_fragColor = o_fragColor;
    return stage_output;
}
