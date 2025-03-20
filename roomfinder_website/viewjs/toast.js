

// toast message handler
export function showToast(message, type = 'info', options = {}) {
  const toastContainer = document.getElementById('toast-container');
  
  // check multiple toast
  const existingToast = toastContainer.querySelector(`.toast.${type}`);
  if (existingToast) {
      return;  
  }

  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.classList.add(type);  
  
  // confirmation msg
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('toast-message');
  messageContainer.textContent = message;
  toast.appendChild(messageContainer);

  // button options
  if (options.showButtons) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('toast-buttons');
      
      // confirm button
      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Confirm';
      confirmBtn.classList.add('confirm-btn');
      confirmBtn.addEventListener('click', () => {
          if (options.onConfirm) options.onConfirm();
          toast.classList.remove('show');
      });
      
      // cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.classList.add('cancel-btn');
      cancelBtn.addEventListener('click', () => {
          if (options.onCancel) options.onCancel();
          toast.classList.remove('show');
      });
      
      buttonContainer.appendChild(confirmBtn);
      buttonContainer.appendChild(cancelBtn);
      toast.appendChild(buttonContainer);
  }
  
  // create toast element
  toastContainer.appendChild(toast);

  // toast intro
  setTimeout(() => {
      toast.classList.add('show');
  }, 100);

  // toast outro
  setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
          toast.remove();
      }, 250); 
  }, 2500); 
}
