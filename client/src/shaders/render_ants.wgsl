struct Uniforms {
    viewMatrix : mat4x4f,
    ant_size: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn vertex_main(
    @builtin(vertex_index) VertexIndex: u32, 
    @builtin(instance_index) ant_index: u32
) -> VertexOut
{
    var vertices = array<vec2f, 6>(
        vec2(-1, -1),
        vec2(1, -1),
        vec2(-1, 1),
    );
    var output : VertexOut;
    output.position = uniforms.viewMatrix * ants[ant_index].transform * vec4(vertices[VertexIndex], 0, 1);
    
    return output;
}
