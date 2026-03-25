import './style.css'

// DATA STRUCTURE FOR BILINGUAL CONTENT
const siteData = {
  en: {
    hero: {
      subtitle: "Digital Systems & Growth Specialist",
      summary: "Digital Systems & Growth Specialist at the intersection of engineering, automation, and revenue. I build scalable web applications, AI workflows, and high-performance digital ecosystems that drive measurable growth."
    },
    titles: {
      nav_skills: "Skills",
      nav_experience: "Experience",
      nav_projects: "Projects",
      skills_title: "Technical & Professional Skills",
      experience_title: "Professional Experience",
      projects_title: "Key Projects",
      tech_visual_title: "Technologies & Platforms",
      stack_title: "Technical Stack",
      edu_title: "Education & Experiences",
      comp_title: "Core Competencies",
      footer_text: "All Rights Reserved."
    },
    skills: [
      { name: "React & TypeScript", level: "Expert", score: 5 },
      { name: "UI/UX & Web Design", level: "Expert", score: 5 },
      { name: "Webflow & Shopify Development", level: "Expert", score: 5 },
      { name: "Vercel & CI/CD Deployment", level: "Advanced", score: 4 },
      { name: "API Integration", level: "Expert", score: 5 },
      { name: "Full Stack Web & Software Development", level: "Advanced", score: 4 },
      { name: "Supabase / Databases", level: "Expert", score: 5 },
      { name: "AI & Automation (Claude Code)", level: "Advanced", score: 4 },
      { name: "Dashboard & Data Analytics (Sheets, Airtable)", level: "Advanced", score: 4 },
      { name: "Complex Software Construction", level: "Advanced", score: 4 },
      { name: "CRM Management (GoHighLevel, Notion)", level: "Expert", score: 5 },
      { name: "Revenue Operations / Meta & Google Ads", level: "Advanced", score: 4 },
      { name: "SEO & Digital Strategy", level: "Advanced", score: 4 },
      { name: "Video / 3D Visualization", level: "Advanced", score: 4 },
      { name: "Bilingual (English / Spanish)", level: "Native", score: 5 }
    ],
    experience: [
      {
        title: "CEO & Founder",
        company: "Universa Agency — Miami, FL",
        date: "2024 – Present",
        desc: [
          "Lead a performance-driven agency focused on building scalable digital ecosystems combining marketing, automation, and custom software solutions.",
          "Architect high-conversion platforms integrating front-end design with backend logic and APIs.",
          "Develop internal dashboards and data systems to track user behavior, conversions, and revenue performance.",
          "Implement advanced automation workflows to reduce operational friction and increase efficiency."
        ]
      },
      {
        title: "Revenue & Automation Systems Specialist",
        company: "Smarkeep / Revenue Operations",
        date: "2024 – Present",
        desc: [
          "Designed and optimized revenue pipelines aligning marketing, sales, and automation layers.",
          "Engineered automated lead qualification and nurturing systems.",
          "Built backend tracking infrastructures to quantify and scale performance.",
          "Applied N×N system logic to create interconnected, scalable workflows across departments."
        ]
      },
      {
        title: "Full-Stack & Automation Developer",
        company: "E-commerce Data Project",
        date: "2023 – 2024",
        desc: [
          "Managed and structured a database of 1,162+ products using Supabase.",
          "Built automated pipelines for product data ingestion, transformation, and asset assignment.",
          "Integrated APIs and AI tools to optimize large-scale content operations.",
          "Developed internal dashboards for inventory and performance tracking."
        ]
      },
      {
        title: "Digital Strategy Consultant",
        company: "Plustextil (Venezuela)",
        date: "2023",
        desc: [
          "Designed SEO-driven positioning strategy for a B2B industrial company.",
          "Built content systems aligned with high-intent corporate buyers.",
          "Structured long-term inbound acquisition through organic channels."
        ]
      },
      {
        title: "Web Systems & Process Analyst",
        company: "Conveyors Technology",
        date: "2022 – 2023",
        desc: [
          "Developed website architecture aligned with industrial workflows.",
          "Built vendor qualification systems based on data-driven logic.",
          "Improved operational efficiency through structured digital processes."
        ]
      }
    ],
    projects: [
      {
        title: "Doral Fashion Week Magazine",
        link: "https://doral-fasgion-week-magazine.webflow.io/",
        subtitle: "Digital editorial platform for Doral Fashion Week.",
        desc: "Designed and developed the digital presence for Doral Fashion Week Magazine. Built a curated platform to showcase editorial collections, connect global brands with local talent, and establish authority in the fashion ecosystem."
      },
      {
        title: "Xclusive Rental",
        link: "https://xclusiverental.webflow.io",
        subtitle: "Luxury and family car rental service in Miami.",
        desc: "Developed a seamless car rental platform offering exclusive family and luxury vehicles. Focused on conversion optimization and dynamic inventory presentation."
      },
      {
        title: "Adventure Rental",
        link: "https://adventurerental-9e1bee5f1021b4e162fddca.webflow.io",
        subtitle: "Jet Ski Rental service in Austin, TX.",
        desc: "Developed a booking and website platform for a watercraft rental service. Integrated online booking systems and optimized the site for local search visibility and user conversion."
      },
      {
        title: "Rusty CBD",
        link: "https://rustycbd.webflow.io",
        subtitle: "E-commerce platform for premium CBD products.",
        desc: "Created a modern e-commerce storefront for CBD flowers and products. Focused on clean aesthetic, product categorization, and smooth shopping experience."
      },
      {
        title: "Mustache Barbershop",
        link: "https://www.mustachebarbershop.com/",
        subtitle: "Professional barbershop and grooming services.",
        desc: "Designed and developed a modern web presence for a premium barbershop. Focused on a sleek aesthetic, showcasing services, and an easy booking experience for clients."
      },
      {
        title: "C&J Professional Cleaning",
        link: "https://c-j-professional-cleaning.webflow.io",
        subtitle: "Corporate site for commercial and residential cleaning services.",
        desc: "Built a professional web presence for a cleaning agency in Florida. Highlighted B2B and residential service offerings, emphasizing reliability, safety, and hygiene."
      },
      {
        title: "Universa / Elemnt Builders",
        link: "https://universas-exceptional-site-08ec65.webflow.io",
        subtitle: "Corporate website for a construction and building company.",
        desc: "Designed and developed a professional web presence for a construction firm highlighting residential and commercial projects. Focused on building trust and showcasing structural excellence."
      },
      {
        title: "Exumas Wedding",
        link: "https://exumaswedding.webflow.io",
        subtitle: "Luxury destination wedding planning platform.",
        desc: "Designed a visually stunning web platform for exclusive private island weddings in the Bahamas. Focused on conveying elegance and seamless service offerings including accommodations, logistics, and event planning."
      },
      {
        title: "INFIT DJCOURSE",
        link: "https://infitevent.webflow.io",
        subtitle: "E-learning platform for DJ courses and community.",
        desc: "Designed and developed a digital platform for a masterclass DJ course. Focused on user experience and course presentation to drive sign-ups and student engagement."
      },
      {
        title: "Trimo Cargo",
        link: "https://trimo-cargo-6aceb60865ea9521a79a006acc4.webflow.io",
        subtitle: "Logistics and international shipping services.",
        desc: "Built a corporate website for a cargo company offering door-to-door shipping from Miami to Venezuela. Configured clear service breakdowns to streamline client acquisition."
      },
      {
        title: "Plustextil.com",
        link: "https://plustextil.com",
        subtitle: "SEO & B2B positioning system for industrial materials company.",
        desc: "Developed a full-scale SEO and content positioning strategy. Structured the website architecture to target high-intent B2B search queries. Designed content systems aligned with industrial buyer behavior to support inbound lead generation."
      },
      {
        title: "Frigorificoloiro.com",
        link: "https://www.frigorificoloiro.com",
        subtitle: "Service-based website optimized for local lead generation in refrigeration sector.",
        desc: "Built and optimized a service-based website for a refrigeration company. Structured service offerings to improve clarity, trust, and conversion rates with a focus on local lead generation."
      },
      {
        title: "Refrigeración JF Milenio",
        link: "https://refrigeracinjfmileniowebsite.vercel.app/ecosistema",
        subtitle: "Database-driven application for refrigeration technicians.",
        desc: "Developed a robust full-stack application featuring a comprehensive catalogue of over 1072 products. Implemented scalable database integrations and optimized search and filter architecture to support technicians in the field."
      },
      {
        title: "KIIERO Music",
        link: "https://kiiero-music-8854cd25dc3932f2197412350d.webflow.io",
        subtitle: "Web Design, Branding, and Google Ads Campaigns.",
        desc: "Led the full digital brand creation for a music industry platform. Developed the visual identity, built a highly engaging website, and engineered Google Ads campaigns to drive targeted audience acquisition and streaming growth."
      },
      {
        title: "Nations League 7",
        link: "https://nationsleague7-c2ku.vercel.app",
        subtitle: "Sports Analytics & Visual Dashboard.",
        desc: "Built a visually engaging and responsive sports statistics platform. Engineered the front-end to handle dynamic data rendering, interactive UI components, and real-time feel for tournament tracking."
      },
      {
        title: "Lucho FBA Academy",
        link: "https://lucho-fba-f7970e78fb5f1813ba9e379e680da.webflow.io",
        subtitle: "E-learning & High-Ticket Coaching Funnel.",
        desc: "Designed and developed a robust Webflow site for an Amazon FBA coaching program. Optimized the user journey for high-ticket sales, combining persuasive copywriting with clean, conversion-focused web architecture."
      },
      {
        title: "58Films",
        link: "https://www.58films.tv",
        subtitle: "Creative Portfolio for Venezuelan Filmmaker.",
        desc: "Designed and developed a minimalist, highly visual portfolio for a filmmaker, prioritizing video performance, clean UX, and personal brand storytelling."
      },
      {
        title: "www.gdreamtravel.com",
        link: "https://golden-dream-travel.webflow.io/",
        subtitle: "Travel platform focused on UX and conversion-driven user journeys.",
        desc: "Designed a digital platform for travel services with a focus on user journey and engagement. Applied conversion-focused design principles to increase inquiries and lead generation."
      }
    ],
    lists: {
      stack: [
        "React, TypeScript, JavaScript",
        "Supabase (Databases)",
        "REST APIs & integrations",
        "Webflow / Shopify",
        "Vercel Deployment",
        "AI tools (Claude Code, generative systems)",
        "Dashboard & analytics systems"
      ],
      edu: [
        "<strong>Business Administration</strong> — Florida National University (FNU), Miami, FL",
        "<strong>Engineering Studies</strong> (partial) — Lindenwood University, Saint Charles, MO (Soccer Scholarship)",
        "Former semi-professional soccer player (USA & Venezuela)",
        "Event production & creative direction",
        "Advanced visual design & AI-assisted rendering"
      ],
      comp: [
        "Systems Architecture (N×N Models)",
        "Software + Business Integration",
        "Automation Engineering",
        "Data-Driven Decision Making",
        "Revenue Systems Design",
        "High-Level Execution"
      ]
    }
  },
  es: {
    hero: {
      subtitle: "Especialista en Sistemas Digitales y Crecimiento",
      summary: "Especialista en Sistemas Digitales y Crecimiento en la intersección de ingeniería, automatización y revenue. Construyo aplicaciones web escalables, flujos de IA y ecosistemas digitales de alto rendimiento que impulsan el crecimiento."
    },
    titles: {
      nav_skills: "Habilidades",
      nav_experience: "Experiencia",
      nav_projects: "Proyectos",
      skills_title: "Habilidades Técnicas y Profesionales",
      experience_title: "Experiencia Profesional",
      projects_title: "Proyectos Clave",
      tech_visual_title: "Tecnologías y Plataformas",
      stack_title: "Tecnologías",
      edu_title: "Educación y Experiencias",
      comp_title: "Competencias Clave",
      footer_text: "Todos los derechos reservados."
    },
    skills: [
      { name: "React y TypeScript", level: "Experto", score: 5 },
      { name: "Diseño Web UI/UX", level: "Experto", score: 5 },
      { name: "Desarrollo en Webflow y Shopify", level: "Experto", score: 5 },
      { name: "Despliegue Vercel y CI/CD", level: "Avanzado", score: 4 },
      { name: "Integración de APIs", level: "Experto", score: 5 },
      { name: "Desarrollo Web Full Stack y Software", level: "Avanzado", score: 4 },
      { name: "Supabase / Bases de Datos", level: "Experto", score: 5 },
      { name: "IA y Automatización", level: "Avanzado", score: 4 },
      { name: "Dashboards y Analítica (Sheets, Airtable)", level: "Avanzado", score: 4 },
      { name: "Construcción de Software", level: "Avanzado", score: 4 },
      { name: "Gestión CRM (GoHighLevel, Notion)", level: "Experto", score: 5 },
      { name: "Operaciones de Ingresos / Meta & Google Ads", level: "Avanzado", score: 4 },
      { name: "SEO y Estrategia Digital", level: "Avanzado", score: 4 },
      { name: "Visualización 3D y Multimedia", level: "Avanzado", score: 4 },
      { name: "Bilingüe (Inglés / Español)", level: "Nativo", score: 5 }
    ],
    experience: [
      {
        title: "CEO y Fundador",
        company: "Universa Agency — Miami, FL",
        date: "2024 – Presente",
        desc: [
          "Dirijo una agencia enfocada en ecosistemas digitales escalables que integran marketing, automatización y software.",
          "Diseño plataformas de alta conversión combinando front-end con lógica backend e integraciones API.",
          "Desarrollo dashboards y sistemas de datos para medir comportamiento de usuarios y conversiones.",
          "Implemento flujos automatizados para reducir fricción operativa y aumentar eficiencia."
        ]
      },
      {
        title: "Especialista en Sistemas de Ingresos y Automatización",
        company: "Smarkeep / Dpto. Operaciones",
        date: "2024 – Presente",
        desc: [
          "Diseñé pipelines de ingresos alineando marketing, ventas y automatización.",
          "Implementé sistemas automatizados de calificación y nutrición de leads.",
          "Construí infraestructuras para medir y escalar rendimiento métrico.",
          "Apliqué lógica de sistemas N×N para automatizar interacciones departamentales."
        ]
      },
      {
        title: "Desarrollador Full-Stack y Automatización",
        company: "Proyecto E-commerce de Datos",
        date: "2023 – 2024",
        desc: [
          "Gestioné y estructuré base de datos de +1,162 productos en Supabase.",
          "Desarrollé pipelines automatizados para estructuración y asignación de activos de producto.",
          "Integré APIs y herramientas de IA para optimizar operaciones a gran escala.",
          "Generé dashboards internos para métricas y monitoreo de inventario."
        ]
      },
      {
        title: "Consultor de Estrategia Digital",
        company: "Plustextil (Venezuela)",
        date: "2023",
        desc: [
          "Diseñé posicionamiento SEO B2B para empresa de materiales industriales.",
          "Estructuré la arquitectura del sitio para resolver intenciones de búsqueda.",
          "Generé sistemas de contenido apoyando la adquisición orgánica de leads."
        ]
      },
      {
        title: "Analista de Sistemas Web y Procesos",
        company: "Conveyors Technology",
        date: "2022 – 2023",
        desc: [
          "Desarrollé arquitectura conectada al flujo de trabajo corporativo.",
          "Construí sistemas lógicos para la calificación online de proveedores.",
          "Mejoré procesos internos y operaciones digitales."
        ]
      }
    ],
    projects: [
      {
        title: "Doral Fashion Week Magazine",
        link: "https://doral-fasgion-week-magazine.webflow.io/",
        subtitle: "Plataforma editorial y digital para Doral Fashion Week.",
        desc: "Diseño y desarrollo de la presencia digital para Doral Fashion Week Magazine. Creación de una plataforma editorial para exhibir colecciones, conectar marcas globales con talento local y establecer autoridad en moda."
      },
      {
        title: "Xclusive Rental",
        link: "https://xclusiverental.webflow.io",
        subtitle: "Servicio de renta de autos familiares y de lujo en Miami.",
        desc: "Desarrollo de plataforma de alquiler de vehículos enfocado en un proceso de reserva fluido e inventario dinámico de autos exclusivos."
      },
      {
        title: "Adventure Rental",
        link: "https://adventurerental-9e1bee5f1021b4e162fddca.webflow.io",
        subtitle: "Servicio de renta de Jet Ski en Austin, TX.",
        desc: "Desarrollo de plataforma web y sistema de reservas para servicio de alquiler de motos acuáticas. Integración de reservas en línea y optimización para conversiones locales."
      },
      {
        title: "Rusty CBD",
        link: "https://rustycbd.webflow.io",
        subtitle: "Plataforma de e-commerce para productos de CBD premium.",
        desc: "Creación de tienda virtual moderna para productos y flores de CBD. Enfoque en categorización de productos, estética limpia y experiencia fluida de compra."
      },
      {
        title: "Mustache Barbershop",
        link: "https://www.mustachebarbershop.com/",
        subtitle: "Servicios profesionales de barbería.",
        desc: "Diseño y desarrollo de una presencia web moderna para una barbería premium. Enfocado en una estética elegante, exhibición de servicios y una experiencia de reserva sencilla."
      },
      {
        title: "C&J Professional Cleaning",
        link: "https://c-j-professional-cleaning.webflow.io",
        subtitle: "Sitio corporativo para servicios de limpieza comercial y residencial.",
        desc: "Construcción de presencia web profesional para agencia de limpieza en Florida. Exhibición de servicios residenciales y B2B, enfatizando confiabilidad, seguridad e higiene."
      },
      {
        title: "Universa / Elemnt Builders",
        link: "https://universas-exceptional-site-08ec65.webflow.io",
        subtitle: "Sitio web corporativo para empresa de construcción.",
        desc: "Construcción de presencia digital profesional para firma de construcción destacando proyectos residenciales y comerciales. Enfoque en generar confianza y exhibir excelencia estructural."
      },
      {
        title: "Exumas Wedding",
        link: "https://exumaswedding.webflow.io",
        subtitle: "Plataforma de planificación de bodas de lujo.",
        desc: "Diseño de un portal web visualmente atractivo para bodas exclusivas en islas privadas de las Bahamas. Enfoque en transmitir elegancia y detallar servicios logísticos, de alojamiento y planificación."
      },
      {
        title: "INFIT DJCOURSE",
        link: "https://infitevent.webflow.io",
        subtitle: "Plataforma de e-learning para cursos de DJ y comunidad.",
        desc: "Diseño y desarrollo de una plataforma digital para un curso interactivo de DJ. Enfoque en la experiencia del usuario y presentación del contenido para impulsar las inscripciones."
      },
      {
        title: "Trimo Cargo",
        link: "https://trimo-cargo-6aceb60865ea9521a79a006acc4.webflow.io",
        subtitle: "Servicios de logística y envíos internacionales.",
        desc: "Construcción de sitio web corporativo para una empresa de carga con envíos puerta a puerta desde Miami a Venezuela. Configuración clara de servicios para facilitar la captación de clientes."
      },
      {
        title: "Plustextil.com",
        link: "https://plustextil.com",
        subtitle: "Estrategia SEO y posicionamiento B2B para sector industrial.",
        desc: "Desarrollo de estrategia a gran escala para captar intenciones B2B mediante arquitectura de contenidos y autoridad de dominio."
      },
      {
        title: "Frigorificoloiro.com",
        link: "https://www.frigorificoloiro.com",
        subtitle: "Sitio optimizado para generación de leads en refrigeración.",
        desc: "Estructura optimizada de servicios y credibilidad técnica enfocada en adquisición de prospección local."
      },
      {
        title: "Refrigeración JF Milenio",
        link: "https://refrigeracinjfmileniowebsite.vercel.app/ecosistema",
        subtitle: "Aplicación de técnicos de refrigeración con base de datos de 1,072+ productos.",
        desc: "Desarrollo de aplicación full-stack con inventario integrado a base de datos escalable. Implementación de arquitectura de búsqueda y filtros para optimizar la experiencia técnica en campo con alto rendimiento."
      },
      {
        title: "KIIERO Music",
        link: "https://kiiero-music-8854cd25dc3932f2197412350d.webflow.io",
        subtitle: "Diseño Web, Branding y Campañas de Google Ads.",
        desc: "Lideré la creación integral de la marca para una plataforma de la industria musical. Desarrollé la identidad visual, construí un sitio web interactivo y estructuré campañas de Google Ads para captación de audiencia y crecimiento en streaming."
      },
      {
        title: "Nations League 7",
        link: "https://nationsleague7-c2ku.vercel.app",
        subtitle: "Dashboard Visual y Analítica Deportiva.",
        desc: "Construcción de una plataforma estadística deportiva visualmente atractiva y responsiva. Desarrollo front-end enfocado en el renderizado dinámico de datos y tracking de torneos en tiempo real."
      },
      {
        title: "Lucho FBA Academy",
        link: "https://lucho-fba-f7970e78fb5f1813ba9e379e680da.webflow.io",
        subtitle: "Embudo de E-learning y Coaching High-Ticket.",
        desc: "Diseño y desarrollo en Webflow para un programa de coaching de Amazon FBA. Optimización del viaje del usuario para ventas de alto valor, combinando copywriting persuasivo con arquitectura web orientada a la conversión."
      },
      {
        title: "58Films",
        link: "https://www.58films.tv",
        subtitle: "Portafolio Creativo de Cineasta Venezolano.",
        desc: "Diseño y desarrollo de un portafolio web minimalista y altamente visual con optimización de video, enfocado en experiencia de usuario y storytelling de marca personal."
      },
      {
        title: "www.gdreamtravel.com",
        link: "https://golden-dream-travel.webflow.io/",
        subtitle: "Plataforma de viajes enfocada en UI/UX y conversión.",
        desc: "Rediseño completo de embudos de consulta y generación de prospectos bajo experiencia centrada en el usuario (UX)."
      }
    ],
    lists: {
      stack: [
        "React, TypeScript, JavaScript",
        "Supabase (Bases de Datos)",
        "APIs REST e integraciones",
        "Webflow / Shopify (Híbridos)",
        "Despliegue Vercel",
        "Herramientas IA y diseño",
        "Desarrollo de Dashboards"
      ],
      edu: [
        "<strong>Administración de Empresas</strong> — Florida National University (FNU), Miami, FL",
        "<strong>Ingeniería</strong> (Parcial) — Lindenwood University, Saint Charles, MO (Beca deportiva)",
        "Ex-Jugador Semiprofesional (USA & Vzla)",
        "Producción de Eventos Digitales",
        "Renderizado 3D y Visualización IA"
      ],
      comp: [
        "Arquitectura N×N y Escalabilidad",
        "Integración de Negocios y Tech",
        "Ingeniería de Automatización",
        "Decisiones con Datos (Data-Driven)",
        "Operaciones y Flujos de Ingresos",
        "Ejecución y Adaptabilidad Global"
      ]
    }
  }
};

let currentLang = 'es';

function generateStars(score) {
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= score) {
      starsHtml += '<span class="filled">★</span>';
    } else {
      starsHtml += '<span>★</span>';
    }
  }
  return `<div class="stars">${starsHtml}</div>`;
}

function renderContent(lang) {
  const data = siteData[lang];

  // Update language buttons classes
  const btnEn = document.getElementById('lang-en');
  const btnEs = document.getElementById('lang-es');
  if (lang === 'en') {
    btnEn.classList.add('active');
    btnEs.classList.remove('active');
  } else {
    btnEs.classList.add('active');
    btnEn.classList.remove('active');
  }

  // Update fixed text fields
  const navSkills = document.querySelector('[data-i18n-nav="skills"]');
  if(navSkills) navSkills.textContent = data.titles.nav_skills;
  const navExp = document.querySelector('[data-i18n-nav="experience"]');
  if(navExp) navExp.textContent = data.titles.nav_experience;
  const navProj = document.querySelector('[data-i18n-nav="projects"]');
  if(navProj) navProj.textContent = data.titles.nav_projects;

  const elSubtitle = document.querySelector('[data-i18n="subtitle"]');
  if(elSubtitle) elSubtitle.textContent = data.hero.subtitle;

  const elSummary = document.querySelector('[data-i18n="summary"]');
  if(elSummary) elSummary.textContent = data.hero.summary;

  const elSkillsTitle = document.querySelector('[data-i18n="skills_title"]');
  if(elSkillsTitle) elSkillsTitle.textContent = data.titles.skills_title;

  const elExpTitle = document.querySelector('[data-i18n="experience_title"]');
  if(elExpTitle) elExpTitle.textContent = data.titles.experience_title;

  const elProjTitle = document.querySelector('[data-i18n="projects_title"]');
  if(elProjTitle) elProjTitle.textContent = data.titles.projects_title;

  const elTechVisTitle = document.querySelector('[data-i18n="tech_visual_title"]');
  if(elTechVisTitle) elTechVisTitle.textContent = data.titles.tech_visual_title;

  const elStackTitle = document.querySelector('[data-i18n="stack_title"]');
  if(elStackTitle) elStackTitle.textContent = data.titles.stack_title;

  const elEduTitle = document.querySelector('[data-i18n="edu_title"]');
  if(elEduTitle) elEduTitle.textContent = data.titles.edu_title;

  const elCompTitle = document.querySelector('[data-i18n="comp_title"]');
  if(elCompTitle) elCompTitle.textContent = data.titles.comp_title;

  const elFooterText = document.querySelector('[data-i18n="footer_text"]');
  if(elFooterText) elFooterText.textContent = data.titles.footer_text;

  // Render Skills
  const skillsContainer = document.getElementById('skills-container');
  skillsContainer.innerHTML = data.skills.map(skill => `
    <div class="skill-item">
      <div>
        <div class="skill-name">${skill.name}</div>
      </div>
      <div class="skill-rating-container">
        <div class="skill-level">${skill.level}</div>
        ${generateStars(skill.score)}
      </div>
    </div>
  `).join('');

  // Render Experience
  const expContainer = document.getElementById('experience-container');
  expContainer.innerHTML = data.experience.map(exp => `
    <div class="timeline-item glass-panel">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-date">${exp.date}</div>
        <h4 class="timeline-title">${exp.title}</h4>
        <div class="timeline-company">${exp.company}</div>
        <div class="timeline-desc">
          <ul>
            ${exp.desc.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `).join('');

  // Render Projects
  const projContainer = document.getElementById('projects-container');
  projContainer.innerHTML = data.projects.map(proj => {
    const isWebflow = proj.link.includes('webflow.io');
    let techIcons = '<div style="margin-top: 16px; display: flex; align-items: center; flex-wrap: wrap; gap: 12px; opacity: 0.9;">';
    
    if (isWebflow) {
      techIcons += '<div title="Built with Webflow" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600; font-family: sans-serif; background: rgba(67, 83, 255, 0.1); padding: 5px 10px; border-radius: 6px; color: #fff; border: 1px solid rgba(67, 83, 255, 0.3);"><img src="https://cdn.simpleicons.org/webflow/4353FF" alt="Webflow" style="height: 14px; width: auto;" /> Webflow</div>';
    } else {
      techIcons += '<div title="Deployed on Vercel" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600; font-family: sans-serif; background: rgba(255, 255, 255, 0.05); padding: 5px 10px; border-radius: 6px; color: #fff; border: 1px solid rgba(255, 255, 255, 0.1);"><img src="https://cdn.simpleicons.org/vercel/FFFFFF" alt="Vercel" style="height: 12px; width: auto;" /> Vercel</div>';
      techIcons += `<div title="Powered by Antigravity" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 600; font-family: monospace; background: rgba(142, 117, 178, 0.1); padding: 5px 10px; border-radius: 6px; color: #EAD0FF; border: 1px solid rgba(142, 117, 178, 0.3);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
          Antigravity
        </div>`;
    }
    techIcons += '</div>';

    return `
    <div class="project-card glass-panel" style="display: flex; flex-direction: column;">
      <div class="project-image-wrapper" style="width: 100%; height: 200px; min-height: 200px; flex-shrink: 0; border-radius: 8px; margin-bottom: 20px; overflow: hidden; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);">
        <img src="https://api.microlink.io/?url=${encodeURIComponent(proj.link)}&screenshot=true&meta=false&embed=screenshot.url" 
             alt="Preview of ${proj.title}" 
             loading="lazy"
             style="width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 8px; transition: transform 0.4s ease; cursor: pointer;"
             onclick="window.open('${proj.link}', '_blank')"
             onmouseover="this.style.transform='scale(1.03)'" 
             onmouseout="this.style.transform='scale(1)'"/>
      </div>
      <h4 class="project-title">
        <a href="${proj.link}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none;">
          ${proj.title} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.8em; opacity: 0.7;"></i>
        </a>
      </h4>
      <div class="project-subtitle">${proj.subtitle}</div>
      <p class="project-desc" style="flex-grow: 1;">${proj.desc}</p>
      ${techIcons}
    </div>
  `}).join('');

  // Render Lists (Stack, Edu, Comp)
  document.querySelector('[data-i18n-html="stack_list"]').innerHTML = 
    data.lists.stack.map(item => `<li>${item}</li>`).join('');
    
  document.querySelector('[data-i18n-html="edu_list"]').innerHTML = 
    data.lists.edu.map(item => `<li>${item}</li>`).join('');
    
  document.querySelector('[data-i18n-html="comp_list"]').innerHTML = 
    data.lists.comp.map(item => `<li>${item}</li>`).join('');

  // Render Visual Tech Logos
  const logos = [
    { name: "Meta Ads", icon: "meta", color: "#0668E1" },
    { name: "Google Ads", icon: "googleads", color: "#F4B400" },
    { name: "n8n", icon: "n8n", color: "#EA4B71" },
    { name: "Illustrator", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg", color: "#FF9A00" },
    { name: "Photoshop", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg", color: "#31A8FF" },
    { name: "Webflow", icon: "webflow", color: "#4353FF" },
    { name: "React", icon: "react", color: "#61DAFB" },
    { name: "Vercel", icon: "vercel", color: "#FFFFFF" },
    { name: "Supabase", icon: "supabase", color: "#3ECF8E" },
    { name: "Airtable", icon: "airtable", color: "#18BFFF" },
    { name: "Notion", icon: "notion", color: "#FFFFFF" },
    { name: "GoHighLevel", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/GoHighLevel_Icon.png", color: "#0F5C7C" },
    { name: "ChatGPT", icon: "openai", color: "#412991" },
    { name: "Claude Code", icon: "anthropic", color: "#D97757" },
    { name: "Gemini", icon: "googlegemini", color: "#8E75B2" }
  ];

  const techContainer = document.getElementById('tech-logos-track');
  if(techContainer) {
    // Duplicate the array to create a seamless infinite loop
    const carouselLogos = [...logos, ...logos];
    
    techContainer.innerHTML = carouselLogos.map(logo => {
      const imgSrc = logo.iconUrl ? logo.iconUrl : `https://cdn.simpleicons.org/${logo.icon}/${logo.color.replace('#', '')}`;
      return `
      <div class="tech-badge" style="--brand-color: ${logo.color}">
        <img src="${imgSrc}" alt="${logo.name} logo" />
        <span>${logo.name}</span>
      </div>
    `}).join('');
  }
}

// Interactivity Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderContent(currentLang);

  // Language switch listeners
  const btnEn = document.getElementById('lang-en');
  const btnEs = document.getElementById('lang-es');

  btnEn.addEventListener('click', () => {
    currentLang = 'en';
    renderContent(currentLang);
  });

  btnEs.addEventListener('click', () => {
    currentLang = 'es';
    renderContent(currentLang);
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));
});
