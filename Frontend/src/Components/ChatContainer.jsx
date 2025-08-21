import { useEffect,useRef} from "react";
import {useMessageStore} from "../Stores/useMessageStore.js"
import { useAuthStore } from "../Stores/useAuthStore.js";
import MessageSkeleton from "./skeletons/MessageSkeletons.jsx";
import { formatMessageTime } from "../Lib/Utils.js";
import ChatHeader from "./ChatHeader.jsx";
import ChatInput from "./ChatInput.jsx";


const ChatContainer = () => {
   
  const {messages,selectedUser,isMessagesLoading,getMessages,subscribeToMessages,unsubscribeToMessage} = useMessageStore();
  const {userAuth} = useAuthStore();
  const messageEndRef = useRef(null);
  
  useEffect(()=>{
    if (selectedUser?._id) {
    getMessages(selectedUser._id);
    subscribeToMessages();
  }
     return () => unsubscribeToMessage();
  },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeToMessage]);
 
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton/>
        <ChatInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">

      <ChatHeader/>
       {/**This belongs to messages section*/}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message,index) => (
          <div
            key={index}
            className={`chat ${message?.SenderId === userAuth?._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message?.SenderId === userAuth?._id
                      ? userAuth?.profilepic || "/avatar.png"
                      : selectedUser?.profilepic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message?.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message?.Image && (
                <img
                  src={message?.Image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message?.Text && <p>{message?.Text}</p>}
            </div>
          </div>
        ))}
      </div>

      <ChatInput/>
      
    </div>
  )
}

export default ChatContainer
