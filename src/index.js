import './components/manageDOM.js'
import './components/inputEditItemStyle.css';

// Function to disable autocomplete/suggestions on inputs
function disableAutocomplete() {
    document.querySelectorAll('input').forEach(input => {
        input.setAttribute('autocomplete', 'off');
    });
}
// Call function to disable autocomplete on initial inputs
disableAutocomplete();
// Event delegation to handle dynamically added inputs
document.addEventListener('focusin', function(event) {
    const target = event.target;
    if (target.matches('input')) {
        target.setAttribute('autocomplete', 'off');
    }
});