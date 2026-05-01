import React from 'react';
import './ActionButton.css';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'default' | 'primary' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  type = 'default',
  loading = false,
  disabled = false,
  icon,
}) => {
  const className = `action-btn action-btn-${type}`;

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? '...' : icon}
      {children}
    </button>
  );
};

export default ActionButton;
