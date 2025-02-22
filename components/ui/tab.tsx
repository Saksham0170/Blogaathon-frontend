import React from 'react';

interface TabProps {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ active, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`p-2 ${active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
            {children}
        </button>
    );
};

export default Tab; 