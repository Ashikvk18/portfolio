%-------------------------
% Resume in Latex
% Author : Ashik Dey Rupak
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{{#1 \vspace{-2pt}}}
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
  \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

% FIX: force real bullet points (•)
\setlist[itemize]{label=\textbullet}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{document}

%----------HEADING----------
\begin{center}
  \textbf{\Huge \scshape Ashik Dey Rupak} \\ \vspace{1pt}
  \small Kirksville, MO $|$ 660-229-3900 $|$
  \href{mailto:ashikdeyrupak18@gmail.com}{\underline{ashikdeyrupak03@gmail.com}} $|$
  \href{https://linkedin.com/in/ashik-dey-rupak-2ba866229}{\underline{linkedin.com/in/ashik-dey-rupak-2ba866229}} $|$
  \href{https://github.com/Ashikvk18}{\underline{github.com/Ashikvk18}}
\end{center}

%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
  \resumeSubheading
    {Truman State University}{Kirksville, MO}
    {B.S.\ in Computer and Information Science (GPA: 4.0), Expected Dec.\ 2026}{Aug.\ 2022 -- Dec.\ 2026}
\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\section{Experience}
\resumeSubHeadingListStart

\resumeSubheading
  {Zuckerman Sustainability Software Engineering Intern}{Jan.\ 2026 -- May\ 2026}
    {Truman State University -- Office of Sustainability}{Kirksville, MO}
    \resumeItemListStart
      \resumeItem{Improved a production web application by debugging broken routes, refactoring navigation structure, and optimizing page layouts.}
      \resumeItem{Implemented accessibility improvements (alt text, semantic headings, contrast fixes) following WCAG guidelines.}
      \resumeItem{Worked with TreePlotter and structured tree inventory data to support interactive mapping and reporting features.}
      \resumeItem{Improved site maintainability by refactoring page structure and standardizing reusable components across the site.}
    \resumeItemListEnd

  \resumeSubheading
    {Computational Chemistry Research Assistant}{Jul.\ 2025 -- Present}
    {A.T.\ Still University (ATSU)}{Kirksville, MO}
    \resumeItemListStart
      \resumeItem{Built and analyzed computational models for large-scale scientific datasets using Linux-based workflows.}
      \resumeItem{Prepared and processed datasets for simulation and analysis pipelines.}
      \resumeItem{Automated analysis pipelines using scripts and cluster tools to manage large experimental datasets.}
    \resumeItemListEnd

  \resumeSubheading
  {Joseph Baldwin Academy (JBA) Student Preceptor}{Jul.\ 2023 -- Jul.\ 2025}
  {Truman State University}{Kirksville, MO}
  \resumeItemListStart
    \resumeItem{Explained and demonstrated core programming concepts in C++ and JavaScript, emphasizing problem-solving, control flow, and modular code.}
  \resumeItemListEnd

\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\section{Projects}
\resumeSubHeadingListStart

  \resumeProjectHeading
    {\textbf{Truman Rec Center AI Website} $|$ \emph{Flask, REST APIs, JWT, HTML/CSS, JavaScript}}{Apr.\ 2025}
    \resumeItemListStart
      \resumeItem{Engineered a full-stack web platform with an AI chatbot, fitness calculators, and personalized workout and nutrition generation.}
      \resumeItem{Built secure REST APIs using Flask and JWT authentication to protect user data and CRUD operations.}
      \resumeItem{Integrated responsive UI components and an AI chatbot powered by the Anthropic API.}
    \resumeItemListEnd

  \resumeProjectHeading
    {\textbf{Green Pulse -- TigerHacks (Hackers' Choice Award)} $|$ \emph{Java, Spring Boot, Firebase, MySQL}}{Oct.\ 2024}
    \resumeItemListStart
      \resumeItem{Developed an AI-based plant disease detection add-on using image analysis and backend services.}
      \resumeItem{Implemented secure data handling and cloud integration using Firebase and MySQL.}
    \resumeItemListEnd

  \resumeProjectHeading
    {\textbf{ChemExplorer -- TruHacks (1st Prize)} $|$ \emph{Kotlin, Android Studio}}{Feb.\ 2024}
    \resumeItemListStart
      \resumeItem{Built an Android application to make chemical data accessible through an intuitive mobile interface.}
      \resumeItem{Designed and implemented core application logic and UI flows in Kotlin for efficient data exploration.}
    \resumeItemListEnd

\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\section{Technical Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
  \small{\item{
    \textbf{Languages}{: Python, C++, Java, JavaScript, HTML/CSS} \\
    \textbf{Frameworks \& Tools}{: Flask, Node.js, Express, Spring Boot, Git/GitHub, Linux, Firebase, MySQL, WordPress} \\
    \textbf{Data \& ML}{: Pandas, NumPy, Matplotlib, XGBoost, PyTorch, TensorFlow} \\
    \textbf{Concepts}{: REST APIs, API Design, JWT Authentication, Full-Stack Development, Responsive Design}
  }}
\end{itemize}

%-----------HONORS-----------
\section{Honors \& Awards}
\resumeSubHeadingListStart
  \resumeSubheading
    {Bronze Medalist -- American Invitational Mathematics Examination (AIME)}{2022}
    {National}{}
  \resumeSubheading
    {Presidential Award}{2022 -- 2026}
    {Truman State University}{Kirksville, MO}
  \resumeSubheading
    {John Merrill Computer Science Foundation Scholarship}{2024}
    {Truman State University}{Kirksville, MO}
\resumeSubHeadingListEnd

\end{document}
