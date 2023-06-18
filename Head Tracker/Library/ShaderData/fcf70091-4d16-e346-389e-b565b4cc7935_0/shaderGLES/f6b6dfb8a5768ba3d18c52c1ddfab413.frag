#version 300 es
precision highp float;
precision highp int;

const vec2 _107[10] = vec2[](vec2(1.440000057220458984375, 1.2999999523162841796875), vec2(1.440000057220458984375, 3.8599998950958251953125), vec2(1.46000003814697265625, 6.570000171661376953125), vec2(1.57700002193450927734375, 9.3500003814697265625), vec2(1.53400003910064697265625, 11.8500003814697265625), vec2(5.21000003814697265625, 1.35000002384185791015625), vec2(5.27600002288818359375, 3.8599998950958251953125), vec2(5.235000133514404296875, 6.5799999237060546875), vec2(5.11999988555908203125, 9.3500003814697265625), vec2(5.2189998626708984375, 11.89000034332275390625));

uniform mediump int _LeftEyes;
uniform mediump int _RightEyes;
uniform mediump sampler2D _EyeTex;
uniform float _OpacityEnable;
uniform vec4 _Color;
uniform float _ReflectionEnable;
uniform mediump sampler2D _ReflectionTex;

in vec2 uv0;
layout(location = 0) out vec4 o_FragColor;

void main()
{
    vec4 _288;
    _288 = vec4(0.0);
    for (mediump int _285 = _LeftEyes; _285 < _RightEyes; )
    {
        vec2 _113 = uv0 * vec2(7.650000095367431640625, 13.59999370574951171875) + (-_107[_285]);
        _288 += (texture(_EyeTex, _113) * step(distance(uv0, _113), 1.0));
        _285++;
        continue;
    }
    vec4 _290;
    if (_OpacityEnable > 0.5)
    {
        _290 = _288 * _Color;
    }
    else
    {
        _290 = _288;
    }
    vec3 _293;
    if (_ReflectionEnable > 0.5)
    {
        vec4 _292;
        _292 = vec4(0.0);
        for (mediump int _291 = _LeftEyes; _291 < _RightEyes; )
        {
            vec2 _226 = uv0 * vec2(7.650000095367431640625, 13.59999370574951171875) + (-_107[_291]);
            _292 += (texture(_ReflectionTex, _226) * step(distance(uv0, _226), 1.0));
            _291++;
            continue;
        }
        _293 = _292.xyz;
    }
    else
    {
        _293 = _290.xyz;
    }
    o_FragColor = vec4(_293, 1.0);
}

