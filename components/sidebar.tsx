import React from 'react';
import Container from './container';

const Sidebar: React.FC = () => {
    return (
        <Container>
            <div>
                <ul>
                    <li>Explorer</li>
                    <li>
                        Movies
                        <ul>
                            <li>Now</li>
                            <li>Popular</li>
                            <li>Top</li>
                        </ul>
                    </li>
                    <li>
                        Shows
                        <ul>
                            <li>Now</li>
                            <li>Popular</li>
                            <li>Top</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </Container>
    );
};

export default Sidebar;