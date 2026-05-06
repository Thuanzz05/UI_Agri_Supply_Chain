import React, { useState, useEffect, useRef } from 'react';
import { Layout, Input, Button, Avatar, Badge, Empty, message, Spin, Modal, Select, Popconfirm } from 'antd';
import { SendOutlined, UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import { AdminLayout } from '../../components/Layout';
import './TinNhan.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Sider, Content } = Layout;

interface Conversation {
  maCuocTroChuyen: number;
  tenNguoiKia: string;
  anhDaiDienNguoiKia?: string;
  tinNhanCuoi?: string;
  ngayCapNhat: string;
  soTinNhanChuaDoc: number;
}

interface Message {
  maTinNhan: number;
  maNguoiGui: number;
  loaiNguoiGui: string;
  noiDung: string;
  ngayGui: string;
  tenNguoiGui?: string;
}

interface AvailableUser {
  maNguoi: number;
  loaiNguoi: string;
  ten: string;
  anhDaiDien?: string;
  diaChi?: string;
  soDienThoai?: string;
}

const TinNhan: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = authService.getStoredUser();

  useEffect(() => {
    loadConversations();
    
    // Kiểm tra xem có yêu cầu chat từ trang khác không
    const pendingChatStr = localStorage.getItem('pendingChat');
    if (pendingChatStr) {
      try {
        const pendingChat = JSON.parse(pendingChatStr);
        localStorage.removeItem('pendingChat');
        
        // Mở modal tạo chat mới với thông tin đã điền sẵn
        setSelectedUserType(pendingChat.loaiNguoi);
        setSelectedUserId(pendingChat.maNguoi);
        setIsNewChatModalOpen(true);
        
        // Load danh sách users cho loại đã chọn
        if (pendingChat.loaiNguoi) {
          loadAvailableUsers(pendingChat.loaiNguoi);
        }
      } catch (error) {
        console.error('Error parsing pending chat:', error);
      }
    }
    
    // Poll mỗi 5 giây để cập nhật tin nhắn mới
    const interval = setInterval(() => {
      loadConversations();
      if (selectedConversation) {
        loadMessages(selectedConversation.maCuocTroChuyen);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getUserInfo = () => {
    if (user?.maNongDan) return { maNguoi: user.maNongDan, loaiNguoi: 'nongdan' };
    if (user?.maDaiLy) return { maNguoi: user.maDaiLy, loaiNguoi: 'daily' };
    if (user?.maSieuThi) return { maNguoi: user.maSieuThi, loaiNguoi: 'sieuthi' };
    return null;
  };

  const loadConversations = async () => {
    try {
      const userInfo = getUserInfo();
      if (!userInfo) return;

      const data = await apiService.getConversations(userInfo.maNguoi, userInfo.loaiNguoi);
      setConversations(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      // Không hiển thị lỗi nếu backend chưa sẵn sàng
      setConversations([]);
    }
  };

  const loadMessages = async (maCuocTroChuyen: number) => {
    try {
      setLoading(true);
      const data = await apiService.getMessages(maCuocTroChuyen);
      setMessages(Array.isArray(data) ? data : []);

      // Đánh dấu đã đọc
      const userInfo = getUserInfo();
      if (userInfo) {
        await apiService.markMessagesAsRead(userInfo.maNguoi, userInfo.loaiNguoi, maCuocTroChuyen);
        await loadConversations(); // Refresh để cập nhật số tin nhắn chưa đọc
      }
    } catch (error: any) {
      console.error('Error loading messages:', error);
      message.error('Không thể tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.maCuocTroChuyen);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const userInfo = getUserInfo();
      if (!userInfo) return;

      // Lấy thông tin người nhận từ conversation
      const otherUser = conversations.find(c => c.maCuocTroChuyen === selectedConversation.maCuocTroChuyen);
      if (!otherUser) return;

      // Gửi tin nhắn trong cuộc trò chuyện hiện tại
      await apiService.sendMessage(userInfo.maNguoi, userInfo.loaiNguoi, {
        maCuocTroChuyen: selectedConversation.maCuocTroChuyen,
        maNguoiNhan: 0, // Sẽ được xác định từ cuộc trò chuyện
        loaiNguoiNhan: '',
        noiDung: messageInput.trim(),
      });

      setMessageInput('');
      await loadMessages(selectedConversation.maCuocTroChuyen);
      await loadConversations();
    } catch (error: any) {
      console.error('Error sending message:', error);
      message.error('Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const isMyMessage = (msg: Message) => {
    const userInfo = getUserInfo();
    if (!userInfo) return false;
    return msg.maNguoiGui === userInfo.maNguoi && msg.loaiNguoiGui === userInfo.loaiNguoi;
  };

  const handleStartNewChat = async () => {
    if (!newChatMessage.trim() || !selectedUserId || !selectedUserType) {
      message.warning('Vui lòng chọn người nhận và nhập tin nhắn');
      return;
    }

    try {
      setSending(true);
      const userInfo = getUserInfo();
      if (!userInfo) return;

      await apiService.sendMessage(userInfo.maNguoi, userInfo.loaiNguoi, {
        maNguoiNhan: selectedUserId,
        loaiNguoiNhan: selectedUserType,
        noiDung: newChatMessage.trim(),
      });

      message.success('Đã gửi tin nhắn');
      setIsNewChatModalOpen(false);
      setNewChatMessage('');
      setSelectedUserId(null);
      setSelectedUserType('');
      await loadConversations();
    } catch (error: any) {
      console.error('Error starting new chat:', error);
      message.error('Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const getAvailableUserTypes = () => {
    const userInfo = getUserInfo();
    if (!userInfo) return [];

    // Nông dân có thể nhắn với Đại lý
    if (userInfo.loaiNguoi === 'nongdan') {
      return [{ value: 'daily', label: 'Đại lý' }];
    }
    // Đại lý có thể nhắn với Nông dân và Siêu thị
    if (userInfo.loaiNguoi === 'daily') {
      return [
        { value: 'nongdan', label: 'Nông dân' },
        { value: 'sieuthi', label: 'Siêu thị' },
      ];
    }
    // Siêu thị có thể nhắn với Đại lý
    if (userInfo.loaiNguoi === 'sieuthi') {
      return [{ value: 'daily', label: 'Đại lý' }];
    }
    return [];
  };

  const loadAvailableUsers = async (loaiNguoi: string) => {
    try {
      setLoadingUsers(true);
      const data = await apiService.getAvailableUsers(loaiNguoi);
      setAvailableUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      message.error('Không thể tải danh sách người dùng');
      setAvailableUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUserTypeChange = (value: string) => {
    setSelectedUserType(value);
    setSelectedUserId(null);
    if (value) {
      loadAvailableUsers(value);
    } else {
      setAvailableUsers([]);
    }
  };

  const handleDeleteConversation = async (maCuocTroChuyen: number) => {
    try {
      await apiService.deleteConversation(maCuocTroChuyen);
      message.success('Đã xóa cuộc trò chuyện');
      
      // Reset selected conversation nếu đang xem cuộc trò chuyện bị xóa
      if (selectedConversation?.maCuocTroChuyen === maCuocTroChuyen) {
        setSelectedConversation(null);
        setMessages([]);
      }
      
      // Reload danh sách
      await loadConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      message.error('Không thể xóa cuộc trò chuyện');
    }
  };

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Tin nhắn</h1>
        <p>Trò chuyện với đối tác trong chuỗi cung ứng</p>
      </div>

      <Layout className="chat-layout">
        <Sider width={320} className="chat-sider">
          <div className="conversation-header">
            <h3>Cuộc trò chuyện</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsNewChatModalOpen(true)}
              size="small"
            >
              Mới
            </Button>
          </div>
          <div className="conversation-list">
            {conversations.length === 0 ? (
              <Empty 
                description="Chưa có cuộc trò chuyện nào" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ marginTop: 40 }}
              />
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.maCuocTroChuyen}
                  className={`conversation-item ${selectedConversation?.maCuocTroChuyen === conversation.maCuocTroChuyen ? 'active' : ''}`}
                >
                  <div 
                    style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <Badge count={conversation.soTinNhanChuaDoc} offset={[-5, 5]}>
                      <Avatar 
                        src={conversation.anhDaiDienNguoiKia} 
                        icon={<UserOutlined />}
                        size={48}
                      />
                    </Badge>
                    <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <strong style={{ fontSize: 14 }}>{conversation.tenNguoiKia}</strong>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {dayjs(conversation.ngayCapNhat).fromNow()}
                        </span>
                      </div>
                      <div className="conversation-preview">
                        <div className="last-message">{conversation.tinNhanCuoi || 'Chưa có tin nhắn'}</div>
                      </div>
                    </div>
                  </div>
                  <Popconfirm
                    title="Xóa cuộc trò chuyện"
                    description="Bạn có chắc muốn xóa cuộc trò chuyện này?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      handleDeleteConversation(conversation.maCuocTroChuyen);
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginLeft: 8 }}
                    />
                  </Popconfirm>
                </div>
              ))
            )}
          </div>
        </Sider>

        <Content className="chat-content">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <Avatar 
                  src={selectedConversation.anhDaiDienNguoiKia} 
                  icon={<UserOutlined />}
                  size={40}
                />
                <h3>{selectedConversation.tenNguoiKia}</h3>
              </div>

              <div className="messages-container">
                {loading ? (
                  <div className="loading-container">
                    <Spin />
                  </div>
                ) : messages.length === 0 ? (
                  <Empty description="Chưa có tin nhắn" />
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.maTinNhan}
                        className={`message ${isMyMessage(msg) ? 'my-message' : 'other-message'}`}
                      >
                        <div className="message-content">
                          <div className="message-text">{msg.noiDung}</div>
                          <div className="message-time">{dayjs(msg.ngayGui).format('HH:mm')}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="message-input-container">
                <Input.TextArea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  disabled={sending}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  loading={sending}
                  disabled={!messageInput.trim()}
                >
                  Gửi
                </Button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <Empty description="Chọn một cuộc trò chuyện để bắt đầu" />
            </div>
          )}
        </Content>
      </Layout>

      {/* Modal tạo cuộc trò chuyện mới */}
      <Modal
        title="Tạo cuộc trò chuyện mới"
        open={isNewChatModalOpen}
        onCancel={() => {
          setIsNewChatModalOpen(false);
          setNewChatMessage('');
          setSelectedUserId(null);
          setSelectedUserType('');
        }}
        onOk={handleStartNewChat}
        okText="Gửi tin nhắn"
        cancelText="Hủy"
        confirmLoading={sending}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Chọn loại người nhận:</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn loại người dùng"
            value={selectedUserType || undefined}
            onChange={handleUserTypeChange}
            options={getAvailableUserTypes()}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Chọn người nhận:</label>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn người nhận"
            value={selectedUserId || undefined}
            onChange={setSelectedUserId}
            loading={loadingUsers}
            disabled={!selectedUserType || loadingUsers}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={availableUsers.map(user => ({
              value: user.maNguoi,
              label: `${user.ten}${user.soDienThoai ? ` - ${user.soDienThoai}` : ''}${user.diaChi ? ` (${user.diaChi})` : ''}`,
            }))}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>Tin nhắn:</label>
          <Input.TextArea
            value={newChatMessage}
            onChange={(e) => setNewChatMessage(e.target.value)}
            placeholder="Nhập tin nhắn đầu tiên..."
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default TinNhan;
