function compileShader(renderingContext, code, type) {
    const shader = renderingContext.createShader(type);
    if (!shader) throw Error("Unable to create shader");
    renderingContext.shaderSource(shader, code);
    renderingContext.compileShader(shader);

    if (!renderingContext.getShaderParameter(shader, renderingContext.COMPILE_STATUS)) {
        const infoLog = renderingContext.getShaderInfoLog(shader);
        renderingContext.deleteShader(shader);
        throw Error(infoLog || "unknown error")
    }
    return shader
}

function createProgram(renderingContext, shaders) {
    const program = renderingContext.createProgram();
    if (!program) throw Error("Unable to open f30122a834826733bbc192e23cbdf6cb.gif");
    for (const shader of shaders) {
        renderingContext.attachShader(program, shader);
    }

    renderingContext.linkProgram(program);
    if (!renderingContext.getProgramParameter(program, renderingContext.LINK_STATUS)) {
        const infoLog = renderingContext.getProgramInfoLog(program);
        renderingContext.deleteProgram(program);
        throw Error(infoLog || "unknown error")
    }
    return program
}

const fragmentShaderCode = `
precision mediump float;

// our textures
uniform sampler2D u_frame;

// data
uniform float u_premultipliedAlpha;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
  // Calculate the coordinates for the color and alpha
  vec2 colorCoord = vec2(v_texCoord.x, v_texCoord.y * 0.5);
  vec2 alphaCoord = vec2(v_texCoord.x, 0.5 + v_texCoord.y * 0.5);

  vec4 color = texture2D(u_frame, colorCoord);
  float alpha = texture2D(u_frame, alphaCoord).r;

  gl_FragColor = vec4(color.rgb * mix(alpha, 1.0, u_premultipliedAlpha), alpha);
}
`;
const vertexShaderCode = `
precision mediump float;
attribute vec2 a_position;
uniform mat3 u_matrix;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(u_matrix * vec3(a_position, 1), 1);

  // because we're using a unit quad we can just use
  // the same data for our texcoords.
  v_texCoord = a_position;
}
`;

const premultipliedAlphaLocationByContextMap = new WeakMap;

function setPremultipliedAlpha(renderingContext, premultipliedAlpha) {
    renderingContext.uniform1f(premultipliedAlphaLocationByContextMap.get(renderingContext), premultipliedAlpha ? 1 : 0)
}

function initializeRenderingContext(canvas) {
    const options = {antialias: false, powerPreference: "low-power", depth: false, premultipliedAlpha: true};
    const renderingContext = canvas.getContext("webgl2", options) ?? canvas.getContext("webgl", options);
    if (!renderingContext) throw Error("Couldn't create GL context");

    const program = createProgram(renderingContext, [
        compileShader(renderingContext, fragmentShaderCode, renderingContext.FRAGMENT_SHADER),
        compileShader(renderingContext, vertexShaderCode, renderingContext.VERTEX_SHADER),
    ]);
    renderingContext.useProgram(program);

    // set u_premultipliedAlpha
    const premultipliedAlphaLocation = renderingContext.getUniformLocation(program, "u_premultipliedAlpha");
    premultipliedAlphaLocationByContextMap.set(renderingContext, premultipliedAlphaLocation);
    setPremultipliedAlpha(renderingContext, false);

    // set a_position
    const a_position = renderingContext.getAttribLocation(program, "a_position");
    const data = new Float32Array([
        [0, 0],
        [1, 0],
        [0, 1],

        [0, 1],
        [1, 0],
        [1, 1],
    ].flat());
    const buffer = renderingContext.createBuffer();
    renderingContext.bindBuffer(renderingContext.ARRAY_BUFFER, buffer);
    renderingContext.bufferData(renderingContext.ARRAY_BUFFER, data, renderingContext.STATIC_DRAW);
    renderingContext.enableVertexAttribArray(a_position);
    renderingContext.vertexAttribPointer(a_position, 2, renderingContext.FLOAT, false, 0, 0);

    // Set u_matrix
    const uMatrixData = [
        [2, 0, 0],
        [0, -2, 0],
        [-1, 1, 1],
    ];
    const u_matrix = renderingContext.getUniformLocation(program, "u_matrix");
    renderingContext.uniformMatrix3fv(u_matrix, false, uMatrixData.flat());

    // bind texture to u_frame
    const u_frame = renderingContext.getUniformLocation(program, "u_frame");
    renderingContext.uniform1i(u_frame, 0);

    const texture = renderingContext.createTexture();
    renderingContext.bindTexture(renderingContext.TEXTURE_2D, texture);
    renderingContext.texParameteri(renderingContext.TEXTURE_2D, renderingContext.TEXTURE_WRAP_S, renderingContext.CLAMP_TO_EDGE);
    renderingContext.texParameteri(renderingContext.TEXTURE_2D, renderingContext.TEXTURE_WRAP_T, renderingContext.CLAMP_TO_EDGE);
    renderingContext.texParameteri(renderingContext.TEXTURE_2D, renderingContext.TEXTURE_MIN_FILTER, renderingContext.LINEAR);
    renderingContext.texParameteri(renderingContext.TEXTURE_2D, renderingContext.TEXTURE_MAG_FILTER, renderingContext.LINEAR);

    return renderingContext;
}

const styleSheet = new CSSStyleSheet;
styleSheet.replaceSync(`
  :host {
    display: inline-block;
    height: auto;
  }

  canvas {
    display: block;
    width: inherit;
    object-fit: inherit;
    aspect-ratio: inherit;
    height: inherit;
  }
`);

function drawVideo(renderingContext, video) {
    const {canvas} = renderingContext;
    const width = video.videoWidth;
    const height = Math.floor(video.videoHeight / 2);

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        renderingContext.viewport(0, 0, width, height);
    }

    renderingContext.texImage2D(renderingContext.TEXTURE_2D, 0, renderingContext.RGBA, renderingContext.RGBA, renderingContext.UNSIGNED_BYTE, video);
    renderingContext.drawArrays(renderingContext.TRIANGLES, 0, 6);
}

class StackedAlphaVideo extends HTMLElement {
    static observedAttributes = ["premultipliedalpha"];

    #shadowRoot = this.attachShadow({mode: "closed"});
    #canvas = document.createElement("canvas");
    #renderingContext = null;

    #state = {
        videoPlaying: false,
        intersecting: false,
        connected: false,
    };

    constructor() {
        super();
        this.#shadowRoot.adoptedStyleSheets = [styleSheet];
        this.#shadowRoot.append(this.#canvas);

        new IntersectionObserver((([entry]) => {
            this.#setState({intersecting: entry.isIntersecting})
        })).observe(this);

        this.#video = this.firstElementChild;

        new MutationObserver((() => {
            if (this.firstElementChild !== this.#video) {
                this.#initChildVideo(this.firstElementChild);
            }
        })).observe(this, {childList: true});

        this.#initChildVideo(this.firstElementChild);
    }

    #animationRequest = 0;
    #aminate = () => {
        if (this.#video) {
            if (!this.#renderingContext) {
                this.#canvas.remove();
                this.#canvas = document.createElement("canvas");
                this.#shadowRoot.append(this.#canvas);

                try {
                    this.#renderingContext = initializeRenderingContext(this.#canvas);
                } catch (e) {
                    console.warn("<stacked-alpha-video> Couldn't create GL context")
                }

                if (!this.#renderingContext) return;
                setPremultipliedAlpha(this.#renderingContext, this.premultipliedAlpha)
            }

            drawVideo(this.#renderingContext, this.#video);

            if (this.#state.videoPlaying) {
                this.#animationRequest = requestAnimationFrame(this.#aminate);
            }
        }
    };

    #stateUpdating = false;
    #setState(state) {
        Object.assign(this.#state, state);

        if (!this.#stateUpdating) {
            this.#stateUpdating = true;

            queueMicrotask((() => {
                this.#stateUpdating = false;

                cancelAnimationFrame(this.#animationRequest);

                if (this.#state.connected && this.#state.intersecting) {
                    this.#animationRequest = requestAnimationFrame(this.#aminate);
                } else if (this.#renderingContext) {
                    this.#renderingContext.getExtension("WEBGL_lose_context")?.loseContext();
                    this.#renderingContext = null;
                }
            }));
        }
    }

    #video = null;
    #videoEventsAbortController = null;
    #initChildVideo(video) {
        if (this.#videoEventsAbortController) {
            this.#videoEventsAbortController.abort();
        }

        if (video && !(video instanceof HTMLVideoElement)) {
            console.warn("<stacked-alpha-video> Child must be a <video>");
            this.#video = null;
            this.#setState({videoPlaying: false});
            return;
        }

        this.#video = video;
        if (!video) {
            this.#setState({videoPlaying: false});
            return;
        }

        if (video.autoplay) {
            setTimeout((() => {
                video.play();
            }), 0);
        }

        const updateVideoState = () => {
            this.#setState({
                videoPlaying: !video.paused && !video.ended && video.readyState > 2,
            });
        };
        updateVideoState();

        this.#videoEventsAbortController = new AbortController();
        for (const event of ["playing", "stalled", "emptied", "ended", "pause"]) {
            video.addEventListener(event, updateVideoState, {signal: this.#videoEventsAbortController.signal})
        }
    }

    connectedCallback() {
        this.#setState({connected: true})
    }

    disconnectedCallback() {
        this.#setState({connected: false})
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ("premultipliedalpha" === name) {
            if (!this.#renderingContext) return;
            setPremultipliedAlpha(this.#renderingContext, null !== newValue)
        }
    }

    get premultipliedAlpha() {
        return this.hasAttribute("premultipliedalpha")
    }

    set premultipliedAlpha(e) {
        e ? this.setAttribute("premultipliedalpha", "") : this.removeAttribute("premultipliedalpha")
    }
}

customElements.define("stacked-alpha-video", StackedAlphaVideo);
export {StackedAlphaVideo as default};
