import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import universities from "../data/universities";
import programs from "../data/programs"; // ✅ Import programs list
import skillsList from "../data/skills";
import countries from "../data/countries";
import "../styles/Form.css";

const questions = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone Number", type: "tel", inputMode: "numeric" },
  {
    name: "country",
    label: "Country",
    type: "text",
  },
  {
    name: "city",
    label: "City / Zipcode",
    type: "text",
  },

  {
    name: "skills",
    label: "List your skills(Hit ENTER after every skill)",
    type: "text",
  },
  { name: "languages", label: "Languages", type: "text" },
  { name: "proficiency", label: "Set Proficiency Levels", type: "dropdown" },
  {
    name: "program",
    label: "Program (e.g., BSc Computer Science)",
    type: "text",
  },
  { name: "school", label: "School / University Name", type: "text" },
  { name: "experience", label: "Work Experience", type: "textarea" },
  { name: "projects", label: "Projects", type: "textarea" },
  { name: "certifications", label: "Certifications", type: "textarea" },
];

const proficiencyLevels = ["Native", "Fluent", "Intermediate", "Beginner"];

const languageSuggestions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Arabic",
  "Russian",
  "Portuguese",
];

const Form = ({ onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: [],
    languages: [],
    program: "",
    school: "",
    experience: "",
    projects: "",
    certifications: "",
  });

  // Inputs
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [programInput, setProgramInput] = useState("");
  const [schoolInput, setSchoolInput] = useState("");

  // Filtered lists
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);

  // Highlighted index for navigation
  const [highlightedSkill, setHighlightedSkill] = useState(-1);
  const [highlightedLang, setHighlightedLang] = useState(-1);
  const [highlightedProgram, setHighlightedProgram] = useState(-1);
  const [highlightedSchool, setHighlightedSchool] = useState(-1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [dotError, setDotError] = useState("");

  // Countries
  // ✅ State variables
  const [countryInput, setCountryInput] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [highlightedCountry, setHighlightedCountry] = useState(-1);

  // ✅ Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("resumeFormData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed);
      setProgramInput(parsed.program || "");
      setSchoolInput(parsed.school || "");
      setSkillInput("");
      setLanguageInput("");
    }
  }, []);

  // ✅ Auto-save form data whenever it changes
  useEffect(() => {
    localStorage.setItem("resumeFormData", JSON.stringify(formData));
  }, [formData]);

  // Auto-hide dot error after 3 seconds
  useEffect(() => {
    if (dotError) {
      const timer = setTimeout(() => {
        setDotError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dotError]);

  const debounceTimer = useRef(null);
  const debounce = (callback, delay = 200) => {
    return (...args) => {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  // ✅ Validation
  const validateInput = (name, value) => {
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidationError(
        emailRegex.test(value) ? "" : "Enter a valid email address"
      );
    }
    if (name === "phone") {
      const phoneRegex = /^[0-9]{7,15}$/;
      setValidationError(
        phoneRegex.test(value) ? "" : "Enter a valid phone number"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = async () => {
    if (validationError) return;

    // ✅ Auto-add skill if user typed one but didn't press Enter
    if (current.name === "skills" && skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }

    // ✅ Auto-add language if user typed one but didn't press Enter
    if (current.name === "languages" && languageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        languages: [
          ...prev.languages,
          { name: languageInput.trim(), proficiency: "Fluent" },
        ],
      }));
      setLanguageInput("");
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      setError(null);
      try {
        const API_BASE =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${API_BASE}/api/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skills: formData.skills.join(", ") }),
        });
        if (!response.ok) throw new Error("Failed to generate summary");
        const data = await response.json();
        const summary = data.summary;
        onSubmit({ ...formData, summary });
        localStorage.removeItem("resumeFormData");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  /* ====================== SKILLS ====================== */
  const handleSkillInputChange = debounce((value) => {
    const results = skillsList.filter(
      (skill) =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !formData.skills.includes(skill)
    );
    setFilteredSkills(results);
    setHighlightedSkill(results.length > 0 ? 0 : -1);
  });

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput("");
    setFilteredSkills([]);
    setHighlightedSkill(-1);
  };

  const handleSkillKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      skillInput === "" &&
      formData.skills.length > 0
    ) {
      const updated = [...formData.skills];
      updated.pop();
      setFormData({ ...formData, skills: updated });
    }
    if (filteredSkills.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedSkill((prev) => (prev + 1) % filteredSkills.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedSkill((prev) =>
          prev <= 0 ? filteredSkills.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected =
          highlightedSkill >= 0
            ? filteredSkills[highlightedSkill]
            : skillInput.trim();
        if (selected) addSkill(selected);
      }
    } else if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  /* ====================== COUNTRIES ====================== */

  // ✅ Handle input changes (filter countries in real time)
  const handleCountryInputChange = (value) => {
    setCountryInput(value);
    if (value.trim() === "") {
      setFilteredCountries([]);
      return;
    }
    const matches = countries.filter((c) =>
      c.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCountries(matches);
    setHighlightedCountry(-1);
  };

  // ✅ Handle selection (via click or Enter key)
  const handleCountrySelect = (country) => {
    setFormData({ ...formData, country });
    setCountryInput(country);
    setFilteredCountries([]); // ✅ Hide suggestions after selection
  };

  // ✅ Keyboard navigation (Arrow Up/Down + Enter)
  const handleCountryKeyDown = (e) => {
    if (filteredCountries.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCountry((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCountry((prev) =>
        prev > 0 ? prev - 1 : filteredCountries.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedCountry >= 0) {
        handleCountrySelect(filteredCountries[highlightedCountry]);
      } else if (filteredCountries.length === 1) {
        handleCountrySelect(filteredCountries[0]);
      }
    }
  };

  /* ====================== LANGUAGES ====================== */
  const handleLanguageInputChange = debounce((value) => {
    const results = languageSuggestions.filter(
      (lang) =>
        lang.toLowerCase().includes(value.toLowerCase()) &&
        !formData.languages.some((l) => l.name === lang)
    );
    setFilteredLanguages(results);
    setHighlightedLang(results.length > 0 ? 0 : -1);
  });

  const addLanguage = (language) => {
    if (!formData.languages.some((l) => l.name === language)) {
      setFormData({
        ...formData,
        languages: [
          ...formData.languages,
          { name: language, proficiency: "Fluent" },
        ],
      });
    }
    setLanguageInput("");
    setFilteredLanguages([]);
    setHighlightedLang(-1);
  };

  const handleLanguageKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      languageInput === "" &&
      formData.languages.length > 0
    ) {
      const updated = [...formData.languages];
      updated.pop();
      setFormData({ ...formData, languages: updated });
    }
    if (filteredLanguages.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedLang((prev) => (prev + 1) % filteredLanguages.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedLang((prev) =>
          prev <= 0 ? filteredLanguages.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected =
          highlightedLang >= 0
            ? filteredLanguages[highlightedLang]
            : languageInput.trim();
        if (selected) addLanguage(selected);
      }
    } else if (e.key === "Enter" && languageInput.trim() !== "") {
      e.preventDefault();
      addLanguage(languageInput.trim());
    }
  };

  /* ====================== PROGRAM ====================== */
  const handleProgramInputChange = debounce((value) => {
    const results = programs.filter((p) =>
      p.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPrograms(results);
    setHighlightedProgram(results.length > 0 ? 0 : -1);
  });

  const handleProgramSelect = (programName) => {
    setFormData({ ...formData, program: programName });
    setProgramInput(programName);
    setFilteredPrograms([]);
    setHighlightedProgram(-1);
  };

  const handleProgramKeyDown = (e) => {
    if (filteredPrograms.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedProgram((prev) => (prev + 1) % filteredPrograms.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedProgram((prev) =>
          prev <= 0 ? filteredPrograms.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected =
          highlightedProgram >= 0
            ? filteredPrograms[highlightedProgram]
            : programInput.trim();
        if (selected) handleProgramSelect(selected);
      }
    } else if (e.key === "Enter" && programInput.trim() !== "") {
      e.preventDefault();
      handleProgramSelect(programInput.trim());
    }
  };

  /* ====================== SCHOOL ====================== */
  const handleSchoolInputChange = debounce((value) => {
    const results = universities.filter(
      (u) =>
        u.name.toLowerCase().includes(value.toLowerCase()) ||
        (u.nickname && u.nickname.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredSchools(results);
    setHighlightedSchool(results.length > 0 ? 0 : -1);
  });

  const handleSchoolSelect = (schoolName) => {
    setFormData({ ...formData, school: schoolName });
    setSchoolInput(schoolName);
    setFilteredSchools([]);
    setHighlightedSchool(-1);
  };

  const handleSchoolKeyDown = (e) => {
    if (filteredSchools.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedSchool((prev) => (prev + 1) % filteredSchools.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedSchool((prev) =>
          prev <= 0 ? filteredSchools.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected =
          highlightedSchool >= 0
            ? filteredSchools[highlightedSchool].name
            : schoolInput.trim();
        if (selected) handleSchoolSelect(selected);
      }
    } else if (e.key === "Enter" && schoolInput.trim() !== "") {
      e.preventDefault();
      handleSchoolSelect(schoolInput.trim());
    }
  };

  const current = questions[currentQuestion];

  return (
    <div className="form-container">
      {/* ✅ Step Progress Dots */}
      <div className="progress-dots">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentQuestion ? "active" : ""} ${
              index < currentQuestion ? "completed" : ""
            }`}
            onClick={() => {
              if (
                index > currentQuestion &&
                !formData[questions[currentQuestion].name]
              ) {
                setDotError(
                  "⚠ Please complete this step before skipping ahead"
                );
                return;
              }
              setDotError("");
              setCurrentQuestion(index);
            }}
            title={`Go to Step ${index + 1}`}
            style={{ cursor: "pointer" }}
          ></div>
        ))}
      </div>

      {dotError && <p className="dot-nav-error">{dotError}</p>}

      <div className="form-progress">
        Step {currentQuestion + 1} of {questions.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.name}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="form-question"
        >
          <label htmlFor={current.name}>{current.label}</label>

          {/* ================== LOCATION (COUNTRY + CITY/ZIP) ================== */}
          {current.name === "country" ? (
            <div className="skills-input">
              <input
                type="text"
                name="country"
                id="country"
                value={countryInput}
                onChange={(e) => handleCountryInputChange(e.target.value)}
                onKeyDown={handleCountryKeyDown}
                placeholder="Type or select your country"
                autoComplete="off"
              />
              {filteredCountries.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredCountries.map((country, index) => (
                    <li
                      key={index}
                      className={
                        highlightedCountry === index ? "highlighted" : ""
                      }
                      onMouseDown={() => handleCountrySelect(country)}
                    >
                      {country}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.name === "city" ? (
            <div className="skills-input">
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Enter your city / zipcode"
              />
            </div>
          ) : current.name === "skills" ? (
            <div className="skills-input">
              <div
                className="skills-wrapper"
                onClick={() => document.getElementById("skill-input").focus()}
              >
                {formData.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      className="remove-skill"
                      onClick={() => {
                        const updated = [...formData.skills];
                        updated.splice(index, 1);
                        setFormData({ ...formData, skills: updated });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  id="skill-input"
                  type="text"
                  className="skill-type-input"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    handleSkillInputChange(e.target.value);
                  }}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill..."
                />
              </div>
              {filteredSkills.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredSkills.map((skill, index) => (
                    <li
                      key={index}
                      className={
                        highlightedSkill === index ? "highlighted" : ""
                      }
                      onMouseDown={() => addSkill(skill)}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.name === "languages" ? (
            <div className="skills-input">
              <div
                className="skills-wrapper"
                onClick={() => document.getElementById("lang-input").focus()}
              >
                {formData.languages.map((lang, index) => (
                  <div key={index} className="skill-tag">
                    {lang.name}
                    <button
                      type="button"
                      className="remove-skill"
                      onClick={() => {
                        const updated = [...formData.languages];
                        updated.splice(index, 1);
                        setFormData({ ...formData, languages: updated });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  id="lang-input"
                  type="text"
                  className="skill-type-input"
                  value={languageInput}
                  onChange={(e) => {
                    setLanguageInput(e.target.value);
                    handleLanguageInputChange(e.target.value);
                  }}
                  onKeyDown={handleLanguageKeyDown}
                  placeholder="Type a language..."
                />
              </div>
              {filteredLanguages.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredLanguages.map((lang, index) => (
                    <li
                      key={index}
                      className={highlightedLang === index ? "highlighted" : ""}
                      onMouseDown={() => addLanguage(lang)}
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.name === "proficiency" ? (
            <div>
              {formData.languages.length > 0 ? (
                formData.languages.map((lang, index) => (
                  <div key={index} className="language-proficiency">
                    <span>{lang.name}:</span>
                    <select
                      value={lang.proficiency}
                      onChange={(e) => {
                        const updated = [...formData.languages];
                        updated[index].proficiency = e.target.value;
                        setFormData({ ...formData, languages: updated });
                      }}
                    >
                      {proficiencyLevels.map((level, i) => (
                        <option key={i} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              ) : (
                <p>No languages selected yet.</p>
              )}
            </div>
          ) : current.name === "program" ? (
            <div className="skills-input">
              <input
                type="text"
                name="program"
                id="program"
                value={programInput}
                onChange={(e) => {
                  setProgramInput(e.target.value);
                  handleProgramInputChange(e.target.value);
                }}
                onKeyDown={handleProgramKeyDown}
                placeholder="Search or type your program"
              />
              {filteredPrograms.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredPrograms.map((prog, index) => (
                    <li
                      key={index}
                      className={
                        highlightedProgram === index ? "highlighted" : ""
                      }
                      onMouseDown={() => handleProgramSelect(prog)}
                    >
                      {prog}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.name === "school" ? (
            <div className="skills-input">
              <input
                type="text"
                name="school"
                id="school"
                value={schoolInput}
                onChange={(e) => {
                  setSchoolInput(e.target.value);
                  handleSchoolInputChange(e.target.value);
                }}
                onKeyDown={handleSchoolKeyDown}
                placeholder="Search or type your school"
              />
              {filteredSchools.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredSchools.map((uni, index) => (
                    <li
                      key={index}
                      className={
                        highlightedSchool === index ? "highlighted" : ""
                      }
                      onMouseDown={() => handleSchoolSelect(uni.name)}
                    >
                      {uni.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.type === "textarea" ? (
            <textarea
              name={current.name}
              id={current.name}
              value={formData[current.name] || ""}
              onChange={handleInputChange}
              rows="5"
            />
          ) : (
            <input
              type={current.type}
              inputMode={current.inputMode || undefined}
              name={current.name}
              id={current.name}
              value={formData[current.name] || ""}
              onChange={handleInputChange}
              autoComplete={current.name === "email" ? "email" : "off"}
            />
          )}

          {validationError && (
            <p className="validation-error">{validationError}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="form-navigation">
        {currentQuestion > 0 && (
          <button onClick={handlePrev} className="prev-btn">
            Previous
          </button>
        )}
        <button onClick={handleNext} className="next-btn" disabled={loading}>
          {currentQuestion === questions.length - 1
            ? loading
              ? "Generating..."
              : "Submit"
            : "Next"}
        </button>
      </div>
      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          Generating your summary, please wait...
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Form;
