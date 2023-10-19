import { useRef, useState } from 'react';

const Messenger = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const [connected, setConnected] = useState(false);
  const socket = useRef(null);

  function connect() {
    socket.current = new WebSocket('ws://cacf-46-98-150-96.ngrok.io');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = event => {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
    };
    socket.current.onclose = () => {
      setConnected(false);
      console.log('Socket closed');
    };
    socket.current.onerror = () => {
      console.log('Socket error');
    };
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message',
    };
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            placeholder="Enter name"
          />
          <button onClick={connect}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="messages">
          {messages.map(mess => (
            <div key={mess.id}>
              {mess.event === 'connection' ? (
                <div className="connection_message">
                  User {mess.username} connected
                </div>
              ) : (
                <div className="message">
                  {mess.username}. {mess.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messenger;