import { useState } from 'react';
import {
  HiOutlineSparkles,
  HiOutlineMapPin,
  HiOutlineCurrencyRupee,
  HiOutlineBuildingOffice,
  HiOutlineUsers,
  HiOutlineSun,
  HiOutlineArrowPath,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const directionOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const typeOptions = ['Independent House', 'Villa', 'Duplex', 'Row House', 'Apartment', 'Farm House'];
const climateOptions = ['Tropical', 'Hot & Dry', 'Warm & Humid', 'Composite', 'Cold', 'Temperate'];

export default function ProjectForm({ onSubmit, initialData, userId }) {
  const [formData, setFormData] = useState(initialData || {
    plotSize: '',
    budget: '',
    location: '',
    floors: '1',
    direction: 'North',
    type: 'Independent House',
    familySize: '',
    climate: 'Composite',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Navigate immediately — no Firestore save that could hang
    onSubmit(formData);
  };

  return (
    <div className="project-form">
      <div className="project-form__header">
        <h2 className="project-form__title">
          Create Your Construction Plan
        </h2>
        <p className="project-form__sub">
          Fill in your project details and let AI generate a comprehensive plan.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="project-form__grid">
          <div>
            <label className="project-form__field-label">
              <HiOutlineBuildingOffice style={{ color: 'var(--clr-primary)' }} />
              Plot Size (sq ft) *
            </label>
            <input
              type="text"
              name="plotSize"
              value={formData.plotSize}
              onChange={handleChange}
              className="project-form__input"
              placeholder="e.g., 1200"
              required
            />
          </div>

          <div>
            <label className="project-form__field-label">
              <HiOutlineCurrencyRupee style={{ color: 'var(--clr-accent)' }} />
              Budget (₹) *
            </label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="project-form__input"
              placeholder="e.g., 30,00,000"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="project-form__grid">
          <div>
            <label className="project-form__field-label">
              <HiOutlineMapPin style={{ color: 'var(--clr-primary)' }} />
              Location (City) *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="project-form__input"
              placeholder="e.g., Bangalore"
              required
            />
          </div>

          <div>
            <label className="project-form__field-label">
              <HiOutlineBuildingOffice style={{ color: 'var(--clr-accent)' }} />
              Number of Floors *
            </label>
            <select
              name="floors"
              value={formData.floors}
              onChange={handleChange}
              className="project-form__select"
              required
            >
              {['1', '2', '3', '4', '5'].map(f => (
                <option key={f} value={f}>{f === '1' ? 'Ground Floor Only' : `G + ${parseInt(f) - 1}`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="project-form__grid">
          <div>
            <label className="project-form__field-label">
              <HiOutlineArrowPath style={{ color: 'var(--clr-primary)' }} />
              Plot Direction (Facing)
            </label>
            <select
              name="direction"
              value={formData.direction}
              onChange={handleChange}
              className="project-form__select"
            >
              {directionOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="project-form__field-label">
              <HiOutlineBuildingOffice style={{ color: 'var(--clr-accent)' }} />
              Construction Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="project-form__select"
              required
            >
              {typeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4 */}
        <div className="project-form__grid">
          <div>
            <label className="project-form__field-label">
              <HiOutlineUsers style={{ color: 'var(--clr-primary)' }} />
              Family Size
            </label>
            <input
              type="number"
              name="familySize"
              value={formData.familySize}
              onChange={handleChange}
              className="project-form__input"
              placeholder="e.g., 4"
              min="1"
              max="20"
            />
          </div>

          <div>
            <label className="project-form__field-label">
              <HiOutlineSun style={{ color: 'var(--clr-accent)' }} />
              Climate Zone
            </label>
            <select
              name="climate"
              value={formData.climate}
              onChange={handleChange}
              className="project-form__select"
            >
              {climateOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="project-form__field-label">
            <HiOutlineDocumentText />
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="project-form__textarea"
            placeholder="Any specific requirements, preferences, or constraints..."
            rows={4}
          />
        </div>

        {/* Submit */}
        <div className="project-form__submit">
          <button
            type="submit"
            disabled={saving}
            className="btn btn--green"
          >
            {saving ? (
              <>
                <div className="project-form__spinner"></div>
                Generating...
              </>
            ) : (
              <>
                <HiOutlineSparkles />
                Generate AI Construction Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
