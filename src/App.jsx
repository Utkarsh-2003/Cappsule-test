import React, { useState } from "react";

const App = () => {
  const [query, setQuery] = useState("");
  const [selectedForms, setSelectedForms] = useState({}); // State to track the selected form for each salt
  const [results, setResults] = useState({
    medicineSuggestions: [],
    saltSuggestions: [],
  });

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFormSelect = (form, index) => {
    setSelectedForms({ ...selectedForms, [index]: form });
  };

  const handleSearch = async () => {
    if (query.trim() === "") return;
    try {
      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${query}&pharmacyIds=1,2,3`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.data);
        console.log(data.data.saltSuggestions); // Assuming the API returns an object with medicineSuggestions and saltSuggestions arrays
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5 text-center">Cappsule web development test</h2>
      <div className="row justify-content-center mt-4">
        <div className="col-lg-6">
          <div className="input-group rounded-pill shadow p-2">
            <span
              className="input-group-text bg-white border-0"
              id="search-addon"
            >
              <i className="bi bi-search fs-5"></i>
            </span>
            <input
              type="text"
              name="search"
              id="medicine"
              className="form-control border-0"
              placeholder="Type your medicine name here"
              value={query}
              onChange={handleInputChange}
            />
            <button
              className="btn rounded-pill"
              type="button"
              onClick={handleSearch}
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
      <hr className="mt-5" />
      <div className="results mt-4">
        {results.saltSuggestions.length > 0 ? (
          <div className="row">
            {results.saltSuggestions.map((salt, index) => (
              <div key={index} className="col-md-12 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body d-flex justify-content-between">
                    <div>
                      <p className="card-text">
                        <strong>Form:</strong>{" "}
                        <span className="form-container">
                          {Object.keys(salt.salt_forms_json).map(
                            (form, formIndex) => (
                              <span
                                key={formIndex}
                                className={`form-item mx-1 p-1 border rounded${
                                  selectedForms[index] === form
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => handleFormSelect(form, index)}
                                style={{ cursor: "pointer" }}
                              >
                                {form}
                              </span>
                            )
                          )}
                        </span>
                      </p>
                      {/* Display strength and packaging based on selected form */}
                      {selectedForms[index] &&
                        salt.salt_forms_json[selectedForms[index]] && (
                          <>
                            <p className="card-text">
                              <strong>Strength:</strong>{" "}
                              {Object.keys(
                                salt.salt_forms_json[selectedForms[index]]
                              ).join(", ") || "N/A"}
                            </p>
                            <p className="card-text">
                              <strong>Packing:</strong>{" "}
                              {Object.entries(
                                salt.salt_forms_json[selectedForms[index]]
                              ).map(([strength, packings]) =>
                                Object.keys(packings).map(
                                  (packing, packingIndex) => (
                                    <span
                                      key={packingIndex}
                                      className="badge bg-secondary me-1 mb-1"
                                    >
                                      {packing}
                                    </span>
                                  )
                                )
                              )}
                            </p>
                          </>
                        )}
                    </div>
                    <div className="text-left">
                      <h5 className="card-title">{salt.salt}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          query && <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default App;
