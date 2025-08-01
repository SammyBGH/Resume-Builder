import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import universities from '../data/universities';
import '../styles/Form.css';

const questions = [
  { name: 'fullName', label: 'Full Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone Number', type: 'tel' },
  { name: 'skills', label: 'List your skills', type: 'text' },
  { name: 'languages', label: 'Languages', type: 'text' },
  { name: 'proficiency', label: 'Set Proficiency Levels', type: 'dropdown' },
  { name: 'program', label: 'Program (e.g., BSc Computer Science)', type: 'text' },
  { name: 'school', label: 'School / University Name', type: 'text' },
  { name: 'experience', label: 'Work Experience', type: 'textarea' },
  { name: 'projects', label: 'Projects', type: 'textarea' },
  { name: 'certifications', label: 'Certifications', type: 'textarea' },
];

const proficiencyLevels = ['Native', 'Fluent', 'Intermediate', 'Beginner'];

const skillsList = [
  'JavaScript', 'React', 'Node.js', 'Python', 'CSS', 'HTML', 'MongoDB', 'SQL',
  'Git', 'Docker', 'Figma', 'C++', 'Java', 'TypeScript', 'Express', 'Django',
];

const languageSuggestions = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Russian', 'Portuguese'
];

const Form = ({ onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    skills: [],
    languages: [],
    program: '',
    school: '',
    experience: '',
    projects: '',
    certifications: '',
  });

  // Inputs
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [schoolInput, setSchoolInput] = useState('');

  // Filtered lists
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);

  // Highlighted index for navigation
  const [highlightedSkill, setHighlightedSkill] = useState(-1);
  const [highlightedLang, setHighlightedLang] = useState(-1);
  const [highlightedSchool, setHighlightedSchool] = useState(-1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  let debounceTimer;
  const debounce = (callback, delay = 200) => {
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  // ✅ API Base URL (changes automatically in production)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  // ✅ Real-time validation
  const validateInput = (name, value) => {
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidationError(emailRegex.test(value) ? '' : 'Enter a valid email address');
    }
    if (name === 'phone') {
      const phoneRegex = /^[0-9]{7,15}$/;
      setValidationError(phoneRegex.test(value) ? '' : 'Enter a valid phone number');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = async () => {
    if (validationError) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: formData.skills.join(', ') }),
        });
        if (!response.ok) throw new Error('Failed to generate summary');
        const data = await response.json();
        const summary = data.summary;
        onSubmit({ ...formData, summary });
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

  /* ----------------------- SKILLS HANDLING ----------------------- */
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
    setSkillInput('');
    setFilteredSkills([]);
    setHighlightedSkill(-1);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Backspace' && skillInput === '' && formData.skills.length > 0) {
      const updated = [...formData.skills];
      updated.pop();
      setFormData({ ...formData, skills: updated });
    }
    if (filteredSkills.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedSkill((prev) => (prev + 1) % filteredSkills.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedSkill((prev) =>
          prev <= 0 ? filteredSkills.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = highlightedSkill >= 0 ? filteredSkills[highlightedSkill] : skillInput.trim();
        if (selected) addSkill(selected);
      }
    } else if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  /* ----------------------- LANGUAGES HANDLING ----------------------- */
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
        languages: [...formData.languages, { name: language, proficiency: 'Fluent' }],
      });
    }
    setLanguageInput('');
    setFilteredLanguages([]);
    setHighlightedLang(-1);
  };

  const handleLanguageKeyDown = (e) => {
    if (e.key === 'Backspace' && languageInput === '' && formData.languages.length > 0) {
      const updated = [...formData.languages];
      updated.pop();
      setFormData({ ...formData, languages: updated });
    }
    if (filteredLanguages.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedLang((prev) => (prev + 1) % filteredLanguages.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedLang((prev) =>
          prev <= 0 ? filteredLanguages.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = highlightedLang >= 0 ? filteredLanguages[highlightedLang] : languageInput.trim();
        if (selected) addLanguage(selected);
      }
    } else if (e.key === 'Enter' && languageInput.trim() !== '') {
      e.preventDefault();
      addLanguage(languageInput.trim());
    }
  };

  /* ----------------------- SCHOOL HANDLING ----------------------- */
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
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedSchool((prev) => (prev + 1) % filteredSchools.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedSchool((prev) =>
          prev <= 0 ? filteredSchools.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = highlightedSchool >= 0
          ? filteredSchools[highlightedSchool].name
          : schoolInput.trim();
        if (selected) handleSchoolSelect(selected);
      }
    } else if (e.key === 'Enter' && schoolInput.trim() !== '') {
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
            className={`dot ${index === currentQuestion ? 'active' : ''} ${index < currentQuestion ? 'completed' : ''}`}
          ></div>
        ))}
      </div>

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

          {/* Inputs handled as before */}
          {/* (no changes to skills/language dropdown rendering) */}

          {validationError && <p className="error">{validationError}</p>}
          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">Generating summary...</p>}

          <div className="form-navigation">
            {currentQuestion > 0 && <button className="prev-btn" onClick={handlePrev}>Previous</button>}
            <button className="next-btn" onClick={handleNext} disabled={loading || validationError}>
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Form;
