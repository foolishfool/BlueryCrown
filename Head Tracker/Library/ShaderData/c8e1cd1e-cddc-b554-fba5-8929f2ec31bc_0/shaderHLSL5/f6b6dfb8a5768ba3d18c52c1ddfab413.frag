Texture2D<float4> u_FBOTexture : register(t0);
SamplerState _u_FBOTexture_sampler : register(s0);
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
uniform float _Metallic;
uniform float _Roughness;

static float3 v_nDirWS;
static float3 v_posWS;
static float4 v_gl_pos;
static float4 o_fragColor;

struct SPIRV_Cross_Input
{
    float4 v_gl_pos : v_gl_pos;
    float3 v_posWS : v_posWS;
    float3 v_nDirWS : v_nDirWS;
};

struct SPIRV_Cross_Output
{
    float4 o_fragColor : SV_Target0;
};

static float3 _13094;
static float _13175;
static float4 _16189;

void frag_main()
{
    float3 _3766 = normalize(v_nDirWS);
    float3 _3771 = normalize(u_WorldSpaceCameraPos.xyz - v_posWS);
    float3 _13092;
    if (dot(_3771, _3766) < (-0.0500000007450580596923828125f))
    {
        _13092 = -_3766;
    }
    else
    {
        _13092 = _3766;
    }
    float3 _3864 = pow(max(_AlbedoColor.xyz, 9.9999997473787516355514526367188e-06f.xxx), 2.2000000476837158203125f.xxx);
    float _3868 = clamp(_Metallic, 0.0f, 1.0f);
    float _3804 = clamp(_Roughness, 0.0f, 1.0f);
    float _3873 = _3804 * _3804;
    float _3878 = _3873 * _3873;
    float3 _3818 = _3864 * (1.0f - _3868);
    float _3829 = max(0.0f, dot(_13092, _3771));
    float3 _3847 = lerp(0.0400000028312206268310546875f.xxx, _3864, _3868.xxx);
    float3 _4165 = normalize(_13092);
    float _4168 = -_4165.z;
    float _4170 = _4165.x;
    float _4209 = clamp(_4168 / length(float2(_4170, _4168)), -1.0f, 1.0f);
    float _4218 = abs(_4209);
    float _4221 = mad(-0.15658299624919891357421875f, _4218, 1.57079601287841796875f);
    float _4224 = sqrt(1.0f - _4218);
    float _13095;
    if (_4209 >= 0.0f)
    {
        _13095 = _4221 * _4224;
    }
    else
    {
        _13095 = mad(-_4221, _4224, 3.1415927410125732421875f);
    }
    float _4177 = acos(_4165.y);
    float _4183 = mad(mad((_4170 < 0.0f) ? (-1.0f) : 1.0f, _13095, -1.57079637050628662109375f), 0.15915493667125701904296875f, _EnvRot);
    float _4192 = frac((_4183 + floor(_4183)) + 1.0f);
    float _4245 = floor(7.0f);
    float2 _13099;
    float2 _13106;
    if (abs(_4245) < 0.001000000047497451305389404296875f)
    {
        _13106 = float2(mad(_4192, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4177, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f));
        _13099 = float2(mad(_4192, 0.998046875f, 0.0009765625f), mad(_4177, 0.3170664608478546142578125f, 0.001953125f) * 0.5f);
    }
    else
    {
        float2 _13100;
        float2 _13107;
        if (abs(_4245 - 1.0f) < 0.001000000047497451305389404296875f)
        {
            float _4298 = mad(_4192, 0.99609375f, 0.001953125f);
            float _4308 = mad(mad(_4177, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f);
            _13107 = float2(mad(_4298, 0.5f, 0.5f), _4308);
            _13100 = float2(_4298 * 0.5f, _4308);
        }
        else
        {
            float2 _13101;
            float2 _13108;
            if (abs(_4245 - 2.0f) < 0.001000000047497451305389404296875f)
            {
                float _4336 = mad(_4192, 0.99609375f, 0.001953125f);
                float _4344 = mad(_4177, 0.315823078155517578125f, 0.00390625f);
                _13108 = float2(_4336 * 0.5f, mad(_4344, 0.25f, 0.75f));
                _13101 = float2(mad(_4336, 0.5f, 0.5f), mad(_4344, 0.25f, 0.5f));
            }
            else
            {
                float2 _13102;
                float2 _13109;
                if (abs(_4245 - 3.0f) < 0.001000000047497451305389404296875f)
                {
                    _13109 = float2(mad(mad(_4192, 0.9921875f, 0.00390625f), 0.25f, 0.5f), mad(mad(_4177, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f));
                    _13102 = float2(mad(_4192, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4177, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.75f));
                }
                else
                {
                    float2 _13103;
                    float2 _13110;
                    if (abs(_4245 - 4.0f) < 0.001000000047497451305389404296875f)
                    {
                        float _4412 = mad(_4192, 0.9921875f, 0.00390625f);
                        float _4422 = mad(mad(_4177, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f);
                        _13110 = float2(mad(_4412, 0.25f, 0.75f), _4422);
                        _13103 = float2(mad(_4412, 0.25f, 0.5f), _4422);
                    }
                    else
                    {
                        float2 _13104;
                        float2 _13111;
                        if (abs(_4245 - 5.0f) < 0.001000000047497451305389404296875f)
                        {
                            float _4450 = mad(_4192, 0.9921875f, 0.00390625f);
                            float _4458 = mad(_4177, 0.3133362829685211181640625f, 0.0078125f);
                            _13111 = float2(mad(_4450, 0.25f, 0.5f), mad(_4458, 0.125f, 0.875f));
                            _13104 = float2(mad(_4450, 0.25f, 0.75f), mad(_4458, 0.125f, 0.75f));
                        }
                        else
                        {
                            float2 _13105;
                            float2 _13112;
                            if (abs(_4245 - 6.0f) < 0.001000000047497451305389404296875f)
                            {
                                float _4488 = mad(_4192, 0.9921875f, 0.00390625f);
                                float _4498 = mad(mad(_4177, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f);
                                _13112 = float2(mad(_4488, 0.25f, 0.75f), _4498);
                                _13105 = float2(mad(_4488, 0.25f, 0.5f), _4498);
                            }
                            else
                            {
                                float2 _16082 = float2(mad(mad(_4192, 0.9921875f, 0.00390625f), 0.25f, 0.75f), mad(mad(_4177, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f));
                                _13112 = _16082;
                                _13105 = _16082;
                            }
                            _13111 = _13112;
                            _13104 = _13105;
                        }
                        _13110 = _13111;
                        _13103 = _13104;
                    }
                    _13109 = _13110;
                    _13102 = _13103;
                }
                _13108 = _13109;
                _13101 = _13102;
            }
            _13107 = _13108;
            _13100 = _13101;
        }
        _13106 = _13107;
        _13099 = _13100;
    }
    float4 _4558 = _EnvTex.Sample(__EnvTex_sampler, _13099);
    float4 _4561 = _EnvTex.Sample(__EnvTex_sampler, _13106);
    float4 _4564 = lerp(_4558, _4561, (7.0f - _4245).xxxx);
    float3 _4108 = ((_3818 * ((_4564.xyz / _4564.w.xxx) * _Env)) * max(1.0f.xxx, ((((((_3818 * 2.040400028228759765625f) - 0.3323999941349029541015625f.xxx) * 1.0f) + ((_3818 * (-4.79510021209716796875f)) + 0.6417000293731689453125f.xxx)) * 1.0f) + ((_3818 * 2.755199909210205078125f) + 0.69029998779296875f.xxx)) * 1.0f)) * 1.0f;
    float3 _4667 = normalize(lerp(normalize(reflect(-_3771, _13092)), _13092, (_3804 * _3873).xxx));
    float _4670 = -_4667.z;
    float _4672 = _4667.x;
    float _4711 = clamp(_4670 / length(float2(_4672, _4670)), -1.0f, 1.0f);
    float _4720 = abs(_4711);
    float _4723 = mad(-0.15658299624919891357421875f, _4720, 1.57079601287841796875f);
    float _4726 = sqrt(1.0f - _4720);
    float _13121;
    if (_4711 >= 0.0f)
    {
        _13121 = _4723 * _4726;
    }
    else
    {
        _13121 = mad(-_4723, _4726, 3.1415927410125732421875f);
    }
    float _4679 = acos(_4667.y);
    float _4685 = mad(mad((_4672 < 0.0f) ? (-1.0f) : 1.0f, _13121, -1.57079637050628662109375f), 0.15915493667125701904296875f, _EnvRot);
    float _4694 = frac((_4685 + floor(_4685)) + 1.0f);
    float _4747 = floor(_3804 * 7.0f);
    float2 _13132;
    float2 _13139;
    if (abs(_4747) < 0.001000000047497451305389404296875f)
    {
        _13139 = float2(mad(_4694, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4679, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f));
        _13132 = float2(mad(_4694, 0.998046875f, 0.0009765625f), mad(_4679, 0.3170664608478546142578125f, 0.001953125f) * 0.5f);
    }
    else
    {
        float2 _13133;
        float2 _13140;
        if (abs(_4747 - 1.0f) < 0.001000000047497451305389404296875f)
        {
            float _4800 = mad(_4694, 0.99609375f, 0.001953125f);
            float _4810 = mad(mad(_4679, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.5f);
            _13140 = float2(mad(_4800, 0.5f, 0.5f), _4810);
            _13133 = float2(_4800 * 0.5f, _4810);
        }
        else
        {
            float2 _13134;
            float2 _13141;
            if (abs(_4747 - 2.0f) < 0.001000000047497451305389404296875f)
            {
                float _4838 = mad(_4694, 0.99609375f, 0.001953125f);
                float _4846 = mad(_4679, 0.315823078155517578125f, 0.00390625f);
                _13141 = float2(_4838 * 0.5f, mad(_4846, 0.25f, 0.75f));
                _13134 = float2(mad(_4838, 0.5f, 0.5f), mad(_4846, 0.25f, 0.5f));
            }
            else
            {
                float2 _13135;
                float2 _13142;
                if (abs(_4747 - 3.0f) < 0.001000000047497451305389404296875f)
                {
                    _13142 = float2(mad(mad(_4694, 0.9921875f, 0.00390625f), 0.25f, 0.5f), mad(mad(_4679, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f));
                    _13135 = float2(mad(_4694, 0.99609375f, 0.001953125f) * 0.5f, mad(mad(_4679, 0.315823078155517578125f, 0.00390625f), 0.25f, 0.75f));
                }
                else
                {
                    float2 _13136;
                    float2 _13143;
                    if (abs(_4747 - 4.0f) < 0.001000000047497451305389404296875f)
                    {
                        float _4914 = mad(_4694, 0.9921875f, 0.00390625f);
                        float _4924 = mad(mad(_4679, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.75f);
                        _13143 = float2(mad(_4914, 0.25f, 0.75f), _4924);
                        _13136 = float2(mad(_4914, 0.25f, 0.5f), _4924);
                    }
                    else
                    {
                        float2 _13137;
                        float2 _13144;
                        if (abs(_4747 - 5.0f) < 0.001000000047497451305389404296875f)
                        {
                            float _4952 = mad(_4694, 0.9921875f, 0.00390625f);
                            float _4960 = mad(_4679, 0.3133362829685211181640625f, 0.0078125f);
                            _13144 = float2(mad(_4952, 0.25f, 0.5f), mad(_4960, 0.125f, 0.875f));
                            _13137 = float2(mad(_4952, 0.25f, 0.75f), mad(_4960, 0.125f, 0.75f));
                        }
                        else
                        {
                            float2 _13138;
                            float2 _13145;
                            if (abs(_4747 - 6.0f) < 0.001000000047497451305389404296875f)
                            {
                                float _4990 = mad(_4694, 0.9921875f, 0.00390625f);
                                float _5000 = mad(mad(_4679, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f);
                                _13145 = float2(mad(_4990, 0.25f, 0.75f), _5000);
                                _13138 = float2(mad(_4990, 0.25f, 0.5f), _5000);
                            }
                            else
                            {
                                float2 _16107 = float2(mad(mad(_4694, 0.9921875f, 0.00390625f), 0.25f, 0.75f), mad(mad(_4679, 0.3133362829685211181640625f, 0.0078125f), 0.125f, 0.875f));
                                _13145 = _16107;
                                _13138 = _16107;
                            }
                            _13144 = _13145;
                            _13137 = _13138;
                        }
                        _13143 = _13144;
                        _13136 = _13137;
                    }
                    _13142 = _13143;
                    _13135 = _13136;
                }
                _13141 = _13142;
                _13134 = _13135;
            }
            _13140 = _13141;
            _13133 = _13134;
        }
        _13139 = _13140;
        _13132 = _13133;
    }
    float4 _5066 = lerp(_EnvTex.Sample(__EnvTex_sampler, _13132), _EnvTex.Sample(__EnvTex_sampler, _13139), mad(_3804, 7.0f, -_4747).xxxx);
    float4 _5093 = (float4(-1.0f, -0.0274999998509883880615234375f, -0.572000026702880859375f, 0.02199999988079071044921875f) * _3804) + float4(1.0f, 0.0425000004470348358154296875f, 1.03999996185302734375f, -0.039999999105930328369140625f);
    float _5095 = _5093.x;
    float2 _5113 = (float2(-1.03999996185302734375f, 1.03999996185302734375f) * mad(min(_5095 * _5095, exp2((-9.27999973297119140625f) * _3829)), _5095, _5093.y)) + _5093.zw;
    float3 _4115 = ((((_3847 * _5113.x) + (_5113.y * clamp(50.0f * _3847.y, 0.0f, 1.0f)).xxx) * max(1.0f.xxx, ((((((_3847 * 2.040400028228759765625f) - 0.3323999941349029541015625f.xxx) * 1.0f) + ((_3847 * (-4.79510021209716796875f)) + 0.6417000293731689453125f.xxx)) * 1.0f) + ((_3847 * 2.755199909210205078125f) + 0.69029998779296875f.xxx)) * 1.0f)) * ((_5066.xyz / _5066.w.xxx) * _Env)) * 1.0f;
    float3 _5177 = normalize(-u_DirLightsDirection[0].xyz);
    float _5191 = (u_DirLightsIntensity[0] * u_DirLightsEnabled[0]) * 3.1415920257568359375f;
    float3 _5205 = normalize(_5177 + _3771);
    float _5219 = max(0.0f, dot(_13092, _5177));
    float _5226 = max(0.0f, dot(_13092, _5205));
    float3 _13358;
    float3 _13359;
    if (u_DirLightsEnabled[0] > 0.5f)
    {
        float _5370 = 1.0f - max(0.0f, max(0.0f, dot(_3771, _5205)));
        float _5384 = _5370 * _5370;
        float _5397 = 1.0f - _5219;
        float _5425 = mad(mad(_5226, _3878, -_5226), _5226, 1.0f);
        _13359 = _4115 + ((((((_3847 + ((1.0f.xxx - _3847) * ((_5384 * _5384) * _5370))) * (((_3878 * 0.31830990314483642578125f) / mad(_5425, _5425, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3873, mad(_3829, _5397, _5219), _3829 * mad(_3873, _5397, _5219)) + 9.9999997473787516355514526367188e-06f)))) * _5219) * u_DirLightsColor[0].xyz) * _5191) * 1.0f);
        _13358 = _4108 + ((((_3818 * u_DirLightsColor[0].xyz) * _5191) * (_5219 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13359 = _4115;
        _13358 = _4108;
    }
    float3 _5445 = normalize(-u_DirLightsDirection[1].xyz);
    float _5459 = (u_DirLightsIntensity[1] * u_DirLightsEnabled[1]) * 3.1415920257568359375f;
    float3 _5473 = normalize(_5445 + _3771);
    float _5487 = max(0.0f, dot(_13092, _5445));
    float _5494 = max(0.0f, dot(_13092, _5473));
    float3 _13558;
    float3 _13559;
    if (u_DirLightsEnabled[1] > 0.5f)
    {
        float _5630 = 1.0f - max(0.0f, max(0.0f, dot(_3771, _5473)));
        float _5644 = _5630 * _5630;
        float _5662 = mad(mad(_5494, _3878, -_5494), _5494, 1.0f);
        _13559 = _13359 + ((((((_3847 + ((1.0f.xxx - _3847) * ((_5644 * _5644) * _5630))) * (((_3878 * 0.31830990314483642578125f) / mad(_5662, _5662, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _5487) * u_DirLightsColor[1].xyz) * _5459) * 1.0f);
        _13558 = _13358 + ((((_3818 * u_DirLightsColor[1].xyz) * _5459) * (_5487 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13559 = _13359;
        _13558 = _13358;
    }
    float3 _5682 = normalize(-u_DirLightsDirection[2].xyz);
    float _5696 = (u_DirLightsIntensity[2] * u_DirLightsEnabled[2]) * 3.1415920257568359375f;
    float3 _5710 = normalize(_5682 + _3771);
    float _5724 = max(0.0f, dot(_13092, _5682));
    float _5731 = max(0.0f, dot(_13092, _5710));
    float3 _13769;
    float3 _13770;
    if (u_DirLightsEnabled[2] > 0.5f)
    {
        float _5867 = 1.0f - max(0.0f, max(0.0f, dot(_3771, _5710)));
        float _5881 = _5867 * _5867;
        float _5899 = mad(mad(_5731, _3878, -_5731), _5731, 1.0f);
        _13770 = _13559 + ((((((_3847 + ((1.0f.xxx - _3847) * ((_5881 * _5881) * _5867))) * (((_3878 * 0.31830990314483642578125f) / mad(_5899, _5899, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _5724) * u_DirLightsColor[2].xyz) * _5696) * 1.0f);
        _13769 = _13558 + ((((_3818 * u_DirLightsColor[2].xyz) * _5696) * (_5724 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13770 = _13559;
        _13769 = _13558;
    }
    float3 _5928 = u_PointLightsPosition[0].xyz - v_posWS;
    float _5930 = length(_5928);
    float3 _5934 = _5928 / _5930.xxx;
    float _5948 = (u_PointLightsIntensity[0] * u_PointLightsEnabled[0]) * 3.1415920257568359375f;
    float _5955 = _5930 * u_PointLightsAttenRangeInv[0];
    float _5981 = _5955 * _5955;
    float _5988 = clamp(mad(-_5981, _5981, 1.0f), 0.0f, 1.0f);
    float3 _5969 = (((_5988 * _5988) * mad(_5955, _5955, 1.0f)) * 0.25f).xxx;
    float3 _6005 = normalize(_5934 + _3771);
    float _6019 = max(0.0f, dot(_13092, _5934));
    float _6026 = max(0.0f, dot(_13092, _6005));
    float3 _13991;
    float3 _13992;
    if (u_PointLightsEnabled[0] > 0.5f)
    {
        float _6170 = 1.0f - max(0.0f, max(0.0f, dot(_3771, _6005)));
        float _6184 = _6170 * _6170;
        float _6197 = 1.0f - _6019;
        float _6225 = mad(mad(_6026, _3878, -_6026), _6026, 1.0f);
        _13992 = _13770 + (((((((_3847 + ((1.0f.xxx - _3847) * ((_6184 * _6184) * _6170))) * (((_3878 * 0.31830990314483642578125f) / mad(_6225, _6225, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3873, mad(_3829, _6197, _6019), _3829 * mad(_3873, _6197, _6019)) + 9.9999997473787516355514526367188e-06f)))) * _6019) * u_PointLightsColor[0].xyz) * _5948) * _5969) * 1.0f);
        _13991 = _13769 + (((((_3818 * u_PointLightsColor[0].xyz) * _5948) * _5969) * (_6019 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _13992 = _13770;
        _13991 = _13769;
    }
    float3 _6254 = u_PointLightsPosition[1].xyz - v_posWS;
    float _6256 = length(_6254);
    float3 _6260 = _6254 / _6256.xxx;
    float _6274 = (u_PointLightsIntensity[1] * u_PointLightsEnabled[1]) * 3.1415920257568359375f;
    float _6281 = _6256 * u_PointLightsAttenRangeInv[1];
    float _6307 = _6281 * _6281;
    float _6314 = clamp(mad(-_6307, _6307, 1.0f), 0.0f, 1.0f);
    float3 _6295 = (((_6314 * _6314) * mad(_6281, _6281, 1.0f)) * 0.25f).xxx;
    float3 _6331 = normalize(_6260 + _3771);
    float _6345 = max(0.0f, dot(_13092, _6260));
    float _6352 = max(0.0f, dot(_13092, _6331));
    float3 _14224;
    float3 _14225;
    if (u_PointLightsEnabled[1] > 0.5f)
    {
        float _6488 = 1.0f - max(0.0f, max(0.0f, dot(_3771, _6331)));
        float _6502 = _6488 * _6488;
        float _6520 = mad(mad(_6352, _3878, -_6352), _6352, 1.0f);
        _14225 = _13992 + (((((((_3847 + ((1.0f.xxx - _3847) * ((_6502 * _6502) * _6488))) * (((_3878 * 0.31830990314483642578125f) / mad(_6520, _6520, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _6345) * u_PointLightsColor[1].xyz) * _6274) * _6295) * 1.0f);
        _14224 = _13991 + (((((_3818 * u_PointLightsColor[1].xyz) * _6274) * _6295) * (_6345 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14225 = _13992;
        _14224 = _13991;
    }
    float3 _6551 = u_SpotLightsPosition[0].xyz - v_posWS;
    float _6553 = length(_6551);
    float3 _6557 = _6551 / _6553.xxx;
    float _6571 = (u_SpotLightsIntensity[0] * u_SpotLightsEnabled[0]) * 3.1415920257568359375f;
    float _6578 = _6553 * u_SpotLightsAttenRangeInv[0];
    float _6625 = _6578 * _6578;
    float _6632 = clamp(mad(-_6625, _6625, 1.0f), 0.0f, 1.0f);
    float3 _6613 = ((((_6632 * _6632) * mad(_6578, _6578, 1.0f)) * 0.25f) * smoothstep(u_SpotLightsOuterAngleCos[0], u_SpotLightsInnerAngleCos[0], max(0.0f, dot(_6557, normalize(-u_SpotLightsDirection[0].xyz))))).xxx;
    float3 _6649 = normalize(_6557 + _3771);
    float _6663 = max(0.0f, dot(_13092, _6557));
    float _6670 = max(0.0f, dot(_13092, _6649));
    float3 _14468;
    float3 _14469;
    if (u_SpotLightsEnabled[0] > 0.5f)
    {
        float _6814 = 1.0f - max(0.0f, max(0.0f, dot(_3771, _6649)));
        float _6828 = _6814 * _6814;
        float _6841 = 1.0f - _6663;
        float _6869 = mad(mad(_6670, _3878, -_6670), _6670, 1.0f);
        _14469 = _14225 + (((((((_3847 + ((1.0f.xxx - _3847) * ((_6828 * _6828) * _6814))) * (((_3878 * 0.31830990314483642578125f) / mad(_6869, _6869, 1.0000000116860974230803549289703e-07f)) * (0.5f / (mad(_3873, mad(_3829, _6841, _6663), _3829 * mad(_3873, _6841, _6663)) + 9.9999997473787516355514526367188e-06f)))) * _6663) * u_SpotLightsColor[0].xyz) * _6571) * _6613) * 1.0f);
        _14468 = _14224 + (((((_3818 * u_SpotLightsColor[0].xyz) * _6571) * _6613) * (_6663 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14469 = _14225;
        _14468 = _14224;
    }
    float3 _6900 = u_SpotLightsPosition[1].xyz - v_posWS;
    float _6902 = length(_6900);
    float3 _6906 = _6900 / _6902.xxx;
    float _6920 = (u_SpotLightsIntensity[1] * u_SpotLightsEnabled[1]) * 3.1415920257568359375f;
    float _6927 = _6902 * u_SpotLightsAttenRangeInv[1];
    float _6974 = _6927 * _6927;
    float _6981 = clamp(mad(-_6974, _6974, 1.0f), 0.0f, 1.0f);
    float3 _6962 = ((((_6981 * _6981) * mad(_6927, _6927, 1.0f)) * 0.25f) * smoothstep(u_SpotLightsOuterAngleCos[1], u_SpotLightsInnerAngleCos[1], max(0.0f, dot(_6906, normalize(-u_SpotLightsDirection[1].xyz))))).xxx;
    float3 _6998 = normalize(_6906 + _3771);
    float _7012 = max(0.0f, dot(_13092, _6906));
    float _7019 = max(0.0f, dot(_13092, _6998));
    float3 _14723;
    float3 _14724;
    if (u_SpotLightsEnabled[1] > 0.5f)
    {
        float _7155 = 1.0f - max(0.0f, max(0.0f, dot(_3771, _6998)));
        float _7169 = _7155 * _7155;
        float _7187 = mad(mad(_7019, _3878, -_7019), _7019, 1.0f);
        _14724 = _14469 + (((((((_3847 + ((1.0f.xxx - _3847) * ((_7169 * _7169) * _7155))) * (((_3878 * 0.31830990314483642578125f) / mad(_7187, _7187, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _7012) * u_SpotLightsColor[1].xyz) * _6920) * _6962) * 1.0f);
        _14723 = _14468 + (((((_3818 * u_SpotLightsColor[1].xyz) * _6920) * _6962) * (_7012 * 0.31830990314483642578125f)) * 1.0f);
    }
    else
    {
        _14724 = _14469;
        _14723 = _14468;
    }
    float _7217 = (u_AreaLightsIntensity[0] * u_AreaLightsEnabled[0]) * 3.1415920257568359375f;
    float3 _15485;
    float3 _15526;
    if (u_AreaLightsEnabled[0] > 0.5f)
    {
        float3 _7377;
        float3 _7381;
        bool _7384;
        float3 _15078;
        do
        {
            _7377 = normalize(_3771 - (_13092 * _3829));
            _7381 = cross(_13092, _7377);
            _7384 = u_AreaLightsShape[0] > 0.5f;
            if (_7384)
            {
                float3x3 _7403 = transpose(float3x3(_7377, _7381, _13092));
                float3 _7410 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _7403);
                float3 _7418 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _7403);
                float3 _7426 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _7403);
                float3 _7448 = mul((_7410 + _7426) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7451 = mul((_7418 - _7426) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7454 = mul((_7418 - _7410) * 0.5f, float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                if (u_AreaLightsTwoSide[0] < 0.5f)
                {
                    if (dot(cross(_7451, _7454), _7448) < 0.0f)
                    {
                        _15078 = 0.0f.xxx;
                        break;
                    }
                }
                float _7470 = dot(_7451, _7451);
                float _7473 = dot(_7454, _7454);
                float _7476 = dot(_7451, _7454);
                float _7481 = _7470 * _7473;
                float3 _15033;
                float3 _15034;
                float _15039;
                float _15041;
                if ((abs(_7476) / sqrt(_7481)) > 9.9999997473787516355514526367188e-05f)
                {
                    float _7488 = _7470 + _7473;
                    float _7498 = sqrt(mad(-_7476, _7476, _7481));
                    float _7503 = sqrt(mad(-2.0f, _7498, _7488));
                    float _7509 = sqrt(mad(2.0f, _7498, _7488));
                    float _7513 = mad(0.5f, _7503, 0.5f * _7509);
                    float _7517 = mad(0.5f, _7503, _7509 * (-0.5f));
                    float3 _15031;
                    float3 _15032;
                    if (_7470 > _7473)
                    {
                        float3 _7525 = _7451 * _7476;
                        float _16147 = -_7470;
                        _15032 = _7525 + (_7454 * mad(_7517, _7517, _16147));
                        _15031 = _7525 + (_7454 * mad(_7513, _7513, _16147));
                    }
                    else
                    {
                        float3 _7544 = _7454 * _7476;
                        float _16145 = -_7473;
                        _15032 = _7544 + (_7451 * mad(_7517, _7517, _16145));
                        _15031 = _7544 + (_7451 * mad(_7513, _7513, _16145));
                    }
                    _15041 = 1.0f / (_7517 * _7517);
                    _15039 = 1.0f / (_7513 * _7513);
                    _15034 = normalize(_15032);
                    _15033 = normalize(_15031);
                }
                else
                {
                    float _7573 = 1.0f / _7470;
                    float _7577 = 1.0f / _7473;
                    _15041 = _7577;
                    _15039 = _7573;
                    _15034 = _7454 * sqrt(_7577);
                    _15033 = _7451 * sqrt(_7573);
                }
                float3 _7589 = cross(_15033, _15034);
                float3 _15035;
                if (dot(_7448, _7589) < 0.0f)
                {
                    _15035 = _7589 * (-1.0f);
                }
                else
                {
                    _15035 = _7589;
                }
                float _7600 = dot(_15035, _7448);
                float _7605 = dot(_15033, _7448) / _7600;
                float _7610 = dot(_15034, _7448) / _7600;
                float _7617 = _7600 * _7600;
                float _7619 = _15039 * _7617;
                float _7624 = _15041 * _7617;
                float _7627 = _7619 * _7624;
                float _7634 = mad(_7605, _7605, 1.0f);
                float _16149 = -_7619;
                float4 _12855 = _16189;
                _12855.x = _7627;
                float4 _12857 = _12855;
                _12857.y = mad(-_15041, _7617, mad(_7627, mad(_7610, _7610, _7634), _16149));
                float4 _12859 = _12857;
                _12859.z = mad(-_7624, mad(_7610, _7610, 1.0f), mad(_16149, _7634, 1.0f));
                float2 _7941 = _12859.yz * 0.3333333432674407958984375f.xx;
                float _7943 = _7941.x;
                float4 _12861 = _12859;
                _12861.y = _7943;
                float _7945 = _7941.y;
                float _7956 = -_7945;
                float _7962 = mad(_7956, _7945, _7943);
                float _7965 = -_7943;
                float _7971 = mad(_7965, _7945, _7627);
                float _7980 = dot(float2(_7945, _7965), _12861.xy);
                float _8003 = sqrt(dot(float2(4.0f * _7962, -_7971), float3(_7962, _7971, _7980).zy));
                float _8006 = atan2(_8003, -mad((-2.0f) * _7945, _7962, _7971));
                float _8011 = 2.0f * sqrt(-_7962);
                float _8013 = cos(_8006 * 0.3333333432674407958984375f);
                float _8022 = _8011 * cos(mad(_8006, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _8036 = ((mad(_8011, _8013, _8022) > (2.0f * _7945)) ? (_8011 * _8013) : _8022) - _7945;
                float _8043 = -_7627;
                float _8048 = 2.0f * _7943;
                float _8059 = atan2(_7627 * _8003, -mad(_8043, _7971, _8048 * _7980));
                float _8064 = 2.0f * sqrt(-_7980);
                float _8066 = cos(_8059 * 0.3333333432674407958984375f);
                float _8075 = _8064 * cos(mad(_8059, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _8091 = ((mad(_8064, _8066, _8075) < _8048) ? (_8064 * _8066) : _8075) + _7943;
                float _8109 = mad(-_8036, _8091, _7627);
                float _8135 = _8043 / _8091;
                float _8140 = mad(_7943, _8109, -(_7945 * (_8036 * _8043))) / mad(_7956, _8109, _7943 * _8091);
                float3 _8146 = float3(_8135, _8140, _8036);
                bool _8151 = _8135 < _8140;
                bool _8159;
                if (_8151)
                {
                    _8159 = _8135 < _8036;
                }
                else
                {
                    _8159 = _8151;
                }
                float3 _15046;
                if (_8159)
                {
                    _15046 = _8146.yxz;
                }
                else
                {
                    bool _8168 = _8036 < _8135;
                    bool _8176;
                    if (_8168)
                    {
                        _8176 = _8036 < _8140;
                    }
                    else
                    {
                        _8176 = _8168;
                    }
                    float3 _15047;
                    if (_8176)
                    {
                        _15047 = _8146.xzy;
                    }
                    else
                    {
                        _15047 = _8146;
                    }
                    _15046 = _15047;
                }
                float _16157 = -_15046.y;
                float _7710 = sqrt(_16157 / _15046.z);
                float _7715 = sqrt(_16157 / _15046.x);
                float _7729 = (_7710 * _7715) * rsqrt(mad(_7710, _7710, 1.0f) * mad(_7715, _7715, 1.0f));
                _15078 = (_7729 * u_ltc_mag.Sample(_u_ltc_mag_sampler, (float2(mad(normalize(mul(float3((_7619 * _7605) / mad(_15039, _7617, _16157), (_7624 * _7610) / mad(_15041, _7617, _16157), 1.0f), float3x3(_15033, _15034, _15035))).z, 0.5f, 0.5f), _7729) * 0.984375f) + 0.0078125f.xx).w).xxx;
                break;
            }
            else
            {
                float3x3 _7769 = mul(transpose(float3x3(_7377, _7381, _13092)), float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f)));
                float3 _7776 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _7769);
                float3 _7784 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _7769);
                float3 _7792 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _7769);
                float3 _7800 = mul(u_AreaLightsPoint3[0].xyz - v_posWS, _7769);
                float _8186 = _7776.z;
                int _16190 = int(_8186 > 0.0f);
                float _8193 = _7784.z;
                int _14873;
                if (_8193 > 0.0f)
                {
                    _14873 = _16190 + 2;
                }
                else
                {
                    _14873 = _16190;
                }
                float _8200 = _7792.z;
                int _14877;
                if (_8200 > 0.0f)
                {
                    _14877 = _14873 + 4;
                }
                else
                {
                    _14877 = _14873;
                }
                float _8207 = _7800.z;
                int _14878;
                if (_8207 > 0.0f)
                {
                    _14878 = _14877 + 8;
                }
                else
                {
                    _14878 = _14877;
                }
                int _14889;
                float3 _14905;
                float3 _14925;
                float3 _14947;
                float3 _14965;
                float3 _14983;
                if (_14878 == 0)
                {
                    _14983 = _7784;
                    _14965 = _7792;
                    _14947 = _7800;
                    _14925 = _13094;
                    _14905 = _7776;
                    _14889 = 0;
                }
                else
                {
                    int _14890;
                    float3 _14906;
                    float3 _14930;
                    float3 _14948;
                    float3 _14966;
                    float3 _14984;
                    if (_14878 == 1)
                    {
                        _14984 = (_7776 * (-_8193)) + (_7784 * _8186);
                        _14966 = (_7776 * (-_8207)) + (_7800 * _8186);
                        _14948 = _7800;
                        _14930 = _13094;
                        _14906 = _7776;
                        _14890 = 3;
                    }
                    else
                    {
                        int _14891;
                        float3 _14907;
                        float3 _14931;
                        float3 _14949;
                        float3 _14967;
                        float3 _14985;
                        if (_14878 == 2)
                        {
                            _14985 = _7784;
                            _14967 = (_7784 * (-_8200)) + (_7792 * _8193);
                            _14949 = _7800;
                            _14931 = _13094;
                            _14907 = (_7784 * (-_8186)) + (_7776 * _8193);
                            _14891 = 3;
                        }
                        else
                        {
                            int _14892;
                            float3 _14908;
                            float3 _14932;
                            float3 _14950;
                            float3 _14968;
                            float3 _14986;
                            if (_14878 == 3)
                            {
                                _14986 = _7784;
                                _14968 = (_7784 * (-_8200)) + (_7792 * _8193);
                                _14950 = (_7776 * (-_8207)) + (_7800 * _8186);
                                _14932 = _13094;
                                _14908 = _7776;
                                _14892 = 4;
                            }
                            else
                            {
                                int _14893;
                                float3 _14909;
                                float3 _14933;
                                float3 _14951;
                                float3 _14969;
                                float3 _14987;
                                if (_14878 == 4)
                                {
                                    _14987 = (_7792 * (-_8193)) + (_7784 * _8200);
                                    _14969 = _7792;
                                    _14951 = _7800;
                                    _14933 = _13094;
                                    _14909 = (_7792 * (-_8207)) + (_7800 * _8200);
                                    _14893 = 3;
                                }
                                else
                                {
                                    int _14894;
                                    float3 _14910;
                                    float3 _14934;
                                    float3 _14952;
                                    float3 _14970;
                                    float3 _14988;
                                    if (_14878 == 5)
                                    {
                                        _14988 = _7784;
                                        _14970 = _7792;
                                        _14952 = _7800;
                                        _14934 = _13094;
                                        _14910 = _7776;
                                        _14894 = 0;
                                    }
                                    else
                                    {
                                        int _14895;
                                        float3 _14911;
                                        float3 _14935;
                                        float3 _14953;
                                        float3 _14971;
                                        float3 _14989;
                                        if (_14878 == 6)
                                        {
                                            _14989 = _7784;
                                            _14971 = _7792;
                                            _14953 = (_7792 * (-_8207)) + (_7800 * _8200);
                                            _14935 = _13094;
                                            _14911 = (_7784 * (-_8186)) + (_7776 * _8193);
                                            _14895 = 4;
                                        }
                                        else
                                        {
                                            int _14896;
                                            float3 _14912;
                                            float3 _14936;
                                            float3 _14954;
                                            float3 _14972;
                                            float3 _14990;
                                            if (_14878 == 7)
                                            {
                                                float _8376 = -_8207;
                                                _14990 = _7784;
                                                _14972 = _7792;
                                                _14954 = (_7792 * _8376) + (_7800 * _8200);
                                                _14936 = (_7776 * _8376) + (_7800 * _8186);
                                                _14912 = _7776;
                                                _14896 = 5;
                                            }
                                            else
                                            {
                                                int _14897;
                                                float3 _14913;
                                                float3 _14937;
                                                float3 _14955;
                                                float3 _14973;
                                                float3 _14991;
                                                if (_14878 == 8)
                                                {
                                                    _14991 = (_7800 * (-_8200)) + (_7792 * _8207);
                                                    _14973 = _7800;
                                                    _14955 = _7800;
                                                    _14937 = _13094;
                                                    _14913 = (_7800 * (-_8186)) + (_7776 * _8207);
                                                    _14897 = 3;
                                                }
                                                else
                                                {
                                                    int _14898;
                                                    float3 _14914;
                                                    float3 _14938;
                                                    float3 _14956;
                                                    float3 _14974;
                                                    float3 _14992;
                                                    if (_14878 == 9)
                                                    {
                                                        _14992 = (_7776 * (-_8193)) + (_7784 * _8186);
                                                        _14974 = (_7800 * (-_8200)) + (_7792 * _8207);
                                                        _14956 = _7800;
                                                        _14938 = _13094;
                                                        _14914 = _7776;
                                                        _14898 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _14899;
                                                        float3 _14915;
                                                        float3 _14939;
                                                        float3 _14957;
                                                        float3 _14975;
                                                        float3 _14993;
                                                        if (_14878 == 10)
                                                        {
                                                            _14993 = _7784;
                                                            _14975 = _7792;
                                                            _14957 = _7800;
                                                            _14939 = _13094;
                                                            _14915 = _7776;
                                                            _14899 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _14900;
                                                            float3 _14916;
                                                            float3 _14940;
                                                            float3 _14958;
                                                            float3 _14976;
                                                            float3 _14994;
                                                            if (_14878 == 11)
                                                            {
                                                                float _8476 = -_8200;
                                                                _14994 = _7784;
                                                                _14976 = (_7784 * _8476) + (_7792 * _8193);
                                                                _14958 = (_7800 * _8476) + (_7792 * _8207);
                                                                _14940 = _7800;
                                                                _14916 = _7776;
                                                                _14900 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _14901;
                                                                float3 _14917;
                                                                float3 _14941;
                                                                float3 _14959;
                                                                float3 _14977;
                                                                float3 _14995;
                                                                if (_14878 == 12)
                                                                {
                                                                    _14995 = (_7792 * (-_8193)) + (_7784 * _8200);
                                                                    _14977 = _7792;
                                                                    _14959 = _7800;
                                                                    _14941 = _13094;
                                                                    _14917 = (_7800 * (-_8186)) + (_7776 * _8207);
                                                                    _14901 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _8532 = _14878 == 13;
                                                                    int _14902;
                                                                    float3 _14918;
                                                                    float3 _14942;
                                                                    float3 _14978;
                                                                    float3 _14996;
                                                                    if (_8532)
                                                                    {
                                                                        float _8542 = -_8193;
                                                                        _14996 = (_7776 * _8542) + (_7784 * _8186);
                                                                        _14978 = (_7792 * _8542) + (_7784 * _8200);
                                                                        _14942 = _7800;
                                                                        _14918 = _7776;
                                                                        _14902 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _14903;
                                                                        float3 _14919;
                                                                        float3 _14943;
                                                                        if (_14878 == 14)
                                                                        {
                                                                            float _8572 = -_8186;
                                                                            _14943 = (_7800 * _8572) + (_7776 * _8207);
                                                                            _14919 = (_7784 * _8572) + (_7776 * _8193);
                                                                            _14903 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _14943 = _13094;
                                                                            _14919 = _7776;
                                                                            _14903 = (_14878 == 15) ? 4 : 0;
                                                                        }
                                                                        _14996 = _7784;
                                                                        _14978 = _7792;
                                                                        _14942 = _14943;
                                                                        _14918 = _14919;
                                                                        _14902 = _14903;
                                                                    }
                                                                    bool3 _16193 = _8532.xxx;
                                                                    _14995 = _14996;
                                                                    _14977 = _14978;
                                                                    _14959 = float3(_16193.x ? _7792.x : _7800.x, _16193.y ? _7792.y : _7800.y, _16193.z ? _7792.z : _7800.z);
                                                                    _14941 = _14942;
                                                                    _14917 = _14918;
                                                                    _14901 = _14902;
                                                                }
                                                                _14994 = _14995;
                                                                _14976 = _14977;
                                                                _14958 = _14959;
                                                                _14940 = _14941;
                                                                _14916 = _14917;
                                                                _14900 = _14901;
                                                            }
                                                            _14993 = _14994;
                                                            _14975 = _14976;
                                                            _14957 = _14958;
                                                            _14939 = _14940;
                                                            _14915 = _14916;
                                                            _14899 = _14900;
                                                        }
                                                        _14992 = _14993;
                                                        _14974 = _14975;
                                                        _14956 = _14957;
                                                        _14938 = _14939;
                                                        _14914 = _14915;
                                                        _14898 = _14899;
                                                    }
                                                    _14991 = _14992;
                                                    _14973 = _14974;
                                                    _14955 = _14956;
                                                    _14937 = _14938;
                                                    _14913 = _14914;
                                                    _14897 = _14898;
                                                }
                                                _14990 = _14991;
                                                _14972 = _14973;
                                                _14954 = _14955;
                                                _14936 = _14937;
                                                _14912 = _14913;
                                                _14896 = _14897;
                                            }
                                            _14989 = _14990;
                                            _14971 = _14972;
                                            _14953 = _14954;
                                            _14935 = _14936;
                                            _14911 = _14912;
                                            _14895 = _14896;
                                        }
                                        _14988 = _14989;
                                        _14970 = _14971;
                                        _14952 = _14953;
                                        _14934 = _14935;
                                        _14910 = _14911;
                                        _14894 = _14895;
                                    }
                                    _14987 = _14988;
                                    _14969 = _14970;
                                    _14951 = _14952;
                                    _14933 = _14934;
                                    _14909 = _14910;
                                    _14893 = _14894;
                                }
                                _14986 = _14987;
                                _14968 = _14969;
                                _14950 = _14951;
                                _14932 = _14933;
                                _14908 = _14909;
                                _14892 = _14893;
                            }
                            _14985 = _14986;
                            _14967 = _14968;
                            _14949 = _14950;
                            _14931 = _14932;
                            _14907 = _14908;
                            _14891 = _14892;
                        }
                        _14984 = _14985;
                        _14966 = _14967;
                        _14948 = _14949;
                        _14930 = _14931;
                        _14906 = _14907;
                        _14890 = _14891;
                    }
                    _14983 = _14984;
                    _14965 = _14966;
                    _14947 = _14948;
                    _14925 = _14930;
                    _14905 = _14906;
                    _14889 = _14890;
                }
                bool3 _16195 = (_14889 == 3).xxx;
                bool3 _16197 = (_14889 == 4).xxx;
                if (_14889 == 0)
                {
                    _15078 = 0.0f.xxx;
                    break;
                }
                float3 _7812 = normalize(_14905);
                float3 _7816 = normalize(_14983);
                float3 _7820 = normalize(_14965);
                float3 _7824 = normalize(float3(_16195.x ? _14905.x : _14947.x, _16195.y ? _14905.y : _14947.y, _16195.z ? _14905.z : _14947.z));
                float3 _7828 = normalize(float3(_16197.x ? _14905.x : _14925.x, _16197.y ? _14905.y : _14925.y, _16197.z ? _14905.z : _14925.z));
                float _8649 = dot(_7812, _7816);
                float _8651 = abs(_8649);
                float _8665 = mad(mad(0.01452060043811798095703125f, _8651, 0.4965155124664306640625f), _8651, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8651, _8651, 3.41759395599365234375f);
                float _15001;
                if (_8649 > 0.0f)
                {
                    _15001 = _8665;
                }
                else
                {
                    _15001 = mad(0.5f, rsqrt(max(mad(-_8649, _8649, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8665);
                }
                float _8706 = dot(_7816, _7820);
                float _8708 = abs(_8706);
                float _8722 = mad(mad(0.01452060043811798095703125f, _8708, 0.4965155124664306640625f), _8708, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8708, _8708, 3.41759395599365234375f);
                float _15005;
                if (_8706 > 0.0f)
                {
                    _15005 = _8722;
                }
                else
                {
                    _15005 = mad(0.5f, rsqrt(max(mad(-_8706, _8706, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8722);
                }
                float _8763 = dot(_7820, _7824);
                float _8765 = abs(_8763);
                float _8779 = mad(mad(0.01452060043811798095703125f, _8765, 0.4965155124664306640625f), _8765, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8765, _8765, 3.41759395599365234375f);
                float _15010;
                if (_8763 > 0.0f)
                {
                    _15010 = _8779;
                }
                else
                {
                    _15010 = mad(0.5f, rsqrt(max(mad(-_8763, _8763, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8779);
                }
                float _7850 = ((cross(_7812, _7816) * _15001).z + (cross(_7816, _7820) * _15005).z) + (cross(_7820, _7824) * _15010).z;
                float _15027;
                if (_14889 >= 4)
                {
                    float _8820 = dot(_7824, _7828);
                    float _8822 = abs(_8820);
                    float _8836 = mad(mad(0.01452060043811798095703125f, _8822, 0.4965155124664306640625f), _8822, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8822, _8822, 3.41759395599365234375f);
                    float _15016;
                    if (_8820 > 0.0f)
                    {
                        _15016 = _8836;
                    }
                    else
                    {
                        _15016 = mad(0.5f, rsqrt(max(mad(-_8820, _8820, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8836);
                    }
                    _15027 = _7850 + (cross(_7824, _7828) * _15016).z;
                }
                else
                {
                    _15027 = _7850;
                }
                float _15028;
                if (_14889 == 5)
                {
                    float _8877 = dot(_7828, _7812);
                    float _8879 = abs(_8877);
                    float _8893 = mad(mad(0.01452060043811798095703125f, _8879, 0.4965155124664306640625f), _8879, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _8879, _8879, 3.41759395599365234375f);
                    float _15025;
                    if (_8877 > 0.0f)
                    {
                        _15025 = _8893;
                    }
                    else
                    {
                        _15025 = mad(0.5f, rsqrt(max(mad(-_8877, _8877, 1.0f), 1.0000000116860974230803549289703e-07f)), -_8893);
                    }
                    _15028 = _15027 + (cross(_7828, _7812) * _15025).z;
                }
                else
                {
                    _15028 = _15027;
                }
                if (u_AreaLightsTwoSide[0] > 0.5f)
                {
                    _15078 = abs(_15028).xxx;
                    break;
                }
                _15078 = max(0.0f, _15028).xxx;
                break;
            }
        } while(false);
        float2 _8937 = clamp((float2(_3804, sqrt(1.0f - _3829)) * 0.984375f) + 0.0078125f.xx, 0.0f.xx, 1.0f.xx);
        float4 _8997 = u_ltc_mat.Sample(_u_ltc_mat_sampler, _8937);
        float4 _9001 = (_8997 - 0.5f.xxxx) * 4.0f;
        float3x3 _9024 = float3x3(float3(_9001.x, 0.0f, _9001.y), float3(0.0f, 1.0f, 0.0f), float3(_9001.z, 0.0f, _9001.w));
        float4 _9030 = u_ltc_mag.Sample(_u_ltc_mag_sampler, _8937);
        float3 _15392;
        do
        {
            if (_7384)
            {
                float3x3 _9132 = transpose(float3x3(_7377, _7381, _13092));
                float3 _9139 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _9132);
                float3 _9147 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _9132);
                float3 _9155 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _9132);
                float3 _9177 = mul((_9139 + _9155) * 0.5f, _9024);
                float3 _9180 = mul((_9147 - _9155) * 0.5f, _9024);
                float3 _9183 = mul((_9147 - _9139) * 0.5f, _9024);
                if (u_AreaLightsTwoSide[0] < 0.5f)
                {
                    if (dot(cross(_9180, _9183), _9177) < 0.0f)
                    {
                        _15392 = 0.0f.xxx;
                        break;
                    }
                }
                float _9199 = dot(_9180, _9180);
                float _9202 = dot(_9183, _9183);
                float _9205 = dot(_9180, _9183);
                float _9210 = _9199 * _9202;
                float3 _15347;
                float3 _15348;
                float _15353;
                float _15355;
                if ((abs(_9205) / sqrt(_9210)) > 9.9999997473787516355514526367188e-05f)
                {
                    float _9217 = _9199 + _9202;
                    float _9227 = sqrt(mad(-_9205, _9205, _9210));
                    float _9232 = sqrt(mad(-2.0f, _9227, _9217));
                    float _9238 = sqrt(mad(2.0f, _9227, _9217));
                    float _9242 = mad(0.5f, _9232, 0.5f * _9238);
                    float _9246 = mad(0.5f, _9232, _9238 * (-0.5f));
                    float3 _15345;
                    float3 _15346;
                    if (_9199 > _9202)
                    {
                        float3 _9254 = _9180 * _9205;
                        float _16173 = -_9199;
                        _15346 = _9254 + (_9183 * mad(_9246, _9246, _16173));
                        _15345 = _9254 + (_9183 * mad(_9242, _9242, _16173));
                    }
                    else
                    {
                        float3 _9273 = _9183 * _9205;
                        float _16171 = -_9202;
                        _15346 = _9273 + (_9180 * mad(_9246, _9246, _16171));
                        _15345 = _9273 + (_9180 * mad(_9242, _9242, _16171));
                    }
                    _15355 = 1.0f / (_9246 * _9246);
                    _15353 = 1.0f / (_9242 * _9242);
                    _15348 = normalize(_15346);
                    _15347 = normalize(_15345);
                }
                else
                {
                    float _9302 = 1.0f / _9199;
                    float _9306 = 1.0f / _9202;
                    _15355 = _9306;
                    _15353 = _9302;
                    _15348 = _9183 * sqrt(_9306);
                    _15347 = _9180 * sqrt(_9302);
                }
                float3 _9318 = cross(_15347, _15348);
                float3 _15349;
                if (dot(_9177, _9318) < 0.0f)
                {
                    _15349 = _9318 * (-1.0f);
                }
                else
                {
                    _15349 = _9318;
                }
                float _9329 = dot(_15349, _9177);
                float _9334 = dot(_15347, _9177) / _9329;
                float _9339 = dot(_15348, _9177) / _9329;
                float _9346 = _9329 * _9329;
                float _9348 = _15353 * _9346;
                float _9353 = _15355 * _9346;
                float _9356 = _9348 * _9353;
                float _9363 = mad(_9334, _9334, 1.0f);
                float _16175 = -_9348;
                float4 _12971 = _16189;
                _12971.x = _9356;
                float4 _12973 = _12971;
                _12973.y = mad(-_15355, _9346, mad(_9356, mad(_9339, _9339, _9363), _16175));
                float4 _12975 = _12973;
                _12975.z = mad(-_9353, mad(_9339, _9339, 1.0f), mad(_16175, _9363, 1.0f));
                float2 _9670 = _12975.yz * 0.3333333432674407958984375f.xx;
                float _9672 = _9670.x;
                float4 _12977 = _12975;
                _12977.y = _9672;
                float _9674 = _9670.y;
                float _9685 = -_9674;
                float _9691 = mad(_9685, _9674, _9672);
                float _9694 = -_9672;
                float _9700 = mad(_9694, _9674, _9356);
                float _9709 = dot(float2(_9674, _9694), _12977.xy);
                float _9732 = sqrt(dot(float2(4.0f * _9691, -_9700), float3(_9691, _9700, _9709).zy));
                float _9735 = atan2(_9732, -mad((-2.0f) * _9674, _9691, _9700));
                float _9740 = 2.0f * sqrt(-_9691);
                float _9742 = cos(_9735 * 0.3333333432674407958984375f);
                float _9751 = _9740 * cos(mad(_9735, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _9765 = ((mad(_9740, _9742, _9751) > (2.0f * _9674)) ? (_9740 * _9742) : _9751) - _9674;
                float _9772 = -_9356;
                float _9777 = 2.0f * _9672;
                float _9788 = atan2(_9356 * _9732, -mad(_9772, _9700, _9777 * _9709));
                float _9793 = 2.0f * sqrt(-_9709);
                float _9795 = cos(_9788 * 0.3333333432674407958984375f);
                float _9804 = _9793 * cos(mad(_9788, 0.3333333432674407958984375f, 2.094395160675048828125f));
                float _9820 = ((mad(_9793, _9795, _9804) < _9777) ? (_9793 * _9795) : _9804) + _9672;
                float _9838 = mad(-_9765, _9820, _9356);
                float _9864 = _9772 / _9820;
                float _9869 = mad(_9672, _9838, -(_9674 * (_9765 * _9772))) / mad(_9685, _9838, _9672 * _9820);
                float3 _9875 = float3(_9864, _9869, _9765);
                bool _9880 = _9864 < _9869;
                bool _9888;
                if (_9880)
                {
                    _9888 = _9864 < _9765;
                }
                else
                {
                    _9888 = _9880;
                }
                float3 _15360;
                if (_9888)
                {
                    _15360 = _9875.yxz;
                }
                else
                {
                    bool _9897 = _9765 < _9864;
                    bool _9905;
                    if (_9897)
                    {
                        _9905 = _9765 < _9869;
                    }
                    else
                    {
                        _9905 = _9897;
                    }
                    float3 _15361;
                    if (_9905)
                    {
                        _15361 = _9875.xzy;
                    }
                    else
                    {
                        _15361 = _9875;
                    }
                    _15360 = _15361;
                }
                float _16181 = -_15360.y;
                float _9439 = sqrt(_16181 / _15360.z);
                float _9444 = sqrt(_16181 / _15360.x);
                float _9458 = (_9439 * _9444) * rsqrt(mad(_9439, _9439, 1.0f) * mad(_9444, _9444, 1.0f));
                _15392 = (_9458 * u_ltc_mag.Sample(_u_ltc_mag_sampler, (float2(mad(normalize(mul(float3((_9348 * _9334) / mad(_15353, _9346, _16181), (_9353 * _9339) / mad(_15355, _9346, _16181), 1.0f), float3x3(_15347, _15348, _15349))).z, 0.5f, 0.5f), _9458) * 0.984375f) + 0.0078125f.xx).w).xxx;
                break;
            }
            else
            {
                float3x3 _9498 = mul(transpose(float3x3(_7377, _7381, _13092)), _9024);
                float3 _9505 = mul(u_AreaLightsPoint0[0].xyz - v_posWS, _9498);
                float3 _9513 = mul(u_AreaLightsPoint1[0].xyz - v_posWS, _9498);
                float3 _9521 = mul(u_AreaLightsPoint2[0].xyz - v_posWS, _9498);
                float3 _9529 = mul(u_AreaLightsPoint3[0].xyz - v_posWS, _9498);
                float _9915 = _9505.z;
                int _16201 = int(_9915 > 0.0f);
                float _9922 = _9513.z;
                int _15187;
                if (_9922 > 0.0f)
                {
                    _15187 = _16201 + 2;
                }
                else
                {
                    _15187 = _16201;
                }
                float _9929 = _9521.z;
                int _15191;
                if (_9929 > 0.0f)
                {
                    _15191 = _15187 + 4;
                }
                else
                {
                    _15191 = _15187;
                }
                float _9936 = _9529.z;
                int _15192;
                if (_9936 > 0.0f)
                {
                    _15192 = _15191 + 8;
                }
                else
                {
                    _15192 = _15191;
                }
                int _15203;
                float3 _15219;
                float3 _15239;
                float3 _15261;
                float3 _15279;
                float3 _15297;
                if (_15192 == 0)
                {
                    _15297 = _9513;
                    _15279 = _9521;
                    _15261 = _9529;
                    _15239 = _13094;
                    _15219 = _9505;
                    _15203 = 0;
                }
                else
                {
                    int _15204;
                    float3 _15220;
                    float3 _15244;
                    float3 _15262;
                    float3 _15280;
                    float3 _15298;
                    if (_15192 == 1)
                    {
                        _15298 = (_9505 * (-_9922)) + (_9513 * _9915);
                        _15280 = (_9505 * (-_9936)) + (_9529 * _9915);
                        _15262 = _9529;
                        _15244 = _13094;
                        _15220 = _9505;
                        _15204 = 3;
                    }
                    else
                    {
                        int _15205;
                        float3 _15221;
                        float3 _15245;
                        float3 _15263;
                        float3 _15281;
                        float3 _15299;
                        if (_15192 == 2)
                        {
                            _15299 = _9513;
                            _15281 = (_9513 * (-_9929)) + (_9521 * _9922);
                            _15263 = _9529;
                            _15245 = _13094;
                            _15221 = (_9513 * (-_9915)) + (_9505 * _9922);
                            _15205 = 3;
                        }
                        else
                        {
                            int _15206;
                            float3 _15222;
                            float3 _15246;
                            float3 _15264;
                            float3 _15282;
                            float3 _15300;
                            if (_15192 == 3)
                            {
                                _15300 = _9513;
                                _15282 = (_9513 * (-_9929)) + (_9521 * _9922);
                                _15264 = (_9505 * (-_9936)) + (_9529 * _9915);
                                _15246 = _13094;
                                _15222 = _9505;
                                _15206 = 4;
                            }
                            else
                            {
                                int _15207;
                                float3 _15223;
                                float3 _15247;
                                float3 _15265;
                                float3 _15283;
                                float3 _15301;
                                if (_15192 == 4)
                                {
                                    _15301 = (_9521 * (-_9922)) + (_9513 * _9929);
                                    _15283 = _9521;
                                    _15265 = _9529;
                                    _15247 = _13094;
                                    _15223 = (_9521 * (-_9936)) + (_9529 * _9929);
                                    _15207 = 3;
                                }
                                else
                                {
                                    int _15208;
                                    float3 _15224;
                                    float3 _15248;
                                    float3 _15266;
                                    float3 _15284;
                                    float3 _15302;
                                    if (_15192 == 5)
                                    {
                                        _15302 = _9513;
                                        _15284 = _9521;
                                        _15266 = _9529;
                                        _15248 = _13094;
                                        _15224 = _9505;
                                        _15208 = 0;
                                    }
                                    else
                                    {
                                        int _15209;
                                        float3 _15225;
                                        float3 _15249;
                                        float3 _15267;
                                        float3 _15285;
                                        float3 _15303;
                                        if (_15192 == 6)
                                        {
                                            _15303 = _9513;
                                            _15285 = _9521;
                                            _15267 = (_9521 * (-_9936)) + (_9529 * _9929);
                                            _15249 = _13094;
                                            _15225 = (_9513 * (-_9915)) + (_9505 * _9922);
                                            _15209 = 4;
                                        }
                                        else
                                        {
                                            int _15210;
                                            float3 _15226;
                                            float3 _15250;
                                            float3 _15268;
                                            float3 _15286;
                                            float3 _15304;
                                            if (_15192 == 7)
                                            {
                                                float _10105 = -_9936;
                                                _15304 = _9513;
                                                _15286 = _9521;
                                                _15268 = (_9521 * _10105) + (_9529 * _9929);
                                                _15250 = (_9505 * _10105) + (_9529 * _9915);
                                                _15226 = _9505;
                                                _15210 = 5;
                                            }
                                            else
                                            {
                                                int _15211;
                                                float3 _15227;
                                                float3 _15251;
                                                float3 _15269;
                                                float3 _15287;
                                                float3 _15305;
                                                if (_15192 == 8)
                                                {
                                                    _15305 = (_9529 * (-_9929)) + (_9521 * _9936);
                                                    _15287 = _9529;
                                                    _15269 = _9529;
                                                    _15251 = _13094;
                                                    _15227 = (_9529 * (-_9915)) + (_9505 * _9936);
                                                    _15211 = 3;
                                                }
                                                else
                                                {
                                                    int _15212;
                                                    float3 _15228;
                                                    float3 _15252;
                                                    float3 _15270;
                                                    float3 _15288;
                                                    float3 _15306;
                                                    if (_15192 == 9)
                                                    {
                                                        _15306 = (_9505 * (-_9922)) + (_9513 * _9915);
                                                        _15288 = (_9529 * (-_9929)) + (_9521 * _9936);
                                                        _15270 = _9529;
                                                        _15252 = _13094;
                                                        _15228 = _9505;
                                                        _15212 = 4;
                                                    }
                                                    else
                                                    {
                                                        int _15213;
                                                        float3 _15229;
                                                        float3 _15253;
                                                        float3 _15271;
                                                        float3 _15289;
                                                        float3 _15307;
                                                        if (_15192 == 10)
                                                        {
                                                            _15307 = _9513;
                                                            _15289 = _9521;
                                                            _15271 = _9529;
                                                            _15253 = _13094;
                                                            _15229 = _9505;
                                                            _15213 = 0;
                                                        }
                                                        else
                                                        {
                                                            int _15214;
                                                            float3 _15230;
                                                            float3 _15254;
                                                            float3 _15272;
                                                            float3 _15290;
                                                            float3 _15308;
                                                            if (_15192 == 11)
                                                            {
                                                                float _10205 = -_9929;
                                                                _15308 = _9513;
                                                                _15290 = (_9513 * _10205) + (_9521 * _9922);
                                                                _15272 = (_9529 * _10205) + (_9521 * _9936);
                                                                _15254 = _9529;
                                                                _15230 = _9505;
                                                                _15214 = 5;
                                                            }
                                                            else
                                                            {
                                                                int _15215;
                                                                float3 _15231;
                                                                float3 _15255;
                                                                float3 _15273;
                                                                float3 _15291;
                                                                float3 _15309;
                                                                if (_15192 == 12)
                                                                {
                                                                    _15309 = (_9521 * (-_9922)) + (_9513 * _9929);
                                                                    _15291 = _9521;
                                                                    _15273 = _9529;
                                                                    _15255 = _13094;
                                                                    _15231 = (_9529 * (-_9915)) + (_9505 * _9936);
                                                                    _15215 = 4;
                                                                }
                                                                else
                                                                {
                                                                    bool _10261 = _15192 == 13;
                                                                    int _15216;
                                                                    float3 _15232;
                                                                    float3 _15256;
                                                                    float3 _15292;
                                                                    float3 _15310;
                                                                    if (_10261)
                                                                    {
                                                                        float _10271 = -_9922;
                                                                        _15310 = (_9505 * _10271) + (_9513 * _9915);
                                                                        _15292 = (_9521 * _10271) + (_9513 * _9929);
                                                                        _15256 = _9529;
                                                                        _15232 = _9505;
                                                                        _15216 = 5;
                                                                    }
                                                                    else
                                                                    {
                                                                        int _15217;
                                                                        float3 _15233;
                                                                        float3 _15257;
                                                                        if (_15192 == 14)
                                                                        {
                                                                            float _10301 = -_9915;
                                                                            _15257 = (_9529 * _10301) + (_9505 * _9936);
                                                                            _15233 = (_9513 * _10301) + (_9505 * _9922);
                                                                            _15217 = 5;
                                                                        }
                                                                        else
                                                                        {
                                                                            _15257 = _13094;
                                                                            _15233 = _9505;
                                                                            _15217 = (_15192 == 15) ? 4 : 0;
                                                                        }
                                                                        _15310 = _9513;
                                                                        _15292 = _9521;
                                                                        _15256 = _15257;
                                                                        _15232 = _15233;
                                                                        _15216 = _15217;
                                                                    }
                                                                    bool3 _16203 = _10261.xxx;
                                                                    _15309 = _15310;
                                                                    _15291 = _15292;
                                                                    _15273 = float3(_16203.x ? _9521.x : _9529.x, _16203.y ? _9521.y : _9529.y, _16203.z ? _9521.z : _9529.z);
                                                                    _15255 = _15256;
                                                                    _15231 = _15232;
                                                                    _15215 = _15216;
                                                                }
                                                                _15308 = _15309;
                                                                _15290 = _15291;
                                                                _15272 = _15273;
                                                                _15254 = _15255;
                                                                _15230 = _15231;
                                                                _15214 = _15215;
                                                            }
                                                            _15307 = _15308;
                                                            _15289 = _15290;
                                                            _15271 = _15272;
                                                            _15253 = _15254;
                                                            _15229 = _15230;
                                                            _15213 = _15214;
                                                        }
                                                        _15306 = _15307;
                                                        _15288 = _15289;
                                                        _15270 = _15271;
                                                        _15252 = _15253;
                                                        _15228 = _15229;
                                                        _15212 = _15213;
                                                    }
                                                    _15305 = _15306;
                                                    _15287 = _15288;
                                                    _15269 = _15270;
                                                    _15251 = _15252;
                                                    _15227 = _15228;
                                                    _15211 = _15212;
                                                }
                                                _15304 = _15305;
                                                _15286 = _15287;
                                                _15268 = _15269;
                                                _15250 = _15251;
                                                _15226 = _15227;
                                                _15210 = _15211;
                                            }
                                            _15303 = _15304;
                                            _15285 = _15286;
                                            _15267 = _15268;
                                            _15249 = _15250;
                                            _15225 = _15226;
                                            _15209 = _15210;
                                        }
                                        _15302 = _15303;
                                        _15284 = _15285;
                                        _15266 = _15267;
                                        _15248 = _15249;
                                        _15224 = _15225;
                                        _15208 = _15209;
                                    }
                                    _15301 = _15302;
                                    _15283 = _15284;
                                    _15265 = _15266;
                                    _15247 = _15248;
                                    _15223 = _15224;
                                    _15207 = _15208;
                                }
                                _15300 = _15301;
                                _15282 = _15283;
                                _15264 = _15265;
                                _15246 = _15247;
                                _15222 = _15223;
                                _15206 = _15207;
                            }
                            _15299 = _15300;
                            _15281 = _15282;
                            _15263 = _15264;
                            _15245 = _15246;
                            _15221 = _15222;
                            _15205 = _15206;
                        }
                        _15298 = _15299;
                        _15280 = _15281;
                        _15262 = _15263;
                        _15244 = _15245;
                        _15220 = _15221;
                        _15204 = _15205;
                    }
                    _15297 = _15298;
                    _15279 = _15280;
                    _15261 = _15262;
                    _15239 = _15244;
                    _15219 = _15220;
                    _15203 = _15204;
                }
                bool3 _16205 = (_15203 == 3).xxx;
                bool3 _16207 = (_15203 == 4).xxx;
                if (_15203 == 0)
                {
                    _15392 = 0.0f.xxx;
                    break;
                }
                float3 _9541 = normalize(_15219);
                float3 _9545 = normalize(_15297);
                float3 _9549 = normalize(_15279);
                float3 _9553 = normalize(float3(_16205.x ? _15219.x : _15261.x, _16205.y ? _15219.y : _15261.y, _16205.z ? _15219.z : _15261.z));
                float3 _9557 = normalize(float3(_16207.x ? _15219.x : _15239.x, _16207.y ? _15219.y : _15239.y, _16207.z ? _15219.z : _15239.z));
                float _10378 = dot(_9541, _9545);
                float _10380 = abs(_10378);
                float _10394 = mad(mad(0.01452060043811798095703125f, _10380, 0.4965155124664306640625f), _10380, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10380, _10380, 3.41759395599365234375f);
                float _15315;
                if (_10378 > 0.0f)
                {
                    _15315 = _10394;
                }
                else
                {
                    _15315 = mad(0.5f, rsqrt(max(mad(-_10378, _10378, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10394);
                }
                float _10435 = dot(_9545, _9549);
                float _10437 = abs(_10435);
                float _10451 = mad(mad(0.01452060043811798095703125f, _10437, 0.4965155124664306640625f), _10437, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10437, _10437, 3.41759395599365234375f);
                float _15319;
                if (_10435 > 0.0f)
                {
                    _15319 = _10451;
                }
                else
                {
                    _15319 = mad(0.5f, rsqrt(max(mad(-_10435, _10435, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10451);
                }
                float _10492 = dot(_9549, _9553);
                float _10494 = abs(_10492);
                float _10508 = mad(mad(0.01452060043811798095703125f, _10494, 0.4965155124664306640625f), _10494, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10494, _10494, 3.41759395599365234375f);
                float _15324;
                if (_10492 > 0.0f)
                {
                    _15324 = _10508;
                }
                else
                {
                    _15324 = mad(0.5f, rsqrt(max(mad(-_10492, _10492, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10508);
                }
                float _9579 = ((cross(_9541, _9545) * _15315).z + (cross(_9545, _9549) * _15319).z) + (cross(_9549, _9553) * _15324).z;
                float _15341;
                if (_15203 >= 4)
                {
                    float _10549 = dot(_9553, _9557);
                    float _10551 = abs(_10549);
                    float _10565 = mad(mad(0.01452060043811798095703125f, _10551, 0.4965155124664306640625f), _10551, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10551, _10551, 3.41759395599365234375f);
                    float _15330;
                    if (_10549 > 0.0f)
                    {
                        _15330 = _10565;
                    }
                    else
                    {
                        _15330 = mad(0.5f, rsqrt(max(mad(-_10549, _10549, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10565);
                    }
                    _15341 = _9579 + (cross(_9553, _9557) * _15330).z;
                }
                else
                {
                    _15341 = _9579;
                }
                float _15342;
                if (_15203 == 5)
                {
                    float _10606 = dot(_9557, _9541);
                    float _10608 = abs(_10606);
                    float _10622 = mad(mad(0.01452060043811798095703125f, _10608, 0.4965155124664306640625f), _10608, 0.8543984889984130859375f) / mad(4.1616725921630859375f + _10608, _10608, 3.41759395599365234375f);
                    float _15339;
                    if (_10606 > 0.0f)
                    {
                        _15339 = _10622;
                    }
                    else
                    {
                        _15339 = mad(0.5f, rsqrt(max(mad(-_10606, _10606, 1.0f), 1.0000000116860974230803549289703e-07f)), -_10622);
                    }
                    _15342 = _15341 + (cross(_9557, _9541) * _15339).z;
                }
                else
                {
                    _15342 = _15341;
                }
                if (u_AreaLightsTwoSide[0] > 0.5f)
                {
                    _15392 = abs(_15342).xxx;
                    break;
                }
                _15392 = max(0.0f, _15342).xxx;
                break;
            }
        } while(false);
        _15526 = _14724 + (((u_AreaLightsColor[0].xyz * _7217) * (((_3847 * _9030.x) + ((1.0f.xxx - _3847) * _9030.y)) * _15392)) * 1.0f);
        _15485 = _14723 + ((((_3818 * u_AreaLightsColor[0].xyz) * _7217) * _15078) * 1.0f);
    }
    else
    {
        _15526 = _14724;
        _15485 = _14723;
    }
    float _10666 = (u_AreaLightsIntensity[1] * u_AreaLightsEnabled[1]) * 3.1415920257568359375f;
    float3 _16052;
    float3 _16053;
    if (u_AreaLightsEnabled[1] > 0.5f)
    {
        float _10819 = 1.0f - max(0.0f, _13175);
        float _10833 = _10819 * _10819;
        float _10851 = mad(mad(_13175, _3878, -_13175), _13175, 1.0f);
        _16053 = _15526 + (((((_3847 + ((1.0f.xxx - _3847) * ((_10833 * _10833) * _10819))) * (((_3878 * 0.31830990314483642578125f) / mad(_10851, _10851, 1.0000000116860974230803549289703e-07f)) * 0.25f)) * _13175) * u_AreaLightsColor[1].xyz) * _10666);
        _16052 = _15485 + (((_3818 * u_AreaLightsColor[1].xyz) * _10666) * (_13175 * 0.31830990314483642578125f));
    }
    else
    {
        _16053 = _15526;
        _16052 = _15485;
    }
    float3 _10873 = pow(max(_16052 + _16053, 9.9999997473787516355514526367188e-06f.xxx), 0.4545454680919647216796875f.xxx);
    float _3736 = _10873.x;
    float _3737 = _10873.y;
    float _3738 = _10873.z;
    float4 _10904 = u_FBOTexture.Sample(_u_FBOTexture_sampler, ((v_gl_pos.xy / v_gl_pos.w.xx) * 0.5f) + 0.5f.xx);
    float _10929 = _10904.x;
    float _16054;
    if (_10929 < 0.5f)
    {
        _16054 = (2.0f * _10929) * _3736;
    }
    else
    {
        _16054 = mad((1.0f - _10929) * (-2.0f), 1.0f - _3736, 1.0f);
    }
    float _10934 = _10904.y;
    float _16055;
    if (_10934 < 0.5f)
    {
        _16055 = (2.0f * _10934) * _3737;
    }
    else
    {
        _16055 = mad((1.0f - _10934) * (-2.0f), 1.0f - _3737, 1.0f);
    }
    float _10939 = _10904.z;
    float _16056;
    if (_10939 < 0.5f)
    {
        _16056 = (2.0f * _10939) * _3738;
    }
    else
    {
        _16056 = mad((1.0f - _10939) * (-2.0f), 1.0f - _3738, 1.0f);
    }
    float3 _10919 = (float3(_16054, _16055, _16056) * _AlbedoColor.w) + (_10904.xyz * (1.0f - _AlbedoColor.w));
    float4 _13087 = float4(_3736, _3737, _3738, _AlbedoColor.w);
    _13087.x = _10919.x;
    float4 _13089 = _13087;
    _13089.y = _10919.y;
    float4 _13091 = _13089;
    _13091.z = _10919.z;
    o_fragColor = _13091;
}

SPIRV_Cross_Output main(SPIRV_Cross_Input stage_input)
{
    v_nDirWS = stage_input.v_nDirWS;
    v_posWS = stage_input.v_posWS;
    v_gl_pos = stage_input.v_gl_pos;
    frag_main();
    SPIRV_Cross_Output stage_output;
    stage_output.o_fragColor = o_fragColor;
    return stage_output;
}
