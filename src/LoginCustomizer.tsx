import { useEffect } from 'react';

export function LoginCustomizer() {
  useEffect(() => {
    // Function to customize the login form
    const customizeForm = () => {
      // Change email placeholder to username and remove email validation
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      if (emailInput) {
        emailInput.placeholder = 'Username';
        emailInput.type = 'text';
        
        // Remove HTML5 email validation
        emailInput.removeAttribute('pattern');
        emailInput.removeAttribute('title');
        
        // Override the input validation
        emailInput.addEventListener('input', function(e) {
          const input = e.target as HTMLInputElement;
          // Clear any validation messages
          input.setCustomValidity('');
          
          // Add @lawtown.local to make it a valid email for the backend
          const username = input.value;
          if (username && !username.includes('@')) {
            // Store the original username for display
            input.dataset.originalValue = username;
            // Set the actual value to a fake email for backend compatibility
            input.value = `${username}@lawtown.local`;
            // But show only the username in the UI
            setTimeout(() => {
              if (input.dataset.originalValue) {
                input.value = input.dataset.originalValue;
              }
            }, 0);
          }
        });

        // Handle form submission to convert username to email format
        const form = emailInput.closest('form');
        if (form) {
          form.addEventListener('submit', function(e) {
            const usernameInput = form.querySelector('input[name="email"]') as HTMLInputElement;
            if (usernameInput && !usernameInput.value.includes('@')) {
              usernameInput.value = `${usernameInput.value}@lawtown.local`;
            }
          });
        }
      }

      // Hide signup/signin toggle
      const toggleContainer = document.querySelector('.auth-form-container form > div:last-child');
      if (toggleContainer) {
        (toggleContainer as HTMLElement).style.display = 'none';
      }

      // Hide the "or" divider
      const dividers = document.querySelectorAll('.auth-form-container hr');
      dividers.forEach(divider => {
        (divider as HTMLElement).style.display = 'none';
      });

      // Hide the "or" text and its container
      const orContainers = document.querySelectorAll('.auth-form-container div');
      orContainers.forEach(container => {
        const span = container.querySelector('span');
        if (span && span.textContent?.trim() === 'or') {
          (container as HTMLElement).style.display = 'none';
        }
      });

      // Hide anonymous login button
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        if (button.textContent?.toLowerCase().includes('anonymous')) {
          button.style.display = 'none';
        }
      });

      // Force the form to always be in signIn mode
      const form = document.querySelector('.auth-form-container form');
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
          submitButton.textContent = 'Sign In';
        }
      }
    };

    // Run customization immediately and on DOM changes
    customizeForm();
    
    // Set up observer to handle dynamic content
    const observer = new MutationObserver(customizeForm);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
