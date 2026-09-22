import { ImageResponse } from 'next/og';
import proposalsData from '@/data/proposals.json';

export const runtime = 'edge';
export const alt = 'Propuesta Comercial | Universa Agency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const clientSlug = client?.toLowerCase();
  const proposal = (proposalsData as any)[clientSlug];
  
  const clientName = proposal ? proposal.client : 'Universa Agency';
  const proposalTitle = proposal ? (proposal.title || 'Propuesta Estratégica') : 'High Performance Digital Infrastructure';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0e131f', // Universa Deep Midnight Blue
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background Ambient Radial Green Lights (Top Left & Bottom Right) */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            left: '-150px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45, 220, 128, 0.35) 0%, rgba(45, 220, 128, 0.05) 50%, transparent 70%)',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            right: '-150px',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45, 220, 128, 0.25) 0%, rgba(45, 220, 128, 0.05) 50%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Center Emerald Glow Beam */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45, 220, 128, 0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top Border Accent Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, #2ddc80 50%, transparent 100%)',
            display: 'flex',
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 24px',
            background: 'rgba(45, 220, 128, 0.1)',
            border: '1px solid rgba(45, 220, 128, 0.3)',
            borderRadius: '9999px',
            marginBottom: '28px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#2ddc80',
              boxShadow: '0 0 10px #2ddc80',
              display: 'flex',
            }}
          />
          <span
            style={{
              color: '#2ddc80',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            UNIVERSA AGENCY · PROPUESTA ESTRATÉGICA
          </span>
        </div>

        {/* Universa U Logo Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="130"
          height="125"
          fill="none"
          viewBox="0 0 48 46"
          style={{ zIndex: 10, filter: 'drop-shadow(0 0 25px rgba(45,220,128,0.5))' }}
        >
          <path
            fill="#2ddc80"
            d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
          />
        </svg>

        {/* Client Name Main Heading */}
        <div
          style={{
            marginTop: '24px',
            fontSize: clientName.length > 20 ? '56px' : '68px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            textAlign: 'center',
            padding: '0 60px',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            zIndex: 10,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          {clientName}
        </div>

        {/* Subtitle / Proposal Title */}
        <div
          style={{
            marginTop: '16px',
            fontSize: '18px',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            maxWidth: '900px',
            padding: '0 40px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            zIndex: 10,
          }}
        >
          {proposalTitle.length > 85 ? proposalTitle.slice(0, 85) + '...' : proposalTitle}
        </div>

        {/* Bottom Footer Accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            UNIVERSAAGENCY.COM
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
