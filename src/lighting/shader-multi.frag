precision mediump float;

varying vec4 vColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D normalTexture;
uniform vec2 resolution;
uniform vec4 ambientColour;

#define MAX_LIGHTS 1
#define MAX_POLY 84

uniform int lightCount;
uniform vec2 lightPositions[MAX_LIGHTS];
uniform vec3 lightFalloffs[MAX_LIGHTS];
uniform vec4 lightColours[MAX_LIGHTS];
uniform float lightSizes[MAX_LIGHTS];
uniform int polygonLengths[MAX_LIGHTS];
uniform vec2 polygons[MAX_LIGHTS * MAX_POLY];

vec3 getLight(vec3 normalMap, vec2 lightPos, vec4 lightColour, vec3 lightFalloff, float lightSize) {
    vec3 lightDir = vec3(lightPos.xy - (gl_FragCoord.xy / resolution.xy), 1.0);

    lightDir.x /= (lightSize / resolution.x);
    lightDir.y /= (lightSize / resolution.y);

    float dist = length(lightDir);
    vec3 n = normalize(normalMap * 2.0 - 1.0);
    vec3 l = normalize(lightDir);

    n = mix(n, vec3(0), 0.5);
    float df = max(dot(n, l), 0.0);
    vec3 lightDiffuse = (lightColour.rgb * lightColour.a) * df;
    float attenuation = 1.0 / (lightFalloff.x + (lightFalloff.y * dist) + (lightFalloff.z * dist * dist));

    return lightDiffuse * attenuation;
}

bool intersect(vec2 sa, vec2 sb) {
    float lx = gl_FragCoord.x;
    float ly = resolution.y - gl_FragCoord.y;

    /*
    if (lx > sa.x && lx > sb.x) return false;
    if (ly > sa.y && ly > sb.y) return false;
    if (ly < sa.y && ly < sb.y) return false;

    float m = (sa.y - sb.y) / (sa.x - sb.x);
    float x = ((ly - sb.y) / m) + sb.x;

    if (x < sa.x && x < sb.x) return false;
    if (x > sa.x && x > sb.x) return false;

    return x > lx;
    */

    //if (lx > sa.x && lx > sb.x) return false;
    if (lx < sa.x && lx < sb.x) return false;
    if (ly > sa.y && ly > sb.y) return false;
    if (ly < sa.y && ly < sb.y) return false;

    float ldx = -1.0;
    float ldy = 0.0;

    float sx = sa.x;
    float sy = sa.y;
    vec2 sdir = sb - sa;
    float sdx = sdir.x;
    float sdy = sdir.y;

    vec2 ldir = normalize(vec2(1.0, 0.0));
    vec2 ndir = normalize(sdir);

    if (ldir.x == ndir.x && ldir.y == ndir.y) return false;

    float t2 = (ldx * (sy - ly) + ldy * (lx - sx)) / (sdx * ldy - sdy * ldx);
    float t1 = (sx + sdx * t2 - lx) / ldx;

    if (t1 < 0.0) return false;
    if (t2 < 0.0 || t2 > 1.0) return false;

    return true;
}

float getIntersects(int currPoly, int len) {
    float intersects = 0.0;

    for (int i = 0; i < MAX_POLY; i++) {
        if (i < currPoly) continue;
        if (i > len - 2) break;

        vec2 sa = polygons[i];
        vec2 sb = polygons[i + 1];

        if (intersect(sa, sb)) intersects++;
    }

    return intersects;
}

void main() {
    vec4 diffuseColour = texture2D(uSampler, vTextureCoord);
    vec3 normalMap = texture2D(normalTexture, vTextureCoord).rgb;

    vec3 lightTotal = vec3(0, 0, 0);
    float lights = 0.0;

    int currPoly = 0;

    for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i > lightCount - 1) break;
        if (polygonLengths[i] == 0) continue;
        float intersects = getIntersects(currPoly, polygonLengths[i]);
        currPoly += polygonLengths[i];

        if (intersects == 0.0) continue;
        if (mod(intersects, 2.0) != 0.0) {
            lightTotal = lightTotal + getLight(normalMap, lightPositions[i], lightColours[i], lightFalloffs[i], lightSizes[i]);
            lights++;
        }
    }

    lightTotal /= lights;

    vec3 ambient = ambientColour.rgb * ambientColour.a;
    vec3 intensity = ambient + lightTotal;
    vec3 final = diffuseColour.rgb * intensity;

    gl_FragColor = vColor * vec4(final, diffuseColour.a);
}
