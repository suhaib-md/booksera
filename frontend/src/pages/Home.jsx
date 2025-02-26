import { useNavigate } from "react-router-dom";

function Home() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to BooksEra 📚</h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          Discover books tailored to your interests, join virtual book clubs, and explore AI-powered summaries!
        </p>
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700">
          Explore Books
        </button>
      </div>
    );
  }
  


export default Home;
