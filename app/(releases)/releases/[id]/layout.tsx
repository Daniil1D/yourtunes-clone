import { SideMenu } from '@/shared/components/shared';
import { ReleaseStepper } from '@/shared/components/shared/release-stepper';

export default function ReleaseWizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex">

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-5xl px-6 py-10 space-y-8">
          <ReleaseStepper />
          {children}
        </div>
      </div>
    </main>
  );
}
