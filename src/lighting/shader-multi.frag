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

    vec2 ldir = vec2(1.0, 0.0);
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

    for (int i = 0; i < MAX_LIGHTS * MAX_POLY; i++) {
        if (i < currPoly) continue;
        if (i > len - 2) break;

        vec2 sa = polygons[i];
        vec2 sb = polygons[i + 1];

        if (intersect(sa, sb)) intersects++;
    }

    return intersects;
}

float getClosestLineDistance(int currPoly, int len) {
    float x = gl_FragCoord.x;
    float y = resolution.y - gl_FragCoord.y;

    float closest = 128.0;
    float dist = closest;

    for (int i = 0; i < MAX_LIGHTS * MAX_POLY; i++) {
        if (i < currPoly) continue;
        if (i > len - 2) break;

        vec2 sa = polygons[i];
        vec2 sb = polygons[i + 1];

        if (sa.x == sb.x && sa.y == sb.y) continue;

        float a = sa.y - sb.y;
        float b = sb.x - sa.x;
        float c = (sa.x - sb.x) * sa.y + (sb.y - sa.y) * sa.x;

        vec2 point = vec2(
            (b * (b * x - a * y) - a * c) / (a * a + b * b),
            (a * (-b * x + a * y) - b * c) / (a * a + b * b)
        );

        if ((point.x <= sa.x + 1.0 && point.x >= sb.x - 1.0 || point.x <= sb.x + 1.0 && point.x >= sa.x - 1.0)
        && (point.y <= sa.y + 1.0 && point.y >= sb.y - 1.0 || point.y <= sb.y + 1.0 && point.y >= sa.y - 1.0)) {
            dist = abs(a * x + b * y + c) / sqrt(a * a + b * b);
        } else {
            vec2 d1 = vec2(x - sa.x, y - sa.y);
            vec2 d2 = vec2(x - sb.x, y - sb.y);

            float dist1 = length(d1);
            float dist2 = length(d2);

            if (dist1 < dist2) dist = dist1;
            else dist = dist2;
        }

        if (dist < closest) closest = dist;
    }

    return closest;
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

        vec3 light = vec3(0.0, 0.0, 0.0);

        if (intersects != 0.0 && mod(intersects, 2.0) != 0.0) {
            light = getLight(normalMap, lightPositions[i], lightColours[i], lightFalloffs[i], lightSizes[i]);
            lights++;
        } else {
            float closest = getClosestLineDistance(currPoly, polygonLengths[i]);
            if (closest < 128.0) {
                light = getLight(normalMap, lightPositions[i], lightColours[i], lightFalloffs[i], lightSizes[i]) - closest / 128.0;
                lights++;
            }
        }

        currPoly += polygonLengths[i];

        lightTotal = lightTotal + light;
    }

    lightTotal /= lights;

    vec3 ambient = ambientColour.rgb * ambientColour.a;
    vec3 intensity = ambient + lightTotal;
    vec3 final = diffuseColour.rgb * intensity;

    gl_FragColor = vColor * vec4(final, diffuseColour.a);
}
