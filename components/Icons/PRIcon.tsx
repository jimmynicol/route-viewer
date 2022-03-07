import React from "react";

export const PRIcon: React.ComponentType<React.HTMLAttributes<SVGElement>> = ({
    ...props
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 24" {...props}>
            <path
                d="M5.6 13.3h-.7v2.3h.7c.9 0 1.2-.3 1.2-1v-.2c-.1-.8-.4-1.1-1.2-1.1zm5.6 0h-.9v2.1h.9c.8 0 1.1-.3 1.1-1v-.2c0-.7-.3-.9-1.1-.9zm.6-5.7L15.3 0H1.6l3.5 7.7C2.1 9 0 12 0 15.5 0 20.2 3.8 24 8.5 24s8.5-3.8 8.5-8.5c0-3.5-2.1-6.6-5.2-7.9zM13 1.5l-1.8 4-1.8-4H13zM8.2 14.6c0 1.4-.9 2.2-2.5 2.2h-.8v2.1c0 .1-.1.2-.2.2H3.6c-.1 0-.2-.1-.2-.2V12h2.3c1.6 0 2.5.8 2.5 2.2v.4zM6.5 7.2v-.1L4 1.5h3.7l2.6 5.6c-.6-.1-1.1-.2-1.7-.2-.8.1-1.4.1-2.1.3zM13.9 19c0 .1-.1.1 0 0l-1.4.1c-.1 0-.2 0-.2-.1l-1.2-2.4h-.8v2.3c0 .1-.1.2-.2.2H9c-.1 0-.2-.1-.2-.2V12h2.6c1.5 0 2.3.7 2.3 2v.5c0 .9-.4 1.5-1.1 1.8l1.3 2.5v.2z"
                fill="#FEC835"
            />
        </svg>
    );
};
