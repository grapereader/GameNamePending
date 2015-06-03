/**
    This is the light shader used in the PixiJS NormalMapFilter.
    Unfortunately, it only works with one light.
    TODO This needs to be modified to use multiple light sources.
*/
define(function() {
    return "" +
        "precision mediump float;" +
        "varying vec2 vTextureCoord;" +
        "varying vec4 vColor;" +
        "uniform sampler2D displacementMap;" +
        "uniform sampler2D uSampler;" +
        "uniform vec4 dimensions;" +
        "const vec2 Resolution = vec2(1.0,1.0);" + //resolution of screen
        "uniform vec3 LightPos;" + //light position, normalized
        "const vec4 LightColor = vec4(1.0, 1.0, 1.0, 1.0);" + //light RGBA -- alpha is intensity
        "const vec4 AmbientColor = vec4(1.0, 1.0, 1.0, 0.5);" + //ambient RGBA -- alpha is intensity
        "const vec3 Falloff = vec3(0.0, 1.0, 0.2);" + //attenuation coefficients
        "uniform vec3 LightDir;" +
        "uniform vec2 mapDimensions;" +
        "void main(void)" +
        "{" +
        "    vec2 mapCords = vTextureCoord.xy;" +
        "    vec4 color = texture2D(uSampler, vTextureCoord.st);" +
        "    vec3 nColor = texture2D(displacementMap, vTextureCoord.st).rgb;" +
        "    mapCords *= vec2(dimensions.x/512.0, dimensions.y/512.0);" +
        "    mapCords.y *= -1.0;" +
        "    mapCords.y += 1.0;" +
        "    vec4 DiffuseColor = texture2D(uSampler, vTextureCoord);" +
        "    vec3 NormalMap = texture2D(displacementMap, mapCords).rgb;" +
        "    vec3 LightDir = vec3(LightPos.xy - (mapCords.xy), LightPos.z);" +
        "    float D = length(LightDir);" +
        "    vec3 N = normalize(NormalMap * 2.0 - 1.0);" +
        "    vec3 L = normalize(LightDir);" +
        "    vec3 Diffuse = (LightColor.rgb * LightColor.a) * max(dot(N, L), 0.0);" +
        "    vec3 Ambient = AmbientColor.rgb * AmbientColor.a;" +
        "    float Attenuation = 1.0 / ( Falloff.x + (Falloff.y*D) + (Falloff.z*D*D) );" +
        "    vec3 Intensity = Ambient + Diffuse * Attenuation;" +
        "    vec3 FinalColor = DiffuseColor.rgb * Intensity;" +
        "    gl_FragColor = vColor * vec4(FinalColor, DiffuseColor.a);" +
        "}";
});
