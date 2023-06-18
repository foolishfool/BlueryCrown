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
    spvUnsafeArray<float3, 4> areaLightPoints;
    float areaLightShape;
    float areaLightTwoSide;
    float3 hDir;
    float ldh;
    float ndl;
    float ndh;
    float vdh;
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
    spvUnsafeArray<float4, 2> u_AreaLightsDirection;
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
    float _Cutoff;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float4 v_gl_pos;
    float3 v_posWS;
    float3 v_nDirWS;
    float2 v_uv0;
    float3 v_tDirWS;
    float3 v_bDirWS;
};

static inline __attribute__((always_inline))
float3 SafePow(thread float3& v, thread float3& e)
{
    v = fast::max(v, float3(9.9999997473787516355514526367188e-06));
    e = fast::max(e, float3(9.9999997473787516355514526367188e-06));
    return pow(v, e);
}

static inline __attribute__((always_inline))
float3 GammaToLinear(thread const float3& col)
{
    float3 param = col;
    float3 param_1 = float3(2.2000000476837158203125);
    float3 _385 = SafePow(param, param_1);
    return _385;
}

static inline __attribute__((always_inline))
float saturate0(thread const float& x)
{
    return fast::clamp(x, 0.0, 1.0);
}

static inline __attribute__((always_inline))
float Pow2(thread const float& x)
{
    return x * x;
}

static inline __attribute__((always_inline))
float IorToSpecularLevel(thread const float& iorFrom, thread const float& iorTo)
{
    float sqrtR0 = (iorTo - iorFrom) / (iorTo + iorFrom);
    return sqrtR0 * sqrtR0;
}

static inline __attribute__((always_inline))
void BuildSurfaceParams(thread SurfaceParams& S, thread float3& v_nDirWS, constant float4& u_WorldSpaceCameraPos, thread float3& v_posWS, thread float3& v_tDirWS, thread float3& v_bDirWS, thread float2& v_uv0, constant float4& _AlbedoColor, texture2d<float> _AlbedoTexture, sampler _AlbedoTextureSmplr, constant float& _Metallic, constant float& _Roughness, constant float& _Cutoff)
{
    float3 vnDirWS = normalize(v_nDirWS);
    float3 vDir = normalize(u_WorldSpaceCameraPos.xyz - v_posWS);
    if (dot(vDir, vnDirWS) < (-0.0500000007450580596923828125))
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
    float4 t_AlbedoTex = _AlbedoTexture.sample(_AlbedoTextureSmplr, uv0);
    float3 param_1 = t_AlbedoTex.xyz;
    albedo *= GammaToLinear(param_1);
    opacity *= t_AlbedoTex.w;
    float metallic = _Metallic;
    float roughness = _Roughness;
    float ao = 1.0;
    float cavity = 1.0;
    float3 normal = vnDirWS;
    S.vDir = vDir;
    float avgTextureNormalLength = 1.0;
    S.opacity = opacity;
    if (S.opacity < _Cutoff)
    {
        discard_fragment();
    }
    float param_2 = metallic;
    metallic = saturate0(param_2);
    S.nDir = normal;
    float perceptualRoughness = fast::clamp(roughness, 0.0, 1.0);
    S.roughParams.x = perceptualRoughness;
    float param_3 = S.roughParams.x;
    S.roughParams.y = Pow2(param_3);
    float param_4 = S.roughParams.y;
    S.roughParams.z = Pow2(param_4);
    S.diffCol = albedo * (1.0 - metallic);
    S.pos = v_posWS;
    S.vnDir = vnDirWS;
    S.ndv = fast::max(0.0, dot(S.nDir, S.vDir));
    S.rDir = normalize(reflect(-S.vDir, S.nDir));
    float ior = 1.5;
    float param_5 = 1.0;
    float param_6 = ior;
    float dielectricF0 = IorToSpecularLevel(param_5, param_6);
    float3 specularAlbedo = albedo;
    S.specCol = mix(float3(dielectricF0), specularAlbedo, float3(metallic));
    S.occParams = float2(1.0);
}

static inline __attribute__((always_inline))
float ACos(thread const float& inX)
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

static inline __attribute__((always_inline))
float ATan(thread const float& x, thread const float& y)
{
    float signx = (x < 0.0) ? (-1.0) : 1.0;
    float param = fast::clamp(y / length(float2(x, y)), -1.0, 1.0);
    return signx * ACos(param);
}

static inline __attribute__((always_inline))
float2 GetPanoramicTexCoordsFromDir(thread float3& dir, thread const float& rotation)
{
    dir = normalize(dir);
    float param = dir.x;
    float param_1 = -dir.z;
    float2 uv;
    uv.x = (ATan(param, param_1) - 1.57079637050628662109375) / 6.283185482025146484375;
    uv.y = acos(dir.y) / 3.1415927410125732421875;
    uv.x += rotation;
    uv.x = fract((uv.x + floor(uv.x)) + 1.0);
    return uv;
}

static inline __attribute__((always_inline))
float3 SamplerEncodedPanoramicWithUV(thread const float2& uv, thread const float& lod, texture2d<float> _EnvTex, sampler _EnvTexSmplr)
{
    float lodMin = floor(lod);
    float lodLerp = lod - lodMin;
    float2 uvLodMin = uv;
    float2 uvLodMax = uv;
    float2 size = float2(0.0);
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
    float4 envEncoded = mix(_EnvTex.sample(_EnvTexSmplr, uvLodMin), _EnvTex.sample(_EnvTexSmplr, uvLodMax), float4(lodLerp));
    return envEncoded.xyz / float3(envEncoded.w);
}

static inline __attribute__((always_inline))
float3 SampleIBL(thread const float3& dir, thread const float& rotation, thread const float& lod, texture2d<float> _EnvTex, sampler _EnvTexSmplr, constant float& _Env)
{
    float3 param = dir;
    float param_1 = rotation;
    float2 _2996 = GetPanoramicTexCoordsFromDir(param, param_1);
    float2 uv = _2996;
    float2 param_2 = uv;
    float param_3 = lod;
    return SamplerEncodedPanoramicWithUV(param_2, param_3, _EnvTex, _EnvTexSmplr) * _Env;
}

static inline __attribute__((always_inline))
float3 GTAO_MultiBounce(thread const float& visibility, thread const float3& albedo)
{
    float3 a = (albedo * 2.040400028228759765625) - float3(0.3323999941349029541015625);
    float3 b = (albedo * (-4.79510021209716796875)) + float3(0.6417000293731689453125);
    float3 c = (albedo * 2.755199909210205078125) + float3(0.69029998779296875);
    return fast::max(float3(visibility), ((((a * visibility) + b) * visibility) + c) * visibility);
}

static inline __attribute__((always_inline))
float3 Diffuse_Env(thread const SurfaceParams& S, texture2d<float> _EnvTex, sampler _EnvTexSmplr, constant float& _Env, constant float& _EnvRot)
{
    float3 diffuseNormal = S.nDir;
    float3 lighting = float3(0.0);
    float3 param = diffuseNormal;
    float param_1 = _EnvRot;
    float param_2 = 7.0;
    lighting = SampleIBL(param, param_1, param_2, _EnvTex, _EnvTexSmplr, _Env);
    float param_3 = S.occParams.x;
    float3 param_4 = S.diffCol;
    float3 multiBounceColor = GTAO_MultiBounce(param_3, param_4);
    return (S.diffCol * lighting) * multiBounceColor;
}

static inline __attribute__((always_inline))
float3 EnvBRDFApprox(thread const float3& F0, thread const float& perceptualRoughness, thread const float& ndv)
{
    float4 r = (float4(-1.0, -0.0274999998509883880615234375, -0.572000026702880859375, 0.02199999988079071044921875) * perceptualRoughness) + float4(1.0, 0.0425000004470348358154296875, 1.03999996185302734375, -0.039999999105930328369140625);
    float a004 = (fast::min(r.x * r.x, exp2((-9.27999973297119140625) * ndv)) * r.x) + r.y;
    float2 AB = (float2(-1.03999996185302734375, 1.03999996185302734375) * a004) + r.zw;
    float param = 50.0 * F0.y;
    AB.y *= saturate0(param);
    return (F0 * AB.x) + float3(AB.y);
}

static inline __attribute__((always_inline))
float3 EnvBRDF(thread const SurfaceParams& S)
{
    float3 param = S.specCol;
    float param_1 = S.roughParams.x;
    float param_2 = S.ndv;
    return EnvBRDFApprox(param, param_1, param_2);
}

static inline __attribute__((always_inline))
float3 Specular_Env(thread SurfaceParams& S, texture2d<float> _EnvTex, sampler _EnvTexSmplr, constant float& _Env, constant float& _EnvRot)
{
    float3 dir = mix(S.rDir, S.nDir, float3(S.roughParams.x * S.roughParams.y));
    float3 param = dir;
    float param_1 = _EnvRot;
    float param_2 = S.roughParams.x * 7.0;
    float3 specEnv = SampleIBL(param, param_1, param_2, _EnvTex, _EnvTexSmplr, _Env);
    SurfaceParams param_3 = S;
    S = param_3;
    float3 brdf = EnvBRDF(param_3);
    float param_4 = S.occParams.y;
    float3 param_5 = S.specCol;
    float3 multiBounceColor = GTAO_MultiBounce(param_4, param_5);
    float3 Fr = (brdf * multiBounceColor) * specEnv;
    return Fr;
}

static inline __attribute__((always_inline))
void DoIndirectLight(thread SurfaceParams& S, thread float3& Fd, thread float3& Fr, texture2d<float> _EnvTex, sampler _EnvTexSmplr, constant float& _Env, constant float& _EnvRot)
{
    float coatAttenuate_IBL = 1.0;
    SurfaceParams param = S;
    S = param;
    Fd += (Diffuse_Env(param, _EnvTex, _EnvTexSmplr, _Env, _EnvRot) * coatAttenuate_IBL);
    SurfaceParams param_1 = S;
    float3 _3197 = Specular_Env(param_1, _EnvTex, _EnvTexSmplr, _Env, _EnvRot);
    S = param_1;
    Fr += (_3197 * coatAttenuate_IBL);
}

static inline __attribute__((always_inline))
void LightCommomOperations(thread const SurfaceParams& S, thread LightParams& L)
{
    L.hDir = normalize(L.lDir + S.vDir);
    L.ldh = fast::max(0.0, dot(L.lDir, L.hDir));
    L.ndl = fast::max(0.0, dot(S.nDir, L.lDir));
    L.ndh = fast::max(0.0, dot(S.nDir, L.hDir));
    L.vdh = fast::max(0.0, dot(S.vDir, L.hDir));
}

static inline __attribute__((always_inline))
void BuildDirLightParams(thread SurfaceParams& S, thread const int& index, thread LightParams& ML, constant spvUnsafeArray<float, 3>& u_DirLightsEnabled, constant spvUnsafeArray<float4, 3>& u_DirLightsDirection, constant spvUnsafeArray<float4, 3>& u_DirLightsColor, constant spvUnsafeArray<float, 3>& u_DirLightsIntensity)
{
    ML.enable = u_DirLightsEnabled[index];
    ML.lDir = normalize(-u_DirLightsDirection[index].xyz);
    ML.color = u_DirLightsColor[index].xyz;
    ML.intensity = (u_DirLightsIntensity[index] * u_DirLightsEnabled[index]) * 3.1415920257568359375;
    ML.attenuate = float3(1.0);
    SurfaceParams param = S;
    LightParams param_1 = ML;
    LightCommomOperations(param, param_1);
    S = param;
    ML = param_1;
}

static inline __attribute__((always_inline))
float3 Diffuse_Lambert(thread const SurfaceParams& S, thread const LightParams& L)
{
    float lighting = L.ndl * 0.31830990314483642578125;
    return (((S.diffCol * L.color) * L.intensity) * L.attenuate) * lighting;
}

static inline __attribute__((always_inline))
float3 Diffuse_High(thread SurfaceParams& S, thread LightParams& L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    S = param;
    L = param_1;
    return Diffuse_Lambert(param, param_1);
}

static inline __attribute__((always_inline))
float Pow5(thread const float& x)
{
    float x2 = x * x;
    return (x2 * x2) * x;
}

static inline __attribute__((always_inline))
float3 F_Schlick(thread const float3& f0, thread float& vdh)
{
    vdh = fast::max(0.0, vdh);
    float param = 1.0 - vdh;
    float t = Pow5(param);
    return f0 + ((float3(1.0) - f0) * t);
}

static inline __attribute__((always_inline))
float3 FresnelSpecular(thread const SurfaceParams& S, thread const float& vdh)
{
    float3 f0 = S.specCol;
    float3 param = f0;
    float param_1 = vdh;
    float3 _2359 = F_Schlick(param, param_1);
    return _2359;
}

static inline __attribute__((always_inline))
float V_SmithJointApprox(thread const float& a, thread const float& ndv, thread const float& ndl)
{
    float lambdaV = ndl * ((ndv * (1.0 - a)) + a);
    float lambdaL = ndv * ((ndl * (1.0 - a)) + a);
    return 0.5 / ((lambdaV + lambdaL) + 9.9999997473787516355514526367188e-06);
}

static inline __attribute__((always_inline))
float D_GGX(thread const float& ndh, thread const float& a2)
{
    float d = (((ndh * a2) - ndh) * ndh) + 1.0;
    return (a2 * 0.31830990314483642578125) / ((d * d) + 1.0000000116860974230803549289703e-07);
}

static inline __attribute__((always_inline))
float3 Specular_GGX(thread SurfaceParams& S, thread const LightParams& L)
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

static inline __attribute__((always_inline))
float3 Specular_High(thread SurfaceParams& S, thread LightParams& L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    float3 _2480 = Specular_GGX(param, param_1);
    S = param;
    L = param_1;
    return _2480;
}

static inline __attribute__((always_inline))
void DoHeavyLight(thread SurfaceParams& S, thread LightParams& L, thread float3& Fd, thread float3& Fr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
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

static inline __attribute__((always_inline))
float3 Diffuse_Low(thread SurfaceParams& S, thread LightParams& L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    S = param;
    L = param_1;
    return Diffuse_Lambert(param, param_1);
}

static inline __attribute__((always_inline))
float V_Const()
{
    return 0.25;
}

static inline __attribute__((always_inline))
float3 Specular_GGX_Low(thread SurfaceParams& S, thread const LightParams& L)
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

static inline __attribute__((always_inline))
float3 Specular_Low(thread SurfaceParams& S, thread LightParams& L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    float3 _2489 = Specular_GGX_Low(param, param_1);
    S = param;
    L = param_1;
    return _2489;
}

static inline __attribute__((always_inline))
void DoLight(thread SurfaceParams& S, thread LightParams& L, thread float3& Fd, thread float3& Fr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
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

static inline __attribute__((always_inline))
float Pow4(thread const float& x)
{
    float x2 = x * x;
    return x2 * x2;
}

static inline __attribute__((always_inline))
void BuildPointLightParams(thread SurfaceParams& S, thread const int& index, thread LightParams& PL, constant spvUnsafeArray<float, 2>& u_PointLightsEnabled, constant spvUnsafeArray<float4, 2>& u_PointLightsPosition, constant spvUnsafeArray<float4, 2>& u_PointLightsColor, constant spvUnsafeArray<float, 2>& u_PointLightsIntensity, constant spvUnsafeArray<float, 2>& u_PointLightsAttenRangeInv)
{
    float3 lVec = float3(0.0);
    float lDist = 0.0;
    PL.enable = u_PointLightsEnabled[index];
    lVec = u_PointLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    PL.lDir = lVec / float3(lDist);
    PL.color = u_PointLightsColor[index].xyz;
    PL.intensity = (u_PointLightsIntensity[index] * u_PointLightsEnabled[index]) * 3.1415920257568359375;
    float lWorldDist = lDist;
    lDist *= u_PointLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate0(param_1);
    float param_3 = lDist;
    float attenuate = (Pow2(param_2) * (Pow2(param_3) + 1.0)) * 0.25;
    PL.attenuate = float3(attenuate, attenuate, attenuate);
    SurfaceParams param_4 = S;
    LightParams param_5 = PL;
    LightCommomOperations(param_4, param_5);
    S = param_4;
    PL = param_5;
}

static inline __attribute__((always_inline))
void BuildSpotLightParams(thread SurfaceParams& S, thread const int& index, thread LightParams& SL, constant spvUnsafeArray<float, 2>& u_SpotLightsEnabled, constant spvUnsafeArray<float4, 2>& u_SpotLightsPosition, constant spvUnsafeArray<float4, 2>& u_SpotLightsColor, constant spvUnsafeArray<float, 2>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 2>& u_SpotLightsAttenRangeInv, constant spvUnsafeArray<float4, 2>& u_SpotLightsDirection, constant spvUnsafeArray<float, 2>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 2>& u_SpotLightsInnerAngleCos)
{
    float3 lVec = float3(0.0);
    float lDist = 0.0;
    float3 spotDir = float3(0.0);
    float angleAtten = 0.0;
    SL.enable = u_SpotLightsEnabled[index];
    lVec = u_SpotLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    SL.lDir = lVec / float3(lDist);
    SL.color = u_SpotLightsColor[index].xyz;
    SL.intensity = (u_SpotLightsIntensity[index] * u_SpotLightsEnabled[index]) * 3.1415920257568359375;
    float lWorldDist = lDist;
    lDist *= u_SpotLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate0(param_1);
    float param_3 = lDist;
    float attenuate = (Pow2(param_2) * (Pow2(param_3) + 1.0)) * 0.25;
    spotDir = normalize(-u_SpotLightsDirection[index].xyz);
    angleAtten = fast::max(0.0, dot(SL.lDir, spotDir));
    attenuate *= smoothstep(u_SpotLightsOuterAngleCos[index], u_SpotLightsInnerAngleCos[index], angleAtten);
    SL.attenuate = float3(attenuate, attenuate, attenuate);
    SurfaceParams param_4 = S;
    LightParams param_5 = SL;
    LightCommomOperations(param_4, param_5);
    S = param_4;
    SL = param_5;
}

static inline __attribute__((always_inline))
void BuildAreaLightParams(thread const SurfaceParams& S, thread const int& index, thread LightParams& AL, constant spvUnsafeArray<float, 2>& u_AreaLightsEnabled, constant spvUnsafeArray<float4, 2>& u_AreaLightsDirection, constant spvUnsafeArray<float4, 2>& u_AreaLightsColor, constant spvUnsafeArray<float, 2>& u_AreaLightsIntensity, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint0, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint1, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint2, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint3, constant spvUnsafeArray<float, 2>& u_AreaLightsShape, constant spvUnsafeArray<float, 2>& u_AreaLightsTwoSide)
{
    AL.enable = u_AreaLightsEnabled[index];
    AL.lDir = u_AreaLightsDirection[index].xyz;
    AL.color = u_AreaLightsColor[index].xyz;
    AL.intensity = (u_AreaLightsIntensity[index] * u_AreaLightsEnabled[index]) * 3.1415920257568359375;
    AL.attenuate = float3(1.0);
    AL.areaLightPoints[0] = u_AreaLightsPoint0[index].xyz;
    AL.areaLightPoints[1] = u_AreaLightsPoint1[index].xyz;
    AL.areaLightPoints[2] = u_AreaLightsPoint2[index].xyz;
    AL.areaLightPoints[3] = u_AreaLightsPoint3[index].xyz;
    AL.areaLightShape = u_AreaLightsShape[index];
    AL.areaLightTwoSide = u_AreaLightsTwoSide[index];
}

static inline __attribute__((always_inline))
float3 SolveCubic(thread float4& Coefficient)
{
    float3 _997 = Coefficient.xyz / float3(Coefficient.w);
    Coefficient = float4(_997.x, _997.y, _997.z, Coefficient.w);
    float2 _1004 = Coefficient.yz / float2(3.0);
    Coefficient = float4(Coefficient.x, _1004.x, _1004.y, Coefficient.w);
    float A = Coefficient.w;
    float B = Coefficient.z;
    float C = Coefficient.y;
    float D = Coefficient.x;
    float3 Delta = float3(((-Coefficient.z) * Coefficient.z) + Coefficient.y, ((-Coefficient.y) * Coefficient.z) + Coefficient.x, dot(float2(Coefficient.z, -Coefficient.y), Coefficient.xy));
    float Discriminant = dot(float2(4.0 * Delta.x, -Delta.y), Delta.zy);
    float A_a = 1.0;
    float C_a = Delta.x;
    float D_a = (((-2.0) * B) * Delta.x) + Delta.y;
    float Theta = atan2(sqrt(Discriminant), -D_a) / 3.0;
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
    float2 xlc = float2(xl - B, A);
    float A_d = D;
    float C_d = Delta.z;
    float D_d = ((-D) * Delta.y) + ((2.0 * C) * Delta.z);
    float Theta_1 = atan2(D * sqrt(Discriminant), -D_d) / 3.0;
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

static inline __attribute__((always_inline))
void _LTC_ClipQuadToHorizon(thread spvUnsafeArray<float3, 5>& L, thread int& n)
{
    int config = 0;
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

static inline __attribute__((always_inline))
float3 _LTC_IntegrateEdgeVec(thread const float3& v1, thread const float3& v2)
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
        _499 = (0.5 * rsqrt(fast::max(1.0 - (x * x), 1.0000000116860974230803549289703e-07))) - v;
    }
    float theta_sintheta = _499;
    return cross(v1, v2) * theta_sintheta;
}

static inline __attribute__((always_inline))
float _LTC_IntegrateEdge(thread const float3& v1, thread const float3& v2)
{
    float3 param = v1;
    float3 param_1 = v2;
    return _LTC_IntegrateEdgeVec(param, param_1).z;
}

static inline __attribute__((always_inline))
float3 _LTC_Evaluate(thread const SurfaceParams& S, thread const LightParams& L, thread float3x3& invM, texture2d<float> u_ltc_mag, sampler u_ltc_magSmplr)
{
    float3 T1 = normalize(S.vDir - (S.nDir * S.ndv));
    float3 T2 = cross(S.nDir, T1);
    if (L.areaLightShape > 0.5)
    {
        float3x3 R = transpose(float3x3(float3(T1), float3(T2), float3(S.nDir)));
        spvUnsafeArray<float3, 5> localPoints;
        localPoints[0] = R * (L.areaLightPoints[0] - S.pos);
        localPoints[1] = R * (L.areaLightPoints[1] - S.pos);
        localPoints[2] = R * (L.areaLightPoints[2] - S.pos);
        float3 Lo_i = float3(0.0);
        float3 C = (localPoints[0] + localPoints[2]) * 0.5;
        float3 V1 = (localPoints[1] - localPoints[2]) * 0.5;
        float3 V2 = (localPoints[1] - localPoints[0]) * 0.5;
        C = invM * C;
        V1 = invM * V1;
        V2 = invM * V2;
        if (L.areaLightTwoSide < 0.5)
        {
            if (dot(cross(V1, V2), C) < 0.0)
            {
                return float3(0.0);
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
        float3 V3 = cross(V1, V2);
        if (dot(C, V3) < 0.0)
        {
            V3 *= (-1.0);
        }
        float fL = dot(V3, C);
        float x0 = dot(V1, C) / fL;
        float y0 = dot(V2, C) / fL;
        float E1 = rsqrt(a);
        float E2 = rsqrt(b);
        a *= (fL * fL);
        b *= (fL * fL);
        float c0 = a * b;
        float c1 = (((a * b) * ((1.0 + (x0 * x0)) + (y0 * y0))) - a) - b;
        float c2 = (1.0 - (a * (1.0 + (x0 * x0)))) - (b * (1.0 + (y0 * y0)));
        float c3 = 1.0;
        float4 param_2 = float4(c0, c1, c2, c3);
        float3 _1609 = SolveCubic(param_2);
        float3 roots = _1609;
        float e1 = roots.x;
        float e2 = roots.y;
        float e3 = roots.z;
        float3 avgDir = float3((a * x0) / (a - e2), (b * y0) / (b - e2), 1.0);
        float3x3 rotate = float3x3(float3(V1), float3(V2), float3(V3));
        avgDir = rotate * avgDir;
        avgDir = normalize(avgDir);
        float L1 = sqrt((-e2) / e3);
        float L2 = sqrt((-e2) / e1);
        float formFactor = (L1 * L2) * rsqrt((1.0 + (L1 * L1)) * (1.0 + (L2 * L2)));
        float2 uv = float2((avgDir.z * 0.5) + 0.5, formFactor);
        uv = (uv * 0.984375) + float2(0.0078125);
        float scale = u_ltc_mag.sample(u_ltc_magSmplr, uv).w;
        float spec = formFactor * scale;
        return float3(spec);
    }
    else
    {
        invM = invM * transpose(float3x3(float3(T1), float3(T2), float3(S.nDir)));
        spvUnsafeArray<float3, 5> localPoints_1;
        localPoints_1[0] = invM * (L.areaLightPoints[0] - S.pos);
        localPoints_1[1] = invM * (L.areaLightPoints[1] - S.pos);
        localPoints_1[2] = invM * (L.areaLightPoints[2] - S.pos);
        localPoints_1[3] = invM * (L.areaLightPoints[3] - S.pos);
        spvUnsafeArray<float3, 5> param_3;
        param_3 = localPoints_1;
        int param_4;
        _LTC_ClipQuadToHorizon(param_3, param_4);
        localPoints_1 = param_3;
        int n = param_4;
        if (n == 0)
        {
            return float3(0.0);
        }
        localPoints_1[0] = normalize(localPoints_1[0]);
        localPoints_1[1] = normalize(localPoints_1[1]);
        localPoints_1[2] = normalize(localPoints_1[2]);
        localPoints_1[3] = normalize(localPoints_1[3]);
        localPoints_1[4] = normalize(localPoints_1[4]);
        float sum = 0.0;
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
        if (L.areaLightTwoSide > 0.5)
        {
            return float3(abs(sum));
        }
        return float3(fast::max(0.0, sum));
    }
}

static inline __attribute__((always_inline))
float3 Diffuse_AreaLight(thread SurfaceParams& S, thread LightParams& L, texture2d<float> u_ltc_mag, sampler u_ltc_magSmplr)
{
    float3x3 invM = float3x3(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), float3(0.0, 0.0, 1.0));
    SurfaceParams param = S;
    LightParams param_1 = L;
    float3x3 param_2 = invM;
    float3 _1934 = _LTC_Evaluate(param, param_1, param_2, u_ltc_mag, u_ltc_magSmplr);
    S = param;
    L = param_1;
    float3 lighting = _1934;
    return (((S.diffCol * L.color) * L.intensity) * L.attenuate) * lighting;
}

static inline __attribute__((always_inline))
float2 _LTC_CorrectUV(thread const float2& uv)
{
    return (uv * 0.984375) + float2(0.0078125);
}

static inline __attribute__((always_inline))
float2 _LTC_GetUV(thread const float& roughness, thread const float& NoV)
{
    float2 uv = float2(roughness, sqrt(1.0 - NoV));
    float2 param = uv;
    return _LTC_CorrectUV(param);
}

static inline __attribute__((always_inline))
float3x3 _LTC_GetInvM_GGX(thread const float2& uv, texture2d<float> u_ltc_mat, sampler u_ltc_matSmplr)
{
    float4 t = u_ltc_mat.sample(u_ltc_matSmplr, uv);
    t = (t - float4(0.5)) * 4.0;
    return float3x3(float3(float3(t.x, 0.0, t.y)), float3(0.0, 1.0, 0.0), float3(float3(t.z, 0.0, t.w)));
}

static inline __attribute__((always_inline))
float4 _LTC_GetNFC_GGX(thread const float2& uv, texture2d<float> u_ltc_mag, sampler u_ltc_magSmplr)
{
    float4 t2 = u_ltc_mag.sample(u_ltc_magSmplr, uv);
    return t2;
}

static inline __attribute__((always_inline))
float3 Specular_AreaLight(thread SurfaceParams& S, thread LightParams& L, texture2d<float> u_ltc_mat, sampler u_ltc_matSmplr, texture2d<float> u_ltc_mag, sampler u_ltc_magSmplr)
{
    float param = S.roughParams.x;
    float param_1 = S.ndv;
    float2 uv = _LTC_GetUV(param, param_1);
    uv = fast::clamp(uv, float2(0.0), float2(1.0));
    float2 param_2 = uv;
    float3x3 invM = _LTC_GetInvM_GGX(param_2, u_ltc_mat, u_ltc_matSmplr);
    float2 param_3 = uv;
    float2 nf = _LTC_GetNFC_GGX(param_3, u_ltc_mag, u_ltc_magSmplr).xy;
    float3 f0 = S.specCol;
    float3 Fr = (f0 * nf.x) + ((float3(1.0) - f0) * nf.y);
    SurfaceParams param_4 = S;
    LightParams param_5 = L;
    float3x3 param_6 = invM;
    float3 _1904 = _LTC_Evaluate(param_4, param_5, param_6, u_ltc_mag, u_ltc_magSmplr);
    S = param_4;
    L = param_5;
    float3 spec = _1904;
    float3 lighting = Fr * spec;
    return ((L.color * L.intensity) * L.attenuate) * lighting;
}

static inline __attribute__((always_inline))
void DoHeavyAreaLight(thread SurfaceParams& S, thread LightParams& L, thread float3& Fd, thread float3& Fr, texture2d<float> u_ltc_mat, sampler u_ltc_matSmplr, texture2d<float> u_ltc_mag, sampler u_ltc_magSmplr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
        SurfaceParams param = S;
        LightParams param_1 = L;
        float3 _3145 = Diffuse_AreaLight(param, param_1, u_ltc_mag, u_ltc_magSmplr);
        S = param;
        L = param_1;
        Fd += (_3145 * coatAttenuate);
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        float3 _3156 = Specular_AreaLight(param_2, param_3, u_ltc_mat, u_ltc_matSmplr, u_ltc_mag, u_ltc_magSmplr);
        S = param_2;
        L = param_3;
        Fr += (_3156 * coatAttenuate);
    }
}

static inline __attribute__((always_inline))
void DoAreaLight(thread SurfaceParams& S, thread LightParams& L, thread float3& Fd, thread float3& Fr)
{
    if (L.enable > 0.5)
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

static inline __attribute__((always_inline))
float3 Lighting(thread SurfaceParams& S, texture2d<float> u_ltc_mat, sampler u_ltc_matSmplr, texture2d<float> u_ltc_mag, sampler u_ltc_magSmplr, constant spvUnsafeArray<float, 3>& u_DirLightsEnabled, constant spvUnsafeArray<float4, 3>& u_DirLightsDirection, constant spvUnsafeArray<float4, 3>& u_DirLightsColor, constant spvUnsafeArray<float, 3>& u_DirLightsIntensity, constant spvUnsafeArray<float, 2>& u_PointLightsEnabled, constant spvUnsafeArray<float4, 2>& u_PointLightsPosition, constant spvUnsafeArray<float4, 2>& u_PointLightsColor, constant spvUnsafeArray<float, 2>& u_PointLightsIntensity, constant spvUnsafeArray<float, 2>& u_PointLightsAttenRangeInv, constant spvUnsafeArray<float, 2>& u_SpotLightsEnabled, constant spvUnsafeArray<float4, 2>& u_SpotLightsPosition, constant spvUnsafeArray<float4, 2>& u_SpotLightsColor, constant spvUnsafeArray<float, 2>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 2>& u_SpotLightsAttenRangeInv, constant spvUnsafeArray<float4, 2>& u_SpotLightsDirection, constant spvUnsafeArray<float, 2>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 2>& u_SpotLightsInnerAngleCos, constant spvUnsafeArray<float, 2>& u_AreaLightsEnabled, constant spvUnsafeArray<float4, 2>& u_AreaLightsDirection, constant spvUnsafeArray<float4, 2>& u_AreaLightsColor, constant spvUnsafeArray<float, 2>& u_AreaLightsIntensity, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint0, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint1, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint2, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint3, constant spvUnsafeArray<float, 2>& u_AreaLightsShape, constant spvUnsafeArray<float, 2>& u_AreaLightsTwoSide, texture2d<float> _EnvTex, sampler _EnvTexSmplr, constant float& _Env, constant float& _EnvRot)
{
    float3 Fd = float3(0.0);
    float3 Fr = float3(0.0);
    float3 finalRGB = float3(0.0);
    SurfaceParams param = S;
    float3 param_1 = Fd;
    float3 param_2 = Fr;
    DoIndirectLight(param, param_1, param_2, _EnvTex, _EnvTexSmplr, _Env, _EnvRot);
    S = param;
    Fd = param_1;
    Fr = param_2;
    SurfaceParams param_3 = S;
    int param_4 = 0;
    LightParams param_5;
    BuildDirLightParams(param_3, param_4, param_5, u_DirLightsEnabled, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity);
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
    BuildDirLightParams(param_10, param_11, param_12, u_DirLightsEnabled, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity);
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
    BuildDirLightParams(param_17, param_18, param_19, u_DirLightsEnabled, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity);
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
    BuildPointLightParams(param_24, param_25, param_26, u_PointLightsEnabled, u_PointLightsPosition, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv);
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
    BuildPointLightParams(param_31, param_32, param_33, u_PointLightsEnabled, u_PointLightsPosition, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv);
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
    BuildSpotLightParams(param_38, param_39, param_40, u_SpotLightsEnabled, u_SpotLightsPosition, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsAttenRangeInv, u_SpotLightsDirection, u_SpotLightsOuterAngleCos, u_SpotLightsInnerAngleCos);
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
    BuildSpotLightParams(param_45, param_46, param_47, u_SpotLightsEnabled, u_SpotLightsPosition, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsAttenRangeInv, u_SpotLightsDirection, u_SpotLightsOuterAngleCos, u_SpotLightsInnerAngleCos);
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
    BuildAreaLightParams(param_52, param_53, param_54, u_AreaLightsEnabled, u_AreaLightsDirection, u_AreaLightsColor, u_AreaLightsIntensity, u_AreaLightsPoint0, u_AreaLightsPoint1, u_AreaLightsPoint2, u_AreaLightsPoint3, u_AreaLightsShape, u_AreaLightsTwoSide);
    S = param_52;
    LightParams AL0 = param_54;
    SurfaceParams param_55 = S;
    LightParams param_56 = AL0;
    float3 param_57 = Fd;
    float3 param_58 = Fr;
    DoHeavyAreaLight(param_55, param_56, param_57, param_58, u_ltc_mat, u_ltc_matSmplr, u_ltc_mag, u_ltc_magSmplr);
    S = param_55;
    AL0 = param_56;
    Fd = param_57;
    Fr = param_58;
    SurfaceParams param_59 = S;
    int param_60 = 1;
    LightParams param_61;
    BuildAreaLightParams(param_59, param_60, param_61, u_AreaLightsEnabled, u_AreaLightsDirection, u_AreaLightsColor, u_AreaLightsIntensity, u_AreaLightsPoint0, u_AreaLightsPoint1, u_AreaLightsPoint2, u_AreaLightsPoint3, u_AreaLightsShape, u_AreaLightsTwoSide);
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

static inline __attribute__((always_inline))
float3 LinearToGamma(thread const float3& col)
{
    float3 param = col;
    float3 param_1 = float3(0.4545454680919647216796875);
    float3 _393 = SafePow(param, param_1);
    return _393;
}

static inline __attribute__((always_inline))
float4 MainEntry(texture2d<float> u_ltc_mat, sampler u_ltc_matSmplr, texture2d<float> u_ltc_mag, sampler u_ltc_magSmplr, constant spvUnsafeArray<float, 3>& u_DirLightsEnabled, constant spvUnsafeArray<float4, 3>& u_DirLightsDirection, constant spvUnsafeArray<float4, 3>& u_DirLightsColor, constant spvUnsafeArray<float, 3>& u_DirLightsIntensity, constant spvUnsafeArray<float, 2>& u_PointLightsEnabled, constant spvUnsafeArray<float4, 2>& u_PointLightsPosition, constant spvUnsafeArray<float4, 2>& u_PointLightsColor, constant spvUnsafeArray<float, 2>& u_PointLightsIntensity, constant spvUnsafeArray<float, 2>& u_PointLightsAttenRangeInv, constant spvUnsafeArray<float, 2>& u_SpotLightsEnabled, constant spvUnsafeArray<float4, 2>& u_SpotLightsPosition, constant spvUnsafeArray<float4, 2>& u_SpotLightsColor, constant spvUnsafeArray<float, 2>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 2>& u_SpotLightsAttenRangeInv, constant spvUnsafeArray<float4, 2>& u_SpotLightsDirection, constant spvUnsafeArray<float, 2>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 2>& u_SpotLightsInnerAngleCos, constant spvUnsafeArray<float, 2>& u_AreaLightsEnabled, constant spvUnsafeArray<float4, 2>& u_AreaLightsDirection, constant spvUnsafeArray<float4, 2>& u_AreaLightsColor, constant spvUnsafeArray<float, 2>& u_AreaLightsIntensity, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint0, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint1, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint2, constant spvUnsafeArray<float4, 2>& u_AreaLightsPoint3, constant spvUnsafeArray<float, 2>& u_AreaLightsShape, constant spvUnsafeArray<float, 2>& u_AreaLightsTwoSide, texture2d<float> _EnvTex, sampler _EnvTexSmplr, constant float& _Env, constant float& _EnvRot, thread float3& v_nDirWS, constant float4& u_WorldSpaceCameraPos, thread float3& v_posWS, thread float3& v_tDirWS, thread float3& v_bDirWS, thread float2& v_uv0, constant float4& _AlbedoColor, texture2d<float> _AlbedoTexture, sampler _AlbedoTextureSmplr, constant float& _Metallic, constant float& _Roughness, constant float& _Cutoff)
{
    SurfaceParams param;
    BuildSurfaceParams(param, v_nDirWS, u_WorldSpaceCameraPos, v_posWS, v_tDirWS, v_bDirWS, v_uv0, _AlbedoColor, _AlbedoTexture, _AlbedoTextureSmplr, _Metallic, _Roughness, _Cutoff);
    SurfaceParams S = param;
    SurfaceParams param_1 = S;
    float3 _3562 = Lighting(param_1, u_ltc_mat, u_ltc_matSmplr, u_ltc_mag, u_ltc_magSmplr, u_DirLightsEnabled, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity, u_PointLightsEnabled, u_PointLightsPosition, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv, u_SpotLightsEnabled, u_SpotLightsPosition, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsAttenRangeInv, u_SpotLightsDirection, u_SpotLightsOuterAngleCos, u_SpotLightsInnerAngleCos, u_AreaLightsEnabled, u_AreaLightsDirection, u_AreaLightsColor, u_AreaLightsIntensity, u_AreaLightsPoint0, u_AreaLightsPoint1, u_AreaLightsPoint2, u_AreaLightsPoint3, u_AreaLightsShape, u_AreaLightsTwoSide, _EnvTex, _EnvTexSmplr, _Env, _EnvRot);
    S = param_1;
    float3 finalRGB = _3562;
    float3 param_2 = finalRGB;
    finalRGB = LinearToGamma(param_2);
    float4 result = float4(finalRGB, S.opacity);
    return result;
}

static inline __attribute__((always_inline))
float4 ApplyBlendMode(thread const float4& color, thread const float2& uv)
{
    float4 ret = color;
    return ret;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_ltc_mat [[texture(0)]], texture2d<float> u_ltc_mag [[texture(1)]], texture2d<float> _EnvTex [[texture(2)]], texture2d<float> _AlbedoTexture [[texture(3)]], sampler u_ltc_matSmplr [[sampler(0)]], sampler u_ltc_magSmplr [[sampler(1)]], sampler _EnvTexSmplr [[sampler(2)]], sampler _AlbedoTextureSmplr [[sampler(3)]])
{
    main0_out out = {};
    float2 ndc_coord = in.v_gl_pos.xy / float2(in.v_gl_pos.w);
    float2 screen_coord = (ndc_coord * 0.5) + float2(0.5);
    float4 _3594 = MainEntry(u_ltc_mat, u_ltc_matSmplr, u_ltc_mag, u_ltc_magSmplr, buffer.u_DirLightsEnabled, buffer.u_DirLightsDirection, buffer.u_DirLightsColor, buffer.u_DirLightsIntensity, buffer.u_PointLightsEnabled, buffer.u_PointLightsPosition, buffer.u_PointLightsColor, buffer.u_PointLightsIntensity, buffer.u_PointLightsAttenRangeInv, buffer.u_SpotLightsEnabled, buffer.u_SpotLightsPosition, buffer.u_SpotLightsColor, buffer.u_SpotLightsIntensity, buffer.u_SpotLightsAttenRangeInv, buffer.u_SpotLightsDirection, buffer.u_SpotLightsOuterAngleCos, buffer.u_SpotLightsInnerAngleCos, buffer.u_AreaLightsEnabled, buffer.u_AreaLightsDirection, buffer.u_AreaLightsColor, buffer.u_AreaLightsIntensity, buffer.u_AreaLightsPoint0, buffer.u_AreaLightsPoint1, buffer.u_AreaLightsPoint2, buffer.u_AreaLightsPoint3, buffer.u_AreaLightsShape, buffer.u_AreaLightsTwoSide, _EnvTex, _EnvTexSmplr, buffer._Env, buffer._EnvRot, in.v_nDirWS, buffer.u_WorldSpaceCameraPos, in.v_posWS, in.v_tDirWS, in.v_bDirWS, in.v_uv0, buffer._AlbedoColor, _AlbedoTexture, _AlbedoTextureSmplr, buffer._Metallic, buffer._Roughness, buffer._Cutoff);
    float4 final_color = _3594;
    float4 param = final_color;
    float2 param_1 = screen_coord;
    out.o_fragColor = ApplyBlendMode(param, param_1);
    return out;
}

