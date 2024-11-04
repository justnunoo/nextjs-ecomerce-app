export function applyScrollAnimation() {
    const elements = document.querySelectorAll(".animate-up");
  
    function checkIfInView() {
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
  
        if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0) {
          setTimeout(() => {
            element.classList.add('in-view');
          }, 100);
        }
      });
    }
  
    window.addEventListener("scroll", checkIfInView);
    checkIfInView(); // Check on initial load
  }
  