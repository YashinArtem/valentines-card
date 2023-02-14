export class QuadProgram {
    private program: WebGLProgram;

    private positionAttribute: number;
    private sizeUniform: WebGLUniformLocation;
    private resolutionUniform: WebGLUniformLocation;
    private mouseUniform: WebGLUniformLocation;
    private sideUniform: WebGLUniformLocation;
    private timeUniform: WebGLUniformLocation;

    public updateProgram(gl: WebGLRenderingContext): void {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, this.vertexShaderCode);
        gl.compileShader(vertexShader);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, this.fragmentShaderCode);
        gl.compileShader(fragmentShader);
        const log = gl.getShaderInfoLog(fragmentShader);
        if(log) {
            console.log(log);
            console.log(this.fragmentShaderCode);
        }
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        this.program = program;
        this.positionAttribute = gl.getAttribLocation(program, 'a_position');
        this.resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
        this.mouseUniform = gl.getUniformLocation(program, 'u_mouse');
        this.sideUniform = gl.getUniformLocation(program, 'u_side');
        this.timeUniform = gl.getUniformLocation(program, 'u_time');
    }

    public getProgram(): WebGLProgram {
        return this.program;
    }

    public getPositionAttribute(): number {
        return this.positionAttribute;
    }

    public getRectUniform(): WebGLUniformLocation {
        return this.sizeUniform;
    }

    public getResolutionUniform(): WebGLUniformLocation {
        return this.resolutionUniform;
    }

    public getMouseUniform(): WebGLUniformLocation {
        return this.mouseUniform;
    }

    public getSideUniform(): WebGLUniformLocation {
        return this.sideUniform;
    }

    public getTimeUniform(): WebGLUniformLocation {
        return this.timeUniform;
    }

    private vertexShaderCode: string =
        `#version 300 es
        in vec2 a_position;

        out vec2 v_texcoord;

        void main() {
            v_texcoord = a_position;
            gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
        }
    `;

    private fragmentShaderCode =
        `#version 300 es
        precision highp float;

        in vec2 v_texcoord;

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_side;

        out vec4 outColor;

        mat2 rot(float a) {
            float s = sin(a);
            float c = cos(a);
            return mat2(c, -s, s, c);
        }

        float dot2(vec2 v) {
            return dot(v, v);
        }

        float plane(vec3 ro, vec3 rd, vec4 p) {
            return -(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz);
        }

        float square(vec2 p, vec2 b) {
            vec2 d = abs(p) - b;
            return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        }

        float heart(vec2 p) {
            p.x = abs(p.x);
            if(p.y + p.x > 1.0) return sqrt(dot2(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
            return sqrt(min(dot2(p - vec2(0.00, 1.00)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
        }

        float box(vec3 p, vec3 b) {
            vec3 q = abs(p) - b;
            return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
        }
        
        vec2 map(vec3 p) {
            float dBox = -box(p, vec3(0.5, 0.5, 0.75)) + 0.15;
            vec3 hp = p - vec3(0.0, 0.0, 0.5);
            float size = 1.0 + (pow(abs(sin(u_time * 3.0)), 64.0) + pow(abs(sin(u_time * 3.0 + 1.0)), 64.0)) * 0.05;
            float hd = heart(-hp.yz * size) + size * 0.5;
            hd = sqrt(hd * hd + hp.x * hp.x) - size * 0.5;
            hd = max(hd, -p.x);
            dBox = max(dBox, -p.x);
            if (dBox < hd) return vec2(dBox, 0.0);
            return vec2(hd, 1.0);
        }

        vec3 normal(vec3 p) {
            vec2 e = vec2(1.0, -1.0) * 0.5773 * 0.0005;
            return normalize(e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x + e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
        }

        vec3 march(vec3 ro, vec3 rd) {
            vec3 p = ro;
            for (int i = 0; i < 100; i++) {
                vec2 d = map(p);
                if (d.x < 0.001) {
                    vec3 color = vec3(0.8, 0.75, 0.7);
                    if (d.y > 0.5) color = vec3(1.0, 0.1, 0.15);
                    vec3 lightDir = normalize(vec3(-0.5, 0.5, 1.0));
                    float diffuse = clamp(dot(lightDir, normal(p)) * 0.25 + 0.75, 0.0, 1.0);
                    return vec3(color * diffuse);
                }
                else if (d.x > 10.0) {
                    return vec3(0.0);
                }
                p += rd * d.x;
            }
            return vec3(0.0);
        }

        void main() {
            vec2 uv = v_texcoord - 0.5;
            uv.x *= u_resolution.x / u_resolution.y;
            vec3 color = vec3(0.0);
            vec3 ro = vec3(-3.0, 0.0, 0.0);
            vec3 rd = normalize(vec3(1.0, uv));
            vec2 mouse = u_mouse;
            mouse.y *= (1.0 - u_side) * 2.0 - 1.0;
            ro.xy *= rot(mouse.x - u_side * 3.1415);
            rd.xy *= rot(mouse.x - u_side * 3.1415);
            ro.xz *= rot(mouse.y);
            rd.xz *= rot(mouse.y);
            float planeDist = plane(ro, rd, vec4(-1.0, 0.0, 0.0, 0.0));
            vec3 planePoint = ro + rd * planeDist;
            if (planeDist > 0.0) {
                float squareDist = square(planePoint.yz, vec2(0.5, 0.75));
                if (squareDist - 0.2 < 0.0) {
                    if (dot(rd, vec3(1.0, 0.0, 0.0)) > 0.0) {
                        float circles = sin(planePoint.y * 10.0 + 1.5) + sin(planePoint.z * 10.0);
                        float circlesMask = smoothstep(0.5, 0.51, circles);
                        color = mix(vec3(0.1), vec3(0.1, 0.3, 0.6), circlesMask);
                        float specular = pow(max(dot(rd, vec3(1.0, 0.0, 0.0)), 0.0), 32.0);
                        color += specular * clamp(circlesMask, 0.1, 0.75);
                    }
                    else {
                        color = vec3(0.8, 0.75, 0.7);
                        if (squareDist - 0.15 < 0.0) {
                            color = march(-ro, -rd);
                        }
                    }
                }
            }
            outColor = vec4(color, 1.0);
        }
    `;
}