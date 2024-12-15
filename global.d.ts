declare namespace JSX {
    interface IntrinsicElements {
        'mpegts-video': {
            autoplay?: boolean;
            controls?: boolean;
            src?: string;
            style?: React.CSSProperties;
            onClick?: (event: React.MouseEvent<HTMLElement>) => void;
            className?: string;
        };
    }
}