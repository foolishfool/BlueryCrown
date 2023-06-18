struct SurfaceParams
{
    float2 uv0;
    float opacity;
    float3 roughParams;
    float2 occParams;
    float3 diffCol;
    float3 specCol;
    float3 pos;
    float3 nDir;
    float3 vnDir;
    float3 vDir;
    float3 rDir;
    float ndv;
};

struct LightParams
{
    float enable;
    float3 lDir;
    float3 color;
    float intensity;
    float3 attenuate;
    float3 areaLightPoints[4];
    float areaLightShape;
    float areaLightTwoSide;
    float3 hDir;
    float ldh;
    float ndl;
    float ndh;
    float vdh;
};

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
uniform float4 u_AreaLightsDirection[2];
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
uniform float _Occlusion;
uniform float _ThinFilmIOR;
row_major uniform float4x4 u_VP;
row_major uniform float4x4 u_MV;
row_major uniform float4x4 u_InvView;
row_major uniform float4x4 u_CameraInvProjection;
row_major uniform float4x4 u_InvModel;
uniform float4 u_Time;
uniform float u_DirLightNum;
uniform float u_PointLightNum;
uniform float u_SpotLightNum;
Texture2D<float4> u_FBOTexture : register(t0);
SamplerState _u_FBOTexture_sampler : register(s0);
uniform float u_AreaLightNum;
uniform float4 u_AreaLightsPosition[2];
uniform float u_AreaLightsAttenRangeInv[2];

static float3 v_nDirWS;
static float3 v_posWS;
static float3 v_tDirWS;
static float3 v_bDirWS;
static float2 v_uv0;
static float4 v_gl_pos;
static float4 o_fragColor;
static float2 v_uv0_src;
static float2 v_uv1;

struct SPIRV_Cross_Input
{
    float4 v_gl_pos : v_gl_pos;
    float3 v_posWS : v_posWS;
    float3 v_nDirWS : v_nDirWS;
    float2 v_uv0 : v_uv0;
    float2 v_uv0_src : v_uv0_src;
    float2 v_uv1 : v_uv1;
    float3 v_tDirWS : v_tDirWS;
    float3 v_bDirWS : v_bDirWS;
};

struct SPIRV_Cross_Output
{
    float4 o_fragColor : SV_Target0;
};

float3 SafePow(inout float3 v, inout float3 e)
{
    v = max(v, 9.9999997473787516355514526367188e-06f.xxx);
    e = max(e, 9.9999997473787516355514526367188e-06f.xxx);
    return pow(v, e);
}

float3 GammaToLinear(float3 col)
{
    float3 param = col;
    float3 param_1 = 2.2000000476837158203125f.xxx;
    float3 _385 = SafePow(param, param_1);
    return _385;
}

float saturate(float x)
{
    return clamp(x, 0.0f, 1.0f);
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
    float3 vnDirWS = normalize(v_nDirWS);
    float3 vDir = normalize(u_WorldSpaceCameraPos.xyz - v_posWS);
    if (dot(vDir, vnDirWS) < (-0.0500000007450580596923828125f))
    {
        vnDirWS = -vnDirWS;
    }
    float3 vtDirWS = normalize(v_tDirWS);
    float3 vbDirWS = normalize(v_bDirWS);
    float2 uv0 = v_uv0;
    S.uv0 = uv0;
    float3 param = _AlbedoColor.xyz;
    float3 albedo = GammaToLinear(param);
    float opacity = _AlbedoColor.w;
    float4 t_AlbedoTex = _AlbedoTexture.Sample(__AlbedoTexture_sampler, uv0);
    float3 param_1 = t_AlbedoTex.xyz;
    albedo *= GammaToLinear(param_1);
    opacity *= t_AlbedoTex.w;
    float metallic = _Metallic;
    float roughness = _Roughness;
    float ao = 1.0f;
    float cavity = 1.0f;
    float3 normal = vnDirWS;
    S.vDir = vDir;
    float avgTextureNormalLength = 1.0f;
    S.opacity = opacity;
    float param_2 = metallic;
    metallic = saturate(param_2);
    S.nDir = normal;
    float perceptualRoughness = clamp(roughness, 0.0f, 1.0f);
    S.roughParams.x = perceptualRoughness;
    float param_3 = S.roughParams.x;
    S.roughParams.y = Pow2(param_3);
    float param_4 = S.roughParams.y;
    S.roughParams.z = Pow2(param_4);
    S.diffCol = albedo * (1.0f - metallic);
    S.pos = v_posWS;
    S.vnDir = vnDirWS;
    S.ndv = max(0.0f, dot(S.nDir, S.vDir));
    S.rDir = normalize(reflect(-S.vDir, S.nDir));
    float ior = 1.5f;
    float param_5 = 1.0f;
    float param_6 = ior;
    float dielectricF0 = IorToSpecularLevel(param_5, param_6);
    float3 specularAlbedo = albedo;
    S.specCol = lerp(dielectricF0.xxx, specularAlbedo, metallic.xxx);
    S.occParams = 1.0f.xx;
}

float ACos(float inX)
{
    float x = abs(inX);
    float res = ((-0.15658299624919891357421875f) * x) + 1.57079601287841796875f;
    res *= sqrt(1.0f - x);
    float _293;
    if (inX >= 0.0f)
    {
        _293 = res;
    }
    else
    {
        _293 = 3.1415927410125732421875f - res;
    }
    return _293;
}

float ATan(float x, float y)
{
    float signx = (x < 0.0f) ? (-1.0f) : 1.0f;
    float param = clamp(y / length(float2(x, y)), -1.0f, 1.0f);
    return signx * ACos(param);
}

float2 GetPanoramicTexCoordsFromDir(inout float3 dir, float rotation)
{
    dir = normalize(dir);
    float param = dir.x;
    float param_1 = -dir.z;
    float2 uv;
    uv.x = (ATan(param, param_1) - 1.57079637050628662109375f) / 6.283185482025146484375f;
    uv.y = acos(dir.y) / 3.1415927410125732421875f;
    uv.x += rotation;
    uv.x = frac((uv.x + floor(uv.x)) + 1.0f);
    return uv;
}

float3 SamplerEncodedPanoramicWithUV(float2 uv, float lod)
{
    float lodMin = floor(lod);
    float lodLerp = lod - lodMin;
    float2 uvLodMin = uv;
    float2 uvLodMax = uv;
    float2 size = 0.0f.xx;
    if (abs(lodMin - 0.0f) < 0.001000000047497451305389404296875f)
    {
        uvLodMin.x = ((((uv.x * 511.0f) / 512.0f) + 0.0009765625f) * 1.0f) + 0.0f;
        uvLodMin.y = ((((uv.y * 255.0f) / 256.0f) + 0.001953125f) * 0.5f) + 0.0f;
        uvLodMax.x = ((((uv.x * 255.0f) / 256.0f) + 0.001953125f) * 0.5f) + 0.0f;
        uvLodMax.y = ((((uv.y * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
    }
    else
    {
        if (abs(lodMin - 1.0f) < 0.001000000047497451305389404296875f)
        {
            uvLodMin.x = ((((uv.x * 255.0f) / 256.0f) + 0.001953125f) * 0.5f) + 0.0f;
            uvLodMin.y = ((((uv.y * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
            uvLodMax.x = ((((uv.x * 255.0f) / 256.0f) + 0.001953125f) * 0.5f) + 0.5f;
            uvLodMax.y = ((((uv.y * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
        }
        else
        {
            if (abs(lodMin - 2.0f) < 0.001000000047497451305389404296875f)
            {
                uvLodMin.x = ((((uv.x * 255.0f) / 256.0f) + 0.001953125f) * 0.5f) + 0.5f;
                uvLodMin.y = ((((uv.y * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
                uvLodMax.x = ((((uv.x * 255.0f) / 256.0f) + 0.001953125f) * 0.5f) + 0.0f;
                uvLodMax.y = ((((uv.y * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.75f;
            }
            else
            {
                if (abs(lodMin - 3.0f) < 0.001000000047497451305389404296875f)
                {
                    uvLodMin.x = ((((uv.x * 255.0f) / 256.0f) + 0.001953125f) * 0.5f) + 0.0f;
                    uvLodMin.y = ((((uv.y * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.75f;
                    uvLodMax.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
                    uvLodMax.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.75f;
                }
                else
                {
                    if (abs(lodMin - 4.0f) < 0.001000000047497451305389404296875f)
                    {
                        uvLodMin.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
                        uvLodMin.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.75f;
                        uvLodMax.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.75f;
                        uvLodMax.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.75f;
                    }
                    else
                    {
                        if (abs(lodMin - 5.0f) < 0.001000000047497451305389404296875f)
                        {
                            uvLodMin.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.75f;
                            uvLodMin.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.75f;
                            uvLodMax.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
                            uvLodMax.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.875f;
                        }
                        else
                        {
                            if (abs(lodMin - 6.0f) < 0.001000000047497451305389404296875f)
                            {
                                uvLodMin.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.5f;
                                uvLodMin.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.875f;
                                uvLodMax.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.75f;
                                uvLodMax.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.875f;
                            }
                            else
                            {
                                uvLodMin.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.75f;
                                uvLodMin.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.875f;
                                uvLodMax.x = ((((uv.x * 127.0f) / 128.0f) + 0.00390625f) * 0.25f) + 0.75f;
                                uvLodMax.y = ((((uv.y * 63.0f) / 64.0f) + 0.0078125f) * 0.125f) + 0.875f;
                            }
                        }
                    }
                }
            }
        }
    }
    float4 envEncoded = lerp(_EnvTex.Sample(__EnvTex_sampler, uvLodMin), _EnvTex.Sample(__EnvTex_sampler, uvLodMax), lodLerp.xxxx);
    return envEncoded.xyz / envEncoded.w.xxx;
}

float3 SampleIBL(float3 dir, float rotation, float lod)
{
    float3 param = dir;
    float param_1 = rotation;
    float2 _2996 = GetPanoramicTexCoordsFromDir(param, param_1);
    float2 uv = _2996;
    float2 param_2 = uv;
    float param_3 = lod;
    return SamplerEncodedPanoramicWithUV(param_2, param_3) * _Env;
}

float3 GTAO_MultiBounce(float visibility, float3 albedo)
{
    float3 a = (albedo * 2.040400028228759765625f) - 0.3323999941349029541015625f.xxx;
    float3 b = (albedo * (-4.79510021209716796875f)) + 0.6417000293731689453125f.xxx;
    float3 c = (albedo * 2.755199909210205078125f) + 0.69029998779296875f.xxx;
    return max(visibility.xxx, ((((a * visibility) + b) * visibility) + c) * visibility);
}

float3 Diffuse_Env(SurfaceParams S)
{
    float3 diffuseNormal = S.nDir;
    float3 lighting = 0.0f.xxx;
    float3 param = diffuseNormal;
    float param_1 = _EnvRot;
    float param_2 = 7.0f;
    lighting = SampleIBL(param, param_1, param_2);
    float param_3 = S.occParams.x;
    float3 param_4 = S.diffCol;
    float3 multiBounceColor = GTAO_MultiBounce(param_3, param_4);
    return (S.diffCol * lighting) * multiBounceColor;
}

float3 EnvBRDFApprox(float3 F0, float perceptualRoughness, float ndv)
{
    float4 r = (float4(-1.0f, -0.0274999998509883880615234375f, -0.572000026702880859375f, 0.02199999988079071044921875f) * perceptualRoughness) + float4(1.0f, 0.0425000004470348358154296875f, 1.03999996185302734375f, -0.039999999105930328369140625f);
    float a004 = (min(r.x * r.x, exp2((-9.27999973297119140625f) * ndv)) * r.x) + r.y;
    float2 AB = (float2(-1.03999996185302734375f, 1.03999996185302734375f) * a004) + r.zw;
    float param = 50.0f * F0.y;
    AB.y *= saturate(param);
    return (F0 * AB.x) + AB.y.xxx;
}

float3 EnvBRDF(SurfaceParams S)
{
    float3 param = S.specCol;
    float param_1 = S.roughParams.x;
    float param_2 = S.ndv;
    return EnvBRDFApprox(param, param_1, param_2);
}

float3 Specular_Env(inout SurfaceParams S)
{
    float3 dir = lerp(S.rDir, S.nDir, (S.roughParams.x * S.roughParams.y).xxx);
    float3 param = dir;
    float param_1 = _EnvRot;
    float param_2 = S.roughParams.x * 7.0f;
    float3 specEnv = SampleIBL(param, param_1, param_2);
    SurfaceParams param_3 = S;
    S = param_3;
    float3 brdf = EnvBRDF(param_3);
    float param_4 = S.occParams.y;
    float3 param_5 = S.specCol;
    float3 multiBounceColor = GTAO_MultiBounce(param_4, param_5);
    float3 Fr = (brdf * multiBounceColor) * specEnv;
    return Fr;
}

void DoIndirectLight(inout SurfaceParams S, inout float3 Fd, inout float3 Fr)
{
    float coatAttenuate_IBL = 1.0f;
    SurfaceParams param = S;
    S = param;
    Fd += (Diffuse_Env(param) * coatAttenuate_IBL);
    SurfaceParams param_1 = S;
    float3 _3197 = Specular_Env(param_1);
    S = param_1;
    Fr += (_3197 * coatAttenuate_IBL);
}

void LightCommomOperations(SurfaceParams S, inout LightParams L)
{
    L.hDir = normalize(L.lDir + S.vDir);
    L.ldh = max(0.0f, dot(L.lDir, L.hDir));
    L.ndl = max(0.0f, dot(S.nDir, L.lDir));
    L.ndh = max(0.0f, dot(S.nDir, L.hDir));
    L.vdh = max(0.0f, dot(S.vDir, L.hDir));
}

void BuildDirLightParams(inout SurfaceParams S, int index, inout LightParams ML)
{
    ML.enable = u_DirLightsEnabled[index];
    ML.lDir = normalize(-u_DirLightsDirection[index].xyz);
    ML.color = u_DirLightsColor[index].xyz;
    ML.intensity = (u_DirLightsIntensity[index] * u_DirLightsEnabled[index]) * 3.1415920257568359375f;
    ML.attenuate = 1.0f.xxx;
    SurfaceParams param = S;
    LightParams param_1 = ML;
    LightCommomOperations(param, param_1);
    S = param;
    ML = param_1;
}

float3 Diffuse_Lambert(SurfaceParams S, LightParams L)
{
    float lighting = L.ndl * 0.31830990314483642578125f;
    return (((S.diffCol * L.color) * L.intensity) * L.attenuate) * lighting;
}

float3 Diffuse_High(inout SurfaceParams S, inout LightParams L)
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

float3 F_Schlick(float3 f0, inout float vdh)
{
    vdh = max(0.0f, vdh);
    float param = 1.0f - vdh;
    float t = Pow5(param);
    return f0 + ((1.0f.xxx - f0) * t);
}

float3 FresnelSpecular(SurfaceParams S, float vdh)
{
    float3 f0 = S.specCol;
    float3 param = f0;
    float param_1 = vdh;
    float3 _2359 = F_Schlick(param, param_1);
    return _2359;
}

float V_SmithJointApprox(float a, float ndv, float ndl)
{
    float lambdaV = ndl * ((ndv * (1.0f - a)) + a);
    float lambdaL = ndv * ((ndl * (1.0f - a)) + a);
    return 0.5f / ((lambdaV + lambdaL) + 9.9999997473787516355514526367188e-06f);
}

float D_GGX(float ndh, float a2)
{
    float d = (((ndh * a2) - ndh) * ndh) + 1.0f;
    return (a2 * 0.31830990314483642578125f) / ((d * d) + 1.0000000116860974230803549289703e-07f);
}

float3 Specular_GGX(inout SurfaceParams S, LightParams L)
{
    SurfaceParams param = S;
    float param_1 = L.vdh;
    S = param;
    float3 F = FresnelSpecular(param, param_1);
    float a = S.roughParams.y;
    float a2 = S.roughParams.z;
    float param_2 = L.ndl;
    float param_3 = S.ndv;
    float param_4 = a;
    float V = V_SmithJointApprox(param_2, param_3, param_4);
    float param_5 = L.ndh;
    float param_6 = a2;
    float D = D_GGX(param_5, param_6);
    float3 specular = ((((F * (D * V)) * L.ndl) * L.color) * L.intensity) * L.attenuate;
    return specular;
}

float3 Specular_High(inout SurfaceParams S, inout LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    float3 _2480 = Specular_GGX(param, param_1);
    S = param;
    L = param_1;
    return _2480;
}

void DoHeavyLight(inout SurfaceParams S, inout LightParams L, inout float3 Fd, inout float3 Fr)
{
    if (L.enable > 0.5f)
    {
        float coatAttenuate = 1.0f;
        SurfaceParams param = S;
        LightParams param_1 = L;
        float3 _3089 = Diffuse_High(param, param_1);
        S = param;
        L = param_1;
        Fd += (_3089 * coatAttenuate);
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        float3 _3100 = Specular_High(param_2, param_3);
        S = param_2;
        L = param_3;
        Fr += (_3100 * coatAttenuate);
    }
}

float3 Diffuse_Low(inout SurfaceParams S, inout LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    S = param;
    L = param_1;
    return Diffuse_Lambert(param, param_1);
}

float V_Const()
{
    return 0.25f;
}

float3 Specular_GGX_Low(inout SurfaceParams S, LightParams L)
{
    SurfaceParams param = S;
    float param_1 = L.vdh;
    S = param;
    float3 F = FresnelSpecular(param, param_1);
    float a = S.roughParams.y;
    float a2 = S.roughParams.z;
    float V = V_Const();
    float param_2 = L.ndh;
    float param_3 = a2;
    float D = D_GGX(param_2, param_3);
    float3 specular = ((((F * (D * V)) * L.ndl) * L.color) * L.intensity) * L.attenuate;
    return specular;
}

float3 Specular_Low(inout SurfaceParams S, inout LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    float3 _2489 = Specular_GGX_Low(param, param_1);
    S = param;
    L = param_1;
    return _2489;
}

void DoLight(inout SurfaceParams S, inout LightParams L, inout float3 Fd, inout float3 Fr)
{
    if (L.enable > 0.5f)
    {
        float coatAttenuate = 1.0f;
        SurfaceParams param = S;
        LightParams param_1 = L;
        float3 _3117 = Diffuse_Low(param, param_1);
        S = param;
        L = param_1;
        Fd += (_3117 * coatAttenuate);
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        float3 _3128 = Specular_Low(param_2, param_3);
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

void BuildPointLightParams(inout SurfaceParams S, int index, inout LightParams PL)
{
    float3 lVec = 0.0f.xxx;
    float lDist = 0.0f;
    PL.enable = u_PointLightsEnabled[index];
    lVec = u_PointLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    PL.lDir = lVec / lDist.xxx;
    PL.color = u_PointLightsColor[index].xyz;
    PL.intensity = (u_PointLightsIntensity[index] * u_PointLightsEnabled[index]) * 3.1415920257568359375f;
    float lWorldDist = lDist;
    lDist *= u_PointLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0f - Pow4(param);
    float param_2 = saturate(param_1);
    float param_3 = lDist;
    float attenuate = (Pow2(param_2) * (Pow2(param_3) + 1.0f)) * 0.25f;
    PL.attenuate = float3(attenuate, attenuate, attenuate);
    SurfaceParams param_4 = S;
    LightParams param_5 = PL;
    LightCommomOperations(param_4, param_5);
    S = param_4;
    PL = param_5;
}

void BuildSpotLightParams(inout SurfaceParams S, int index, inout LightParams SL)
{
    float3 lVec = 0.0f.xxx;
    float lDist = 0.0f;
    float3 spotDir = 0.0f.xxx;
    float angleAtten = 0.0f;
    SL.enable = u_SpotLightsEnabled[index];
    lVec = u_SpotLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    SL.lDir = lVec / lDist.xxx;
    SL.color = u_SpotLightsColor[index].xyz;
    SL.intensity = (u_SpotLightsIntensity[index] * u_SpotLightsEnabled[index]) * 3.1415920257568359375f;
    float lWorldDist = lDist;
    lDist *= u_SpotLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0f - Pow4(param);
    float param_2 = saturate(param_1);
    float param_3 = lDist;
    float attenuate = (Pow2(param_2) * (Pow2(param_3) + 1.0f)) * 0.25f;
    spotDir = normalize(-u_SpotLightsDirection[index].xyz);
    angleAtten = max(0.0f, dot(SL.lDir, spotDir));
    attenuate *= smoothstep(u_SpotLightsOuterAngleCos[index], u_SpotLightsInnerAngleCos[index], angleAtten);
    SL.attenuate = float3(attenuate, attenuate, attenuate);
    SurfaceParams param_4 = S;
    LightParams param_5 = SL;
    LightCommomOperations(param_4, param_5);
    S = param_4;
    SL = param_5;
}

void BuildAreaLightParams(SurfaceParams S, int index, inout LightParams AL)
{
    AL.enable = u_AreaLightsEnabled[index];
    AL.lDir = u_AreaLightsDirection[index].xyz;
    AL.color = u_AreaLightsColor[index].xyz;
    AL.intensity = (u_AreaLightsIntensity[index] * u_AreaLightsEnabled[index]) * 3.1415920257568359375f;
    AL.attenuate = 1.0f.xxx;
    AL.areaLightPoints[0] = u_AreaLightsPoint0[index].xyz;
    AL.areaLightPoints[1] = u_AreaLightsPoint1[index].xyz;
    AL.areaLightPoints[2] = u_AreaLightsPoint2[index].xyz;
    AL.areaLightPoints[3] = u_AreaLightsPoint3[index].xyz;
    AL.areaLightShape = u_AreaLightsShape[index];
    AL.areaLightTwoSide = u_AreaLightsTwoSide[index];
}

float3 SolveCubic(inout float4 Coefficient)
{
    float3 _997 = Coefficient.xyz / Coefficient.w.xxx;
    Coefficient = float4(_997.x, _997.y, _997.z, Coefficient.w);
    float2 _1004 = Coefficient.yz / 3.0f.xx;
    Coefficient = float4(Coefficient.x, _1004.x, _1004.y, Coefficient.w);
    float A = Coefficient.w;
    float B = Coefficient.z;
    float C = Coefficient.y;
    float D = Coefficient.x;
    float3 Delta = float3(((-Coefficient.z) * Coefficient.z) + Coefficient.y, ((-Coefficient.y) * Coefficient.z) + Coefficient.x, dot(float2(Coefficient.z, -Coefficient.y), Coefficient.xy));
    float Discriminant = dot(float2(4.0f * Delta.x, -Delta.y), Delta.zy);
    float A_a = 1.0f;
    float C_a = Delta.x;
    float D_a = (((-2.0f) * B) * Delta.x) + Delta.y;
    float Theta = atan2(sqrt(Discriminant), -D_a) / 3.0f;
    float x_1a = (2.0f * sqrt(-C_a)) * cos(Theta);
    float x_3a = (2.0f * sqrt(-C_a)) * cos(Theta + 2.094395160675048828125f);
    float xl;
    if ((x_1a + x_3a) > (2.0f * B))
    {
        xl = x_1a;
    }
    else
    {
        xl = x_3a;
    }
    float2 xlc = float2(xl - B, A);
    float A_d = D;
    float C_d = Delta.z;
    float D_d = ((-D) * Delta.y) + ((2.0f * C) * Delta.z);
    float Theta_1 = atan2(D * sqrt(Discriminant), -D_d) / 3.0f;
    float x_1d = (2.0f * sqrt(-C_d)) * cos(Theta_1);
    float x_3d = (2.0f * sqrt(-C_d)) * cos(Theta_1 + 2.094395160675048828125f);
    float xs;
    if ((x_1d + x_3d) < (2.0f * C))
    {
        xs = x_1d;
    }
    else
    {
        xs = x_3d;
    }
    float2 xsc = float2(-D, xs + C);
    float E = xlc.y * xsc.y;
    float F = ((-xlc.x) * xsc.y) - (xlc.y * xsc.x);
    float G = xlc.x * xsc.x;
    float2 xmc = float2((C * F) - (B * G), ((-B) * F) + (C * E));
    float3 Root = float3(xsc.x / xsc.y, xmc.x / xmc.y, xlc.x / xlc.y);
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

void _LTC_ClipQuadToHorizon(inout float3 L[5], inout int n)
{
    int config = 0;
    if (L[0].z > 0.0f)
    {
        config++;
    }
    if (L[1].z > 0.0f)
    {
        config += 2;
    }
    if (L[2].z > 0.0f)
    {
        config += 4;
    }
    if (L[3].z > 0.0f)
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

float3 _LTC_IntegrateEdgeVec(float3 v1, float3 v2)
{
    float x = dot(v1, v2);
    float y = abs(x);
    float a = 0.8543984889984130859375f + ((0.4965155124664306640625f + (0.01452060043811798095703125f * y)) * y);
    float b = 3.41759395599365234375f + ((4.1616725921630859375f + y) * y);
    float v = a / b;
    float _499;
    if (x > 0.0f)
    {
        _499 = v;
    }
    else
    {
        _499 = (0.5f * rsqrt(max(1.0f - (x * x), 1.0000000116860974230803549289703e-07f))) - v;
    }
    float theta_sintheta = _499;
    return cross(v1, v2) * theta_sintheta;
}

float _LTC_IntegrateEdge(float3 v1, float3 v2)
{
    float3 param = v1;
    float3 param_1 = v2;
    return _LTC_IntegrateEdgeVec(param, param_1).z;
}

float3 _LTC_Evaluate(SurfaceParams S, LightParams L, inout float3x3 invM)
{
    float3 T1 = normalize(S.vDir - (S.nDir * S.ndv));
    float3 T2 = cross(S.nDir, T1);
    if (L.areaLightShape > 0.5f)
    {
        float3x3 R = transpose(float3x3(float3(T1), float3(T2), float3(S.nDir)));
        float3 localPoints[5];
        localPoints[0] = mul(L.areaLightPoints[0] - S.pos, R);
        localPoints[1] = mul(L.areaLightPoints[1] - S.pos, R);
        localPoints[2] = mul(L.areaLightPoints[2] - S.pos, R);
        float3 Lo_i = 0.0f.xxx;
        float3 C = (localPoints[0] + localPoints[2]) * 0.5f;
        float3 V1 = (localPoints[1] - localPoints[2]) * 0.5f;
        float3 V2 = (localPoints[1] - localPoints[0]) * 0.5f;
        C = mul(C, invM);
        V1 = mul(V1, invM);
        V2 = mul(V2, invM);
        if (L.areaLightTwoSide < 0.5f)
        {
            if (dot(cross(V1, V2), C) < 0.0f)
            {
                return 0.0f.xxx;
            }
        }
        float d11 = dot(V1, V1);
        float d22 = dot(V2, V2);
        float d12 = dot(V1, V2);
        float a;
        float b;
        if ((abs(d12) / sqrt(d11 * d22)) > 9.9999997473787516355514526367188e-05f)
        {
            float tr = d11 + d22;
            float det = ((-d12) * d12) + (d11 * d22);
            det = sqrt(det);
            float u = 0.5f * sqrt(tr - (2.0f * det));
            float v = 0.5f * sqrt(tr + (2.0f * det));
            float param = u + v;
            float e_max = Pow2(param);
            float param_1 = u - v;
            float e_min = Pow2(param_1);
            float3 V1_;
            float3 V2_;
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
            a = 1.0f / e_max;
            b = 1.0f / e_min;
            V1 = normalize(V1_);
            V2 = normalize(V2_);
        }
        else
        {
            a = 1.0f / dot(V1, V1);
            b = 1.0f / dot(V2, V2);
            V1 *= sqrt(a);
            V2 *= sqrt(b);
        }
        float3 V3 = cross(V1, V2);
        if (dot(C, V3) < 0.0f)
        {
            V3 *= (-1.0f);
        }
        float fL = dot(V3, C);
        float x0 = dot(V1, C) / fL;
        float y0 = dot(V2, C) / fL;
        float E1 = rsqrt(a);
        float E2 = rsqrt(b);
        a *= (fL * fL);
        b *= (fL * fL);
        float c0 = a * b;
        float c1 = (((a * b) * ((1.0f + (x0 * x0)) + (y0 * y0))) - a) - b;
        float c2 = (1.0f - (a * (1.0f + (x0 * x0)))) - (b * (1.0f + (y0 * y0)));
        float c3 = 1.0f;
        float4 param_2 = float4(c0, c1, c2, c3);
        float3 _1609 = SolveCubic(param_2);
        float3 roots = _1609;
        float e1 = roots.x;
        float e2 = roots.y;
        float e3 = roots.z;
        float3 avgDir = float3((a * x0) / (a - e2), (b * y0) / (b - e2), 1.0f);
        float3x3 rotate = float3x3(float3(V1), float3(V2), float3(V3));
        avgDir = mul(avgDir, rotate);
        avgDir = normalize(avgDir);
        float L1 = sqrt((-e2) / e3);
        float L2 = sqrt((-e2) / e1);
        float formFactor = (L1 * L2) * rsqrt((1.0f + (L1 * L1)) * (1.0f + (L2 * L2)));
        float2 uv = float2((avgDir.z * 0.5f) + 0.5f, formFactor);
        uv = (uv * 0.984375f) + 0.0078125f.xx;
        float scale = u_ltc_mag.Sample(_u_ltc_mag_sampler, uv).w;
        float spec = formFactor * scale;
        return spec.xxx;
    }
    else
    {
        invM = mul(transpose(float3x3(float3(T1), float3(T2), float3(S.nDir))), invM);
        float3 localPoints_1[5];
        localPoints_1[0] = mul(L.areaLightPoints[0] - S.pos, invM);
        localPoints_1[1] = mul(L.areaLightPoints[1] - S.pos, invM);
        localPoints_1[2] = mul(L.areaLightPoints[2] - S.pos, invM);
        localPoints_1[3] = mul(L.areaLightPoints[3] - S.pos, invM);
        float3 param_3[5] = localPoints_1;
        int param_4;
        _LTC_ClipQuadToHorizon(param_3, param_4);
        localPoints_1 = param_3;
        int n = param_4;
        if (n == 0)
        {
            return 0.0f.xxx;
        }
        localPoints_1[0] = normalize(localPoints_1[0]);
        localPoints_1[1] = normalize(localPoints_1[1]);
        localPoints_1[2] = normalize(localPoints_1[2]);
        localPoints_1[3] = normalize(localPoints_1[3]);
        localPoints_1[4] = normalize(localPoints_1[4]);
        float sum = 0.0f;
        float3 param_5 = localPoints_1[0];
        float3 param_6 = localPoints_1[1];
        sum += _LTC_IntegrateEdge(param_5, param_6);
        float3 param_7 = localPoints_1[1];
        float3 param_8 = localPoints_1[2];
        sum += _LTC_IntegrateEdge(param_7, param_8);
        float3 param_9 = localPoints_1[2];
        float3 param_10 = localPoints_1[3];
        sum += _LTC_IntegrateEdge(param_9, param_10);
        if (n >= 4)
        {
            float3 param_11 = localPoints_1[3];
            float3 param_12 = localPoints_1[4];
            sum += _LTC_IntegrateEdge(param_11, param_12);
        }
        if (n == 5)
        {
            float3 param_13 = localPoints_1[4];
            float3 param_14 = localPoints_1[0];
            sum += _LTC_IntegrateEdge(param_13, param_14);
        }
        if (L.areaLightTwoSide > 0.5f)
        {
            return abs(sum).xxx;
        }
        return max(0.0f, sum).xxx;
    }
}

float3 Diffuse_AreaLight(inout SurfaceParams S, inout LightParams L)
{
    float3x3 invM = float3x3(float3(1.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 0.0f), float3(0.0f, 0.0f, 1.0f));
    SurfaceParams param = S;
    LightParams param_1 = L;
    float3x3 param_2 = invM;
    float3 _1934 = _LTC_Evaluate(param, param_1, param_2);
    S = param;
    L = param_1;
    float3 lighting = _1934;
    return (((S.diffCol * L.color) * L.intensity) * L.attenuate) * lighting;
}

float2 _LTC_CorrectUV(float2 uv)
{
    return (uv * 0.984375f) + 0.0078125f.xx;
}

float2 _LTC_GetUV(float roughness, float NoV)
{
    float2 uv = float2(roughness, sqrt(1.0f - NoV));
    float2 param = uv;
    return _LTC_CorrectUV(param);
}

float3x3 _LTC_GetInvM_GGX(float2 uv)
{
    float4 t = u_ltc_mat.Sample(_u_ltc_mat_sampler, uv);
    t = (t - 0.5f.xxxx) * 4.0f;
    return float3x3(float3(float3(t.x, 0.0f, t.y)), float3(0.0f, 1.0f, 0.0f), float3(float3(t.z, 0.0f, t.w)));
}

float4 _LTC_GetNFC_GGX(float2 uv)
{
    float4 t2 = u_ltc_mag.Sample(_u_ltc_mag_sampler, uv);
    return t2;
}

float3 Specular_AreaLight(inout SurfaceParams S, inout LightParams L)
{
    float param = S.roughParams.x;
    float param_1 = S.ndv;
    float2 uv = _LTC_GetUV(param, param_1);
    uv = clamp(uv, 0.0f.xx, 1.0f.xx);
    float2 param_2 = uv;
    float3x3 invM = _LTC_GetInvM_GGX(param_2);
    float2 param_3 = uv;
    float2 nf = _LTC_GetNFC_GGX(param_3).xy;
    float3 f0 = S.specCol;
    float3 Fr = (f0 * nf.x) + ((1.0f.xxx - f0) * nf.y);
    SurfaceParams param_4 = S;
    LightParams param_5 = L;
    float3x3 param_6 = invM;
    float3 _1904 = _LTC_Evaluate(param_4, param_5, param_6);
    S = param_4;
    L = param_5;
    float3 spec = _1904;
    float3 lighting = Fr * spec;
    return ((L.color * L.intensity) * L.attenuate) * lighting;
}

void DoHeavyAreaLight(inout SurfaceParams S, inout LightParams L, inout float3 Fd, inout float3 Fr)
{
    if (L.enable > 0.5f)
    {
        float coatAttenuate = 1.0f;
        SurfaceParams param = S;
        LightParams param_1 = L;
        float3 _3145 = Diffuse_AreaLight(param, param_1);
        S = param;
        L = param_1;
        Fd += (_3145 * coatAttenuate);
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        float3 _3156 = Specular_AreaLight(param_2, param_3);
        S = param_2;
        L = param_3;
        Fr += (_3156 * coatAttenuate);
    }
}

void DoAreaLight(inout SurfaceParams S, inout LightParams L, inout float3 Fd, inout float3 Fr)
{
    if (L.enable > 0.5f)
    {
        SurfaceParams param = S;
        LightParams param_1 = L;
        float3 _3172 = Diffuse_Low(param, param_1);
        S = param;
        L = param_1;
        Fd += _3172;
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        float3 _3181 = Specular_Low(param_2, param_3);
        S = param_2;
        L = param_3;
        Fr += _3181;
    }
}

float3 Lighting(inout SurfaceParams S)
{
    float3 Fd = 0.0f.xxx;
    float3 Fr = 0.0f.xxx;
    float3 finalRGB = 0.0f.xxx;
    SurfaceParams param = S;
    float3 param_1 = Fd;
    float3 param_2 = Fr;
    DoIndirectLight(param, param_1, param_2);
    S = param;
    Fd = param_1;
    Fr = param_2;
    SurfaceParams param_3 = S;
    int param_4 = 0;
    LightParams param_5;
    BuildDirLightParams(param_3, param_4, param_5);
    S = param_3;
    LightParams DL0 = param_5;
    SurfaceParams param_6 = S;
    LightParams param_7 = DL0;
    float3 param_8 = Fd;
    float3 param_9 = Fr;
    DoHeavyLight(param_6, param_7, param_8, param_9);
    S = param_6;
    DL0 = param_7;
    Fd = param_8;
    Fr = param_9;
    SurfaceParams param_10 = S;
    int param_11 = 1;
    LightParams param_12;
    BuildDirLightParams(param_10, param_11, param_12);
    S = param_10;
    LightParams DL1 = param_12;
    SurfaceParams param_13 = S;
    LightParams param_14 = DL1;
    float3 param_15 = Fd;
    float3 param_16 = Fr;
    DoLight(param_13, param_14, param_15, param_16);
    S = param_13;
    DL1 = param_14;
    Fd = param_15;
    Fr = param_16;
    SurfaceParams param_17 = S;
    int param_18 = 2;
    LightParams param_19;
    BuildDirLightParams(param_17, param_18, param_19);
    S = param_17;
    LightParams DL2 = param_19;
    SurfaceParams param_20 = S;
    LightParams param_21 = DL2;
    float3 param_22 = Fd;
    float3 param_23 = Fr;
    DoLight(param_20, param_21, param_22, param_23);
    S = param_20;
    DL2 = param_21;
    Fd = param_22;
    Fr = param_23;
    SurfaceParams param_24 = S;
    int param_25 = 0;
    LightParams param_26;
    BuildPointLightParams(param_24, param_25, param_26);
    S = param_24;
    LightParams PL0 = param_26;
    SurfaceParams param_27 = S;
    LightParams param_28 = PL0;
    float3 param_29 = Fd;
    float3 param_30 = Fr;
    DoHeavyLight(param_27, param_28, param_29, param_30);
    S = param_27;
    PL0 = param_28;
    Fd = param_29;
    Fr = param_30;
    SurfaceParams param_31 = S;
    int param_32 = 1;
    LightParams param_33;
    BuildPointLightParams(param_31, param_32, param_33);
    S = param_31;
    LightParams PL1 = param_33;
    SurfaceParams param_34 = S;
    LightParams param_35 = PL1;
    float3 param_36 = Fd;
    float3 param_37 = Fr;
    DoLight(param_34, param_35, param_36, param_37);
    S = param_34;
    PL1 = param_35;
    Fd = param_36;
    Fr = param_37;
    SurfaceParams param_38 = S;
    int param_39 = 0;
    LightParams param_40;
    BuildSpotLightParams(param_38, param_39, param_40);
    S = param_38;
    LightParams SL0 = param_40;
    SurfaceParams param_41 = S;
    LightParams param_42 = SL0;
    float3 param_43 = Fd;
    float3 param_44 = Fr;
    DoHeavyLight(param_41, param_42, param_43, param_44);
    S = param_41;
    SL0 = param_42;
    Fd = param_43;
    Fr = param_44;
    SurfaceParams param_45 = S;
    int param_46 = 1;
    LightParams param_47;
    BuildSpotLightParams(param_45, param_46, param_47);
    S = param_45;
    LightParams SL1 = param_47;
    SurfaceParams param_48 = S;
    LightParams param_49 = SL1;
    float3 param_50 = Fd;
    float3 param_51 = Fr;
    DoLight(param_48, param_49, param_50, param_51);
    S = param_48;
    SL1 = param_49;
    Fd = param_50;
    Fr = param_51;
    SurfaceParams param_52 = S;
    int param_53 = 0;
    LightParams param_54;
    BuildAreaLightParams(param_52, param_53, param_54);
    S = param_52;
    LightParams AL0 = param_54;
    SurfaceParams param_55 = S;
    LightParams param_56 = AL0;
    float3 param_57 = Fd;
    float3 param_58 = Fr;
    DoHeavyAreaLight(param_55, param_56, param_57, param_58);
    S = param_55;
    AL0 = param_56;
    Fd = param_57;
    Fr = param_58;
    SurfaceParams param_59 = S;
    int param_60 = 1;
    LightParams param_61;
    BuildAreaLightParams(param_59, param_60, param_61);
    S = param_59;
    LightParams AL1 = param_61;
    SurfaceParams param_62 = S;
    LightParams param_63 = AL1;
    float3 param_64 = Fd;
    float3 param_65 = Fr;
    DoAreaLight(param_62, param_63, param_64, param_65);
    S = param_62;
    AL1 = param_63;
    Fd = param_64;
    Fr = param_65;
    finalRGB = Fd + Fr;
    return finalRGB;
}

float3 LinearToGamma(float3 col)
{
    float3 param = col;
    float3 param_1 = 0.4545454680919647216796875f.xxx;
    float3 _393 = SafePow(param, param_1);
    return _393;
}

float4 MainEntry()
{
    SurfaceParams param;
    BuildSurfaceParams(param);
    SurfaceParams S = param;
    SurfaceParams param_1 = S;
    float3 _3554 = Lighting(param_1);
    S = param_1;
    float3 finalRGB = _3554;
    float3 param_2 = finalRGB;
    finalRGB = LinearToGamma(param_2);
    float4 result = float4(finalRGB, S.opacity);
    return result;
}

float4 ApplyBlendMode(float4 color, float2 uv)
{
    float4 ret = color;
    return ret;
}

void frag_main()
{
    float2 ndc_coord = v_gl_pos.xy / v_gl_pos.w.xx;
    float2 screen_coord = (ndc_coord * 0.5f) + 0.5f.xx;
    float4 final_color = MainEntry();
    float4 param = final_color;
    float2 param_1 = screen_coord;
    o_fragColor = ApplyBlendMode(param, param_1);
}

SPIRV_Cross_Output main(SPIRV_Cross_Input stage_input)
{
    v_nDirWS = stage_input.v_nDirWS;
    v_posWS = stage_input.v_posWS;
    v_tDirWS = stage_input.v_tDirWS;
    v_bDirWS = stage_input.v_bDirWS;
    v_uv0 = stage_input.v_uv0;
    v_gl_pos = stage_input.v_gl_pos;
    v_uv0_src = stage_input.v_uv0_src;
    v_uv1 = stage_input.v_uv1;
    frag_main();
    SPIRV_Cross_Output stage_output;
    stage_output.o_fragColor = o_fragColor;
    return stage_output;
}
