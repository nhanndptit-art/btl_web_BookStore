window.showToast = window.showToast || function(message, type ='success'){
    const toastBox = document.getElementById('toast-box');
    if (!toastBox)
    return;
    const toastConfigs ={
        'success': {
            color:'#2ecc71',
            icon:'<i class="ph-fill ph-check-circle"></i>',
            title:'Success'
        },
        'warning': {
            color:'#a6b3da',
            icon:'<i class="ph-fill ph-warning-circle"></i>',
            title:'Just a note ^_^'
        },
        'remove':{
            color:'#ff4d4f',
            icon:'<i class="ph-fill ph-x-circle"></i>',
            title:'Removed successfully T_T'
        }
    };
    const config = toastConfigs[type] || toastConfigs['success'];
    const toast = document.createElement('div');
    toast.classList.add('toast-custom');
    toast.style.setProperty('--toast-color', config.color);
    toast.innerHTML =`
            <div class="toast-icon">${config.icon}</div>
            <div class="toast-content">
                ${config.title ? `<span class="toast-title">${config.title}</span>` : ''}
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close"><i class="ph ph-x"></i></button>
        `;
    toastBox.appendChild(toast);
    setTimeout(() => {toast.classList.add('show');}, 10);
    const timeout = setTimeout(() => { removeToast(toast);}, 4000);
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timeout);
        removeToast(toast);
    });
    

    function removeToast(t){
        t.classList.remove('show');
        setTimeout(() => t.remove(), 500);
    }
};
