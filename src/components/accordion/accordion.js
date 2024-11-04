export default function Accordion({ header, text, id, className = "" }) {
  return (
    <div className={`accordion-item ${className}`}> {/* Include additional className */}
      <h2 className="accordion-header">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${id}`}  // Make sure the target starts with '#'
          aria-expanded="true"
          aria-controls={`collapse${id}`}   // Dynamically target the correct ID
        >
          {header}
        </button>
      </h2>
      <div
        id={`collapse${id}`}                // Unique ID for each collapse
        className="accordion-collapse collapse" // "show" to make it expanded by default
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          {text}
        </div>
      </div>
    </div>
  );
}
