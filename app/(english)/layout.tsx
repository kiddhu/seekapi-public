import { RootDocument } from '@/components/root-document';
export { metadata, viewport } from '@/components/root-document';

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
