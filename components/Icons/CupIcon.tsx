import React from "react";

export const CupIcon: React.ComponentType<React.HTMLAttributes<SVGElement>> = ({
    ...props
}) => {
    return (
        <svg {...props} viewBox="0 0 24 21" xmlns="http://www.w3.org/2000/svg">
            <g fill="#FEC835">
                <path d="M20.5 1.7V0h-17v1.7H0v3.4c0 2.3 1.8 4.1 4 4.3 1 2.8 3.5 4.9 6.4 5.4-.2 1.9-1.7 3.4-3.5 3.7V21h10.2v-2.5c-1.9-.3-3.4-1.8-3.6-3.7 3-.5 5.4-2.6 6.4-5.4 2.3-.2 4.1-2.1 4.1-4.3V1.7h-3.5zm-19 3.4V3.2h2v3.3c0 .5 0 .9.1 1.3-1.2-.3-2.1-1.4-2.1-2.7zm21 0c0 1.3-.9 2.4-2.1 2.7.1-.4.1-.9.1-1.3V3.2h2v1.9z" />
                <path d="M14.4 8.3c0 1.4-1.3 2.1-2.5 2.1-.8 0-2.1-.2-2.5-1.7 0-.1 0-.2.1-.3l.7-.3c.2-.1.3 0 .3.2.2.6.6.8 1.3.8.6 0 1.1-.3 1.1-.9 0-.6-.4-1-1.1-1h-.5c-.1 0-.1 0-.1-.1v-.9s0-.1.1-.1h.5c.6 0 1-.3 1-.8v-.1c0-.2-.1-.8-1-.8-.6 0-1 .2-1.2.7 0 .1-.1.1-.2.1h-.1l-.8-.3c.1.1 0 0 .1-.2.3-1 1.2-1.6 2.3-1.6 1.5 0 2.4.7 2.4 1.9v.1c0 .7-.4 1.2-1 1.5.5.2 1.1.7 1.1 1.5v.2z" />
            </g>
        </svg>
    );
};
