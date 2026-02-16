export default function Home() {
  const ChevronIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col gap-6">
      {/* <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
          End-User Interaction Techniques
        </h1>
        <div className="flex flex-col gap-3">
          <a
            href="/d1-1"
            className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center"
          >
            <span className="font-medium">
              Customization Widgets (Phone Store)
            </span>
            <ChevronIcon />
          </a>
          <a
            href="/d1-2"
            className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center"
          >
            <span className="font-medium">
              Exchanging Specifications (Menu Site)
            </span>
            <ChevronIcon />
          </a>
          <a
            href="/d2-3/sophistication"
            className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center"
          >
            <span className="font-medium">Semantic Zooming (Thesaurus)</span>
            <ChevronIcon />
          </a>
          <a
            href="/d2-2"
            className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center"
          >
            <span className="font-medium">
              Direct Manipulation (Soccer Match)
            </span>
            <ChevronIcon />
          </a>
        </div>
      </div> */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
          Gallery of Real-World Examples
        </h1>
        <div className="flex flex-col gap-3">
          <a
            href="/d2-1"
            className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center"
          >
            <span className="font-medium">
              Example 1: AT&T Shop Phones Page
            </span>
            <ChevronIcon />
          </a>
          <a
            href="/d2-2"
            className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center"
          >
            <span className="font-medium">Example 2: Soccer Match Players</span>
            <ChevronIcon />
          </a>
          <a
            href="/d2-3/sophistication"
            className="p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-300 flex items-center"
          >
            <span className="font-medium">
              Example 3: Merriam Webster Thesaurus
            </span>
            <ChevronIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
