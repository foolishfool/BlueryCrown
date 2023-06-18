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

static float3 _12900;
static float _12981;
static float4 _15986;

void frag_main()
{
    float3 _3682 = normalize(v_nDirWS);
    float3 _3687 = normalize(u_WorldSpaceCameraPos.xyz - v_posWS);
    float3 _12898;
    if (dot(_3687, _3682) < (-0.0500000007450580596923828125f))
    {
        _12898 = -_3682;
    }
    else
    {
        _12898 = _3682;
    }
    float4 _3710 = _AlbedoTexture.Sample(__AlbedoTexture_sampler, v_uv0);
    float3 _3715 = pow(max(_AlbedoColor.xyz, 9.9999997473787516355514526367188e-06f.xxx), 2.2000000476837158203125f.xxx) * pow(max(_3710.xyz, 9.9999997473787516355514526367188e-06f.xxx), 2.2000000476837158203125f.xxx);
    float _3811 = clamp(_Metallic, 0.0f, 1.0f);
    float _3732 = clamp(_Roughness, 0.0f, 1.0f);
    float _3816 = _3732 * _3732;
    float _3821 = _3816 * _3816;
    float3 _3746 = _3715 * (1.0f - _3811);
    float _3757 = max(0.0f, dot(_12898, _3687));
    float3 _3775 = lerp(0.0400000028312206268310546875f.xxx, _3715, _3811.xxx);
    float3 _4108 = normalize(_12898);
    float _4111 = -_4108.z;
    float _4113 = _4108.x;
    float _4152 = clamp(_4111 / length(float2(_4113, _4111)), -1.0f, 1.0f);
    float _4161 = abs(_4152);
    float _4164 = mad(-0.15658299624919891357421875f, _4161, 1.57079601287841796875f);
    float _4167 = sqrt(1.0f - _4161);
    float _12901;
    if (_4152 >= 0.0f)
    {
        _12901 = _4164 * _4167;
    }
    else
    {
        _12901 = mad(-_4164, _4167, 3.1415927410125732421875f);
    }
    float _4120 = acos(_4108.y);
    float _4126 = mad(mad((_4113 < 0.0f) ? (-1.0f) : 1.0f, _12901, -1.57079637050628662109375f), 0.15915493667125701904296875f, _EnvRot);
    float _4135 = frac((_4126 + floor(_4126)) + 1.0f);
    float _4188 = floor(7.0f);
    float2 _12905;
    float2 _12912;
    if (abs(_4188) < 0.001000000047497451305389404296875f)
    {
        _12912 = float2(mad(_4135, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4120, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f));
        _12905 = float2(mad(_4135, 0.998046875f, 0.0009765625f), mad(_4120, 0.3170664608478546142578125f, 0.001953125f) * 0.5f);
    }
    else
    {
        float2 _12906;
        float2 _12913;
        if (abs(_4188 - 1.0f) < 0.001000000047497451305389404296875f)
        {
            float _4241 = mad(_4135, 0.99609375f, 0.001953125f);
            float _4251 = mad(mad(_4120, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f);
            _12913 = float2(mad(_4241, 0.5f, 0.5f), _4251);
            _12906 = float2(_4241 * 0.5f, _4251);
        }
        else
        {
            float2 _12907;
            float2 _12914;
            if (abs(_4188 - 2.0f) < 0.001000000047497451305389404296875f)
            {
                float _4279 = mad(_4135, 0.99609375f, 0.001953125f);
                float _4287 = mad(_4120, 0.315823078155517578125f, 0.00390625f);
                _12914 = float2(_4279 * 0.5f, mad(_4287, 0.25f, 0.75f));
                _12907 = float2(mad(_4279, 0.5f, 0.5f), mad(_4287, 0.25f, 0.5f));
            }
            else
            {
                float2 _12908;
                float2 _12915;
                if (abs(_4188 - 3.0f) < 0.001000000047497451305389404296875f)
                {
                    _12915 = float2(mad(mad(_4135, 0.9921875f, 0.00390625f), 0.25f, 0.5f), mad(mad(_4120, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f));
                    _12908 = float2(mad(_4135, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4120, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.75f));
                }
                else
                {
                    float2 _12909;
                    float2 _12916;
                    if (abs(_4188 - 4.0f) < 0.001000000047497451305389404296875f)
                    {
                        float _4355 = mad(_4135, 0.9921875f, 0.00390625f);
                        float _4365 = mad(mad(_4120, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f);
                        _12916 = float2(mad(_4355, 0.25f, 0.75f), _4365);
                        _12909 = float2(mad(_4355, 0.25f, 0.5f), _4365);
                    }
                    else
                    {
                        float2 _12910;
                        float2 _12917;
                        if (abs(_4188 - 5.0f) < 0.001000000047497451305389404296875f)
                        {
                            float _4393 = mad(_4135, 0.9921875f, 0.00390625f);
                            float _4401 = mad(_4120, 0.3133362829685211181640625f, 0.0078125f);
                            _12917 = float2(mad(_4393, 0.25f, 0.5f), mad(_4401, 0.125f, 0.875f));
                            _12910 = float2(mad(_4393, 0.25f, 0.75f), mad(_4401, 0.125f, 0.75f));
                        }
                        else
                        {
                            float2 _12911;
                            float2 _12918;
                            if (abs(_4188 - 6.0f) < 0.001000000047497451305389404296875f)
                            {
                                float _4431 = mad(_4135, 0.9921875f, 0.00390625f);
                                float _4441 = mad(mad(_4120, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f);
                                _12918 = float2(mad(_4431, 0.25f, 0.75f), _4441);
                                _12911 = float2(mad(_4431, 0.25f, 0.5f), _4441);
                            }
                            else
                            {
                                float2 _15882 = float2(mad(mad(_4135, 0.9921875f, 0.00390625f), 0.25f, 0.75f), mad(mad(_4120, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f));
                                _12918 = _15882;
                                _12911 = _15882;
                            }
                            _12917 = _12918;
                            _12910 = _12911;
                        }
                        _12916 = _12917;
                        _12909 = _12910;
                    }
                    _12915 = _12916;
                    _12908 = _12909;
                }
                _12914 = _12915;
                _12907 = _12908;
            }
            _12913 = _12914;
            _12906 = _12907;
        }
        _12912 = _12913;
        _12905 = _12906;
    }
    float4 _4501 = _EnvTex.Sample(__EnvTex_sampler, _12905);
    float4 _4504 = _EnvTex.Sample(__EnvTex_sampler, _12912);
    float4 _4507 = lerp(_4501, _4504, (7.0f - _4188).xxxx);
    float3 _4051 = ((_3746 * ((_4507.xyz / _4507.w.xxx) * _Env)) * max(1.0f.xxx, ((((((_3746 * 2.040400028228759765625f) - 0.3323999941349029541015625f.xxx) * 1.0f) + ((_3746 * (-4.79510021209716796875f)) + 0.6417000293731689453125f.xxx)) * 1.0f) + ((_3746 * 2.755199909210205078125f) + 0.69029998779296875f.xxx)) * 1.0f)) * 1.0f;
    float3 _4610 = normalize(lerp(normalize(reflect(-_3687, _12898)), _12898, (_3732 * _3816).xxx));
    float _4613 = -_4610.z;
    float _4615 = _4610.x;
    float _4654 = clamp(_4613 / length(float2(_4615, _4613)), -1.0f, 1.0f);
    float _4663 = abs(_4654);
    float _4666 = mad(-0.15658299624919891357421875f, _4663, 1.57079601287841796875f);
    float _4669 = sqrt(1.0f - _4663);
    float _12927;
    if (_4654 >= 0.0f)
    {
        _12927 = _4666 * _4669;
    }
    else
    {
        _12927 = mad(-_4666, _4669, 3.1415927410125732421875f);
    }
    float _4622 = acos(_4610.y);
    float _4628 = mad(mad((_4615 < 0.0f) ? (-1.0f) : 1.0f, _12927, -1.57079637050628662109375f), 0.15915493667125701904296875f, _EnvRot);
    float _4637 = frac((_4628 + floor(_4628)) + 1.0f);
    float _4690 = floor(_3732 * 7.0f);
    float2 _12938;
    float2 _12945;
    if (abs(_4690) < 0.001000000047497451305389404296875f)
    {
        _12945 = float2(mad(_4637, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4622, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f));
        _12938 = float2(mad(_4637, 0.998046875f, 0.0009765625f), mad(_4622, 0.3170664608478546142578125f, 0.001953125f) * 0.5f);
    }
    else
    {
        float2 _12939;
        float2 _12946;
        if (abs(_4690 - 1.0f) < 0.001000000047497451305389404296875f)
        {
            float _4743 = mad(_4637, 0.99609375f, 0.001953125f);
            float _4753 = mad(mad(_4622, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f);
            _12946 = float2(mad(_4743, 0.5f, 0.5f), _4753);
            _12939 = float2(_4743 * 0.5f, _4753);
        }
        else
        {
            float2 _12940;
            float2 _12947;
            if (abs(_4690 - 2.0f) < 0.001000000047497451305389404296875f)
            {
                float _4781 = mad(_4637, 0.99609375f, 0.001953125f);
                float _4789 = mad(_4622, 0.315823078155517578125f, 0.00390625f);
                _12947 = float2(_4781 * 0.5f, mad(_4789, 0.25f, 0.75f));
                _12940 = float2(mad(_4781, 0.5f, 0.5f), mad(_4789, 0.25f, 0.5f));
            }
            else
            {
                float2 _12941;
                float2 _12948;
                if (abs(_4690 - 3.0f) < 0.001000000047497451305389404296875f)
                {
                    _12948 = float2(mad(mad(_4637, 0.9921875f, 0.00390625f), 0.25f, 0.5f), mad(mad(_4622, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f));
                    _12941 = float2(mad(_4637, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4622, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.75f));
                }
                else
                {
                    float2 _12942;
                    float2 _12949;
                    if (abs(_4690 - 4.0f) < 0.001000000047497451305389404296875f)
                    {
                        float _4857 = mad(_4637, 0.9921875f, 0.00390625f);
                        float _4867 = mad(mad(_4622, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f);
                        _12949 = float2(mad(_4857, 0.25f, 0.75f), _4867);
                        _12942 = float2(mad(_4857, 0.25f, 0.5f), _4867);
                    }
                    else
                    {
                        float2 _12943;
                        float2 _12950;
                        if (abs(_4690 - 5.0f) < 0.001000000047497451305389404296875f)
                        {
                            float _4895 = mad(_4637, 0.9921875f, 0.00390625f);
                            float _4903 = mad(_4622, 0.3133362829685211181640625f, 0.0078125f);
                            _12950 = float2(mad(_4895, 0.25f, 0.5f), mad(_4903, 0.125f, 0.875f));
                            _12943 = float2(mad(_4895, 0.25f, 0.75f), mad(_4903, 0.125f, 0.75f));
                        }
                        else
                        {
                            float2 _12944;
                            float2 _12951;
                            if (abs(_4690 - 6.0f) < 0.001000000047497451305389404296875f)
                            {
                                float _4933 = mad(_4637, 0.9921875f, 0.00390625f);
                                float _4943 = mad(mad(_4622, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f);
                                _12951 = float2(mad(_4933, 0.25f, 0.75f), _4943);
                                _12944 = float2(mad(_4933, 0.25f, 0.5f), _4943);
                            }
                            else
                            {
                                float2 _15907 = float2(mad(mad(_4637, 0.9921875f, 0.00390625f), 0.25f, 0.75f), mad(mad(_4622, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f));
                                _12951 = _15907;
                                _12944 = _15907;
                            }
                            _12950 = _12951;
                            _12943 = _12944;
                        }
                        _12949 = _12950;
                        _12942 = _12943;
                    }
                    _12948 = _12949;
                    _12941 = _12942;
                }
                _12947 = _12948;
                _12940 = _12941;
            }
            _12946 = _12947;
            _12939 = _12940;
        }
        _12945 = _12946;
        _12938 = _12939;
    }
    float4 _5009 = lerp(_EnvTex.Sample(__EnvTex_sampler, _12938), _EnvTex.Sample(__EnvTex_sampler, _12945), mad(_3732, 7.0f, -_4690).xxxx);
    float4 _5036 = (float4(-1.0f, -0.0274999998509883880615234375f, -0.572000026702880859375f, 0.02199999988079071044921875f) * _3732) + float4(1.0f, 0.0425000004470348358154296875f, 1.03999996185302734375f, -0.039999999105930328369140625f);
    float _5038 = _5036.x;
    float2 _5056 = (float2(-1.03999996185302734375f, 1.03999996185302734375f) * mad(min(_5038 * _5038, exp2((-9.27999973297119140625f) * _3757)), _5038, _5036.y)) + _5036.zw;
    float3 _4058 = ((((_3775 * _5056.x) + (_5056.y * clamp(50.0f * _3775.y, 0.0f, 1.0f)).xxx) * max(1.0f.xxx, ((((((_3775 * 2.040400028228759765625f) - 0.3323999941349029541015625f.xxx) * 1.0f) + ((_3775 * (-4.79510021209716796875f)) + 0.6417000293731689453125f.xxx)) * 1.0f) + ((_3775 * 2.755199909210205078125f) + 0.69029998779296875f.xxx)) * 1.0f)) * ((_5009.xyz / _5009.w.xxx) * _Env)) * 1.0f;
    float3 _5120 = normalize(-u_DirLightsDirection[0].xyz);
    float _5134 = (u_DirLightsIntensity[0] * u_DirLightsEnabled[0]) * 3.1415920257568359375f;
    float3 _5148 = normalize(_5120 + _3687);
    float _5162 = max(0.0f, dot(_12898, _5120));
    float _5169 = max(0.0f, dot(_12898, _5148));
    float3 _13164;
    float3 _13165;
    if (u_DirLightsEnabled[0] > 0.5f)
    {
        float _5313 = 1.0f - max(0.0f, max(0.0f, dot(_3687, _5148)));
        float _5327 = _5313 * _5313;
        float _5340 = 1.0f - _5162;
        float _5368 = mad(mad(_5169, _3821, -_5169), _5169, 1.0f);
        _13165 = _4058 + ((((((_3775 + ((1.0f.xxx - _3775) * ((_5327 * _5327) * _5313))) * (((_3821 * 0.31830990314483642578125f) / mad(_5368, _5368, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3816, mad(_3757, _5340, _5162), _3757 * mad(_3816, _5340, _5162)) + 9.9999997473787516355514526367188e-06f)))) * _5162) * u_DirLightsColor[0].xyz) * _5134) * 1.0f);
        _13164 = _4051 + ((((_3746 * u_DirLightsColor[0].xyz) * _5134) * (_5162 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13165 = _4058;
        _13164 = _4051;
    }
    float3 _5388 = normalize(-u_DirLightsDirection[1].xyz);
    float _5402 = (u_DirLightsIntensity[1] * u_DirLightsEnabled[1]) * 3.1415920257568359375f;
    float3 _5416 = normalize(_5388 + _3687);
    float _5430 = max(0.0f, dot(_12898, _5388));
    float _5437 = max(0.0f, dot(_12898, _5416));
    float3 _13364;
    float3 _13365;
    if (u_DirLightsEnabled[1] > 0.5f)
    {
        float _5573 = 1.0f - max(0.0f, max(0.0f, dot(_3687, _5416)));
        float _5587 = _5573 * _5573;
        float _5605 = mad(mad(_5437, _3821, -_5437), _5437, 1.0f);
        _13365 = _13165 + ((((((_3775 + ((1.0f.xxx - _3775) * ((_5587 * _5587) * _5573))) * (((_3821 * 0.31830990314483642578125f) / mad(_5605, _5605, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _5430) * u_DirLightsColor[1].xyz) * _5402) * 1.0f);
        _13364 = _13164 + ((((_3746 * u_DirLightsColor[1].xyz) * _5402) * (_5430 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13365 = _13165;
        _13364 = _13164;
    }
    float3 _5625 = normalize(-u_DirLightsDirection[2].xyz);
    float _5639 = (u_DirLightsIntensity[2] * u_DirLightsEnabled[2]) * 3.1415920257568359375f;
    float3 _5653 = normalize(_5625 + _3687);
    float _5667 = max(0.0f, dot(_12898, _5625));
    float _5674 = max(0.0f, dot(_12898, _5653));
    float3 _13575;
    float3 _13576;
    if (u_DirLightsEnabled[2] > 0.5f)
    {
        float _5810 = 1.0f - max(0.0f, max(0.0f, dot(_3687, _5653)));
        float _5824 = _5810 * _5810;
        float _5842 = mad(mad(_5674, _3821, -_5674), _5674, 1.0f);
        _13576 = _13365 + ((((((_3775 + ((1.0f.xxx - _3775) * ((_5824 * _5824) * _5810))) * (((_3821 * 0.31830990314483642578125f) / mad(_5842, _5842, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _5667) * u_DirLightsColor[2].xyz) * _5639) * 1.0f);
        _13575 = _13364 + ((((_3746 * u_DirLightsColor[2].xyz) * _5639) * (_5667 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13576 = _13365;
        _13575 = _13364;
    }
    float3 _5871 = u_PointLightsPosition[0].xyz - v_posWS;
    float _5873 = length(_5871);
    float3 _5877 = _5871 / _5873.xxx;
    float _5891 = (u_PointLightsIntensity[0] * u_PointLightsEnabled[0]) * 3.1415920257568359375f;
    float _5898 = _5873 * u_PointLightsAttenRangeInv[0];
    float _5924 = _5898 * _5898;
    float _5931 = clamp(mad(-_5924, _5924, 1.0f), 0.0f, 1.0f);
    float3 _5912 = (((_5931 * _5931) * mad(_5898, _5898, 1.0f)) * 0.25f).xxx;
    float3 _5948 = normalize(_5877 + _3687);
    float _5962 = max(0.0f, dot(_12898, _5877));
    float _5969 = max(0.0f, dot(_12898, _5948));
    float3 _13797;
    float3 _13798;
    if (u_PointLightsEnabled[0] > 0.5f)
    {
        float _6113 = 1.0f - max(0.0f, max(0.0f, dot(_3687, _5948)));
        float _6127 = _6113 * _6113;
        float _6140 = 1.0f - _5962;
        float _6168 = mad(mad(_5969, _3821, -_5969), _5969, 1.0f);
        _13798 = _13576 + (((((((_3775 + ((1.0f.xxx - _3775) * ((_6127 * _6127) * _6113))) * (((_3821 * 0.31830990314483642578125f) / mad(_6168, _6168, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3816, mad(_3757, _6140, _5962), _3757 * mad(_3816, _6140, _5962)) + 9.9999997473787516355514526367188e-06f)))) * _5962) * u_PointLightsColor[0].xyz) * _5891) * _5912) * 1.0f);
        _13797 = _13575 + (((((_3746 * u_PointLightsColor[0].xyz) * _5891) * _5912) * (_5962 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13798 = _13576;
        _13797 = _13575;
    }
    float3 _6197 = u_PointLightsPosition[1].xyz - v_posWS;
    float _6199 = length(_6197);
    float3 _6203 = _6197 / _6199.xxx;
    float _6217 = (u_PointLightsIntensity[1] * u_PointLightsEnabled[1]) * 3.1415920257568359375f;
    float _6224 = _6199 * u_PointLightsAttenRangeInv[1];
    float _6250 = _6224 * _6224;
    float _6257 = clamp(mad(-_6250, _6250, 1.0f), 0.0f, 1.0f);
    float3 _6238 = (((_6257 * _6257) * mad(_6224, _6224, 1.0f)) * 0.25f).xxx;
    float3 _6274 = normalize(_6203 + _3687);
    float _6288 = max(0.0f, dot(_12898, _6203));
    float _6295 = max(0.0f, dot(_12898, _6274));
    float3 _14030;
    float3 _14031;
    if (u_PointLightsEnabled[1] > 0.5f)
    {
        float _6431 = 1.0f - max(0.0f, max(0.0f, dot(_3687, _6274)));
        float _6445 = _6431 * _6431;
        float _6463 = mad(mad(_6295, _3821, -_6295), _6295, 1.0f);
        _14031 = _13798 + (((((((_3775 + ((1.0f.xxx - _3775) * ((_6445 * _6445) * _6431))) * (((_3821 * 0.31830990314483642578125f) / mad(_6463, _6463, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _6288) * u_PointLightsColor[1].xyz) * _6217) * _6238) * 1.0f);
        _14030 = _13797 + (((((_3746 * u_PointLightsColor[1].xyz) * _6217) * _6238) * (_6288 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14031 = _13798;
        _14030 = _13797;
    }
    float3 _6494 = u_SpotLightsPosition[0].xyz - v_posWS;
    float _6496 = length(_6494);
    float3 _6500 = _6494 / _6496.xxx;
    float _6514 = (u_SpotLightsIntensity[0] * u_SpotLightsEnabled[0]) * 3.1415920257568359375f;
    float _6521 = _6496 * u_SpotLightsAttenRangeInv[0];
    float _6568 = _6521 * _6521;
    float _6575 = clamp(mad(-_6568, _6568, 1.0f), 0.0f, 1.0f);
    float3 _6556 = ((((_6575 * _6575) * mad(_6521, _6521, 1.0f)) * 0.25f) * smoothstep(u_SpotLightsOuterAngleCos[0], u_SpotLightsInnerAngleCos[0], max(0.0f, dot(_6500, normalize(-u_SpotLightsDirection[0].xyz))))).xxx;
    float3 _6592 = normalize(_6500 + _3687);
    float _6606 = max(0.0f, dot(_12898, _6500));
    float _6613 = max(0.0f, dot(_12898, _6592));
    float3 _14274;
    float3 _14275;
    if (u_SpotLightsEnabled[0] > 0.5f)
    {
        float _6757 = 1.0f - max(0.0f, max(0.0f, dot(_3687, _6592)));
        float _6771 = _6757 * _6757;
        float _6784 = 1.0f - _6606;
        float _6812 = mad(mad(_6613, _3821, -_6613), _6613, 1.0f);
        _14275 = _14031 + (((((((_3775 + ((1.0f.xxx - _3775) * ((_6771 * _6771) * _6757))) * (((_3821 * 0.31830990314483642578125f) / mad(_6812, _6812, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3816, mad(_3757, _6784, _6606), _3757 * mad(_3816, _6784, _6606)) + 9.9999997473787516355514526367188e-06f)))) * _6606) * u_SpotLightsColor[0].xyz) * _6514) * _6556) * 1.0f);
        _14274 = _14030 + (((((_3746 * u_SpotLightsColor[0].xyz) * _6514) * _6556) * (_6606 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14275 = _14031;
        _14274 = _14030;
    }
    float3 _6843 = u_SpotLightsPosition[1].xyz - v_posWS;
    float _6845 = length(_6843);
    float3 _6849 = _6843 / _6845.xxx;
    float _6863 = (u_SpotLightsIntensity[1] * u_SpotLightsEnabled[1]) * 3.1415920257568359375f;
    float _6870 = _6845 * u_SpotLightsAttenRangeInv[1];
    float _6917 = _6870 * _6870;
    float _6924 = clamp(mad(-_6917, _6917, 1.0f), 0.0f, 1.0f);
    float3 _6905 = ((((_6924 * _6924) * mad(_6870, _6870, 1.0f)) * 0.25f) * smoothstep(u_SpotLightsOuterAngleCos[1], u_SpotLightsInnerAngleCos[1], max(0.0f, dot(_6849, normalize(-u_SpotLightsDirection[1].xyz))))).xxx;
    float3 _6941 = normalize(_6849 + _3687);
    float _6955 = max(0.0f, dot(_12898, _6849));
    float _6962 = max(0.0f, dot(_12898, _6941));
    float3 _14529;
    float3 _14530;
    if (u_SpotLightsEnabled[1] > 0.5f)
    {
        float _7098 = 1.0f - max(0.0f, max(0.0f, dot(_3687, _6941)));
        float _7112 = _7098 * _7098;
        float _7130 = mad(mad(_6962, _3821, -_6962), _6962, 1.0f);
        _14530 = _14275 + (((((((_3775 + ((1.0f.xxx - _3775) * ((_7112 * _7112) * _7098))) * (((_3821 * 0.31830990314483642578125f) / mad(_7130, _7130, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _6955) * u_SpotLightsColor[1].xyz) * _6863) * _6905) * 1.0f);
        _14529 = _14274 + (((((_3746 * u_SpotLightsColor[1].xyz) * _6863) * _6905) * (_6955 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14530 = _14275;
        _14529 = _14274;
    }
    float _7160 = (u_AreaLightsIntensity[0] * u_AreaLightsEnabled[0]) * 3.1415920257568359375f;
    float3 _15291;
    float3 _15332;
    if (u_AreaLightsEnabled[0] > 0.5f)
    {
        float3 _7320;
        float3 _7324;
        bool _7327;
        float3 _14884;
        do
        {
            _7320 = normalize(_3687 - (_12898 * _3757));
            _7324 = cross(_12898, _7320);
            _7327 = u_AreaLightsShape[0] > 0.5f;
            if (_7327)
            {
                float3x3 _7346 = transpose(float3x3(_7320, _7324, _12898));
                float3 _7353 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _7346);
                float3 _7361 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _7346);
                float3 _7369 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _7346);
                float3 _7391 = mul((_7353 + _7369) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7394 = mul((_7361 - _7369) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7397 = mul((_7361 - _7353) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                if (u_AreaLightsTwoSide[0] < 0.5f)
                {
                    if (dot(cross(_7394, _7397), _7391) < 0.0f)
                    {
                        _14884 = 0.0f.xxx;
                        break;
                    }
                }
                float _7413 = dot(_7394, _7394);
                float _7416 = dot(_7397, _7397);
                float _7419 = dot(_7394, _7397);
                float _7424 = _7413 * _7416;
                float3 _14839;
                float3 _14840;
                float _14845;
                float _14847;
                if ((abs(_7419) / sqrt(_7424)) > 9.9999997473787516355514526367188e-05f)
                {
                    float _7431 = _7413 + _7416;
                    float _7441 = sqrt(mad(-_7419, _7419, _7424));
                    float _7446 = sqrt(mad(-2.0f, _7441, _7431));
                    float _7452 = sqrt(mad(2.0f, _7441, _7431));
                    float _7456 = mad(0.5f, _7446, 0.5f * _7452);
                    float _7460 = mad(0.5f, _7446, _7452 * (-0.5f));
                    float3 _14837;
                    float3 _14838;
                    if (_7413 > _7416)
                    {
                        float3 _7468 = _7394 * _7419;
                        float _15947 = -_7413;
                        _14838 = _7468 + (_7397 * mad(_7460, _7460, _15947));
                        _14837 = _7468 + (_7397 * mad(_7456, _7456, _15947));
                    }
                    else
                    {
                        float3 _7487 = _7397 * _7419;
                        float _15945 = -_7416;
                        _14838 = _7487 + (_7394 * mad(_7460, _7460, _15945));
                        _14837 = _7487 + (_7394 * mad(_7456, _7456, _15945));
                    }
                    _14847 = 1.0f / (_7460 * _7460);
                    _14845 = 1.0f / (_7456 * _7456);
                    _14840 = normalize(_14838);
                    _14839 = normalize(_14837);
                }
                else
                {
                    float _7516 = 1.0f / _7413;
                    float _7520 = 1.0f / _7416;
                    _14847 = _7520;
                    _14845 = _7516;
                    _14840 = _7397 * sqrt(_7520);
                    _14839 = _7394 * sqrt(_7516);
                }
                float3 _7532 = cross(_14839, _14840);
                float3 _14841;
                if (dot(_7391, _7532) < 0.0f)
                {
                    _14841 = _7532 * (-1.0f);
                }
                else
                {
                    _14841 = _7532;
                }
                float _7543 = dot(_14841, _7391);
                float _7548 = dot(_14839, _7391) / _7543;
                float _7553 = dot(_14840, _7391) / _7543;
                float _7560 = _7543 * _7543;
                float _7562 = _14845 * _7560;
                float _7567 = _14847 * _7560;
                float _7570 = _7562 * _7567;
                float _7577 = mad(_7548, _7548, 1.0f);
                float _15949 = -_7562;
                float4 _12674 = _15986;
                _12674.x = _7570;
                float4 _12676 = _12674;
                _12676.y = mad(-_14847, _7560, mad(_7570, mad(_7553, _7553, _7577), _15949));
                float4 _12678 = _12676;
                _12678.z = mad(-_7567, mad(_7553, _7553, 1.0f), mad(_15949, _7577, 1.0f));
                float2 _7884 = _12678.yz * 0.3333333432674407958984375f.xx;
                float _7886 = _7884.x;
                float4 _12680 = _12678;
                _12680.y = _7886;
                float _7888 = _7884.y;
                float _7899 = -_7888;
                float _7905 = mad(_7899, _7888, _7886);
                float _7908 = -_7886;
                float _7914 = mad(_7908, _7888, _7570);
                float _7923 = dot(float2(_7888, _7908), _12680.xy);
                float _7946 = sqrt(dot(float2(4.0f * _7905, -_7914), float3(_7905, _7914, _7923).zy));
                float _7949 = atan2(_7946, -mad((-2.0f) * _7888, _7905, _7914));
                float _7954 = 2.0f * sqrt(-_7905);
                float _7956 = cos(_7949 * 0.3333333432674407958984375f);
                float _7965 = _7954 * cos(mad(_7949, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _7979 = ((mad(_7954, _7956, _7965) > (2.0f * _7888)) ? (_7954 * _7956) : _7965) - _7888;
                float _7986 = -_7570;
                float _7991 = 2.0f * _7886;
                float _8002 = atan2(_7570 * _7946, -mad(_7986, _7914, _7991 * _7923));
                float _8007 = 2.0f * sqrt(-_7923);
                float _8009 = cos(_8002 * 0.3333333432674407958984375f);
                float _8018 = _8007 * cos(mad(_8002, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _8034 = ((mad(_8007, _8009, _8018) < _7991) ? (_8007 * _8009) : _8018) + _7886;
                float _8052 = mad(-_7979, _8034, _7570);
                float _8078 = _7986 / _8034;
                float _8083 = mad(_7886, _8052, -(_7888 * (_7979 * _7986))) / mad(_7899, _8052, _7886 * _8034);
                float3 _8089 = float3(_8078, _8083, _7979);
                bool _8094 = _8078 < _8083;
                bool _8102;
                if (_8094)
                {
                    _8102 = _8078 < _7979;
                }
                else
                {
                    _8102 = _8094;
                }
                float3 _14852;
                if (_8102)
                {
                    _14852 = _8089.yxz;
                }
                else
                {
                    bool _8111 = _7979 < _8078;
                    bool _8119;
                    if (_8111)
                    {
                        _8119 = _7979 < _8083;
                    }
                    else
                    {
                        _8119 = _8111;
                    }
                    float3 _14853;
                    if (_8119)
                    {
                        _14853 = _8089.xzy;
                    }
                    else
                    {
                        _14853 = _8089;
                    }
                    _14852 = _14853;
                }
                float _15957 = -_14852.y;
                float _7653 = sqrt(_15957 / _14852.z);
                float _7658 = sqrt(_15957 / _14852.x);
                float _7672 = (_7653 * _7658) * rsqrt(mad(_7653, _7653, 1.0f) * mad(_7658, _7658, 1.0f));
                _14884 = (_7672 * u_ltc_mag.Sample(_u_ltc_mag_sampler, (float2(mad(normalize(mul(float3((_7562 * _7548) / mad(_14845, _7560, _15957), (_7567 * _7553) / mad(_14847, _7560, _15957), 1.0f), float3x3(_14839, _14840, _14841))).z, 0.5f, 0.5f), _7672) * 0.984375f) + 0.0078125f.xx).w).xxx;
                break;
            }
            else
            {
                float3x3 _7712 = mul(transpose(float3x3(_7320, _7324, _12898)), float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7719 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _7712);
                float3 _7727 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _7712);
                float3 _7735 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _7712);
                float3 _7743 = mul(u_AreaLightsPoint3[0].xyz - v_posWS, _7712);
                float _8129 = _7719.z;
                int _15987 = int(_8129 > 0.0f);
                float _8136 = _7727.z;
                int _14679;
                if (_8136 > 0.0f)
                {
                    _14679 = _15987 + 2;
                }
                else
                {
                    _14679 = _15987;
                }
                float _8143 = _7735.z;
                int _14683;
                if (_8143 > 0.0f)
                {
                    _14683 = _14679 + 4;
                }
                else
                {
                    _14683 = _14679;
                }
                float _8150 = _7743.z;
                int _14684;
                if (_8150 > 0.0f)
                {
                    _14684 = _14683 + 8;
                }
                else
                {
                    _14684 = _14683;
                }
                int _14695;
                float3 _14711;
                float3 _14731;
                float3 _14753;
                float3 _14771;
                float3 _14789;
                if (_14684 == 0)
                {
                    _14789 = _7727;
                    _14771 = _7735;
                    _14753 = _7743;
                    _14731 = _12900;
                    _14711 = _7719;
                    _14695 = 0;
                }
                else
                {
                    int _14696;
                    float3 _14712;
                    float3 _14736;
                    float3 _14754;
                    float3 _14772;
                    float3 _14790;
                    if (_14684 == 1)
                    {
                        _14790 = (_7719 * (-_8136)) + (_7727 * _8129);
                        _14772 = (_7719 * (-_8150)) + (_7743 * _8129);
                        _14754 = _7743;
                        _14736 = _12900;
                        _14712 = _7719;
                        _14696 = 3;
                    }
                    else
                    {
                        int _14697;
                        float3 _14713;
                        float3 _14737;
                        float3 _14755;
                        float3 _14773;
                        float3 _14791;
                        if (_14684 == 2)
                        {
                            _14791 = _7727;
                            _14773 = (_7727 * (-_8143)) + (_7735 * _8136);
                            _14755 = _7743;
                            _14737 = _12900;
                            _14713 = (_7727 * (-_8129)) + (_7719 * _8136);
                            _14697 = 3;
                        }
                        else
                        {
                            int _14698;
                            float3 _14714;
                            float3 _14738;
                            float3 _14756;
                            float3 _14774;
                            float3 _14792;
                            if (_14684 == 3)
                            {
                                _14792 = _7727;
                                _14774 = (_7727 * (-_8143)) + (_7735 * _8136);
                                _14756 = (_7719 * (-_8150)) + (_7743 * _8129);
                                _14738 = _12900;
                                _14714 = _7719;
                                _14698 = 4;
                            }
                            else
                            {
                                int _14699;
                                float3 _14715;
                                float3 _14739;
                                float3 _14757;
                                float3 _14775;
                                float3 _14793;
                                if (_14684 == 4)
                                {
                                    _14793 = (_7735 * (-_8136)) + (_7727 * _8143);
                                    _14775 = _7735;
                                    _14757 = _7743;
                                    _14739 = _12900;
                                    _14715 = (_7735 * (-_8150)) + (_7743 * _8143);
                                    _14699 = 3;
                                }
                                else
                                {
                                    int _14700;
                                    float3 _14716;
                                    float3 _14740;
                                    float3 _14758;
                                    float3 _14776;
                                    float3 _14794;
                                    if (_14684 == 5)
                                    {
                                        _14794 = _7727;
                                        _14776 = _7735;
                                        _14758 = _7743;
                                        _14740 = _12900;
                                        _14716 = _7719;
                                        _14700 = 0;
                                    }
                                    else
                                    {
                                        int _14701;
                                        float3 _14717;
                                        float3 _14741;
                                        float3 _14759;
                                        float3 _14777;
                                        float3 _14795;
                                        if (_14684 == 6)
                                        {
                                            _14795 = _7727;
                                            _14777 = _7735;
                                            _14759 = (_7735 * (-_8150)) + (_7743 * _8143);
                                            _14741 = _12900;
                                            _14717 = (_7727 * (-_8129)) + (_7719 * _8136);
                                            _14701 = 4;
                                        }
                                        else
                                        {
                                            int _14702;
                                            float3 _14718;
                                            float3 _14742;
                                            float3 _14760;
                                            float3 _14778;
                                            float3 _14796;
                                            if (_14684 == 7)
                                            {
                                                float _8319 = -_8150;
                                                _14796 = _7727;
                                                _14778 = _7735;
                                                _14760 = (_7735 * _8319) + (_7743 * _8143);
                                                _14742 = (_7719 * _8319) + (_7743 * _8129);
                                                _14718 = _7719;
                                                _14702 = 5;
                                            }
                                            else
                                            {
                                                int _14703;
                                                float3 _14719;
                                                float3 _14743;
                                                float3 _14761;
                                                float3 _14779;
                                                float3 _14797;
                                                if (_14684 == 8)
                                                {
                                                    _14797 = (_7743 * (-_8143)) + (_7735 * _8150);
                                                    _14779 = _7743;
                                                    _14761 = _7743;
                                                    _14743 = _12900;
                                                    _14719 = (_7743 * (-_8129)) + (_7719 * _8150);
                                                    _14703 = 3;
                                                }
                                                else
                                                {
                                                    int _14704;
                                                    float3 _14720;
                                                    float3 _14744;
                                                    float3 _14762;
                                                    float3 _14780;
                                                    float3 _14798;
                                                    if (_14684 == 9)
                                                    {
                                                        _14798 = (_7719 * (-_8136)) + (_7727 * _8129);
                                                        _14780 = (_7743 * (-_8143)) + (_7735 * _8150);
                                                        _14762 = _7743;
                                                        _14744 = _12900;
                                                        _14720 = _7719;
                                                        _14704 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _14705;
                                                        float3 _14721;
                                                        float3 _14745;
                                                        float3 _14763;
                                                        float3 _14781;
                                                        float3 _14799;
                                                        if (_14684 == 10)
                                                        {
                                                            _14799 = _7727;
                                                            _14781 = _7735;
                                                            _14763 = _7743;
                                                            _14745 = _12900;
                                                            _14721 = _7719;
                                                            _14705 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _14706;
                                                            float3 _14722;
                                                            float3 _14746;
                                                            float3 _14764;
                                                            float3 _14782;
                                                            float3 _14800;
                                                            if (_14684 == 11)
                                                            {
                                                                float _8419 = -_8143;
                                                                _14800 = _7727;
                                                                _14782 = (_7727 * _8419) + (_7735 * _8136);
                                                                _14764 = (_7743 * _8419) + (_7735 * _8150);
                                                                _14746 = _7743;
                                                                _14722 = _7719;
                                                                _14706 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _14707;
                                                                float3 _14723;
                                                                float3 _14747;
                                                                float3 _14765;
                                                                float3 _14783;
                                                                float3 _14801;
                                                                if (_14684 == 12)
                                                                {
                                                                    _14801 = (_7735 * (-_8136)) + (_7727 * _8143);
                                                                    _14783 = _7735;
                                                                    _14765 = _7743;
                                                                    _14747 = _12900;
                                                                    _14723 = (_7743 * (-_8129)) + (_7719 * _8150);
                                                                    _14707 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _8475 = _14684 == 13;
                                                                    int _14708;
                                                                    float3 _14724;
                                                                    float3 _14748;
                                                                    float3 _14784;
                                                                    float3 _14802;
                                                                    if (_8475)
                                                                    {
                                                                        float _8485 = -_8136;
                                                                        _14802 = (_7719 * _8485) + (_7727 * _8129);
                                                                        _14784 = (_7735 * _8485) + (_7727 * _8143);
                                                                        _14748 = _7743;
                                                                        _14724 = _7719;
                                                                        _14708 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _14709;
                                                                        float3 _14725;
                                                                        float3 _14749;
                                                                        if (_14684 == 14)
                                                                        {
                                                                            float _8515 = -_8129;
                                                                            _14749 = (_7743 * _8515) + (_7719 * _8150);
                                                                            _14725 = (_7727 * _8515) + (_7719 * _8136);
                                                                            _14709 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _14749 = _12900;
                                                                            _14725 = _7719;
                                                                            _14709 = (_14684 == 15) ? 4 : 0;
                                                                        }
                                                                        _14802 = _7727;
                                                                        _14784 = _7735;
                                                                        _14748 = _14749;
                                                                        _14724 = _14725;
                                                                        _14708 = _14709;
                                                                    }
                                                                    bool3 _15990 = _8475.xxx;
                                                                    _14801 = _14802;
                                                                    _14783 = _14784;
                                                                    _14765 = float3(_15990.x ? _7735.x : _7743.x, _15990.y ? _7735.y : _7743.y, _15990.z ? _7735.z : _7743.z);
                                                                    _14747 = _14748;
                                                                    _14723 = _14724;
                                                                    _14707 = _14708;
                                                                }
                                                                _14800 = _14801;
                                                                _14782 = _14783;
                                                                _14764 = _14765;
                                                                _14746 = _14747;
                                                                _14722 = _14723;
                                                                _14706 = _14707;
                                                            }
                                                            _14799 = _14800;
                                                            _14781 = _14782;
                                                            _14763 = _14764;
                                                            _14745 = _14746;
                                                            _14721 = _14722;
                                                            _14705 = _14706;
                                                        }
                                                        _14798 = _14799;
                                                        _14780 = _14781;
                                                        _14762 = _14763;
                                                        _14744 = _14745;
                                                        _14720 = _14721;
                                                        _14704 = _14705;
                                                    }
                                                    _14797 = _14798;
                                                    _14779 = _14780;
                                                    _14761 = _14762;
                                                    _14743 = _14744;
                                                    _14719 = _14720;
                                                    _14703 = _14704;
                                                }
                                                _14796 = _14797;
                                                _14778 = _14779;
                                                _14760 = _14761;
                                                _14742 = _14743;
                                                _14718 = _14719;
                                                _14702 = _14703;
                                            }
                                            _14795 = _14796;
                                            _14777 = _14778;
                                            _14759 = _14760;
                                            _14741 = _14742;
                                            _14717 = _14718;
                                            _14701 = _14702;
                                        }
                                        _14794 = _14795;
                                        _14776 = _14777;
                                        _14758 = _14759;
                                        _14740 = _14741;
                                        _14716 = _14717;
                                        _14700 = _14701;
                                    }
                                    _14793 = _14794;
                                    _14775 = _14776;
                                    _14757 = _14758;
                                    _14739 = _14740;
                                    _14715 = _14716;
                                    _14699 = _14700;
                                }
                                _14792 = _14793;
                                _14774 = _14775;
                                _14756 = _14757;
                                _14738 = _14739;
                                _14714 = _14715;
                                _14698 = _14699;
                            }
                            _14791 = _14792;
                            _14773 = _14774;
                            _14755 = _14756;
                            _14737 = _14738;
                            _14713 = _14714;
                            _14697 = _14698;
                        }
                        _14790 = _14791;
                        _14772 = _14773;
                        _14754 = _14755;
                        _14736 = _14737;
                        _14712 = _14713;
                        _14696 = _14697;
                    }
                    _14789 = _14790;
                    _14771 = _14772;
                    _14753 = _14754;
                    _14731 = _14736;
                    _14711 = _14712;
                    _14695 = _14696;
                }
                bool3 _15992 = (_14695 == 3).xxx;
                bool3 _15994 = (_14695 == 4).xxx;
                if (_14695 == 0)
                {
                    _14884 = 0.0f.xxx;
                    break;
                }
                float3 _7755 = normalize(_14711);
                float3 _7759 = normalize(_14789);
                float3 _7763 = normalize(_14771);
                float3 _7767 = normalize(float3(_15992.x ? _14711.x : _14753.x, _15992.y ? _14711.y : _14753.y, _15992.z ? _14711.z : _14753.z));
                float3 _7771 = normalize(float3(_15994.x ? _14711.x : _14731.x, _15994.y ? _14711.y : _14731.y, _15994.z ? _14711.z : _14731.z));
                float _8592 = dot(_7755, _7759);
                float _8594 = abs(_8592);
                float _8608 = mad(mad(0.01452060043811798095703125f, _8594, 0.4965155124664306640625f), _8594, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8594, _8594, 3.41759395599365234375f);
                float _14807;
                if (_8592 > 0.0f)
                {
                    _14807 = _8608;
                }
                else
                {
                    _14807 = mad(0.5f, rsqrt(max(mad(-_8592, _8592, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8608);
                }
                float _8649 = dot(_7759, _7763);
                float _8651 = abs(_8649);
                float _8665 = mad(mad(0.01452060043811798095703125f, _8651, 0.4965155124664306640625f), _8651, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8651, _8651, 3.41759395599365234375f);
                float _14811;
                if (_8649 > 0.0f)
                {
                    _14811 = _8665;
                }
                else
                {
                    _14811 = mad(0.5f, rsqrt(max(mad(-_8649, _8649, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8665);
                }
                float _8706 = dot(_7763, _7767);
                float _8708 = abs(_8706);
                float _8722 = mad(mad(0.01452060043811798095703125f, _8708, 0.4965155124664306640625f), _8708, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8708, _8708, 3.41759395599365234375f);
                float _14816;
                if (_8706 > 0.0f)
                {
                    _14816 = _8722;
                }
                else
                {
                    _14816 = mad(0.5f, rsqrt(max(mad(-_8706, _8706, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8722);
                }
                float _7793 = ((cross(_7755, _7759) * _14807).z + (cross(_7759, _7763) * _14811).z) + (cross(_7763, _7767) * _14816).z;
                float _14833;
                if (_14695 >= 4)
                {
                    float _8763 = dot(_7767, _7771);
                    float _8765 = abs(_8763);
                    float _8779 = mad(mad(0.01452060043811798095703125f, _8765, 0.4965155124664306640625f), _8765, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8765, _8765, 3.41759395599365234375f);
                    float _14822;
                    if (_8763 > 0.0f)
                    {
                        _14822 = _8779;
                    }
                    else
                    {
                        _14822 = mad(0.5f, rsqrt(max(mad(-_8763, _8763, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8779);
                    }
                    _14833 = _7793 + (cross(_7767, _7771) * _14822).z;
                }
                else
                {
                    _14833 = _7793;
                }
                float _14834;
                if (_14695 == 5)
                {
                    float _8820 = dot(_7771, _7755);
                    float _8822 = abs(_8820);
                    float _8836 = mad(mad(0.01452060043811798095703125f, _8822, 0.4965155124664306640625f), _8822, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8822, _8822, 3.41759395599365234375f);
                    float _14831;
                    if (_8820 > 0.0f)
                    {
                        _14831 = _8836;
                    }
                    else
                    {
                        _14831 = mad(0.5f, rsqrt(max(mad(-_8820, _8820, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8836);
                    }
                    _14834 = _14833 + (cross(_7771, _7755) * _14831).z;
                }
                else
                {
                    _14834 = _14833;
                }
                if (u_AreaLightsTwoSide[0] > 0.5f)
                {
                    _14884 = abs(_14834).xxx;
                    break;
                }
                _14884 = max(0.0f, _14834).xxx;
                break;
            }
        } while(false);
        float2 _8880 = clamp((float2(_3732, sqrt(1.0f - _3757)) * 0.984375f) + 0.0078125f.xx, 0.0f.xx, 1.0f.xx);
        float4 _8940 = u_ltc_mat.Sample(_u_ltc_mat_sampler, _8880);
        float4 _8944 = (_8940 - 0.5f.xxxx) * 4.0f;
        float3x3 _8967 = float3x3(float3(_8944.x, 0.0f, _8944.y), float3(0.0f, 1.0f, 0.0f), float3(_8944.z, 0.0f, _8944.w));
        float4 _8973 = u_ltc_mag.Sample(_u_ltc_mag_sampler, _8880);
        float3 _15198;
        do
        {
            if (_7327)
            {
                float3x3 _9075 = transpose(float3x3(_7320, _7324, _12898));
                float3 _9082 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _9075);
                float3 _9090 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _9075);
                float3 _9098 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _9075);
                float3 _9120 = mul((_9082 + _9098) * 0.5f, _8967);
                float3 _9123 = mul((_9090 - _9098) * 0.5f, _8967);
                float3 _9126 = mul((_9090 - _9082) * 0.5f, _8967);
                if (u_AreaLightsTwoSide[0] < 0.5f)
                {
                    if (dot(cross(_9123, _9126), _9120) < 0.0f)
                    {
                        _15198 = 0.0f.xxx;
                        break;
                    }
                }
                float _9142 = dot(_9123, _9123);
                float _9145 = dot(_9126, _9126);
                float _9148 = dot(_9123, _9126);
                float _9153 = _9142 * _9145;
                float3 _15153;
                float3 _15154;
                float _15159;
                float _15161;
                if ((abs(_9148) / sqrt(_9153)) > 9.9999997473787516355514526367188e-05f)
                {
                    float _9160 = _9142 + _9145;
                    float _9170 = sqrt(mad(-_9148, _9148, _9153));
                    float _9175 = sqrt(mad(-2.0f, _9170, _9160));
                    float _9181 = sqrt(mad(2.0f, _9170, _9160));
                    float _9185 = mad(0.5f, _9175, 0.5f * _9181);
                    float _9189 = mad(0.5f, _9175, _9181 * (-0.5f));
                    float3 _15151;
                    float3 _15152;
                    if (_9142 > _9145)
                    {
                        float3 _9197 = _9123 * _9148;
                        float _15973 = -_9142;
                        _15152 = _9197 + (_9126 * mad(_9189, _9189, _15973));
                        _15151 = _9197 + (_9126 * mad(_9185, _9185, _15973));
                    }
                    else
                    {
                        float3 _9216 = _9126 * _9148;
                        float _15971 = -_9145;
                        _15152 = _9216 + (_9123 * mad(_9189, _9189, _15971));
                        _15151 = _9216 + (_9123 * mad(_9185, _9185, _15971));
                    }
                    _15161 = 1.0f / (_9189 * _9189);
                    _15159 = 1.0f / (_9185 * _9185);
                    _15154 = normalize(_15152);
                    _15153 = normalize(_15151);
                }
                else
                {
                    float _9245 = 1.0f / _9142;
                    float _9249 = 1.0f / _9145;
                    _15161 = _9249;
                    _15159 = _9245;
                    _15154 = _9126 * sqrt(_9249);
                    _15153 = _9123 * sqrt(_9245);
                }
                float3 _9261 = cross(_15153, _15154);
                float3 _15155;
                if (dot(_9120, _9261) < 0.0f)
                {
                    _15155 = _9261 * (-1.0f);
                }
                else
                {
                    _15155 = _9261;
                }
                float _9272 = dot(_15155, _9120);
                float _9277 = dot(_15153, _9120) / _9272;
                float _9282 = dot(_15154, _9120) / _9272;
                float _9289 = _9272 * _9272;
                float _9291 = _15159 * _9289;
                float _9296 = _15161 * _9289;
                float _9299 = _9291 * _9296;
                float _9306 = mad(_9277, _9277, 1.0f);
                float _15975 = -_9291;
                float4 _12790 = _15986;
                _12790.x = _9299;
                float4 _12792 = _12790;
                _12792.y = mad(-_15161, _9289, mad(_9299, mad(_9282, _9282, _9306), _15975));
                float4 _12794 = _12792;
                _12794.z = mad(-_9296, mad(_9282, _9282, 1.0f), mad(_15975, _9306, 1.0f));
                float2 _9613 = _12794.yz * 0.3333333432674407958984375f.xx;
                float _9615 = _9613.x;
                float4 _12796 = _12794;
                _12796.y = _9615;
                float _9617 = _9613.y;
                float _9628 = -_9617;
                float _9634 = mad(_9628, _9617, _9615);
                float _9637 = -_9615;
                float _9643 = mad(_9637, _9617, _9299);
                float _9652 = dot(float2(_9617, _9637), _12796.xy);
                float _9675 = sqrt(dot(float2(4.0f * _9634, -_9643), float3(_9634, _9643, _9652).zy));
                float _9678 = atan2(_9675, -mad((-2.0f) * _9617, _9634, _9643));
                float _9683 = 2.0f * sqrt(-_9634);
                float _9685 = cos(_9678 * 0.3333333432674407958984375f);
                float _9694 = _9683 * cos(mad(_9678, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _9708 = ((mad(_9683, _9685, _9694) > (2.0f * _9617)) ? (_9683 * _9685) : _9694) - _9617;
                float _9715 = -_9299;
                float _9720 = 2.0f * _9615;
                float _9731 = atan2(_9299 * _9675, -mad(_9715, _9643, _9720 * _9652));
                float _9736 = 2.0f * sqrt(-_9652);
                float _9738 = cos(_9731 * 0.3333333432674407958984375f);
                float _9747 = _9736 * cos(mad(_9731, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _9763 = ((mad(_9736, _9738, _9747) < _9720) ? (_9736 * _9738) : _9747) + _9615;
                float _9781 = mad(-_9708, _9763, _9299);
                float _9807 = _9715 / _9763;
                float _9812 = mad(_9615, _9781, -(_9617 * (_9708 * _9715))) / mad(_9628, _9781, _9615 * _9763);
                float3 _9818 = float3(_9807, _9812, _9708);
                bool _9823 = _9807 < _9812;
                bool _9831;
                if (_9823)
                {
                    _9831 = _9807 < _9708;
                }
                else
                {
                    _9831 = _9823;
                }
                float3 _15166;
                if (_9831)
                {
                    _15166 = _9818.yxz;
                }
                else
                {
                    bool _9840 = _9708 < _9807;
                    bool _9848;
                    if (_9840)
                    {
                        _9848 = _9708 < _9812;
                    }
                    else
                    {
                        _9848 = _9840;
                    }
                    float3 _15167;
                    if (_9848)
                    {
                        _15167 = _9818.xzy;
                    }
                    else
                    {
                        _15167 = _9818;
                    }
                    _15166 = _15167;
                }
                float _15981 = -_15166.y;
                float _9382 = sqrt(_15981 / _15166.z);
                float _9387 = sqrt(_15981 / _15166.x);
                float _9401 = (_9382 * _9387) * rsqrt(mad(_9382, _9382, 1.0f) * mad(_9387, _9387, 1.0f));
                _15198 = (_9401 * u_ltc_mag.Sample(_u_ltc_mag_sampler, (float2(mad(normalize(mul(float3((_9291 * _9277) / mad(_15159, _9289, _15981), (_9296 * _9282) / mad(_15161, _9289, _15981), 1.0f), float3x3(_15153, _15154, _15155))).z, 0.5f, 0.5f), _9401) * 0.984375f) + 0.0078125f.xx).w).xxx;
                break;
            }
            else
            {
                float3x3 _9441 = mul(transpose(float3x3(_7320, _7324, _12898)), _8967);
                float3 _9448 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _9441);
                float3 _9456 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _9441);
                float3 _9464 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _9441);
                float3 _9472 = mul(u_AreaLightsPoint3[0].xyz - v_posWS, _9441);
                float _9858 = _9448.z;
                int _15998 = int(_9858 > 0.0f);
                float _9865 = _9456.z;
                int _14993;
                if (_9865 > 0.0f)
                {
                    _14993 = _15998 + 2;
                }
                else
                {
                    _14993 = _15998;
                }
                float _9872 = _9464.z;
                int _14997;
                if (_9872 > 0.0f)
                {
                    _14997 = _14993 + 4;
                }
                else
                {
                    _14997 = _14993;
                }
                float _9879 = _9472.z;
                int _14998;
                if (_9879 > 0.0f)
                {
                    _14998 = _14997 + 8;
                }
                else
                {
                    _14998 = _14997;
                }
                int _15009;
                float3 _15025;
                float3 _15045;
                float3 _15067;
                float3 _15085;
                float3 _15103;
                if (_14998 == 0)
                {
                    _15103 = _9456;
                    _15085 = _9464;
                    _15067 = _9472;
                    _15045 = _12900;
                    _15025 = _9448;
                    _15009 = 0;
                }
                else
                {
                    int _15010;
                    float3 _15026;
                    float3 _15050;
                    float3 _15068;
                    float3 _15086;
                    float3 _15104;
                    if (_14998 == 1)
                    {
                        _15104 = (_9448 * (-_9865)) + (_9456 * _9858);
                        _15086 = (_9448 * (-_9879)) + (_9472 * _9858);
                        _15068 = _9472;
                        _15050 = _12900;
                        _15026 = _9448;
                        _15010 = 3;
                    }
                    else
                    {
                        int _15011;
                        float3 _15027;
                        float3 _15051;
                        float3 _15069;
                        float3 _15087;
                        float3 _15105;
                        if (_14998 == 2)
                        {
                            _15105 = _9456;
                            _15087 = (_9456 * (-_9872)) + (_9464 * _9865);
                            _15069 = _9472;
                            _15051 = _12900;
                            _15027 = (_9456 * (-_9858)) + (_9448 * _9865);
                            _15011 = 3;
                        }
                        else
                        {
                            int _15012;
                            float3 _15028;
                            float3 _15052;
                            float3 _15070;
                            float3 _15088;
                            float3 _15106;
                            if (_14998 == 3)
                            {
                                _15106 = _9456;
                                _15088 = (_9456 * (-_9872)) + (_9464 * _9865);
                                _15070 = (_9448 * (-_9879)) + (_9472 * _9858);
                                _15052 = _12900;
                                _15028 = _9448;
                                _15012 = 4;
                            }
                            else
                            {
                                int _15013;
                                float3 _15029;
                                float3 _15053;
                                float3 _15071;
                                float3 _15089;
                                float3 _15107;
                                if (_14998 == 4)
                                {
                                    _15107 = (_9464 * (-_9865)) + (_9456 * _9872);
                                    _15089 = _9464;
                                    _15071 = _9472;
                                    _15053 = _12900;
                                    _15029 = (_9464 * (-_9879)) + (_9472 * _9872);
                                    _15013 = 3;
                                }
                                else
                                {
                                    int _15014;
                                    float3 _15030;
                                    float3 _15054;
                                    float3 _15072;
                                    float3 _15090;
                                    float3 _15108;
                                    if (_14998 == 5)
                                    {
                                        _15108 = _9456;
                                        _15090 = _9464;
                                        _15072 = _9472;
                                        _15054 = _12900;
                                        _15030 = _9448;
                                        _15014 = 0;
                                    }
                                    else
                                    {
                                        int _15015;
                                        float3 _15031;
                                        float3 _15055;
                                        float3 _15073;
                                        float3 _15091;
                                        float3 _15109;
                                        if (_14998 == 6)
                                        {
                                            _15109 = _9456;
                                            _15091 = _9464;
                                            _15073 = (_9464 * (-_9879)) + (_9472 * _9872);
                                            _15055 = _12900;
                                            _15031 = (_9456 * (-_9858)) + (_9448 * _9865);
                                            _15015 = 4;
                                        }
                                        else
                                        {
                                            int _15016;
                                            float3 _15032;
                                            float3 _15056;
                                            float3 _15074;
                                            float3 _15092;
                                            float3 _15110;
                                            if (_14998 == 7)
                                            {
                                                float _10048 = -_9879;
                                                _15110 = _9456;
                                                _15092 = _9464;
                                                _15074 = (_9464 * _10048) + (_9472 * _9872);
                                                _15056 = (_9448 * _10048) + (_9472 * _9858);
                                                _15032 = _9448;
                                                _15016 = 5;
                                            }
                                            else
                                            {
                                                int _15017;
                                                float3 _15033;
                                                float3 _15057;
                                                float3 _15075;
                                                float3 _15093;
                                                float3 _15111;
                                                if (_14998 == 8)
                                                {
                                                    _15111 = (_9472 * (-_9872)) + (_9464 * _9879);
                                                    _15093 = _9472;
                                                    _15075 = _9472;
                                                    _15057 = _12900;
                                                    _15033 = (_9472 * (-_9858)) + (_9448 * _9879);
                                                    _15017 = 3;
                                                }
                                                else
                                                {
                                                    int _15018;
                                                    float3 _15034;
                                                    float3 _15058;
                                                    float3 _15076;
                                                    float3 _15094;
                                                    float3 _15112;
                                                    if (_14998 == 9)
                                                    {
                                                        _15112 = (_9448 * (-_9865)) + (_9456 * _9858);
                                                        _15094 = (_9472 * (-_9872)) + (_9464 * _9879);
                                                        _15076 = _9472;
                                                        _15058 = _12900;
                                                        _15034 = _9448;
                                                        _15018 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _15019;
                                                        float3 _15035;
                                                        float3 _15059;
                                                        float3 _15077;
                                                        float3 _15095;
                                                        float3 _15113;
                                                        if (_14998 == 10)
                                                        {
                                                            _15113 = _9456;
                                                            _15095 = _9464;
                                                            _15077 = _9472;
                                                            _15059 = _12900;
                                                            _15035 = _9448;
                                                            _15019 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _15020;
                                                            float3 _15036;
                                                            float3 _15060;
                                                            float3 _15078;
                                                            float3 _15096;
                                                            float3 _15114;
                                                            if (_14998 == 11)
                                                            {
                                                                float _10148 = -_9872;
                                                                _15114 = _9456;
                                                                _15096 = (_9456 * _10148) + (_9464 * _9865);
                                                                _15078 = (_9472 * _10148) + (_9464 * _9879);
                                                                _15060 = _9472;
                                                                _15036 = _9448;
                                                                _15020 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _15021;
                                                                float3 _15037;
                                                                float3 _15061;
                                                                float3 _15079;
                                                                float3 _15097;
                                                                float3 _15115;
                                                                if (_14998 == 12)
                                                                {
                                                                    _15115 = (_9464 * (-_9865)) + (_9456 * _9872);
                                                                    _15097 = _9464;
                                                                    _15079 = _9472;
                                                                    _15061 = _12900;
                                                                    _15037 = (_9472 * (-_9858)) + (_9448 * _9879);
                                                                    _15021 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _10204 = _14998 == 13;
                                                                    int _15022;
                                                                    float3 _15038;
                                                                    float3 _15062;
                                                                    float3 _15098;
                                                                    float3 _15116;
                                                                    if (_10204)
                                                                    {
                                                                        float _10214 = -_9865;
                                                                        _15116 = (_9448 * _10214) + (_9456 * _9858);
                                                                        _15098 = (_9464 * _10214) + (_9456 * _9872);
                                                                        _15062 = _9472;
                                                                        _15038 = _9448;
                                                                        _15022 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _15023;
                                                                        float3 _15039;
                                                                        float3 _15063;
                                                                        if (_14998 == 14)
                                                                        {
                                                                            float _10244 = -_9858;
                                                                            _15063 = (_9472 * _10244) + (_9448 * _9879);
                                                                            _15039 = (_9456 * _10244) + (_9448 * _9865);
                                                                            _15023 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _15063 = _12900;
                                                                            _15039 = _9448;
                                                                            _15023 = (_14998 == 15) ? 4 : 0;
                                                                        }
                                                                        _15116 = _9456;
                                                                        _15098 = _9464;
                                                                        _15062 = _15063;
                                                                        _15038 = _15039;
                                                                        _15022 = _15023;
                                                                    }
                                                                    bool3 _16000 = _10204.xxx;
                                                                    _15115 = _15116;
                                                                    _15097 = _15098;
                                                                    _15079 = float3(_16000.x ? _9464.x : _9472.x, _16000.y ? _9464.y : _9472.y, _16000.z ? _9464.z : _9472.z);
                                                                    _15061 = _15062;
                                                                    _15037 = _15038;
                                                                    _15021 = _15022;
                                                                }
                                                                _15114 = _15115;
                                                                _15096 = _15097;
                                                                _15078 = _15079;
                                                                _15060 = _15061;
                                                                _15036 = _15037;
                                                                _15020 = _15021;
                                                            }
                                                            _15113 = _15114;
                                                            _15095 = _15096;
                                                            _15077 = _15078;
                                                            _15059 = _15060;
                                                            _15035 = _15036;
                                                            _15019 = _15020;
                                                        }
                                                        _15112 = _15113;
                                                        _15094 = _15095;
                                                        _15076 = _15077;
                                                        _15058 = _15059;
                                                        _15034 = _15035;
                                                        _15018 = _15019;
                                                    }
                                                    _15111 = _15112;
                                                    _15093 = _15094;
                                                    _15075 = _15076;
                                                    _15057 = _15058;
                                                    _15033 = _15034;
                                                    _15017 = _15018;
                                                }
                                                _15110 = _15111;
                                                _15092 = _15093;
                                                _15074 = _15075;
                                                _15056 = _15057;
                                                _15032 = _15033;
                                                _15016 = _15017;
                                            }
                                            _15109 = _15110;
                                            _15091 = _15092;
                                            _15073 = _15074;
                                            _15055 = _15056;
                                            _15031 = _15032;
                                            _15015 = _15016;
                                        }
                                        _15108 = _15109;
                                        _15090 = _15091;
                                        _15072 = _15073;
                                        _15054 = _15055;
                                        _15030 = _15031;
                                        _15014 = _15015;
                                    }
                                    _15107 = _15108;
                                    _15089 = _15090;
                                    _15071 = _15072;
                                    _15053 = _15054;
                                    _15029 = _15030;
                                    _15013 = _15014;
                                }
                                _15106 = _15107;
                                _15088 = _15089;
                                _15070 = _15071;
                                _15052 = _15053;
                                _15028 = _15029;
                                _15012 = _15013;
                            }
                            _15105 = _15106;
                            _15087 = _15088;
                            _15069 = _15070;
                            _15051 = _15052;
                            _15027 = _15028;
                            _15011 = _15012;
                        }
                        _15104 = _15105;
                        _15086 = _15087;
                        _15068 = _15069;
                        _15050 = _15051;
                        _15026 = _15027;
                        _15010 = _15011;
                    }
                    _15103 = _15104;
                    _15085 = _15086;
                    _15067 = _15068;
                    _15045 = _15050;
                    _15025 = _15026;
                    _15009 = _15010;
                }
                bool3 _16002 = (_15009 == 3).xxx;
                bool3 _16004 = (_15009 == 4).xxx;
                if (_15009 == 0)
                {
                    _15198 = 0.0f.xxx;
                    break;
                }
                float3 _9484 = normalize(_15025);
                float3 _9488 = normalize(_15103);
                float3 _9492 = normalize(_15085);
                float3 _9496 = normalize(float3(_16002.x ? _15025.x : _15067.x, _16002.y ? _15025.y : _15067.y, _16002.z ? _15025.z : _15067.z));
                float3 _9500 = normalize(float3(_16004.x ? _15025.x : _15045.x, _16004.y ? _15025.y : _15045.y, _16004.z ? _15025.z : _15045.z));
                float _10321 = dot(_9484, _9488);
                float _10323 = abs(_10321);
                float _10337 = mad(mad(0.01452060043811798095703125f, _10323, 0.4965155124664306640625f), _10323, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10323, _10323, 3.41759395599365234375f);
                float _15121;
                if (_10321 > 0.0f)
                {
                    _15121 = _10337;
                }
                else
                {
                    _15121 = mad(0.5f, rsqrt(max(mad(-_10321, _10321, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10337);
                }
                float _10378 = dot(_9488, _9492);
                float _10380 = abs(_10378);
                float _10394 = mad(mad(0.01452060043811798095703125f, _10380, 0.4965155124664306640625f), _10380, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10380, _10380, 3.41759395599365234375f);
                float _15125;
                if (_10378 > 0.0f)
                {
                    _15125 = _10394;
                }
                else
                {
                    _15125 = mad(0.5f, rsqrt(max(mad(-_10378, _10378, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10394);
                }
                float _10435 = dot(_9492, _9496);
                float _10437 = abs(_10435);
                float _10451 = mad(mad(0.01452060043811798095703125f, _10437, 0.4965155124664306640625f), _10437, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10437, _10437, 3.41759395599365234375f);
                float _15130;
                if (_10435 > 0.0f)
                {
                    _15130 = _10451;
                }
                else
                {
                    _15130 = mad(0.5f, rsqrt(max(mad(-_10435, _10435, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10451);
                }
                float _9522 = ((cross(_9484, _9488) * _15121).z + (cross(_9488, _9492) * _15125).z) + (cross(_9492, _9496) * _15130).z;
                float _15147;
                if (_15009 >= 4)
                {
                    float _10492 = dot(_9496, _9500);
                    float _10494 = abs(_10492);
                    float _10508 = mad(mad(0.01452060043811798095703125f, _10494, 0.4965155124664306640625f), _10494, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10494, _10494, 3.41759395599365234375f);
                    float _15136;
                    if (_10492 > 0.0f)
                    {
                        _15136 = _10508;
                    }
                    else
                    {
                        _15136 = mad(0.5f, rsqrt(max(mad(-_10492, _10492, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10508);
                    }
                    _15147 = _9522 + (cross(_9496, _9500) * _15136).z;
                }
                else
                {
                    _15147 = _9522;
                }
                float _15148;
                if (_15009 == 5)
                {
                    float _10549 = dot(_9500, _9484);
                    float _10551 = abs(_10549);
                    float _10565 = mad(mad(0.01452060043811798095703125f, _10551, 0.4965155124664306640625f), _10551, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10551, _10551, 3.41759395599365234375f);
                    float _15145;
                    if (_10549 > 0.0f)
                    {
                        _15145 = _10565;
                    }
                    else
                    {
                        _15145 = mad(0.5f, rsqrt(max(mad(-_10549, _10549, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10565);
                    }
                    _15148 = _15147 + (cross(_9500, _9484) * _15145).z;
                }
                else
                {
                    _15148 = _15147;
                }
                if (u_AreaLightsTwoSide[0] > 0.5f)
                {
                    _15198 = abs(_15148).xxx;
                    break;
                }
                _15198 = max(0.0f, _15148).xxx;
                break;
            }
        } while(false);
        _15332 = _14530 + (((u_AreaLightsColor[0].xyz * _7160) * (((_3775 * _8973.x) + ((1.0f.xxx - _3775) * _8973.y)) * _15198)) * 1.0f);
        _15291 = _14529 + ((((_3746 * u_AreaLightsColor[0].xyz) * _7160) * _14884) * 1.0f);
    }
    else
    {
        _15332 = _14530;
        _15291 = _14529;
    }
    float _10609 = (u_AreaLightsIntensity[1] * u_AreaLightsEnabled[1]) * 3.1415920257568359375f;
    float3 _15858;
    float3 _15859;
    if (u_AreaLightsEnabled[1] > 0.5f)
    {
        float _10762 = 1.0f - max(0.0f, _12981);
        float _10776 = _10762 * _10762;
        float _10794 = mad(mad(_12981, _3821, -_12981), _12981, 1.0f);
        _15859 = _15332 + (((((_3775 + ((1.0f.xxx - _3775) * ((_10776 * _10776) * _10762))) * (((_3821 * 0.31830990314483642578125f) / mad(_10794, _10794, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _12981) * u_AreaLightsColor[1].xyz) * _10609);
        _15858 = _15291 + (((_3746 * u_AreaLightsColor[1].xyz) * _10609) * (_12981 * 0.31830990314483642578125f));
    }
    else
    {
        _15859 = _15332;
        _15858 = _15291;
    }
    o_fragColor = float4(pow(max(_15858 + _15859, 9.9999997473787516355514526367188e-06f.xxx), 0.4545454680919647216796875f.xxx), _AlbedoColor.w * _3710.w);
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
