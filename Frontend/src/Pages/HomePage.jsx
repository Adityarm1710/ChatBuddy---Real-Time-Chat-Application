import Sidebar from "../Components/Sidebar.jsx";
import ChatContainer from "../Components/ChatContainer.jsx";
import NoChatContainer from "../Components/NoChatContainer.jsx";
import { useMessageStore } from "../Stores/useMessageStore.js";

const HomePage = () => {
  const {selectedUser} = useMessageStore();
  return (
   <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar/>
            {!selectedUser ? <NoChatContainer /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
