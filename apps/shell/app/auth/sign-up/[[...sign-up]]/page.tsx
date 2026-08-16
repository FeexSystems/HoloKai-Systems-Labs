import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 py-24 relative z-10">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-background to-background" />
      
      <div className="relative z-10 w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto w-full',
              card: 'bg-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl',
              headerTitle: 'text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500',
              headerSubtitle: 'text-zinc-400 font-inter text-sm',
              socialButtonsBlockButton: 'border-white/10 bg-white/5 hover:bg-white/10 text-white transition-colors',
              socialButtonsBlockButtonText: 'text-zinc-200 font-semibold',
              dividerLine: 'bg-white/10',
              dividerText: 'text-zinc-500',
              formFieldLabel: 'text-zinc-300 font-medium',
              formFieldInput: 'bg-black/50 border-white/10 text-white focus:border-amber-500/50 focus:ring-amber-500/20 rounded-lg',
              formButtonPrimary: 'bg-amber-600 hover:bg-amber-500 text-white font-bold font-inter transition-colors rounded-lg',
              footerActionText: 'text-zinc-400',
              footerActionLink: 'text-amber-500 hover:text-amber-400 font-semibold',
              identityPreviewText: 'text-zinc-200',
              identityPreviewEditButtonIcon: 'text-amber-500 hover:text-amber-400',
              formFieldSuccessText: 'text-emerald-400',
              formFieldErrorText: 'text-red-400',
            },
          }}
          routing="path"
          path="/auth/sign-up"
          signInUrl="/auth/sign-in"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
