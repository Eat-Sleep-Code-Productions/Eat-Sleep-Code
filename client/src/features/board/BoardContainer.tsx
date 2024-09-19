import { useState } from "react";
import BoardRow from "./components/BoardRow";
import AddBoardRowPopup from "./components/AddBoardRowPopup";
import {
  useGetAllProblemsQuery,
  useGetBoardDataQuery,
  useAddBoardRowMutation,
} from "./BoardContainerApiSlice";
import type { LeetcodeProblem } from "./boardTypes";
import type React from "react";

// Renders a TailwindCSS table that contains BoardRow components
export default function BoardContainer() {
  // ***** Pulls leetcode problems from RTK Query *****
  const { data: problems } = useGetAllProblemsQuery();

  // ***** Local state to track popup visibility *****
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // Toggle popup and resets input field if closed
  const togglePopup = () => {
    if (isPopupOpen) {
      setSearchTerm("");
      setSelectedProblem("");
    }
    setIsPopupOpen(!isPopupOpen);
  };

  // ***** Local state to track the input field *****
  const [searchTerm, setSearchTerm] = useState("");
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  // Filter problems based on the input field
  const filteredProblems = problems?.filter((problem: LeetcodeProblem) =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ***** Local state to track the selected leetcode problem from dropdown *****
  const [selectedProblem, setSelectedProblem] = useState("");
  // RTK Query POST request for new leetcode question entries
  const [addBoardRow] = useAddBoardRowMutation();
  // Function that will post new leetcode problem entry for user
  const handleSubmit = async () => {
    // Find the selected problem in the list of problems by its id
    const problem = problems?.find(
      (p: LeetcodeProblem) => p.id === selectedProblem,
    );

    // If the problem does not exist, alert the user
    if (!problem) {
      alert("Please select a valid problem.");
      return;
    }
    // Attempts to send the post request
    try {
      await addBoardRow({ problem_id: problem.id }).unwrap();
      // Forces RTK Query to refetch user data
      refetchRows();
      // Close the popup after successful entry
      togglePopup();
    } catch (error) {
      // Catches any errors while posting
      console.error("Error adding new problem:", error);
    }
  };

  const {
    data: rows,
    error: rowsError,
    isLoading: rowsIsLoading,
    refetch: refetchRows,
  } = useGetBoardDataQuery();
  console.log(rows);

  if (rowsIsLoading) {
    return <div>Loading...</div>;
  }

  if (rowsError) {
    return <div className="text-red-500">Error fetching data</div>;
  }

  // ***** Returned React Component *****
  return (
    <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-4x1">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            My Board
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Keep track of all the leetcode problem's you've done!
          </p>
        </div>

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={togglePopup}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            New Entry
          </button>
        </div>
      </div>

      <AddBoardRowPopup isOpen={isPopupOpen} onClose={togglePopup}>
        <h2 className="text-lg font-semibold mb-4 flex justify-center">
          Select a Problem from LeetCode
        </h2>

        <div className="mb-4 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Search Problem
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a problem..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>

        {searchTerm && (
          <div className="overflow-y-auto max-h-48">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Problem Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Difficulty
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProblems?.map((problem) => (
                  <tr
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem.id)} // Store problem.id instead of title
                    className={`cursor-pointer hover:bg-gray-100 ${selectedProblem === problem.id ? "bg-blue-100" : ""}`}
                  >
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {problem.title}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end w-full mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Problem
          </button>
        </div>
      </AddBoardRowPopup>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Passed
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible" />
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Problem
                    <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200" />
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Type
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible" />
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Difficulty
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible" />
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    # of Completions
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible" />
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Last Updated
                    <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible" />
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {rows?.problems?.map((row) => (
                  <BoardRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
