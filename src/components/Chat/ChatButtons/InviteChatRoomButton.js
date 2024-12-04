import React, { useState } from 'react';

const InviteChatRoomButton = () => {
  const [loading, setLoading] = useState(false);
  return <button disabled={loading}>{loading ? '···' : '초대'}</button>;
};

export default InviteChatRoomButton;
