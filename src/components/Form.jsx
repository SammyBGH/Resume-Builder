import React, { useState } from 'react';
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

  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [schoolInput, setSchoolInput] = useState('');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: formData.skills.join(', ') }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate summary');
        }

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
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // ====================== SKILLS ======================
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    setFilteredSkills(
      skillsList.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !formData.skills.includes(skill)
      )
    );
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
    setSkillInput('');
    setFilteredSkills([]);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const handleSkillSelect = (skill) => {
    addSkill(skill);
  };

  const handleSkillRemove = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({ ...formData, skills: updatedSkills });
  };

  // ====================== LANGUAGES ======================
  const handleLanguageInputChange = (e) => {
    const value = e.target.value;
    setLanguageInput(value);
    setFilteredLanguages(
      languageSuggestions.filter(
        (lang) =>
          lang.toLowerCase().includes(value.toLowerCase()) &&
          !formData.languages.some((l) => l.name === lang)
      )
    );
  };

  const addLanguage = (language) => {
    if (!formData.languages.some((l) => l.name === language)) {
      setFormData({
        ...formData,
        languages: [...formData.languages, { name: language, proficiency: 'Fluent' }],
      });
    }
    setLanguageInput('');
    setFilteredLanguages([]);
  };

  const handleLanguageSelect = (language) => {
    addLanguage(language);
  };

  const handleLanguageRemove = (index) => {
    const updated = [...formData.languages];
    updated.splice(index, 1);
    setFormData({ ...formData, languages: updated });
  };

  const handleProficiencyChange = (index, value) => {
    const updated = [...formData.languages];
    updated[index].proficiency = value;
    setFormData({ ...formData, languages: updated });
  };

  // ====================== SCHOOL SUGGESTIONS ======================
  const handleSchoolInputChange = (e) => {
    const value = e.target.value;
    setSchoolInput(value);
    setFormData({ ...formData, school: value });

    setFilteredSchools(
      universities.filter(
        (u) =>
          u.name.toLowerCase().includes(value.toLowerCase()) ||
          (u.nickname && u.nickname.toLowerCase().includes(value.toLowerCase()))
      )
    );
  };

  const handleSchoolSelect = (schoolName) => {
    setFormData({ ...formData, school: schoolName });
    setSchoolInput(schoolName);
    setFilteredSchools([]);
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

          {current.name === 'skills' ? (
            <div className="skills-input">
              <div className="skills-wrapper" onClick={() => document.getElementById('skill-input').focus()}>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill}
                    <button type="button" className="remove-skill" onClick={() => handleSkillRemove(index)}>×</button>
                  </div>
                ))}
                <input
                  id="skill-input"
                  type="text"
                  className="skill-type-input"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill..."
                />
              </div>
              {filteredSkills.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredSkills.map((skill, index) => (
                    <li key={index} onMouseDown={() => handleSkillSelect(skill)}>
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.name === 'languages' ? (
            <div className="skills-input">
              <div className="skills-wrapper" onClick={() => document.getElementById('lang-input').focus()}>
                {formData.languages.map((lang, index) => (
                  <div key={index} className="skill-tag">
                    {lang.name}
                    <button type="button" className="remove-skill" onClick={() => handleLanguageRemove(index)}>×</button>
                  </div>
                ))}
                <input
                  id="lang-input"
                  type="text"
                  className="skill-type-input"
                  value={languageInput}
                  onChange={handleLanguageInputChange}
                  placeholder="Type a language..."
                />
              </div>
              {filteredLanguages.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredLanguages.map((lang, index) => (
                    <li key={index} onMouseDown={() => handleLanguageSelect(lang)}>
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.name === 'proficiency' ? (
            <div>
              {formData.languages.length > 0 ? (
                formData.languages.map((lang, index) => (
                  <div key={index} className="language-proficiency">
                    <span>{lang.name}:</span>
                    <select
                      value={lang.proficiency}
                      onChange={(e) => handleProficiencyChange(index, e.target.value)}
                    >
                      {proficiencyLevels.map((level, i) => (
                        <option key={i} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                ))
              ) : (
                <p>No languages selected yet.</p>
              )}
            </div>
          ) : current.name === 'school' ? (
            <div className="skills-input">
              <input
                type="text"
                name="school"
                id="school"
                value={schoolInput}
                onChange={handleSchoolInputChange}
                placeholder="Type your school/university..."
                autoComplete="off"
              />
              {filteredSchools.length > 0 && (
                <ul className="skill-suggestions">
                  {filteredSchools.map((u, index) => (
                    <li key={index} onMouseDown={() => handleSchoolSelect(u.name)}>
                      {u.name} {u.nickname ? `(${u.nickname})` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : current.type === 'textarea' ? (
            <textarea
              name={current.name}
              id={current.name}
              value={formData[current.name]}
              onChange={handleInputChange}
              rows="5"
            />
          ) : (
            <input
              type={current.type}
              name={current.name}
              id={current.name}
              value={formData[current.name]}
              onChange={handleInputChange}
            />
          )}

          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">Generating summary...</p>}

          <div className="form-navigation">
            {currentQuestion > 0 && <button className="prev-btn" onClick={handlePrev}>Previous</button>}
            <button className="next-btn" onClick={handleNext} disabled={loading}>
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Form;
