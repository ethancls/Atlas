declare module 'mpegts-video-element' {
    class MPEGTSVideoElement extends HTMLElement {
        autoplay: boolean;
        controls: boolean;
        src: string;
        style: Partial<CSSStyleDeclaration>;
    }

    export default MPEGTSVideoElement;
}