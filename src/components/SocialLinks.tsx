import React from 'react';
import { Space, Typography } from 'antd';
import { FacebookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getSocialLinks } from '../utils/socialLinks';

const { Text } = Typography;

interface SocialLinksProps {
  data?: unknown;
  direction?: 'horizontal' | 'vertical';
  showEmpty?: boolean;
  textMode?: 'label' | 'url';
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  data,
  direction = 'horizontal',
  showEmpty = false,
  textMode = 'label',
}) => {
  const links = getSocialLinks(data);
  
  const items = [
    links.facebook && {
      key: 'facebook',
      label: textMode === 'url' ? links.facebook : 'Facebook',
      url: links.facebook,
      icon: <FacebookOutlined style={{ color: '#1877F2' }} />,
    },
    links.tiktok && {
      key: 'tiktok',
      label: textMode === 'url' ? links.tiktok : 'TikTok',
      url: links.tiktok,
      icon: <VideoCameraOutlined style={{ color: '#000000' }} />,
    },
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    url: string;
    icon: React.ReactNode;
  }>;

  if (!items.length) {
    return showEmpty ? <Text type="secondary">Chưa cập nhật</Text> : null;
  }

  return (
    <Space direction={direction} size={8} wrap>
      {items.map((item) => (
        <a key={item.key} href={item.url} target="_blank" rel="noopener noreferrer">
          {item.icon}
          <span style={{ marginLeft: 6 }}>{item.label}</span>
        </a>
      ))}
    </Space>
  );
};

export default SocialLinks;
