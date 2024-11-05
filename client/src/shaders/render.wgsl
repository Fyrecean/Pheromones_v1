@group(0) @binding(0) var textureIn: texture_2d<f32>;
@group(0) @binding(1) var samplerIn: sampler;

struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) uv : vec2f,
}

@vertex
fn vertex_main(@builtin(vertex_index) VertexIndex: u32) -> VertexOut
{
    var vertices = array<vec2f, 6>(
    vec2(-1, -1),
    vec2(1, -1),
    vec2(-1, 1),
    vec2(1, 1),
    vec2(1, -1),
    vec2(-1, 1),
    );
    var uvs = array<vec2f, 6> (
    vec2(0, 0),
    vec2(1, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
    vec2(0, 1),
    );
    var output : VertexOut;
    output.position = vec4(vertices[VertexIndex], 0, 1);
    output.uv = uvs[VertexIndex];
    
    return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
    // let color1 = vec3(0.39, 0.82, 0.06);
    // let color1 = vec3(0.34, 0.8, 0.32);
    let color1 = vec3(1.);
    let color2 = vec3(0, 0.49, 0.77);
    // let color2 = vec3(.1, 0.3, .3);
    // let color2 = vec3(0.3, 0.77, 0.67);
    let black = vec3(0.);
    let sample = textureSample(textureIn, samplerIn, fragData.uv).x;
    var outColor: vec3<f32>;
    if (sample >= .5) {
        outColor = mix(color2, color1, (sample - .5) * 2);
    } else {
        outColor = mix(black, color2, sample * 2);
    }

    return vec4(outColor, 1);
}