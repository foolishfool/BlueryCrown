#version 300 es
precision highp float;
precision highp int;

uniform vec4 u_WorldSpaceCameraPos;
uniform float u_DirLightsEnabled[3];
uniform float u_DirLightNum;
uniform vec4 u_DirLightsDirection[3];
uniform vec4 u_DirLightsColor[3];
uniform float u_DirLightsIntensity[3];
uniform float u_PointLightsEnabled[2];
uniform float u_PointLightNum;
uniform vec4 u_PointLightsPosition[2];
uniform vec4 u_PointLightsColor[2];
uniform float u_PointLightsIntensity[2];
uniform float u_PointLightsAttenRangeInv[2];
uniform float u_SpotLightsEnabled[2];
uniform float u_SpotLightNum;
uniform vec4 u_SpotLightsPosition[2];
uniform vec4 u_SpotLightsColor[2];
uniform float u_SpotLightsIntensity[2];
uniform float u_SpotLightsAttenRangeInv[2];
uniform vec4 u_SpotLightsDirection[2];
uniform float u_SpotLightsOuterAngleCos[2];
uniform float u_SpotLightsInnerAngleCos[2];
uniform float _AmbientIntensity;
uniform float _AmbientRotation;
uniform vec4 _AlbedoColor;
uniform mediump sampler2D _AlbedoTexture;
uniform float _Metallic;
uniform float _Roughness;
uniform mediump sampler2D _EmissiveTexture;
uniform vec4 _EmissiveColor;
uniform float _EmissiveIntensity;
uniform mediump sampler2D _AmbientTexture;

in vec3 v_posWS;
in vec3 v_nDirWS;
in vec2 v_uv0;
layout(location = 0) out vec4 glResult;

float _6766;

void main()
{
    mediump vec4 _2088 = texture(_AlbedoTexture, v_uv0);
    vec3 _2094 = vec3(pow(_AlbedoColor.x, 2.2000000476837158203125), pow(_AlbedoColor.y, 2.2000000476837158203125), pow(_AlbedoColor.z, 2.2000000476837158203125)) * vec3(pow(_2088.x, 2.2000000476837158203125), pow(_2088.y, 2.2000000476837158203125), pow(_2088.z, 2.2000000476837158203125));
    vec3 _2112 = normalize(v_nDirWS);
    mediump vec4 _2117 = texture(_EmissiveTexture, v_uv0);
    float _2526 = clamp(_Metallic, 0.0, 1.0);
    float _2425 = clamp(_Roughness, 0.07999999821186065673828125, 1.0);
    float _2531 = _2425 * _2425;
    float _2536 = _2531 * _2531;
    vec3 _2449 = _2094 * (0.959999978542327880859375 * (1.0 - _2526));
    vec3 _2456 = mix(vec3(0.039999999105930328369140625), _2094, vec3(_2526));
    vec3 _2491 = normalize(u_WorldSpaceCameraPos.xyz - v_posWS);
    vec3 _6599;
    if (dot(_2491, _2112) < 0.0)
    {
        _6599 = reflect(_2491, _2112);
    }
    else
    {
        _6599 = _2491;
    }
    vec3 _2517 = normalize(reflect(-_6599, _2112));
    float _2559 = max(0.0, dot(_2112, _6599));
    float _2582 = min(1.0 + dot(_2517, _2112), 1.0);
    float _2588 = clamp(pow(_2559 + 1.0, exp2((-16.0) * _2425 + (-1.0))), 0.0, 1.0) * (_2582 * _2582);
    float _2652 = u_DirLightsEnabled[0] * step(0.5, u_DirLightNum);
    vec3 _2659 = normalize(-u_DirLightsDirection[0].xyz);
    float _2671 = u_DirLightsIntensity[0] * _2652;
    float _2686 = u_DirLightsEnabled[1] * step(1.5, u_DirLightNum);
    vec3 _2693 = normalize(-u_DirLightsDirection[1].xyz);
    float _2705 = u_DirLightsIntensity[1] * _2686;
    float _2720 = u_DirLightsEnabled[2] * step(2.5, u_DirLightNum);
    vec3 _2727 = normalize(-u_DirLightsDirection[2].xyz);
    float _2739 = u_DirLightsIntensity[2] * _2720;
    float _2761 = u_PointLightsEnabled[0] * step(0.5, u_PointLightNum);
    vec3 _2769 = u_PointLightsPosition[0].xyz - v_posWS;
    float _2771 = length(_2769);
    vec3 _2775 = _2769 / vec3(_2771);
    float _2787 = u_PointLightsIntensity[0] * _2761;
    float _2793 = _2771 * u_PointLightsAttenRangeInv[0];
    float _2815 = _2793 * _2793;
    float _2822 = clamp((-_2815) * _2815 + 1.0, 0.0, 1.0);
    vec3 _2807 = vec3(((_2822 * _2822) * (_2793 * _2793 + 1.0)) * 0.25);
    float _2851 = u_PointLightsEnabled[1] * step(1.5, u_PointLightNum);
    vec3 _2859 = u_PointLightsPosition[1].xyz - v_posWS;
    float _2861 = length(_2859);
    vec3 _2865 = _2859 / vec3(_2861);
    float _2877 = u_PointLightsIntensity[1] * _2851;
    float _2883 = _2861 * u_PointLightsAttenRangeInv[1];
    float _2905 = _2883 * _2883;
    float _2912 = clamp((-_2905) * _2905 + 1.0, 0.0, 1.0);
    vec3 _2897 = vec3(((_2912 * _2912) * (_2883 * _2883 + 1.0)) * 0.25);
    float _2943 = u_SpotLightsEnabled[0] * step(0.5, u_SpotLightNum);
    vec3 _2951 = u_SpotLightsPosition[0].xyz - v_posWS;
    float _2953 = length(_2951);
    vec3 _2957 = _2951 / vec3(_2953);
    float _2969 = u_SpotLightsIntensity[0] * _2943;
    float _2975 = _2953 * u_SpotLightsAttenRangeInv[0];
    float _3018 = _2975 * _2975;
    float _3025 = clamp((-_3018) * _3018 + 1.0, 0.0, 1.0);
    vec3 _3010 = vec3((((_3025 * _3025) * (_2975 * _2975 + 1.0)) * 0.25) * smoothstep(u_SpotLightsOuterAngleCos[0], u_SpotLightsInnerAngleCos[0], max(0.0, dot(_2957, normalize(-u_SpotLightsDirection[0].xyz)))));
    float _3056 = u_SpotLightsEnabled[1] * step(1.5, u_SpotLightNum);
    vec3 _3064 = u_SpotLightsPosition[1].xyz - v_posWS;
    float _3066 = length(_3064);
    vec3 _3070 = _3064 / vec3(_3066);
    float _3082 = u_SpotLightsIntensity[1] * _3056;
    float _3088 = _3066 * u_SpotLightsAttenRangeInv[1];
    float _3131 = _3088 * _3088;
    float _3138 = clamp((-_3131) * _3131 + 1.0, 0.0, 1.0);
    vec3 _3123 = vec3((((_3138 * _3138) * (_3088 * _3088 + 1.0)) * 0.25) * smoothstep(u_SpotLightsOuterAngleCos[1], u_SpotLightsInnerAngleCos[1], max(0.0, dot(_3070, normalize(-u_SpotLightsDirection[1].xyz)))));
    vec3 _3415 = normalize(_2112);
    float _3418 = -_3415.z;
    float _3420 = _3415.x;
    float _3427 = acos(_3415.y);
    float _3433 = (((_3420 < 0.0) ? (-1.0) : 1.0) * acos(clamp(_3418 / length(vec2(_3420, _3418)), -1.0, 1.0)) + (-1.57079637050628662109375)) * 0.15915493667125701904296875 + _AmbientRotation;
    float _3442 = fract((_3433 + floor(_3433)) + 1.0);
    vec2 _6358 = vec2(_6766, _3427 * 0.3183098733425140380859375);
    _6358.x = _3442;
    float _3470 = floor(7.0);
    vec2 _6606;
    vec2 _6614;
    if (abs(_3470) < 0.001000000047497451305389404296875)
    {
        _6614 = vec2((_3442 * 0.99609375 + 0.001953125) * 0.5, (_3427 * 0.315823078155517578125 + 0.00390625) * 0.25 + 0.5);
        _6606 = vec2(_3442 * 0.998046875 + 0.0009765625, (_3427 * 0.3170664608478546142578125 + 0.001953125) * 0.5);
    }
    else
    {
        vec2 _6607;
        vec2 _6615;
        if (abs(_3470 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _3523 = _3442 * 0.99609375 + 0.001953125;
            float _3533 = (_3427 * 0.315823078155517578125 + 0.00390625) * 0.25 + 0.5;
            _6615 = vec2(_3523 * 0.5 + 0.5, _3533);
            _6607 = vec2(_3523 * 0.5, _3533);
        }
        else
        {
            vec2 _6608;
            vec2 _6616;
            if (abs(_3470 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _3561 = _3442 * 0.99609375 + 0.001953125;
                float _3569 = _3427 * 0.315823078155517578125 + 0.00390625;
                _6616 = vec2(_3561 * 0.5, _3569 * 0.25 + 0.75);
                _6608 = vec2(_3561 * 0.5 + 0.5, _3569 * 0.25 + 0.5);
            }
            else
            {
                vec2 _6609;
                vec2 _6617;
                if (abs(_3470 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6617 = vec2((_3442 * 0.9921875 + 0.00390625) * 0.25 + 0.5, (_3427 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.75);
                    _6609 = vec2((_3442 * 0.99609375 + 0.001953125) * 0.5, (_3427 * 0.315823078155517578125 + 0.00390625) * 0.25 + 0.75);
                }
                else
                {
                    vec2 _6610;
                    vec2 _6618;
                    if (abs(_3470 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _3637 = _3442 * 0.9921875 + 0.00390625;
                        float _3647 = (_3427 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.75;
                        _6618 = vec2(_3637 * 0.25 + 0.75, _3647);
                        _6610 = vec2(_3637 * 0.25 + 0.5, _3647);
                    }
                    else
                    {
                        vec2 _6611;
                        vec2 _6619;
                        if (abs(_3470 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _3675 = _3442 * 0.9921875 + 0.00390625;
                            float _3683 = _3427 * 0.3133362829685211181640625 + 0.0078125;
                            _6619 = vec2(_3675 * 0.25 + 0.5, _3683 * 0.125 + 0.875);
                            _6611 = vec2(_3675 * 0.25 + 0.75, _3683 * 0.125 + 0.75);
                        }
                        else
                        {
                            vec2 _6612;
                            vec2 _6620;
                            if (abs(_3470 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _3713 = _3442 * 0.9921875 + 0.00390625;
                                float _3723 = (_3427 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.875;
                                _6620 = vec2(_3713 * 0.25 + 0.75, _3723);
                                _6612 = vec2(_3713 * 0.25 + 0.5, _3723);
                            }
                            else
                            {
                                vec2 _6621;
                                if (abs(_3470 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6621 = vec2((_3442 * 0.9921875 + 0.00390625) * 0.25 + 0.75, (_3427 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.875);
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
    mediump vec4 _3789 = texture(_AmbientTexture, _6606);
    mediump vec4 _3792 = texture(_AmbientTexture, _6614);
    vec4 _3795 = mix(_3789, _3792, vec4(7.0 - _3470));
    vec3 _3203 = ((((_3795.xyz / vec3(_3795.w)) * _2449) * max(vec3(1.0), ((((((_2449 * 2.040400028228759765625) - vec3(0.3323999941349029541015625)) * 1.0) + ((_2449 * (-4.79510021209716796875)) + vec3(0.6417000293731689453125))) * 1.0) + ((_2449 * 2.755199909210205078125) + vec3(0.69029998779296875))) * 1.0)) * _AmbientIntensity) * 1.0;
    float _3858 = _2425 - 0.07999999821186065673828125;
    vec3 _3898 = normalize(mix(_2517, _2112, vec3(_2425 * _2531)));
    float _3901 = -_3898.z;
    float _3903 = _3898.x;
    float _3910 = acos(_3898.y);
    float _3916 = (((_3903 < 0.0) ? (-1.0) : 1.0) * acos(clamp(_3901 / length(vec2(_3903, _3901)), -1.0, 1.0)) + (-1.57079637050628662109375)) * 0.15915493667125701904296875 + _AmbientRotation;
    float _3925 = fract((_3916 + floor(_3916)) + 1.0);
    vec2 _6473 = vec2(_6766, _3910 * 0.3183098733425140380859375);
    _6473.x = _3925;
    float _3953 = floor(_3858 * 7.0);
    vec2 _6639;
    vec2 _6647;
    if (abs(_3953) < 0.001000000047497451305389404296875)
    {
        _6647 = vec2((_3925 * 0.99609375 + 0.001953125) * 0.5, (_3910 * 0.315823078155517578125 + 0.00390625) * 0.25 + 0.5);
        _6639 = vec2(_3925 * 0.998046875 + 0.0009765625, (_3910 * 0.3170664608478546142578125 + 0.001953125) * 0.5);
    }
    else
    {
        vec2 _6640;
        vec2 _6648;
        if (abs(_3953 - 1.0) < 0.001000000047497451305389404296875)
        {
            float _4006 = _3925 * 0.99609375 + 0.001953125;
            float _4016 = (_3910 * 0.315823078155517578125 + 0.00390625) * 0.25 + 0.5;
            _6648 = vec2(_4006 * 0.5 + 0.5, _4016);
            _6640 = vec2(_4006 * 0.5, _4016);
        }
        else
        {
            vec2 _6641;
            vec2 _6649;
            if (abs(_3953 - 2.0) < 0.001000000047497451305389404296875)
            {
                float _4044 = _3925 * 0.99609375 + 0.001953125;
                float _4052 = _3910 * 0.315823078155517578125 + 0.00390625;
                _6649 = vec2(_4044 * 0.5, _4052 * 0.25 + 0.75);
                _6641 = vec2(_4044 * 0.5 + 0.5, _4052 * 0.25 + 0.5);
            }
            else
            {
                vec2 _6642;
                vec2 _6650;
                if (abs(_3953 - 3.0) < 0.001000000047497451305389404296875)
                {
                    _6650 = vec2((_3925 * 0.9921875 + 0.00390625) * 0.25 + 0.5, (_3910 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.75);
                    _6642 = vec2((_3925 * 0.99609375 + 0.001953125) * 0.5, (_3910 * 0.315823078155517578125 + 0.00390625) * 0.25 + 0.75);
                }
                else
                {
                    vec2 _6643;
                    vec2 _6651;
                    if (abs(_3953 - 4.0) < 0.001000000047497451305389404296875)
                    {
                        float _4120 = _3925 * 0.9921875 + 0.00390625;
                        float _4130 = (_3910 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.75;
                        _6651 = vec2(_4120 * 0.25 + 0.75, _4130);
                        _6643 = vec2(_4120 * 0.25 + 0.5, _4130);
                    }
                    else
                    {
                        vec2 _6644;
                        vec2 _6652;
                        if (abs(_3953 - 5.0) < 0.001000000047497451305389404296875)
                        {
                            float _4158 = _3925 * 0.9921875 + 0.00390625;
                            float _4166 = _3910 * 0.3133362829685211181640625 + 0.0078125;
                            _6652 = vec2(_4158 * 0.25 + 0.5, _4166 * 0.125 + 0.875);
                            _6644 = vec2(_4158 * 0.25 + 0.75, _4166 * 0.125 + 0.75);
                        }
                        else
                        {
                            vec2 _6645;
                            vec2 _6653;
                            if (abs(_3953 - 6.0) < 0.001000000047497451305389404296875)
                            {
                                float _4196 = _3925 * 0.9921875 + 0.00390625;
                                float _4206 = (_3910 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.875;
                                _6653 = vec2(_4196 * 0.25 + 0.75, _4206);
                                _6645 = vec2(_4196 * 0.25 + 0.5, _4206);
                            }
                            else
                            {
                                vec2 _6654;
                                if (abs(_3953 - 7.0) < 0.001000000047497451305389404296875)
                                {
                                    _6654 = vec2((_3925 * 0.9921875 + 0.00390625) * 0.25 + 0.75, (_3910 * 0.3133362829685211181640625 + 0.0078125) * 0.125 + 0.875);
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
    vec4 _4278 = mix(texture(_AmbientTexture, _6639), texture(_AmbientTexture, _6647), vec4(_3858 * 7.0 + (-_3953)));
    vec4 _4303 = (vec4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * _2425) + vec4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float _4305 = _4303.x;
    vec2 _4323 = (vec2(-1.03999996185302734375, 1.03999996185302734375) * (min(_4305 * _4305, exp2((-9.27999973297119140625) * _2559)) * _4305 + _4303.y)) + _4303.zw;
    vec3 _3210 = (((((_2456 * _4323.x) + vec3(_4323.y * clamp(50.0 * _2456.y, 0.0, 1.0))) * (_4278.xyz / vec3(_4278.w))) * max(vec3(_2588), ((((((_2456 * 2.040400028228759765625) - vec3(0.3323999941349029541015625)) * _2588) + ((_2456 * (-4.79510021209716796875)) + vec3(0.6417000293731689453125))) * _2588) + ((_2456 * 2.755199909210205078125) + vec3(0.69029998779296875))) * _2588)) * _AmbientIntensity) * 1.0;
    vec3 _6682;
    vec3 _6683;
    if (_2652 > 0.5)
    {
        vec3 _4396 = normalize(_2659 + _6599);
        float _4402 = max(0.0, dot(_2112, _2659));
        float _4413 = max(0.0, dot(_6599, _4396));
        float _4429 = (-_2559) * _4402 + ((2.0 * _4413) * _4413 + (-1.0));
        float _6671;
        if (_4429 >= 0.0)
        {
            _6671 = 1.0 / max(_4402, _2559);
        }
        else
        {
            _6671 = 1.0;
        }
        float _4507 = max(0.0, dot(_2112, _4396));
        float _4565 = 1.0 - _4402;
        float _4593 = (_4507 * _2536 + (-_4507)) * _4507 + 1.0;
        float _4606 = 1.0 - _4413;
        float _4620 = _4606 * _4606;
        _6683 = _3210 + ((((((((_2456 + ((vec3(1.0) - _2456) * ((_4620 * _4620) * _4606))) * (0.5 / ((_2531 * (_2559 * _4565 + _4402) + (_2559 * (_2531 * _4565 + _4402))) + 9.9999997473787516355514526367188e-06))) * ((_2536 * 0.31830990314483642578125) / (_4593 * _4593 + 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4402) * u_DirLightsColor[0].xyz) * _2671) * 1.0);
        _6682 = _3203 + ((((_2449 * u_DirLightsColor[0].xyz) * _2671) * ((((((0.449999988079071044921875 * _2536) / (_2531 * _2531 + 0.0900000035762786865234375)) * _4429) * _6671 + (1.0 - ((0.5 * _2536) / (_2531 * _2531 + 0.3300000131130218505859375)))) * (_2425 * 0.5 + 1.0)) * _4402)) * 1.0);
    }
    else
    {
        _6683 = _3210;
        _6682 = _3203;
    }
    vec3 _6684;
    vec3 _6685;
    if (_2686 > 0.5)
    {
        float _4635 = max(0.0, dot(_2112, _2693));
        vec3 _4671 = normalize(_2693 + _6599);
        float _4676 = max(0.0, dot(_2112, _4671));
        float _4730 = (_4676 * _2536 + (-_4676)) * _4676 + 1.0;
        float _4743 = 1.0 - max(0.0, dot(_6599, _4671));
        float _4757 = _4743 * _4743;
        _6685 = _6683 + ((((((((_2456 + ((vec3(1.0) - _2456) * ((_4757 * _4757) * _4743))) * 0.25) * ((_2536 * 0.31830990314483642578125) / (_4730 * _4730 + 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4635) * u_DirLightsColor[1].xyz) * _2705) * 1.0);
        _6684 = _6682 + ((((_2449 * u_DirLightsColor[1].xyz) * _2705) * _4635) * 1.0);
    }
    else
    {
        _6685 = _6683;
        _6684 = _6682;
    }
    vec3 _6686;
    vec3 _6687;
    if (_2720 > 0.5)
    {
        float _4772 = max(0.0, dot(_2112, _2727));
        vec3 _4808 = normalize(_2727 + _6599);
        float _4813 = max(0.0, dot(_2112, _4808));
        float _4867 = (_4813 * _2536 + (-_4813)) * _4813 + 1.0;
        float _4880 = 1.0 - max(0.0, dot(_6599, _4808));
        float _4894 = _4880 * _4880;
        _6687 = _6685 + ((((((((_2456 + ((vec3(1.0) - _2456) * ((_4894 * _4894) * _4880))) * 0.25) * ((_2536 * 0.31830990314483642578125) / (_4867 * _4867 + 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4772) * u_DirLightsColor[2].xyz) * _2739) * 1.0);
        _6686 = _6684 + ((((_2449 * u_DirLightsColor[2].xyz) * _2739) * _4772) * 1.0);
    }
    else
    {
        _6687 = _6685;
        _6686 = _6684;
    }
    vec3 _6688;
    vec3 _6689;
    if (_2761 > 0.5)
    {
        float _4909 = max(0.0, dot(_2112, _2775));
        vec3 _4945 = normalize(_2775 + _6599);
        float _4950 = max(0.0, dot(_2112, _4945));
        float _5004 = (_4950 * _2536 + (-_4950)) * _4950 + 1.0;
        float _5017 = 1.0 - max(0.0, dot(_6599, _4945));
        float _5031 = _5017 * _5017;
        _6689 = _6687 + (((((((((_2456 + ((vec3(1.0) - _2456) * ((_5031 * _5031) * _5017))) * 0.25) * ((_2536 * 0.31830990314483642578125) / (_5004 * _5004 + 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _4909) * u_PointLightsColor[0].xyz) * _2787) * _2807) * 1.0);
        _6688 = _6686 + (((((_2449 * u_PointLightsColor[0].xyz) * _2787) * _2807) * _4909) * 1.0);
    }
    else
    {
        _6689 = _6687;
        _6688 = _6686;
    }
    vec3 _6690;
    vec3 _6691;
    if (_2851 > 0.5)
    {
        float _5046 = max(0.0, dot(_2112, _2865));
        vec3 _5082 = normalize(_2865 + _6599);
        float _5087 = max(0.0, dot(_2112, _5082));
        float _5141 = (_5087 * _2536 + (-_5087)) * _5087 + 1.0;
        float _5154 = 1.0 - max(0.0, dot(_6599, _5082));
        float _5168 = _5154 * _5154;
        _6691 = _6689 + (((((((((_2456 + ((vec3(1.0) - _2456) * ((_5168 * _5168) * _5154))) * 0.25) * ((_2536 * 0.31830990314483642578125) / (_5141 * _5141 + 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5046) * u_PointLightsColor[1].xyz) * _2877) * _2897) * 1.0);
        _6690 = _6688 + (((((_2449 * u_PointLightsColor[1].xyz) * _2877) * _2897) * _5046) * 1.0);
    }
    else
    {
        _6691 = _6689;
        _6690 = _6688;
    }
    vec3 _6692;
    vec3 _6693;
    if (_2943 > 0.5)
    {
        float _5183 = max(0.0, dot(_2112, _2957));
        vec3 _5219 = normalize(_2957 + _6599);
        float _5224 = max(0.0, dot(_2112, _5219));
        float _5278 = (_5224 * _2536 + (-_5224)) * _5224 + 1.0;
        float _5291 = 1.0 - max(0.0, dot(_6599, _5219));
        float _5305 = _5291 * _5291;
        _6693 = _6691 + (((((((((_2456 + ((vec3(1.0) - _2456) * ((_5305 * _5305) * _5291))) * 0.25) * ((_2536 * 0.31830990314483642578125) / (_5278 * _5278 + 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5183) * u_SpotLightsColor[0].xyz) * _2969) * _3010) * 1.0);
        _6692 = _6690 + (((((_2449 * u_SpotLightsColor[0].xyz) * _2969) * _3010) * _5183) * 1.0);
    }
    else
    {
        _6693 = _6691;
        _6692 = _6690;
    }
    vec3 _6694;
    vec3 _6695;
    if (_3056 > 0.5)
    {
        float _5320 = max(0.0, dot(_2112, _3070));
        vec3 _5356 = normalize(_3070 + _6599);
        float _5361 = max(0.0, dot(_2112, _5356));
        float _5415 = (_5361 * _2536 + (-_5361)) * _5361 + 1.0;
        float _5428 = 1.0 - max(0.0, dot(_6599, _5356));
        float _5442 = _5428 * _5428;
        _6695 = _6693 + (((((((((_2456 + ((vec3(1.0) - _2456) * ((_5442 * _5442) * _5428))) * 0.25) * ((_2536 * 0.31830990314483642578125) / (_5415 * _5415 + 1.0000000116860974230803549289703e-07))) * 3.1415927410125732421875) * _5320) * u_SpotLightsColor[1].xyz) * _3082) * _3123) * 1.0);
        _6694 = _6692 + (((((_2449 * u_SpotLightsColor[1].xyz) * _3082) * _3123) * _5320) * 1.0);
    }
    else
    {
        _6695 = _6693;
        _6694 = _6692;
    }
    vec3 _3366 = (_6694 + ((vec3(pow(_EmissiveColor.x, 2.2000000476837158203125), pow(_EmissiveColor.y, 2.2000000476837158203125), pow(_EmissiveColor.z, 2.2000000476837158203125)) * vec3(pow(_2117.x, 2.2000000476837158203125), pow(_2117.y, 2.2000000476837158203125), pow(_2117.z, 2.2000000476837158203125))) * _EmissiveIntensity)) + _6695;
    glResult = vec4(pow(_3366.x, 0.4545449912548065185546875), pow(_3366.y, 0.4545449912548065185546875), pow(_3366.z, 0.4545449912548065185546875), _AlbedoColor.w * _2088.w);
}

