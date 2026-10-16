(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const button = document.getElementById('copy-note');
  if (button) {
    button.addEventListener('click', async function () {
      const note = 'Portfolio checklist: add professional email; add GitHub profile URL; verify project descriptions and ownership; add screenshots/demo links; update skill levels; test mobile layout; proofread before publishing.';
      try {
        await navigator.clipboard.writeText(note);
        button.textContent = 'Checklist copied ✓';
      } catch (error) {
        button.textContent = 'Checklist: add email, GitHub, screenshots, demos';
      }
    });
  }
  const launcher = document.getElementById('chat-launcher');
  const panel = document.getElementById('portfolio-chat');
  const close = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  function setChatOpen(open) {
    panel.classList.toggle('open', open);
    launcher.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  }
  function addMessage(text, role) {
    const message = document.createElement('div');
    message.className = 'chat-message ' + role;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }
  function answerQuestion(question) {
    const q = question.toLowerCase();
    if (/navigato|zoo|capstone|ar navigation/.test(q)) return 'NavigatoAR is Mark’s capstone project in development. It explores AR-assisted navigation and visit tracking for Manila Zoological and Botanical Garden, helping visitors find exhibits, learn about animals, and keep track of visited places. The current project uses Unity 6, C#, and UI Toolkit; Laravel is being considered for backend features.';
    if (/contribut|role|responsib|what did mark do|his part|my part/.test(q)) return 'Mark’s confirmed NavigatoAR contributions include Unity UI and screen layouts, login and signup screens, an interactive map with zooming and dragging, search and screen navigation, C# scripting and debugging, Git/GitHub collaboration, and research paper/documentation work. NavigatoAR is still in development, so this list describes Mark’s contributions and does not mean every planned app feature is complete.';
    if (/map|zoom|drag|search|location|dashboard/.test(q)) return 'Mark has worked on the NavigatoAR Unity UI Toolkit map interface, including map zooming and dragging, search, and screen navigation. These are interface and interaction features; full AR guidance, GPS behavior, backend integration, and other planned features should be described as in development until they are implemented and tested.';
    if (/login|sign.?up|registration|account/.test(q)) return 'Mark has worked on the login and signup screens for NavigatoAR using Unity UI Toolkit. Account persistence and backend authentication should be treated as planned or in development unless separately implemented and tested.';
    if (/c#|script|debug/.test(q)) return 'Mark has worked on C# scripts and debugging for NavigatoAR, alongside Unity UI Toolkit screens and map interactions. The project is ongoing, so the portfolio should not imply that every feature is finished.';
    if (/git|github|version control|collaborat|team/.test(q)) return 'Mark has worked with Git and GitHub for NavigatoAR team collaboration and project version control. The repository is https://github.com/Rnszz/NavigatoAR.02.';
    if (/research|paper|documentation|thesis|manuscript/.test(q)) return 'Mark has contributed to the NavigatoAR research paper and documentation as part of the capstone work. The project combines research and software development, and its implementation is still in progress.';
    if (/unity|ui toolkit|ux|interface|frontend/.test(q)) return 'Mark has been working with Unity 6 and UI Toolkit, including UXML layouts, USS styling, screen navigation, and interactive dashboard/map behavior. He prefers learning the reasoning behind each step and gradually adopting maintainable project structure.';
    if (/skill|technolog|program|language|stack|code/.test(q)) return 'The portfolio lists C#, Unity, UI Toolkit, Java, HTML, CSS, JavaScript, PHP/Laravel, SQL, MySQL, SQL Server, Git, and GitHub. These represent a mix of technologies Mark has worked with and areas he is developing, rather than a claim of expert-level proficiency in every tool.';
    if (/payroll|business system|database project/.test(q)) return 'The portfolio describes a Payroll Management System focused on employee records, attendance, salary calculations, benefits, CRUD operations, validation, and database interactions. Ask Mark for more details about the implementation.';
    if (/learn|goal|improv|approach|process|work ethic/.test(q)) return 'Mark’s stated approach is to understand the user problem first, keep interface, application logic, and data responsibilities clear, test real workflows, and collaborate using Git and GitHub. He is continuing to grow through practical projects.';
    if (/about|who is mark|background|student|experience/.test(q)) return 'Mark Renz is presented here as a student developer exploring web and application development. His portfolio focuses on practical projects, clean interfaces, problem-solving, and learning through implementation. More personal details can be added when Mark provides them.';
    if (/contact|email|github|hire|internship|opportunit/.test(q)) return 'The portfolio links to Mark’s NavigatoAR GitHub repository: https://github.com/Rnszz/NavigatoAR.02. A professional email and other contact details have not been configured in this demo yet.';
    if (/hello|hi\b|hey\b/.test(q)) return 'Hello! You can ask about Mark’s projects, listed skills, learning approach, or GitHub repository.';
    return 'I don’t have that detail in the portfolio information yet. Try asking about NavigatoAR, Mark’s skills, the Payroll Management System, his development approach, or GitHub. We can expand my knowledge base with verified information before connecting a real AI service.';
  }
  if (launcher && panel && close && messages && form && input) {
    launcher.addEventListener('click', function () { setChatOpen(!panel.classList.contains('open')); });
    close.addEventListener('click', function () { setChatOpen(false); launcher.focus(); });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      addMessage(question, 'user');
      addMessage(answerQuestion(question), 'bot');
      input.value = '';
      input.focus();
    });
    panel.querySelectorAll('[data-question]').forEach(function (suggestion) {
      suggestion.addEventListener('click', function () {
        const question = suggestion.getAttribute('data-question');
        addMessage(question, 'user');
        addMessage(answerQuestion(question), 'bot');
      });
    });
  }
})();
