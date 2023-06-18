#version 300 es
precision highp float;
precision highp int;

uniform vec2 samplerEnvSize;
uniform mediump sampler2D samplerEnv;
uniform float roughnessScale;

in vec2 varScreenTexturePos;
layout(location = 0) out vec4 fragColor;

void main()
{
    float _522 = 6.283185482025146484375 * varScreenTexturePos.x;
    float _525 = 3.1415927410125732421875 * (1.0 - varScreenTexturePos.y);
    float _529 = sin(_525);
    float _530 = sin(_522) * _529;
    vec3 _541 = vec3(cos(_522) * _529, cos(_525), _530);
    vec4 _905;
    float _906;
    _906 = 0.0;
    _905 = vec4(0.0);
    vec4 _925;
    float _926;
    for (mediump int _904 = 0; _904 < 4096; _906 = _926, _905 = _925, _904++)
    {
        mediump int _907;
        float _908;
        float _924;
        _924 = 0.5;
        _908 = 0.0;
        _907 = _904;
        for (; _907 > 0; )
        {
            mediump int _688 = _907 / 2;
            float _696 = float(_907 - (_688 * 2)) * _924 + _908;
            _924 *= 0.5;
            _908 = _696;
            _907 = _688;
            continue;
        }
        float _719 = float(_904) * 0.001533980830572545528411865234375;
        float _732 = sqrt(1.0 - _908);
        float _737 = sqrt((-_732) * _732 + 1.0);
        bvec3 _754 = bvec3(abs(_530) < 0.999000012874603271484375);
        vec3 _759 = normalize(cross(vec3(_754.x ? vec3(0.0, 0.0, 1.0).x : vec3(1.0, 0.0, 0.0).x, _754.y ? vec3(0.0, 0.0, 1.0).y : vec3(1.0, 0.0, 0.0).y, _754.z ? vec3(0.0, 0.0, 1.0).z : vec3(1.0, 0.0, 0.0).z), _541));
        vec3 _777 = normalize(((_759 * (_737 * cos(_719))) + (cross(_541, _759) * (_737 * sin(_719)))) + (_541 * _732));
        float _586 = dot(_541, _777);
        vec3 _591 = (_777 * (2.0 * _586)) - _541;
        float _595 = clamp(dot(_541, _591), 0.0, 1.0);
        if (_595 > 0.0)
        {
            float _819 = -_591.z;
            float _821 = _591.x;
            vec2 _830 = vec2(((_821 < 0.0) ? (-1.0) : 1.0) * acos(clamp(_819 / length(vec2(_821, _819)), -1.0, 1.0)) + (-1.57079637050628662109375), acos(_591.y)) * vec2(0.15915493667125701904296875, 0.3183098733425140380859375);
            vec2 _900 = _830;
            _900.y = 1.0 - _830.y;
            _926 = _906 + _595;
            _925 = _905 + (textureLod(samplerEnv, _900, 0.5 * log2((1.0 / (4096.0 * (((0.3183098733425140380859375 * max(_586, 0.0)) / (4.0 * max(dot(_777, _541), 0.0))) + 9.9999997473787516355514526367188e-05) + 9.9999997473787516355514526367188e-05)) / (12.56637096405029296875 / (samplerEnvSize.x * samplerEnvSize.y))) + roughnessScale) * _595);
        }
        else
        {
            _926 = _906;
            _925 = _905;
        }
    }
    vec4 _662 = _905 / vec4(_906);
    float _864 = 1.0 / max(1.0, max(_662.x, max(_662.y, _662.z)));
    fragColor = vec4(_662.xyz * _864, _864);
}

