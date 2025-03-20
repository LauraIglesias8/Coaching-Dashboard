import React, { useState, useEffect } from "react";
import { FaClock, FaCalendarCheck, FaClipboardList, FaExclamationCircle } from "react-icons/fa";

const statusIcons = {
  Planned: <FaClipboardList className="text-yellow-500" />,
  Scheduled: <FaClock className="text-blue-500" />,
  Conducted: <FaCalendarCheck className="text-green-500" />,
  Pending: <FaExclamationCircle className="text-red-500" />,
};

export default function InstructorDashboard() {
  const [instructors, setInstructors] = useState([]);
  const [newInstructorName, setNewInstructorName] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("instructors");
    if (storedData) {
      setInstructors(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("instructors", JSON.stringify(instructors));
  }, [instructors]);

  const updateInstructor = (id, field, value) => {
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, [field]: value } : inst))
    );
  };

  const toggleEdit = (id) => {
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, isEditing: !inst.isEditing } : inst))
    );
  };

  const addInstructor = () => {
    if (!newInstructorName.trim()) return;
    const newInstructor = {
      id: instructors.length + 1,
      name: newInstructorName,
      lastCoached: "",
      comments: "",
      score: 0,
      status: "Planned",
      isEditing: false,
    };
    setInstructors([...instructors, newInstructor].sort((a, b) => a.name.localeCompare(b.name)));
    setNewInstructorName("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Instructor Dashboard</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter instructor name"
          value={newInstructorName}
          onChange={(e) => setNewInstructorName(e.target.value)}
          className="border p-2 rounded mr-2 w-64"
        />
        <button
          onClick={addInstructor}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Instructor
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instructors.map((inst) => (
          <div
            key={inst.id}
            className="relative bg-white p-4 rounded-lg shadow-md border border-gray-300"
          >
            <div className="absolute top-2 right-2 text-xl">{statusIcons[inst.status]}</div>
            <h2 className="text-lg font-semibold">{inst.name}</h2>
            {!inst.isEditing ? (
              <>
                <p className="text-gray-600">Last Coached: {inst.lastCoached || "N/A"}</p>
                <p className="text-gray-600">Score: {inst.score}</p>
                <p className="text-gray-600">Comments: {inst.comments || "No comments"}</p>
                <p className="text-gray-600">Status: {inst.status}</p>
              </>
            ) : (
              <>
                <input
                  type="date"
                  value={inst.lastCoached}
                  onChange={(e) => updateInstructor(inst.id, "lastCoached", e.target.value)}
                  className="border p-1 rounded w-full my-1"
                />
                <input
                  type="number"
                  value={inst.score}
                  onChange={(e) => updateInstructor(inst.id, "score", parseInt(e.target.value) || 0)}
                  className="border p-1 rounded w-full my-1"
                />
                <textarea
                  value={inst.comments}
                  onChange={(e) => updateInstructor(inst.id, "comments", e.target.value)}
                  className="border p-1 rounded w-full my-1"
                />
                <select
                  value={inst.status}
                  onChange={(e) => updateInstructor(inst.id, "status", e.target.value)}
                  className="border p-1 rounded w-full my-1"
                >
                  {Object.keys(statusIcons).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </>
            )}
            <button
              onClick={() => toggleEdit(inst.id)}
              className={`mt-2 w-full text-white py-1 rounded ${
                inst.isEditing ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {inst.isEditing ? "Save" : "Edit"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
