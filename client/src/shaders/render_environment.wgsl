struct Uniforms {
    viewMatrix : mat4x4f,
    rainbow: u32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var samplerIn: sampler;
@group(0) @binding(2) var textureIn: texture_2d<f32>;

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
    output.position = uniforms.viewMatrix * vec4(vertices[VertexIndex], 0, 1);
    output.uv = uvs[VertexIndex];
    
    return output;
}

const color1 = vec3(1.);
const color2 = vec3(0, 0.49, 0.77);
const black = vec3(0.);

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
    if (uniforms.rainbow == 1) {
        return textureSample(textureIn, samplerIn, fragData.uv);
    } else {
        
        let sample = rgb2hsv(textureSample(textureIn, samplerIn, fragData.uv).xyz).z;

        var outColor: vec3<f32>;
        if (sample >= .5) {
            outColor = mix(color2, color1, (sample - .5) * 2);
        } else {
            outColor = mix(black, color2, sample * 2);
        }
        return vec4(outColor, 1);
    }
}