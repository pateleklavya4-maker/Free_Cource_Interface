// JavaScript for Learn & Build Platform

document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Course selection functionality
    const courseButtons = document.querySelectorAll('.btn-primary[data-course]');
    courseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const course = button.getAttribute('data-course');
            alert(`You've selected the ${course.replace('-', ' ')} course! Check your dashboard to start learning.`);

            // Switch to dashboard tab
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            document.querySelector('.tab[data-tab="dashboard"]').classList.add('active');
            document.getElementById('dashboard').classList.add('active');

            // Update dashboard with course info
            updateDashboardCourse(course);
        });
    });

    // Code editor functionality
    const htmlCode = document.getElementById('html-code');
    const cssCode = document.getElementById('css-code');
    const jsCode = document.getElementById('js-code');
    const outputPreview = document.getElementById('output-preview');
    const consoleLog = document.getElementById('console-log');
    const runCodeBtn = document.getElementById('run-code');
    const resetCodeBtn = document.getElementById('reset-code');

    // Update preview in real-time
    function updatePreview() {
        const html = htmlCode.value;
        const css = `<style>${cssCode.value}</style>`;
        const js = `<script>${jsCode.value}<\/script>`;

        // Create a complete HTML document for the preview
        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                ${css}
            </head>
            <body>
                ${html}
                ${js}
            </body>
            </html>
        `;

        // Update the preview iframe
        outputPreview.srcdoc = fullHTML;

        // Clear console and try to run JS
        consoleLog.textContent = 'Code executed...';
        try {
            // We can't actually execute JS in the preview for security, but we can show it ran
            consoleLog.textContent += '\n✓ HTML rendered\n✓ CSS applied\n✓ JavaScript loaded';
        } catch (e) {
            consoleLog.textContent += `\n⚠ Warning: ${e.message}`;
        }
    }

    // Update preview when any code changes
    [htmlCode, cssCode, jsCode].forEach(element => {
        element.addEventListener('input', updatePreview);
        element.addEventListener('keyup', updatePreview);
    });

    // Run code button (manual trigger)
    runCodeBtn.addEventListener('click', () => {
        updatePreview();
        // Add pulse animation to button
        runCodeBtn.classList.add('pulse');
        setTimeout(() => runCodeBtn.classList.remove('pulse'), 500);
    });

    // Reset code button
    resetCodeBtn.addEventListener('click', () => {
        htmlCode.value = '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
        cssCode.value = '/* Add your CSS styles here */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}';
        jsCode.value = '// Add your JavaScript code here\nconsole.log(\'Hello, World!\');';
        updatePreview();
    });

    // Initialize preview
    updatePreview();

    // Registration form functionality
    const registrationForm = document.getElementById('registration-form');
    const registrationMessage = document.getElementById('registration-message');

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
            showMessage(registrationMessage, 'Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(registrationMessage, 'Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage(registrationMessage, 'Password must be at least 6 characters long', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage(registrationMessage, 'Passwords do not match', 'error');
            return;
        }

        // Simulate successful registration
        showMessage(registrationMessage, `Account created successfully, ${name}! Welcome to Learn & Build.`, 'success');

        // Store user data in localStorage (simulation)
        const userData = {
            name: name,
            email: email,
            registeredAt: new Date().toISOString()
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Update welcome message
        const welcomeMessage = document.querySelector('.welcome-message span');
        welcomeMessage.textContent = `Welcome, ${name}! Start your coding journey today.`;

        // Reset form
        registrationForm.reset();

        // Switch to dashboard after successful registration
        setTimeout(() => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            document.querySelector('.tab[data-tab="dashboard"]').classList.add('active');
            document.getElementById('dashboard').classList.add('active');
        }, 1500);
    });

    // Upload form functionality
    const uploadForm = document.getElementById('upload-form');
    const uploadMessage = document.getElementById('upload-message');
    const projectsList = document.getElementById('projects-list');
    const projectFileInput = document.getElementById('project-file');
    const fileUploadArea = document.querySelector('.upload-preview');

    // Handle file drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#4361ee';
        fileUploadArea.style.background = '#f0f9ff';
    });

    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#e2e8f0';
        fileUploadArea.style.background = '#f8fafc';
    });

    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#e2e8f0';
        fileUploadArea.style.background = '#f8fafc';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            projectFileInput.files = files;
            updateFilePreview(files);
        }
    });

    // Handle file selection
    projectFileInput.addEventListener('change', () => {
        updateFilePreview(projectFileInput.files);
    });

    function updateFilePreview(files) {
        if (files.length === 0) {
            fileUploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag & drop files here or click to browse</p>
                <p class="small-text">Supported: HTML, CSS, JS, images, zip files</p>
            `;
            return;
        }

        let fileList = '<strong>Selected files:</strong><br>';
        Array.from(files).forEach((file, index) => {
            if (index >= 3) { // Show max 3 files
                fileList += `... and ${files.length - 3} more files`;
                return;
            }
            fileList += `• ${file.name} (${formatFileSize(file.size)})<br>`;
        });

        fileUploadArea.innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
            <p>${fileList}</p>
        `;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('project-title').value.trim();
        const description = document.getElementById('project-description').value.trim();
        const tags = document.getElementById('project-tags').value.trim();
        const files = projectFileInput.files;

        if (!title || !description) {
            showMessage(uploadMessage, 'Please fill in project title and description', 'error');
            return;
        }

        if (files.length === 0) {
            showMessage(uploadMessage, 'Please select at least one file to upload', 'error');
            return;
        }

        // Simulate upload success
        showMessage(uploadMessage, 'Project uploaded successfully!', 'success');

        // Add project to dashboard
        addProjectToDashboard({
            title: title,
            description: description,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            files: Array.from(files).map(file => file.name),
            uploadedAt: new Date().toISOString()
        });

        // Reset form
        uploadForm.reset();
        projectFileInput.value = '';
        updateFilePreview([]);

        // Switch to dashboard to show new project
        setTimeout(() => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            document.querySelector('.tab[data-tab="dashboard"]').classList.add('active');
            document.getElementById('dashboard').classList.add('active');
        }, 1500);
    });

    // Helper function to show messages
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = `form-message ${type}`;
        element.style.display = 'block';

        // Hide after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to update dashboard with course info
    function updateDashboardCourse(course) {
        // This would typically update dashboard stats
        // For now, we'll just show a welcome message
        const welcomeMessage = document.querySelector('.welcome-message span');
        welcomeMessage.textContent = `Welcome back! You're now learning ${course.replace('-', ' ')}. Start building!`;
    }

    // Helper function to add project to dashboard
    function addProjectToDashboard(project) {
        // Check if there are existing projects
        const noProjectsMsg = document.querySelector('.no-projects');
        if (noProjectsMsg) {
            noProjectsMsg.style.display = 'none';
        }

        // Create project card
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const tagsHTML = project.tags.length > 0 ?
            `<div class="tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>` :
            '';

        projectCard.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            ${tagsHTML}
            <div class="project-meta">
                <small><i class="fas fa-cloud-upload-alt"></i> ${project.files.length} files</small>
                <small><i class="fas fa-calendar"></i> ${new Date(project.uploadedAt).toLocaleDateString()}</small>
            </div>
        `;

        // Add to projects list
        projectsList.prepend(projectCard);

        // Update project count in dashboard
        updateProjectCount();
    }

    // Helper function to update project count
    function updateProjectCount() {
        const projectCount = document.querySelectorAll('.project-card').length;
        const projectsStat = document.querySelectorAll('.stat-card')[1]; // Second stat card
        if (projectsStat) {
            projectsStat.querySelector('p').textContent = `${projectCount} project${projectCount !== 1 ? 's' : ''}`;
        }
    }

    // Initialize with any saved user data
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
        try {
            const userData = JSON.parse(savedUserData);
            const welcomeMessage = document.querySelector('.welcome-message span');
            welcomeMessage.textContent = `Welcome back, ${userData.name}! Continue your coding journey.`;
        } catch (e) {
            console.log('Error parsing user data:', e);
        }
    }

    // Initialize with any saved projects
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        try {
            const projects = JSON.parse(savedProjects);
            projects.forEach(project => addProjectToDashboard(project));
        } catch (e) {
            console.log('Error parsing projects data:', e);
        }
    }

    // Add some visual flair on load
    document.querySelectorAll('.course-icon').forEach(icon => {
        icon.style.animation = 'pulse 3s infinite';
    });

    // Handle keyboard shortcuts for accessibility
    document.addEventListener('keydown', function (e) {
        // Ctrl+Enter to run code
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            runCodeBtn.click();
        }

        // Escape to clear forms
        if (e.key === 'Escape') {
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab.id === 'editor') {
                htmlCode.value = '';
                cssCode.value = '';
                jsCode.value = '';
                updatePreview();
            }
        }
    });

    // Add hover effects to course cards
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add focus outlines for accessibility
    document.querySelectorAll('button, input, textarea, .tab').forEach(element => {
        element.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function () {
            this.style.outline = 'none';
        });
    });
});

// CSS Variable helper for JS (since we can't directly access CSS variables in older browsers)
function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName);
}
// Set CSS variable for use in JS
document.documentElement.style.setProperty('--primary-color', '#4361ee');
document.documentElement.style.setProperty('--secondary-color', '#3f37c9');
document.documentElement.style.setProperty('--accent-color', '#4cc9f0');
document.documentElement.style.setProperty('--success-color', '#4ade80');
document.documentElement.style.setProperty('--warning-color', '#fbbf24');
document.documentElement.style.setProperty('--danger-color', '#f87171');
document.documentElement.style.setProperty('--dark-color', '#1e293b');
document.documentElement.style.setProperty('--light-color', '#f8fafc');
document.documentElement.style.setProperty('--gray-color', '#64748b');