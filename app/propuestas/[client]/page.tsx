import React from 'react';
import { Metadata } from 'next';
import proposalsData from '@/data/proposals.json';
import ProposalClient from './ProposalClient';

type Props = {
  params: Promise<{ client: string }>;
};

export async function generateStaticParams() {
  return Object.keys(proposalsData).map((client) => ({
    client: client.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { client } = await params;
  const clientSlug = client.toLowerCase();
  const proposal = (proposalsData as any)[clientSlug];

  if (!proposal) {
    return {
      title: "Propuesta No Encontrada | Universa Agency",
    };
  }

  return {
    title: `${proposal.client} - ${proposal.title} | Universa Agency`,
    description: proposal.summary || `Propuesta técnica personalizada para ${proposal.client}. Infraestructura digital de alto rendimiento.`,
    openGraph: {
      title: `${proposal.client} | Propuesta Técnica Universa`,
      description: proposal.summary,
      type: 'website',
      url: `https://www.universaagency.com/propuestas/${clientSlug}`,
      images: [
        {
          url: `https://www.universaagency.com/propuestas/${clientSlug}/opengraph-image?v=2`,
          width: 1200,
          height: 630,
          alt: `${proposal.client} - Universa Agency`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${proposal.client} | Propuesta Técnica Universa`,
      description: proposal.summary,
      images: [`https://www.universaagency.com/propuestas/${clientSlug}/opengraph-image?v=2`],
    },
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default async function Page({ params }: Props) {
  const { client } = await params;
  return <ProposalClient clientSlug={client} />;
}

