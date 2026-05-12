import React from 'react';
import './ModalButton.css';

interface ModalButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'default' | 'primary' | 'danger' | 'success';
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ModalButton: React.FC<ModalButtonProps> = ({
  children,
  onClick,
  type = 'default',
  htmlType = 'button',
  loading = false,
  disabled = false,
  icon,
}) => {
  const className = `modal-btn modal-btn-${type}`;

  return (
    <button
      type={htmlType}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? '...' : icon}
      {children}
    </button>
  );
};

export default ModalButton;
