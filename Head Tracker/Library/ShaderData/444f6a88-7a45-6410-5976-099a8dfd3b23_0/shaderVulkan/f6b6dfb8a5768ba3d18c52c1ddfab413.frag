#version 300 es
precision highp float;
precision highp int;

struct SurfaceParams
{
    vec2 uv0;
    float opacity;
    vec3 roughParams;
    vec2 occParams;
    vec3 diffCol;
    vec3 specCol;
    vec3 pos;
    vec3 nDir;
    vec3 vnDir;
    vec3 vDir;
    vec3 rDir;
    float ndv;
};

struct LightParams
{
    float enable;
    vec3 lDir;
    vec3 color;
    float intensity;
    vec3 attenuate;
    vec3 areaLightPoints[4];
    float areaLightShape;
    float areaLightTwoSide;
    vec3 hDir;
    float ldh;
    float ndl;
    float ndh;
    float vdh;
};

uniform mediump sampler2D u_ltc_mat;
uniform mediump sampler2D u_ltc_mag;
uniform u_DirLightsEnabled { float _u_DirLightsEnabled[3]; };
uniform u_DirLightsDirection { vec4 _u_DirLightsDirection[3]; };
uniform u_DirLightsColor { vec4 _u_DirLightsColor[3]; };
uniform u_DirLightsIntensity { float _u_DirLightsIntensity[3]; };
uniform u_PointLightsEnabled { float _u_PointLightsEnabled[2]; };
uniform u_PointLightsPosition { vec4 _u_PointLightsPosition[2]; };
uniform u_PointLightsColor { vec4 _u_PointLightsColor[2]; };
uniform u_PointLightsIntensity { float _u_PointLightsIntensity[2]; };
uniform u_PointLightsAttenRangeInv { float _u_PointLightsAttenRangeInv[2]; };
uniform u_SpotLightsEnabled { float _u_SpotLightsEnabled[2]; };
uniform u_SpotLightsPosition { vec4 _u_SpotLightsPosition[2]; };
uniform u_SpotLightsColor { vec4 _u_SpotLightsColor[2]; };
uniform u_SpotLightsIntensity { float _u_SpotLightsIntensity[2]; };
uniform u_SpotLightsAttenRangeInv { float _u_SpotLightsAttenRangeInv[2]; };
uniform u_SpotLightsDirection { vec4 _u_SpotLightsDirection[2]; };
uniform u_SpotLightsOuterAngleCos { float _u_SpotLightsOuterAngleCos[2]; };
uniform u_SpotLightsInnerAngleCos { float _u_SpotLightsInnerAngleCos[2]; };
uniform u_AreaLightsEnabled { float _u_AreaLightsEnabled[2]; };
uniform u_AreaLightsDirection { vec4 _u_AreaLightsDirection[2]; };
uniform u_AreaLightsColor { vec4 _u_AreaLightsColor[2]; };
uniform u_AreaLightsIntensity { float _u_AreaLightsIntensity[2]; };
uniform u_AreaLightsPoint0 { vec4 _u_AreaLightsPoint0[2]; };
uniform u_AreaLightsPoint1 { vec4 _u_AreaLightsPoint1[2]; };
uniform u_AreaLightsPoint2 { vec4 _u_AreaLightsPoint2[2]; };
uniform u_AreaLightsPoint3 { vec4 _u_AreaLightsPoint3[2]; };
uniform u_AreaLightsShape { float _u_AreaLightsShape[2]; };
uniform u_AreaLightsTwoSide { float _u_AreaLightsTwoSide[2]; };
uniform mediump sampler2D _EnvTex;
uniform _Env { float __Env; };
uniform _EnvRot { float __EnvRot; };
uniform u_WorldSpaceCameraPos { vec4 _u_WorldSpaceCameraPos; };
uniform _AlbedoColor { vec4 __AlbedoColor; };
uniform mediump sampler2D _AlbedoTexture;
uniform _Metallic { float __Metallic; };
uniform _Roughness { float __Roughness; };
uniform _Cutoff { float __Cutoff; };
uniform _Occlusion { float __Occlusion; };
uniform _ThinFilmIOR { float __ThinFilmIOR; };
uniform u_VP { mat4 _u_VP; };
uniform u_MV { mat4 _u_MV; };
uniform u_InvView { mat4 _u_InvView; };
uniform u_CameraInvProjection { mat4 _u_CameraInvProjection; };
uniform u_InvModel { mat4 _u_InvModel; };
uniform u_Time { vec4 _u_Time; };
uniform u_DirLightNum { float _u_DirLightNum; };
uniform u_PointLightNum { float _u_PointLightNum; };
uniform u_SpotLightNum { float _u_SpotLightNum; };
uniform mediump sampler2D u_FBOTexture;
uniform u_AreaLightNum { float _u_AreaLightNum; };
uniform u_AreaLightsPosition { vec4 _u_AreaLightsPosition[2]; };
uniform u_AreaLightsAttenRangeInv { float _u_AreaLightsAttenRangeInv[2]; };

in vec3 v_nDirWS;
in vec3 v_posWS;
in vec3 v_tDirWS;
in vec3 v_bDirWS;
in vec2 v_uv0;
in vec4 v_gl_pos;
layout(location = 0) out vec4 o_fragColor;
in vec2 v_uv0_src;
in vec2 v_uv1;

vec3 SafePow(inout vec3 v, inout vec3 e)
{
    v = max(v, vec3(9.9999997473787516355514526367188e-06));
    e = max(e, vec3(9.9999997473787516355514526367188e-06));
    return pow(v, e);
}

vec3 GammaToLinear(vec3 col)
{
    vec3 param = col;
    vec3 param_1 = vec3(2.2000000476837158203125);
    vec3 _385 = SafePow(param, param_1);
    return _385;
}

float saturate(float x)
{
    return clamp(x, 0.0, 1.0);
}

float Pow2(float x)
{
    return x * x;
}

float IorToSpecularLevel(float iorFrom, float iorTo)
{
    float sqrtR0 = (iorTo - iorFrom) / (iorTo + iorFrom);
    return sqrtR0 * sqrtR0;
}

void BuildSurfaceParams(inout SurfaceParams S)
{
    vec3 vnDirWS = normalize(v_nDirWS);
    vec3 vDir = normalize(_u_WorldSpaceCameraPos.xyz - v_posWS);
    if (dot(vDir, vnDirWS) < (-0.0500000007450580596923828125))
    {
        vnDirWS = -vnDirWS;
    }
    vec3 vtDirWS = normalize(v_tDirWS);
    vec3 vbDirWS = normalize(v_bDirWS);
    vec2 uv0 = v_uv0;
    S.uv0 = uv0;
    vec3 param = __AlbedoColor.xyz;
    vec3 albedo = GammaToLinear(param);
    float opacity = __AlbedoColor.w;
    vec4 t_AlbedoTex = texture(_AlbedoTexture, uv0);
    vec3 param_1 = t_AlbedoTex.xyz;
    albedo *= GammaToLinear(param_1);
    opacity *= t_AlbedoTex.w;
    float metallic = __Metallic;
    float roughness = __Roughness;
    float ao = 1.0;
    float cavity = 1.0;
    vec3 normal = vnDirWS;
    S.vDir = vDir;
    float avgTextureNormalLength = 1.0;
    S.opacity = opacity;
    if (S.opacity < __Cutoff)
    {
        discard;
    }
    float param_2 = metallic;
    metallic = saturate(param_2);
    S.nDir = normal;
    float perceptualRoughness = clamp(roughness, 0.0, 1.0);
    S.roughParams.x = perceptualRoughness;
    float param_3 = S.roughParams.x;
    S.roughParams.y = Pow2(param_3);
    float param_4 = S.roughParams.y;
    S.roughParams.z = Pow2(param_4);
    S.diffCol = albedo * (1.0 - metallic);
    S.pos = v_posWS;
    S.vnDir = vnDirWS;
    S.ndv = max(0.0, dot(S.nDir, S.vDir));
    S.rDir = normalize(reflect(-S.vDir, S.nDir));
    float ior = 1.5;
    float param_5 = 1.0;
    float param_6 = ior;
    float dielectricF0 = IorToSpecularLevel(param_5, param_6);
    vec3 specularAlbedo = albedo;
    S.specCol = mix(vec3(dielectricF0), specularAlbedo, vec3(metallic));
    S.occParams = vec2(1.0);
}

float ACos(float inX)
{
    float x = abs(inX);
    float res = ((-0.15658299624919891357421875) * x) + 1.57079601287841796875;
    res *= sqrt(1.0 - x);
    float _293;
    if (inX >= 0.0)
    {
        _293 = res;
    }
    else
    {
        _293 = 3.1415927410125732421875 - res;
    }
    return _293;
}

float ATan(float x, float y)
{
    float signx = (x < 0.0) ? (-1.0) : 1.0;
    float param = clamp(y / length(vec2(x, y)), -1.0, 1.0);
    return signx * ACos(param);
}

vec2 GetPanoramicTexCoordsFromDir(inout vec3 dir, float rotation)
{
    dir = normalize(dir);
    float param = dir.x;
    float param_1 = -dir.z;
    vec2 uv;
    uv.x = (ATan(param, param_1) - 1.57079637050628662109375) / 6.283185482025146484375;
    uv.y = acos(dir.y) / 3.1415927410125732421875;
    uv.x += rotation;
    uv.x = fract((uv.x + floor(uv.x)) + 1.0);
    return uv;
}

vec3 SamplerEncodedPanoramicWithUV(vec2 uv, float lod)
{
    float lodMin = floor(lod);
    float lodLerp = lod - lodMin;
    vec2 uvLodMin = uv;
    vec2 uvLodMax = uv;
    vec2 size = vec2(0.0);
    if (abs(lodMin - 0.0) < 0.001000000047497451305389404296875)
    {
        uvLodMin.x = ((((uv.x * 511.0) / 512.0) + 0.0009765625) * 1.0) + 0.0;
        uvLodMin.y = ((((uv.y * 255.0) / 256.0) + 0.001953125) * 0.5) + 0.0;
        uvLodMax.x = ((((uv.x * 255.0) / 256.0) + 0.001953125) * 0.5) + 0.0;
        uvLodMax.y = ((((uv.y * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
    }
    else
    {
        if (abs(lodMin - 1.0) < 0.001000000047497451305389404296875)
        {
            uvLodMin.x = ((((uv.x * 255.0) / 256.0) + 0.001953125) * 0.5) + 0.0;
            uvLodMin.y = ((((uv.y * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
            uvLodMax.x = ((((uv.x * 255.0) / 256.0) + 0.001953125) * 0.5) + 0.5;
            uvLodMax.y = ((((uv.y * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
        }
        else
        {
            if (abs(lodMin - 2.0) < 0.001000000047497451305389404296875)
            {
                uvLodMin.x = ((((uv.x * 255.0) / 256.0) + 0.001953125) * 0.5) + 0.5;
                uvLodMin.y = ((((uv.y * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
                uvLodMax.x = ((((uv.x * 255.0) / 256.0) + 0.001953125) * 0.5) + 0.0;
                uvLodMax.y = ((((uv.y * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.75;
            }
            else
            {
                if (abs(lodMin - 3.0) < 0.001000000047497451305389404296875)
                {
                    uvLodMin.x = ((((uv.x * 255.0) / 256.0) + 0.001953125) * 0.5) + 0.0;
                    uvLodMin.y = ((((uv.y * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.75;
                    uvLodMax.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
                    uvLodMax.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.75;
                }
                else
                {
                    if (abs(lodMin - 4.0) < 0.001000000047497451305389404296875)
                    {
                        uvLodMin.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
                        uvLodMin.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.75;
                        uvLodMax.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.75;
                        uvLodMax.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.75;
                    }
                    else
                    {
                        if (abs(lodMin - 5.0) < 0.001000000047497451305389404296875)
                        {
                            uvLodMin.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.75;
                            uvLodMin.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.75;
                            uvLodMax.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
                            uvLodMax.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.875;
                        }
                        else
                        {
                            if (abs(lodMin - 6.0) < 0.001000000047497451305389404296875)
                            {
                                uvLodMin.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.5;
                                uvLodMin.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.875;
                                uvLodMax.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.75;
                                uvLodMax.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.875;
                            }
                            else
                            {
                                uvLodMin.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.75;
                                uvLodMin.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.875;
                                uvLodMax.x = ((((uv.x * 127.0) / 128.0) + 0.00390625) * 0.25) + 0.75;
                                uvLodMax.y = ((((uv.y * 63.0) / 64.0) + 0.0078125) * 0.125) + 0.875;
                            }
                        }
                    }
                }
            }
        }
    }
    vec4 envEncoded = mix(texture(_EnvTex, uvLodMin), texture(_EnvTex, uvLodMax), vec4(lodLerp));
    return envEncoded.xyz / vec3(envEncoded.w);
}

vec3 SampleIBL(vec3 dir, float rotation, float lod)
{
    vec3 param = dir;
    float param_1 = rotation;
    vec2 _2996 = GetPanoramicTexCoordsFromDir(param, param_1);
    vec2 uv = _2996;
    vec2 param_2 = uv;
    float param_3 = lod;
    return SamplerEncodedPanoramicWithUV(param_2, param_3) * __Env;
}

vec3 GTAO_MultiBounce(float visibility, vec3 albedo)
{
    vec3 a = (albedo * 2.040400028228759765625) - vec3(0.3323999941349029541015625);
    vec3 b = (albedo * (-4.79510021209716796875)) + vec3(0.6417000293731689453125);
    vec3 c = (albedo * 2.755199909210205078125) + vec3(0.69029998779296875);
    return max(vec3(visibility), ((((a * visibility) + b) * visibility) + c) * visibility);
}

vec3 Diffuse_Env(SurfaceParams S)
{
    vec3 diffuseNormal = S.nDir;
    vec3 lighting = vec3(0.0);
    vec3 param = diffuseNormal;
    float param_1 = __EnvRot;
    float param_2 = 7.0;
    lighting = SampleIBL(param, param_1, param_2);
    float param_3 = S.occParams.x;
    vec3 param_4 = S.diffCol;
    vec3 multiBounceColor = GTAO_MultiBounce(param_3, param_4);
    return (S.diffCol * lighting) * multiBounceColor;
}

vec3 EnvBRDFApprox(vec3 F0, float perceptualRoughness, float ndv)
{
    vec4 r = (vec4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * perceptualRoughness) + vec4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float a004 = (min(r.x * r.x, exp2((-9.27999973297119140625) * ndv)) * r.x) + r.y;
    vec2 AB = (vec2(-1.03999996185302734375, 1.03999996185302734375) * a004) + r.zw;
    float param = 50.0 * F0.y;
    AB.y *= saturate(param);
    return (F0 * AB.x) + vec3(AB.y);
}

vec3 EnvBRDF(SurfaceParams S)
{
    vec3 param = S.specCol;
    float param_1 = S.roughParams.x;
    float param_2 = S.ndv;
    return EnvBRDFApprox(param, param_1, param_2);
}

vec3 Specular_Env(inout SurfaceParams S)
{
    vec3 dir = mix(S.rDir, S.nDir, vec3(S.roughParams.x * S.roughParams.y));
    vec3 param = dir;
    float param_1 = __EnvRot;
    float param_2 = S.roughParams.x * 7.0;
    vec3 specEnv = SampleIBL(param, param_1, param_2);
    SurfaceParams param_3 = S;
    S = param_3;
    vec3 brdf = EnvBRDF(param_3);
    float param_4 = S.occParams.y;
    vec3 param_5 = S.specCol;
    vec3 multiBounceColor = GTAO_MultiBounce(param_4, param_5);
    vec3 Fr = (brdf * multiBounceColor) * specEnv;
    return Fr;
}

void DoIndirectLight(inout SurfaceParams S, inout vec3 Fd, inout vec3 Fr)
{
    float coatAttenuate_IBL = 1.0;
    SurfaceParams param = S;
    S = param;
    Fd += (Diffuse_Env(param) * coatAttenuate_IBL);
    SurfaceParams param_1 = S;
    vec3 _3197 = Specular_Env(param_1);
    S = param_1;
    Fr += (_3197 * coatAttenuate_IBL);
}

void LightCommomOperations(SurfaceParams S, inout LightParams L)
{
    L.hDir = normalize(L.lDir + S.vDir);
    L.ldh = max(0.0, dot(L.lDir, L.hDir));
    L.ndl = max(0.0, dot(S.nDir, L.lDir));
    L.ndh = max(0.0, dot(S.nDir, L.hDir));
    L.vdh = max(0.0, dot(S.vDir, L.hDir));
}

void BuildDirLightParams(inout SurfaceParams S, mediump int index, inout LightParams ML)
{
    ML.enable = _u_DirLightsEnabled[index];
    ML.lDir = normalize(-_u_DirLightsDirection[index].xyz);
    ML.color = _u_DirLightsColor[index].xyz;
    ML.intensity = (_u_DirLightsIntensity[index] * _u_DirLightsEnabled[index]) * 3.1415920257568359375;
    ML.attenuate = vec3(1.0);
    SurfaceParams param = S;
    LightParams param_1 = ML;
    LightCommomOperations(param, param_1);
    S = param;
    ML = param_1;
}

vec3 Diffuse_Lambert(SurfaceParams S, LightParams L)
{
    float lighting = L.ndl * 0.31830990314483642578125;
    return (((S.diffCol * L.color) * L.intensity) * L.attenuate) * lighting;
}

vec3 Diffuse_High(inout SurfaceParams S, inout LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    S = param;
    L = param_1;
    return Diffuse_Lambert(param, param_1);
}

float Pow5(float x)
{
    float x2 = x * x;
    return (x2 * x2) * x;
}

vec3 F_Schlick(vec3 f0, inout float vdh)
{
    vdh = max(0.0, vdh);
    float param = 1.0 - vdh;
    float t = Pow5(param);
    return f0 + ((vec3(1.0) - f0) * t);
}

vec3 FresnelSpecular(SurfaceParams S, float vdh)
{
    vec3 f0 = S.specCol;
    vec3 param = f0;
    float param_1 = vdh;
    vec3 _2359 = F_Schlick(param, param_1);
    return _2359;
}

float V_SmithJointApprox(float a, float ndv, float ndl)
{
    float lambdaV = ndl * ((ndv * (1.0 - a)) + a);
    float lambdaL = ndv * ((ndl * (1.0 - a)) + a);
    return 0.5 / ((lambdaV + lambdaL) + 9.9999997473787516355514526367188e-06);
}

float D_GGX(float ndh, float a2)
{
    float d = (((ndh * a2) - ndh) * ndh) + 1.0;
    return (a2 * 0.31830990314483642578125) / ((d * d) + 1.0000000116860974230803549289703e-07);
}

vec3 Specular_GGX(inout SurfaceParams S, LightParams L)
{
    SurfaceParams param = S;
    float param_1 = L.vdh;
    S = param;
    vec3 F = FresnelSpecular(param, param_1);
    float a = S.roughParams.y;
    float a2 = S.roughParams.z;
    float param_2 = L.ndl;
    float param_3 = S.ndv;
    float param_4 = a;
    float V = V_SmithJointApprox(param_2, param_3, param_4);
    float param_5 = L.ndh;
    float param_6 = a2;
    float D = D_GGX(param_5, param_6);
    vec3 specular = ((((F * (D * V)) * L.ndl) * L.color) * L.intensity) * L.attenuate;
    return specular;
}

vec3 Specular_High(inout SurfaceParams S, inout LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    vec3 _2480 = Specular_GGX(param, param_1);
    S = param;
    L = param_1;
    return _2480;
}

void DoHeavyLight(inout SurfaceParams S, inout LightParams L, inout vec3 Fd, inout vec3 Fr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
        SurfaceParams param = S;
        LightParams param_1 = L;
        vec3 _3089 = Diffuse_High(param, param_1);
        S = param;
        L = param_1;
        Fd += (_3089 * coatAttenuate);
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        vec3 _3100 = Specular_High(param_2, param_3);
        S = param_2;
        L = param_3;
        Fr += (_3100 * coatAttenuate);
    }
}

vec3 Diffuse_Low(inout SurfaceParams S, inout LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    S = param;
    L = param_1;
    return Diffuse_Lambert(param, param_1);
}

float V_Const()
{
    return 0.25;
}

vec3 Specular_GGX_Low(inout SurfaceParams S, LightParams L)
{
    SurfaceParams param = S;
    float param_1 = L.vdh;
    S = param;
    vec3 F = FresnelSpecular(param, param_1);
    float a = S.roughParams.y;
    float a2 = S.roughParams.z;
    float V = V_Const();
    float param_2 = L.ndh;
    float param_3 = a2;
    float D = D_GGX(param_2, param_3);
    vec3 specular = ((((F * (D * V)) * L.ndl) * L.color) * L.intensity) * L.attenuate;
    return specular;
}

vec3 Specular_Low(inout SurfaceParams S, inout LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    vec3 _2489 = Specular_GGX_Low(param, param_1);
    S = param;
    L = param_1;
    return _2489;
}

void DoLight(inout SurfaceParams S, inout LightParams L, inout vec3 Fd, inout vec3 Fr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
        SurfaceParams param = S;
        LightParams param_1 = L;
        vec3 _3117 = Diffuse_Low(param, param_1);
        S = param;
        L = param_1;
        Fd += (_3117 * coatAttenuate);
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        vec3 _3128 = Specular_Low(param_2, param_3);
        S = param_2;
        L = param_3;
        Fr += (_3128 * coatAttenuate);
    }
}

float Pow4(float x)
{
    float x2 = x * x;
    return x2 * x2;
}

void BuildPointLightParams(inout SurfaceParams S, mediump int index, inout LightParams PL)
{
    vec3 lVec = vec3(0.0);
    float lDist = 0.0;
    PL.enable = _u_PointLightsEnabled[index];
    lVec = _u_PointLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    PL.lDir = lVec / vec3(lDist);
    PL.color = _u_PointLightsColor[index].xyz;
    PL.intensity = (_u_PointLightsIntensity[index] * _u_PointLightsEnabled[index]) * 3.1415920257568359375;
    float lWorldDist = lDist;
    lDist *= _u_PointLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate(param_1);
    float param_3 = lDist;
    float attenuate = (Pow2(param_2) * (Pow2(param_3) + 1.0)) * 0.25;
    PL.attenuate = vec3(attenuate, attenuate, attenuate);
    SurfaceParams param_4 = S;
    LightParams param_5 = PL;
    LightCommomOperations(param_4, param_5);
    S = param_4;
    PL = param_5;
}

void BuildSpotLightParams(inout SurfaceParams S, mediump int index, inout LightParams SL)
{
    vec3 lVec = vec3(0.0);
    float lDist = 0.0;
    vec3 spotDir = vec3(0.0);
    float angleAtten = 0.0;
    SL.enable = _u_SpotLightsEnabled[index];
    lVec = _u_SpotLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    SL.lDir = lVec / vec3(lDist);
    SL.color = _u_SpotLightsColor[index].xyz;
    SL.intensity = (_u_SpotLightsIntensity[index] * _u_SpotLightsEnabled[index]) * 3.1415920257568359375;
    float lWorldDist = lDist;
    lDist *= _u_SpotLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate(param_1);
    float param_3 = lDist;
    float attenuate = (Pow2(param_2) * (Pow2(param_3) + 1.0)) * 0.25;
    spotDir = normalize(-_u_SpotLightsDirection[index].xyz);
    angleAtten = max(0.0, dot(SL.lDir, spotDir));
    attenuate *= smoothstep(_u_SpotLightsOuterAngleCos[index], _u_SpotLightsInnerAngleCos[index], angleAtten);
    SL.attenuate = vec3(attenuate, attenuate, attenuate);
    SurfaceParams param_4 = S;
    LightParams param_5 = SL;
    LightCommomOperations(param_4, param_5);
    S = param_4;
    SL = param_5;
}

void BuildAreaLightParams(SurfaceParams S, mediump int index, inout LightParams AL)
{
    AL.enable = _u_AreaLightsEnabled[index];
    AL.lDir = _u_AreaLightsDirection[index].xyz;
    AL.color = _u_AreaLightsColor[index].xyz;
    AL.intensity = (_u_AreaLightsIntensity[index] * _u_AreaLightsEnabled[index]) * 3.1415920257568359375;
    AL.attenuate = vec3(1.0);
    AL.areaLightPoints[0] = _u_AreaLightsPoint0[index].xyz;
    AL.areaLightPoints[1] = _u_AreaLightsPoint1[index].xyz;
    AL.areaLightPoints[2] = _u_AreaLightsPoint2[index].xyz;
    AL.areaLightPoints[3] = _u_AreaLightsPoint3[index].xyz;
    AL.areaLightShape = _u_AreaLightsShape[index];
    AL.areaLightTwoSide = _u_AreaLightsTwoSide[index];
}

vec3 SolveCubic(inout vec4 Coefficient)
{
    vec3 _997 = Coefficient.xyz / vec3(Coefficient.w);
    Coefficient = vec4(_997.x, _997.y, _997.z, Coefficient.w);
    vec2 _1004 = Coefficient.yz / vec2(3.0);
    Coefficient = vec4(Coefficient.x, _1004.x, _1004.y, Coefficient.w);
    float A = Coefficient.w;
    float B = Coefficient.z;
    float C = Coefficient.y;
    float D = Coefficient.x;
    vec3 Delta = vec3(((-Coefficient.z) * Coefficient.z) + Coefficient.y, ((-Coefficient.y) * Coefficient.z) + Coefficient.x, dot(vec2(Coefficient.z, -Coefficient.y), Coefficient.xy));
    float Discriminant = dot(vec2(4.0 * Delta.x, -Delta.y), Delta.zy);
    float A_a = 1.0;
    float C_a = Delta.x;
    float D_a = (((-2.0) * B) * Delta.x) + Delta.y;
    float Theta = atan(sqrt(Discriminant), -D_a) / 3.0;
    float x_1a = (2.0 * sqrt(-C_a)) * cos(Theta);
    float x_3a = (2.0 * sqrt(-C_a)) * cos(Theta + 2.094395160675048828125);
    float xl;
    if ((x_1a + x_3a) > (2.0 * B))
    {
        xl = x_1a;
    }
    else
    {
        xl = x_3a;
    }
    vec2 xlc = vec2(xl - B, A);
    float A_d = D;
    float C_d = Delta.z;
    float D_d = ((-D) * Delta.y) + ((2.0 * C) * Delta.z);
    float Theta_1 = atan(D * sqrt(Discriminant), -D_d) / 3.0;
    float x_1d = (2.0 * sqrt(-C_d)) * cos(Theta_1);
    float x_3d = (2.0 * sqrt(-C_d)) * cos(Theta_1 + 2.094395160675048828125);
    float xs;
    if ((x_1d + x_3d) < (2.0 * C))
    {
        xs = x_1d;
    }
    else
    {
        xs = x_3d;
    }
    vec2 xsc = vec2(-D, xs + C);
    float E = xlc.y * xsc.y;
    float F = ((-xlc.x) * xsc.y) - (xlc.y * xsc.x);
    float G = xlc.x * xsc.x;
    vec2 xmc = vec2((C * F) - (B * G), ((-B) * F) + (C * E));
    vec3 Root = vec3(xsc.x / xsc.y, xmc.x / xmc.y, xlc.x / xlc.y);
    bool _1242 = Root.x < Root.y;
    bool _1250;
    if (_1242)
    {
        _1250 = Root.x < Root.z;
    }
    else
    {
        _1250 = _1242;
    }
    if (_1250)
    {
        Root = Root.yxz;
    }
    else
    {
        bool _1260 = Root.z < Root.x;
        bool _1268;
        if (_1260)
        {
            _1268 = Root.z < Root.y;
        }
        else
        {
            _1268 = _1260;
        }
        if (_1268)
        {
            Root = Root.xzy;
        }
    }
    return Root;
}

void _LTC_ClipQuadToHorizon(inout vec3 L[5], inout mediump int n)
{
    mediump int config = 0;
    if (L[0].z > 0.0)
    {
        config++;
    }
    if (L[1].z > 0.0)
    {
        config += 2;
    }
    if (L[2].z > 0.0)
    {
        config += 4;
    }
    if (L[3].z > 0.0)
    {
        config += 8;
    }
    n = 0;
    if (config == 0)
    {
    }
    else
    {
        if (config == 1)
        {
            n = 3;
            L[1] = (L[0] * (-L[1].z)) + (L[1] * L[0].z);
            L[2] = (L[0] * (-L[3].z)) + (L[3] * L[0].z);
        }
        else
        {
            if (config == 2)
            {
                n = 3;
                L[0] = (L[1] * (-L[0].z)) + (L[0] * L[1].z);
                L[2] = (L[1] * (-L[2].z)) + (L[2] * L[1].z);
            }
            else
            {
                if (config == 3)
                {
                    n = 4;
                    L[2] = (L[1] * (-L[2].z)) + (L[2] * L[1].z);
                    L[3] = (L[0] * (-L[3].z)) + (L[3] * L[0].z);
                }
                else
                {
                    if (config == 4)
                    {
                        n = 3;
                        L[0] = (L[2] * (-L[3].z)) + (L[3] * L[2].z);
                        L[1] = (L[2] * (-L[1].z)) + (L[1] * L[2].z);
                    }
                    else
                    {
                        if (config == 5)
                        {
                            n = 0;
                        }
                        else
                        {
                            if (config == 6)
                            {
                                n = 4;
                                L[0] = (L[1] * (-L[0].z)) + (L[0] * L[1].z);
                                L[3] = (L[2] * (-L[3].z)) + (L[3] * L[2].z);
                            }
                            else
                            {
                                if (config == 7)
                                {
                                    n = 5;
                                    L[4] = (L[0] * (-L[3].z)) + (L[3] * L[0].z);
                                    L[3] = (L[2] * (-L[3].z)) + (L[3] * L[2].z);
                                }
                                else
                                {
                                    if (config == 8)
                                    {
                                        n = 3;
                                        L[0] = (L[3] * (-L[0].z)) + (L[0] * L[3].z);
                                        L[1] = (L[3] * (-L[2].z)) + (L[2] * L[3].z);
                                        L[2] = L[3];
                                    }
                                    else
                                    {
                                        if (config == 9)
                                        {
                                            n = 4;
                                            L[1] = (L[0] * (-L[1].z)) + (L[1] * L[0].z);
                                            L[2] = (L[3] * (-L[2].z)) + (L[2] * L[3].z);
                                        }
                                        else
                                        {
                                            if (config == 10)
                                            {
                                                n = 0;
                                            }
                                            else
                                            {
                                                if (config == 11)
                                                {
                                                    n = 5;
                                                    L[4] = L[3];
                                                    L[3] = (L[3] * (-L[2].z)) + (L[2] * L[3].z);
                                                    L[2] = (L[1] * (-L[2].z)) + (L[2] * L[1].z);
                                                }
                                                else
                                                {
                                                    if (config == 12)
                                                    {
                                                        n = 4;
                                                        L[1] = (L[2] * (-L[1].z)) + (L[1] * L[2].z);
                                                        L[0] = (L[3] * (-L[0].z)) + (L[0] * L[3].z);
                                                    }
                                                    else
                                                    {
                                                        if (config == 13)
                                                        {
                                                            n = 5;
                                                            L[4] = L[3];
                                                            L[3] = L[2];
                                                            L[2] = (L[2] * (-L[1].z)) + (L[1] * L[2].z);
                                                            L[1] = (L[0] * (-L[1].z)) + (L[1] * L[0].z);
                                                        }
                                                        else
                                                        {
                                                            if (config == 14)
                                                            {
                                                                n = 5;
                                                                L[4] = (L[3] * (-L[0].z)) + (L[0] * L[3].z);
                                                                L[0] = (L[1] * (-L[0].z)) + (L[0] * L[1].z);
                                                            }
                                                            else
                                                            {
                                                                if (config == 15)
                                                                {
                                                                    n = 4;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (n == 3)
    {
        L[3] = L[0];
    }
    if (n == 4)
    {
        L[4] = L[0];
    }
}

vec3 _LTC_IntegrateEdgeVec(vec3 v1, vec3 v2)
{
    float x = dot(v1, v2);
    float y = abs(x);
    float a = 0.8543984889984130859375 + ((0.4965155124664306640625 + (0.01452060043811798095703125 * y)) * y);
    float b = 3.41759395599365234375 + ((4.1616725921630859375 + y) * y);
    float v = a / b;
    float _499;
    if (x > 0.0)
    {
        _499 = v;
    }
    else
    {
        _499 = (0.5 * inversesqrt(max(1.0 - (x * x), 1.0000000116860974230803549289703e-07))) - v;
    }
    float theta_sintheta = _499;
    return cross(v1, v2) * theta_sintheta;
}

float _LTC_IntegrateEdge(vec3 v1, vec3 v2)
{
    vec3 param = v1;
    vec3 param_1 = v2;
    return _LTC_IntegrateEdgeVec(param, param_1).z;
}

vec3 _LTC_Evaluate(SurfaceParams S, LightParams L, inout mat3 invM)
{
    vec3 T1 = normalize(S.vDir - (S.nDir * S.ndv));
    vec3 T2 = cross(S.nDir, T1);
    if (L.areaLightShape > 0.5)
    {
        mat3 R = transpose(mat3(vec3(T1), vec3(T2), vec3(S.nDir)));
        vec3 localPoints[5];
        localPoints[0] = R * (L.areaLightPoints[0] - S.pos);
        localPoints[1] = R * (L.areaLightPoints[1] - S.pos);
        localPoints[2] = R * (L.areaLightPoints[2] - S.pos);
        vec3 Lo_i = vec3(0.0);
        vec3 C = (localPoints[0] + localPoints[2]) * 0.5;
        vec3 V1 = (localPoints[1] - localPoints[2]) * 0.5;
        vec3 V2 = (localPoints[1] - localPoints[0]) * 0.5;
        C = invM * C;
        V1 = invM * V1;
        V2 = invM * V2;
        if (L.areaLightTwoSide < 0.5)
        {
            if (dot(cross(V1, V2), C) < 0.0)
            {
                return vec3(0.0);
            }
        }
        float d11 = dot(V1, V1);
        float d22 = dot(V2, V2);
        float d12 = dot(V1, V2);
        float a;
        float b;
        if ((abs(d12) / sqrt(d11 * d22)) > 9.9999997473787516355514526367188e-05)
        {
            float tr = d11 + d22;
            float det = ((-d12) * d12) + (d11 * d22);
            det = sqrt(det);
            float u = 0.5 * sqrt(tr - (2.0 * det));
            float v = 0.5 * sqrt(tr + (2.0 * det));
            float param = u + v;
            float e_max = Pow2(param);
            float param_1 = u - v;
            float e_min = Pow2(param_1);
            vec3 V1_;
            vec3 V2_;
            if (d11 > d22)
            {
                V1_ = (V1 * d12) + (V2 * (e_max - d11));
                V2_ = (V1 * d12) + (V2 * (e_min - d11));
            }
            else
            {
                V1_ = (V2 * d12) + (V1 * (e_max - d22));
                V2_ = (V2 * d12) + (V1 * (e_min - d22));
            }
            a = 1.0 / e_max;
            b = 1.0 / e_min;
            V1 = normalize(V1_);
            V2 = normalize(V2_);
        }
        else
        {
            a = 1.0 / dot(V1, V1);
            b = 1.0 / dot(V2, V2);
            V1 *= sqrt(a);
            V2 *= sqrt(b);
        }
        vec3 V3 = cross(V1, V2);
        if (dot(C, V3) < 0.0)
        {
            V3 *= (-1.0);
        }
        float fL = dot(V3, C);
        float x0 = dot(V1, C) / fL;
        float y0 = dot(V2, C) / fL;
        float E1 = inversesqrt(a);
        float E2 = inversesqrt(b);
        a *= (fL * fL);
        b *= (fL * fL);
        float c0 = a * b;
        float c1 = (((a * b) * ((1.0 + (x0 * x0)) + (y0 * y0))) - a) - b;
        float c2 = (1.0 - (a * (1.0 + (x0 * x0)))) - (b * (1.0 + (y0 * y0)));
        float c3 = 1.0;
        vec4 param_2 = vec4(c0, c1, c2, c3);
        vec3 _1609 = SolveCubic(param_2);
        vec3 roots = _1609;
        float e1 = roots.x;
        float e2 = roots.y;
        float e3 = roots.z;
        vec3 avgDir = vec3((a * x0) / (a - e2), (b * y0) / (b - e2), 1.0);
        mat3 rotate = mat3(vec3(V1), vec3(V2), vec3(V3));
        avgDir = rotate * avgDir;
        avgDir = normalize(avgDir);
        float L1 = sqrt((-e2) / e3);
        float L2 = sqrt((-e2) / e1);
        float formFactor = (L1 * L2) * inversesqrt((1.0 + (L1 * L1)) * (1.0 + (L2 * L2)));
        vec2 uv = vec2((avgDir.z * 0.5) + 0.5, formFactor);
        uv = (uv * 0.984375) + vec2(0.0078125);
        float scale = texture(u_ltc_mag, uv).w;
        float spec = formFactor * scale;
        return vec3(spec);
    }
    else
    {
        invM = invM * transpose(mat3(vec3(T1), vec3(T2), vec3(S.nDir)));
        vec3 localPoints_1[5];
        localPoints_1[0] = invM * (L.areaLightPoints[0] - S.pos);
        localPoints_1[1] = invM * (L.areaLightPoints[1] - S.pos);
        localPoints_1[2] = invM * (L.areaLightPoints[2] - S.pos);
        localPoints_1[3] = invM * (L.areaLightPoints[3] - S.pos);
        vec3 param_3[5] = localPoints_1;
        mediump int param_4;
        _LTC_ClipQuadToHorizon(param_3, param_4);
        localPoints_1 = param_3;
        mediump int n = param_4;
        if (n == 0)
        {
            return vec3(0.0);
        }
        localPoints_1[0] = normalize(localPoints_1[0]);
        localPoints_1[1] = normalize(localPoints_1[1]);
        localPoints_1[2] = normalize(localPoints_1[2]);
        localPoints_1[3] = normalize(localPoints_1[3]);
        localPoints_1[4] = normalize(localPoints_1[4]);
        float sum = 0.0;
        vec3 param_5 = localPoints_1[0];
        vec3 param_6 = localPoints_1[1];
        sum += _LTC_IntegrateEdge(param_5, param_6);
        vec3 param_7 = localPoints_1[1];
        vec3 param_8 = localPoints_1[2];
        sum += _LTC_IntegrateEdge(param_7, param_8);
        vec3 param_9 = localPoints_1[2];
        vec3 param_10 = localPoints_1[3];
        sum += _LTC_IntegrateEdge(param_9, param_10);
        if (n >= 4)
        {
            vec3 param_11 = localPoints_1[3];
            vec3 param_12 = localPoints_1[4];
            sum += _LTC_IntegrateEdge(param_11, param_12);
        }
        if (n == 5)
        {
            vec3 param_13 = localPoints_1[4];
            vec3 param_14 = localPoints_1[0];
            sum += _LTC_IntegrateEdge(param_13, param_14);
        }
        if (L.areaLightTwoSide > 0.5)
        {
            return vec3(abs(sum));
        }
        return vec3(max(0.0, sum));
    }
}

vec3 Diffuse_AreaLight(inout SurfaceParams S, inout LightParams L)
{
    mat3 invM = mat3(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), vec3(0.0, 0.0, 1.0));
    SurfaceParams param = S;
    LightParams param_1 = L;
    mat3 param_2 = invM;
    vec3 _1934 = _LTC_Evaluate(param, param_1, param_2);
    S = param;
    L = param_1;
    vec3 lighting = _1934;
    return (((S.diffCol * L.color) * L.intensity) * L.attenuate) * lighting;
}

vec2 _LTC_CorrectUV(vec2 uv)
{
    return (uv * 0.984375) + vec2(0.0078125);
}

vec2 _LTC_GetUV(float roughness, float NoV)
{
    vec2 uv = vec2(roughness, sqrt(1.0 - NoV));
    vec2 param = uv;
    return _LTC_CorrectUV(param);
}

mat3 _LTC_GetInvM_GGX(vec2 uv)
{
    vec4 t = texture(u_ltc_mat, uv);
    t = (t - vec4(0.5)) * 4.0;
    return mat3(vec3(vec3(t.x, 0.0, t.y)), vec3(0.0, 1.0, 0.0), vec3(vec3(t.z, 0.0, t.w)));
}

vec4 _LTC_GetNFC_GGX(vec2 uv)
{
    vec4 t2 = texture(u_ltc_mag, uv);
    return t2;
}

vec3 Specular_AreaLight(inout SurfaceParams S, inout LightParams L)
{
    float param = S.roughParams.x;
    float param_1 = S.ndv;
    vec2 uv = _LTC_GetUV(param, param_1);
    uv = clamp(uv, vec2(0.0), vec2(1.0));
    vec2 param_2 = uv;
    mat3 invM = _LTC_GetInvM_GGX(param_2);
    vec2 param_3 = uv;
    vec2 nf = _LTC_GetNFC_GGX(param_3).xy;
    vec3 f0 = S.specCol;
    vec3 Fr = (f0 * nf.x) + ((vec3(1.0) - f0) * nf.y);
    SurfaceParams param_4 = S;
    LightParams param_5 = L;
    mat3 param_6 = invM;
    vec3 _1904 = _LTC_Evaluate(param_4, param_5, param_6);
    S = param_4;
    L = param_5;
    vec3 spec = _1904;
    vec3 lighting = Fr * spec;
    return ((L.color * L.intensity) * L.attenuate) * lighting;
}

void DoHeavyAreaLight(inout SurfaceParams S, inout LightParams L, inout vec3 Fd, inout vec3 Fr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
        SurfaceParams param = S;
        LightParams param_1 = L;
        vec3 _3145 = Diffuse_AreaLight(param, param_1);
        S = param;
        L = param_1;
        Fd += (_3145 * coatAttenuate);
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        vec3 _3156 = Specular_AreaLight(param_2, param_3);
        S = param_2;
        L = param_3;
        Fr += (_3156 * coatAttenuate);
    }
}

void DoAreaLight(inout SurfaceParams S, inout LightParams L, inout vec3 Fd, inout vec3 Fr)
{
    if (L.enable > 0.5)
    {
        SurfaceParams param = S;
        LightParams param_1 = L;
        vec3 _3172 = Diffuse_Low(param, param_1);
        S = param;
        L = param_1;
        Fd += _3172;
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        vec3 _3181 = Specular_Low(param_2, param_3);
        S = param_2;
        L = param_3;
        Fr += _3181;
    }
}

vec3 Lighting(inout SurfaceParams S)
{
    vec3 Fd = vec3(0.0);
    vec3 Fr = vec3(0.0);
    vec3 finalRGB = vec3(0.0);
    SurfaceParams param = S;
    vec3 param_1 = Fd;
    vec3 param_2 = Fr;
    DoIndirectLight(param, param_1, param_2);
    S = param;
    Fd = param_1;
    Fr = param_2;
    SurfaceParams param_3 = S;
    mediump int param_4 = 0;
    LightParams param_5;
    BuildDirLightParams(param_3, param_4, param_5);
    S = param_3;
    LightParams DL0 = param_5;
    SurfaceParams param_6 = S;
    LightParams param_7 = DL0;
    vec3 param_8 = Fd;
    vec3 param_9 = Fr;
    DoHeavyLight(param_6, param_7, param_8, param_9);
    S = param_6;
    DL0 = param_7;
    Fd = param_8;
    Fr = param_9;
    SurfaceParams param_10 = S;
    mediump int param_11 = 1;
    LightParams param_12;
    BuildDirLightParams(param_10, param_11, param_12);
    S = param_10;
    LightParams DL1 = param_12;
    SurfaceParams param_13 = S;
    LightParams param_14 = DL1;
    vec3 param_15 = Fd;
    vec3 param_16 = Fr;
    DoLight(param_13, param_14, param_15, param_16);
    S = param_13;
    DL1 = param_14;
    Fd = param_15;
    Fr = param_16;
    SurfaceParams param_17 = S;
    mediump int param_18 = 2;
    LightParams param_19;
    BuildDirLightParams(param_17, param_18, param_19);
    S = param_17;
    LightParams DL2 = param_19;
    SurfaceParams param_20 = S;
    LightParams param_21 = DL2;
    vec3 param_22 = Fd;
    vec3 param_23 = Fr;
    DoLight(param_20, param_21, param_22, param_23);
    S = param_20;
    DL2 = param_21;
    Fd = param_22;
    Fr = param_23;
    SurfaceParams param_24 = S;
    mediump int param_25 = 0;
    LightParams param_26;
    BuildPointLightParams(param_24, param_25, param_26);
    S = param_24;
    LightParams PL0 = param_26;
    SurfaceParams param_27 = S;
    LightParams param_28 = PL0;
    vec3 param_29 = Fd;
    vec3 param_30 = Fr;
    DoHeavyLight(param_27, param_28, param_29, param_30);
    S = param_27;
    PL0 = param_28;
    Fd = param_29;
    Fr = param_30;
    SurfaceParams param_31 = S;
    mediump int param_32 = 1;
    LightParams param_33;
    BuildPointLightParams(param_31, param_32, param_33);
    S = param_31;
    LightParams PL1 = param_33;
    SurfaceParams param_34 = S;
    LightParams param_35 = PL1;
    vec3 param_36 = Fd;
    vec3 param_37 = Fr;
    DoLight(param_34, param_35, param_36, param_37);
    S = param_34;
    PL1 = param_35;
    Fd = param_36;
    Fr = param_37;
    SurfaceParams param_38 = S;
    mediump int param_39 = 0;
    LightParams param_40;
    BuildSpotLightParams(param_38, param_39, param_40);
    S = param_38;
    LightParams SL0 = param_40;
    SurfaceParams param_41 = S;
    LightParams param_42 = SL0;
    vec3 param_43 = Fd;
    vec3 param_44 = Fr;
    DoHeavyLight(param_41, param_42, param_43, param_44);
    S = param_41;
    SL0 = param_42;
    Fd = param_43;
    Fr = param_44;
    SurfaceParams param_45 = S;
    mediump int param_46 = 1;
    LightParams param_47;
    BuildSpotLightParams(param_45, param_46, param_47);
    S = param_45;
    LightParams SL1 = param_47;
    SurfaceParams param_48 = S;
    LightParams param_49 = SL1;
    vec3 param_50 = Fd;
    vec3 param_51 = Fr;
    DoLight(param_48, param_49, param_50, param_51);
    S = param_48;
    SL1 = param_49;
    Fd = param_50;
    Fr = param_51;
    SurfaceParams param_52 = S;
    mediump int param_53 = 0;
    LightParams param_54;
    BuildAreaLightParams(param_52, param_53, param_54);
    S = param_52;
    LightParams AL0 = param_54;
    SurfaceParams param_55 = S;
    LightParams param_56 = AL0;
    vec3 param_57 = Fd;
    vec3 param_58 = Fr;
    DoHeavyAreaLight(param_55, param_56, param_57, param_58);
    S = param_55;
    AL0 = param_56;
    Fd = param_57;
    Fr = param_58;
    SurfaceParams param_59 = S;
    mediump int param_60 = 1;
    LightParams param_61;
    BuildAreaLightParams(param_59, param_60, param_61);
    S = param_59;
    LightParams AL1 = param_61;
    SurfaceParams param_62 = S;
    LightParams param_63 = AL1;
    vec3 param_64 = Fd;
    vec3 param_65 = Fr;
    DoAreaLight(param_62, param_63, param_64, param_65);
    S = param_62;
    AL1 = param_63;
    Fd = param_64;
    Fr = param_65;
    finalRGB = Fd + Fr;
    return finalRGB;
}

vec3 LinearToGamma(vec3 col)
{
    vec3 param = col;
    vec3 param_1 = vec3(0.4545454680919647216796875);
    vec3 _393 = SafePow(param, param_1);
    return _393;
}

vec4 MainEntry()
{
    SurfaceParams param;
    BuildSurfaceParams(param);
    SurfaceParams S = param;
    SurfaceParams param_1 = S;
    vec3 _3562 = Lighting(param_1);
    S = param_1;
    vec3 finalRGB = _3562;
    vec3 param_2 = finalRGB;
    finalRGB = LinearToGamma(param_2);
    vec4 result = vec4(finalRGB, S.opacity);
    return result;
}

vec4 ApplyBlendMode(vec4 color, vec2 uv)
{
    vec4 ret = color;
    return ret;
}

void main()
{
    vec2 ndc_coord = v_gl_pos.xy / vec2(v_gl_pos.w);
    vec2 screen_coord = (ndc_coord * 0.5) + vec2(0.5);
    vec4 _3594 = MainEntry();
    vec4 final_color = _3594;
    vec4 param = final_color;
    vec2 param_1 = screen_coord;
    o_fragColor = ApplyBlendMode(param, param_1);
}

