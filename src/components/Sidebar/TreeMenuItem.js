import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

const TreeMenuItem = ({ label, isOpen, onToggle, children }) => {
  return (
    <div style={{ width: '100%' }}>
      <div 
        className="flex items-center w-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{ position: 'relative' }}
      >
        {label}
        <FaChevronRight 
          size={16}
          style={{ 
            position: 'absolute',
            right: '0',
            top : '6px',
            transform: isOpen ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s ease'
          }}
        />
      </div>
      {isOpen && children}
    </div>
  );
};

export default TreeMenuItem;