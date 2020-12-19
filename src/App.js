import React, { useState, useEffect, useCallback } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';

import './app.css';

const firebaseConfig = {
  apiKey: "AIzaSyBKSp7Ju1iWtciHyyVGcuW09eM7-dzFnEE",
  authDomain: "firechat-8e180.firebaseapp.com",
  databaseURL: "https://firechat-8e180.firebaseio.com",
  projectId: "firechat-8e180",
  storageBucket: "firechat-8e180.appspot.com",
  messagingSenderId: "254452523356",
  appId: "1:254452523356:web:fcf38c4c2d106cd79fa199",
  measurementId: "G-8T5D7WHWXP"
};

firebase.initializeApp(firebaseConfig);

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const onMessagesChanged = useCallback(snap => {
    const data = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));

    console.log('snapshot', data);
    setMessages(data);
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('messages').onSnapshot(onMessagesChanged);

    return () => unsubscribe();
  }, []);

  const sendMessage = useCallback(
    () => {
      try{
        firebase.firestore().collection('messages').add({
          user: user,
          message: message
        });
      } catch (Exception){
        console.log("Algo de errado não está certo");
      } finally {
        setMessage('');
      }
        
    }, [user, message]
  )

  return(
    <div>
      <div className="user">
        <input 
        className="user-name"
        value={user}
        onChange={e => setUser(e.target.value)}
        placeholder="Nome de usuário"
        />
      </div>
      <div className="container">
      <h1>Mensagens</h1>
        {
          messages.map(message => {
            return (
              <div>
              <strong>{message.user}: </strong>
              {message.message}
              </div>
              
            )
          })
        }
        {/* aqui vai ficar armazenada toda conversa na tela */}
      </div>
      <div className="dialog">
        <input 
          className="message-for-seding"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Mensagem"
        />
        <button 
          className="btn-send"
          onClick={sendMessage}
          >Send</button>
      </div>
    </div>
  )

}
export default App;
