#version 300 es
precision highp float;
precision highp int;

uniform mediump vec2 samplerEnvSize;
uniform mediump sampler2D samplerEnv;
uniform mediump float roughnessScale;
uniform mediump float perceptualRoughness;

in vec2 varScreenTexturePos;
layout(location = 0) out vec4 fragColor;

void main()
{
    mediump float _512 = 6.283185482025146484375 * varScreenTexturePos.x;
    mediump float _515 = 3.1415927410125732421875 * (1.0 - varScreenTexturePos.y);
    mediump float _519 = sin(_515);
    mediump vec3 _531 = vec3(cos(_512) * _519, cos(_515), sin(_512) * _519);
    mediump vec4 _890;
    mediump float _891;
    _891 = 0.0;
    _890 = vec4(0.0);
    mediump vec4 _910;
    mediump float _911;
    for (mediump int _889 = 0; _889 < 512; _891 = _911, _890 = _910, _889++)
    {
        mediump float _893;
        _893 = 0.0;
        mediump int _892 = _889;
        mediump float _909 = 0.5;
        for (; _892 > 0; )
        {
            mediump int _680 = _892 / 2;
            mediump float _688 = float(_892 - (_680 * 2)) * _909 + _893;
            _909 *= 0.5;
            _893 = _688;
            _892 = _680;
            continue;
        }
        mediump float _708 = perceptualRoughness * perceptualRoughness;
        mediump float _711 = float(_889) * 0.012271846644580364227294921875;
        mediump float _718 = _708 * _708 + (-1.0);
        mediump float _724 = sqrt((1.0 - _893) / (_718 * _893 + 1.0));
        mediump float _729 = sqrt((-_724) * _724 + 1.0);
        mediump vec3 _745 = normalize(cross(vec3(0.0, 0.0, 1.0), _531));
        mediump vec3 _763 = normalize(((_745 * (_729 * cos(_711))) + (cross(_531, _745) * (_729 * sin(_711)))) + (_531 * _724));
        mediump float _576 = dot(_531, _763);
        mediump vec3 _581 = (_763 * (2.0 * _576)) - _531;
        mediump float _585 = clamp(dot(_531, _581), 0.0, 1.0);
        if (_585 > 0.0)
        {
            mediump float _781 = max(_576, 0.0);
            mediump float _790 = (_781 * _781) * _718 + 1.0;
            mediump float _897;
            if (perceptualRoughness == 0.0)
            {
                _897 = 0.0;
            }
            else
            {
                _897 = 0.5 * log2((1.0 / (512.0 * (((((_708 * _708) / ((3.1415927410125732421875 * _790) * _790)) * _781) / (4.0 * max(dot(_763, _531), 0.0))) + 9.9999997473787516355514526367188e-05) + 9.9999997473787516355514526367188e-05)) / (12.56637096405029296875 / (samplerEnvSize.x * samplerEnvSize.y)));
            }
            mediump float _805 = -_581.z;
            mediump float _807 = _581.x;
            mediump vec2 _816 = vec2(((_807 < 0.0) ? (-1.0) : 1.0) * acos(clamp(_805 / length(vec2(_807, _805)), -1.0, 1.0)) + (-1.57079637050628662109375), acos(_581.y)) * vec2(0.15915493667125701904296875, 0.3183098733425140380859375);
            mediump vec2 _885 = _816;
            _885.y = 1.0 - _816.y;
            _911 = _891 + _585;
            _910 = min(_890 + (textureLod(samplerEnv, _885, _897 + roughnessScale) * _585), vec4(10000.0));
        }
        else
        {
            _911 = _891;
            _910 = _890;
        }
    }
    mediump vec4 _654 = _890 / vec4(_891);
    mediump float _850 = 1.0 / max(1.0, max(_654.x, max(_654.y, _654.z)));
    fragColor = vec4(_654.xyz * _850, _850);
}

