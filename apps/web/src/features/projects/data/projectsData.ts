import { CaseStudy } from '../types'

export const PROJECTS_DATA: CaseStudy[] = [
  {
    slug: 'aegis-platform',
    title: 'Aegis Intelligent Operations Platform',
    client: 'Aegis Supply Systems',
    year: '2025',
    division: 'hybrid',
    divisionLabel: 'Digital + AI Automation',
    heroTagline: 'Autonomous logistics intelligence and real-time fleet telematics',
    overview:
      'Aegis required an operational command center capable of ingesting high-throughput real-time telematics from thousands of transit nodes while deploying autonomous triage agents for unexpected dispatch disruptions.',
    challenge:
      'Legacy dispatch workflows required manual operator intervention for every route deviation, causing cascading delays during peak logistics cycles and creating severe cognitive overload for central dispatch controllers.',
    solution:
      'We architected a sub-second reactive Next.js dashboard backed by high-throughput PostgreSQL and a deterministic AI agent layer. Autonomous agents analyze real-time route variance, re-simulate freight schedules, and execute automated partner notifications with human supervisor oversight.',
    results: [
      { metric: '< 250ms', label: 'Average Telemetry Query Latency' },
      { metric: '74%', label: 'Reduction in Manual Dispatch Tasks' },
      { metric: '14,000+', label: 'Connected Endpoints Tracked Concurrently' },
    ],
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'LangChain', 'LiveKit WebSockets'],
    deliverables: [
      'Operational Command Center Web App',
      'Autonomous Dispatch AI Agent System',
      'Design System & Component Library',
      'High-Performance Real-Time Data Pipeline',
    ],
    gallery: [
      { title: 'Global Operations Dashboard', caption: 'Real-time telemetry map tracking active fleet corridors' },
      { title: 'Agentic Exception Resolver', caption: 'Autonomous routing adjustment card with manual override' },
      { title: 'Fleet Analytics Suite', caption: 'Fuel efficiency and driver safety metric visualizer' },
    ],
  },
  {
    slug: 'lumina-origin',
    title: 'Lumina Origin: Brand Visual Universe',
    client: 'Lumina Architectural Atelier',
    year: '2025',
    division: 'media',
    divisionLabel: 'Media & Production',
    heroTagline: 'A cinematic brand universe and tactile editorial film portfolio',
    overview:
      'Lumina Atelier required a luxury-grade visual identity and high-craft brand film series to support their architectural monograph launch across London, Milan, and Mumbai.',
    challenge:
      'Traditional architectural documentation lacked emotional resonance and failed to communicate the sensory tactility of physical limestone, bronze craftsmanship, and natural daylight transitions.',
    solution:
      'We directed a multi-city 35mm and 6K cinema campaign focusing on chiaroscuro lighting, tactile close-ups, and natural ambient soundscapes, accompanied by an editorial digital exhibition website.',
    results: [
      { metric: '4.8M+', label: 'Organic Global Impressions Across Releases' },
      { metric: '3', label: 'International Design Festival Selections' },
      { metric: '100%', label: 'Monograph Pre-Sale Inventory Depleted' },
    ],
    technologies: ['ARRI Alexa Mini LF', 'DaVinci Resolve', 'Cooke Anamorphic Lenses', 'Pro Tools Spatial Audio'],
    deliverables: [
      '4-Minute Theatrical Brand Film',
      '12 Social & Gallery Cutdowns',
      '40 Fine Art Architectural Stills',
      'Bespoke Sound Identity & Vinyl Master',
    ],
    gallery: [
      { title: 'Light & Monolith', caption: 'Still from 35mm morning study on travertine stone facades' },
      { title: 'The Architect’s Workshop', caption: 'Intimate workshop sequence capturing bespoke metal casting' },
      { title: 'Spatial Harmony', caption: 'Wide-angle golden hour perspective of the pavilion installation' },
    ],
  },
  {
    slug: 'synthesis-concierge',
    title: 'Synthesis Autonomous Client Concierge',
    client: 'Synthesis Capital Partners',
    year: '2025',
    division: 'ai',
    divisionLabel: 'Artificial Intelligence',
    heroTagline: 'Ultra-low latency conversational AI concierge for high-net-worth client intake',
    overview:
      'Synthesis needed an intelligent front-desk and intake layer capable of handling confidential preliminary client qualification, scheduling secure consultations, and resolving institutional product inquiries around the clock.',
    challenge:
      'Traditional automated chatbots were clunky, frustrating high-net-worth callers and degrading brand prestige. Human concierge desks suffered from delayed response times across global timezones.',
    solution:
      'We engineered a custom voice and text conversational agent powered by sub-500ms speech-to-speech models and isolated RAG knowledge boundaries, maintaining strict regulatory compliance and sophisticated conversational tone.',
    results: [
      { metric: '< 420ms', label: 'Average Voice Turnaround Time' },
      { metric: '98.2%', label: 'Accurate Intent Categorization' },
      { metric: '24/7', label: 'Instant Multilingual Institutional Intake' },
    ],
    technologies: ['Deepgram Nova-2', 'Cartesia Sonic Voice', 'Claude 3.5 Sonnet', 'Twilio SIP Trunking', 'Next.js'],
    deliverables: [
      'Real-Time Inbound Voice Concierge',
      'Private RAG Compliance Boundary Engine',
      'Supervisor Audio Stream & Transcript Audit App',
      'Calendar & Salesforce CRM Synchronization',
    ],
    gallery: [
      { title: 'Voice Concierge Telephony Flow', caption: 'Real-time transcript stream with intent confidence scoring' },
      { title: 'Knowledge Boundary Inspector', caption: 'Auditing data sources to verify strict zero-hallucination' },
      { title: 'Intake Analytics Portal', caption: 'Executive summary of qualified client consultations' },
    ],
  },
  {
    slug: 'vortex-identity',
    title: 'Vortex Audio Spatial Platform',
    client: 'Vortex Technologies',
    year: '2024',
    division: 'digital',
    divisionLabel: 'Digital Experiences',
    heroTagline: 'Interactive 3D audio configuration interface and e-commerce flagship',
    overview:
      'A high-performance interactive 3D web application allowing audio engineers and consumers to simulate spatial acoustics and configure modular studio acoustic arrays.',
    challenge:
      'Standard e-commerce platforms could not handle real-time WebGL audio simulation or complex parametric physical dimensions without severe performance lag.',
    solution:
      'We developed a custom Three.js and Next.js platform featuring sub-second 3D room rendering, instant parametric acoustic analysis, and an effortless checkout flow.',
    results: [
      { metric: '3.4x', label: 'Increase in Online Consultation Bookings' },
      { metric: '60 FPS', label: 'Locked Framerate on Desktop & Mobile WebGL' },
      { metric: '99/100', label: 'Lighthouse Performance Score' },
    ],
    technologies: ['Next.js', 'React Three Fiber', 'Three.js', 'Web Audio API', 'Stripe API'],
    deliverables: [
      'Interactive 3D WebGL Configurator',
      'E-commerce & Checkout Pipeline',
      'Parametric Acoustic Calculation Engine',
      'Global CDN Edge Deployment',
    ],
    gallery: [
      { title: 'Acoustic Room Simulator', caption: 'Interactive 3D viewport measuring sound dispersion patterns' },
      { title: 'Modular Hardware Builder', caption: 'Configuring custom acoustic timber panel placements' },
      { title: 'Mobile Checkout Experience', caption: 'Streamlined checkout with instant dimension summary' },
    ],
  },
]

