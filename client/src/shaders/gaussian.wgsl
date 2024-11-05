struct Uniforms {
    blurKernel: mat3x3<f32>,
    passiveAttenuation: f32,
    wrap: u32,
}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(0) @binding(1) var pheromonesIn: texture_storage_2d<rgba8unorm, read>;
@group(0) @binding(2) var pheromonesOut: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(8, 8)
fn attenuate(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let sizeU = (textureDimensions(pheromonesIn));
    if (global_id.x >= sizeU.x || global_id.y >= sizeU.y) {
        return;
    }
    let size = vec2<i32>(sizeU);
    
    let pixel = global_id.xy;
    var colorSum = vec3(0.);

    // Loop through neighboring pixels (3x3 kernel)
    for (var i: i32 = -1; i <= 1; i++) {
        for (var j: i32 = -1; j <= 1; j++) {
            var samplePixel = vec2(i32(global_id.x) + i, i32(global_id.y) + j);
            if (uniforms.wrap == 1) {
                if (samplePixel.x < 0) {
                    samplePixel.x += size.x;
                } else if (samplePixel.x >= size.x) {
                    samplePixel.x -= size.x;
                }
                if (samplePixel.y < 0) {
                    samplePixel.y += size.y;
                } else if (samplePixel.y >= size.y) {
                    samplePixel.y -= size.y;
                }
            } else {
                    if (samplePixel.x < 0) {
                    samplePixel.x = 0;
                } else if (samplePixel.x >= size.x) {
                    samplePixel.x = size.x - 1;
                }
                if (samplePixel.y < 0) {
                    samplePixel.y = 0;
                } else if (samplePixel.y >= size.y) {
                    samplePixel.y = size.y - 1;
                }
            }

            let sampleColor = textureLoad(pheromonesIn, samplePixel).xyz; // Load neighboring pixel color
            let kernelIndex = (i+1) * 3 + (j+1);
            colorSum += sampleColor * uniforms.blurKernel[i+1][j+1]; // Apply Gaussian kernel
        }
    }

    colorSum = max(vec3(0.), colorSum - vec3(uniforms.passiveAttenuation));

    textureStore(pheromonesOut, pixel, vec4(colorSum, 1.0)); // Store blurred color
}