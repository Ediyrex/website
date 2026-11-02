export function SocialProofBar() {
  return (
    <div
      className="w-full bg-[#08090B]"
      style={{ borderTop: '1px solid #292929', borderBottom: '1px solid #292929' }}
    >
      <div
        className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center"
        style={{ height: 86 }}
      >
        {/* Left label */}
        <div className="shrink-0 mr-8">
          <p
            className="font-inter font-medium uppercase text-[#777D87] leading-[1.35]"
            style={{ fontSize: 10.5, letterSpacing: '0.1em' }}
          >
            BUILT FOR
            <br />
            CREATORS, STARTUPS
            <br />
            AND BUSINESSES.
          </p>
        </div>

        {/* Thin vertical divider */}
        <div
          className="shrink-0 mr-10"
          style={{ width: 1, height: 36, background: '#292929' }}
        />

        {/* Tool logos — placeholder monochrome identities */}
        <div className="flex items-center gap-10 sm:gap-14">
          {/* Notion */}
          <div className="flex items-center gap-2 font-inter font-medium text-[#D0CFCC] hover:text-[#F5F3EE] transition-colors cursor-default" style={{ fontSize: 12 }}>
            {/* Notion N icon placeholder */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.2" />
              <text x="4.5" y="13" fontFamily="Georgia, serif" fontSize="10" fontWeight="bold" fill="currentColor">N</text>
            </svg>
            <span>Notion</span>
          </div>

          {/* Google Cloud */}
          <div className="flex items-center gap-2 font-inter font-medium text-[#D0CFCC] hover:text-[#F5F3EE] transition-colors cursor-default" style={{ fontSize: 12 }}>
            {/* Cloud icon placeholder */}
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <path d="M15.5 13H4a3.5 3.5 0 0 1-.5-6.97A5 5 0 0 1 14.08 5.2 3 3 0 1 1 15.5 13Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            <span>Google Cloud</span>
          </div>

          {/* n8n */}
          <div className="flex items-center gap-2 font-inter font-medium text-[#D0CFCC] hover:text-[#F5F3EE] transition-colors cursor-default" style={{ fontSize: 12 }}>
            {/* n8n infinity-node icon placeholder */}
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
              <circle cx="5" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="17" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" />
              <line x1="9" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>n8n</span>
          </div>

          {/* OpenAI */}
          <div className="flex items-center gap-2 font-inter font-medium text-[#D0CFCC] hover:text-[#F5F3EE] transition-colors cursor-default" style={{ fontSize: 12 }}>
            {/* OpenAI gear/blossom icon placeholder */}
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="7.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8.5 4v9M5 5.9l7 5.2M5 11.1l7-5.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span>OpenAI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
