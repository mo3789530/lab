import { Home } from "@/pages/Home";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// 一時的なNewMessageコンポーネント
// const NewMessage = () => (
//   <div className="container mx-auto py-8 px-4">
//     <h1 className="text-2xl font-bold mb-6">新しいメッセージ</h1>
//     <p>このページは開発中です</p>
// //   </div>
// );

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <nav className="bg-gray-100 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Osaka Lunch Board</h1>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;