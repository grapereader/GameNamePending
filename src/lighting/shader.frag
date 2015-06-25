precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D normalTexture;
uniform vec2 resolution;
uniform vec4 ambientColour;

uniform vec3 lightPos;
uniform vec4 lightColour;
uniform vec3 lightFalloff;
uniform float lightSize;

void main() {
    vec4 diffuseColour = texture2D(uSampler, vTextureCoord);
    vec3 normalMap = texture2D(normalTexture, vTextureCoord).rgb;
    vec3 test = vec3(0.5, 0.5, 1);
    vec3 lightDir = vec3(test.xy - (gl_FragCoord.xy / resolution.xy), test.z);
    //vec3 lightDir = vec3(1, 1, lightPos.z);

    //lightDir.x /= (lightSize / resolution.x);
    //lightDir.y /= (lightSize / resolution.y);

    float dist = length(lightDir);
    vec3 n = normalize(normalMap * 2.0 - 1.0);
    vec3 l = normalize(lightDir);

    n = mix(n, vec3(0), 0.5);
    float df = max(dot(n, l), 0.0);
    vec3 lightDiffuse = (lightColour.rgb * lightColour.a) * df;
    vec3 ambient = ambientColour.rgb * ambientColour.a;
    float attenuation = 1.0 / (lightFalloff.x + (lightFalloff.y * dist) + (lightFalloff.z * dist * dist));

    if (attenuation < 0.4) {
        attenuation = 0.0;
    } else if (attenuation < 0.6) {
        attenuation = 0.6;
    } else if (attenuation < 0.8) {
        attenuation = 0.8;
    } else {
        attenuation = 1.0;
    }

    vec3 intensity = ambient + lightDiffuse;// * attenuation;
    vec3 final = diffuseColour.rgb * intensity;

    gl_FragColor = vColor * vec4(final, diffuseColour.a);
}
