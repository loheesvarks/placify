export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-ambient">
      <div className="glass-card p-12 max-w-2xl text-center space-y-6">
        <h1 className="text-h1 gradient-text">Welcome to Placify</h1>
        <p className="text-body-lg text-secondary">AI-Powered Placement Preparation Platform</p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="glass-card-hover p-4 rounded-lg">
            <p className="text-label-md text-tertiary">Design System</p>
            <p className="text-h3 text-primary mt-2">✓ Ready</p>
          </div>
          <div className="glass-card-hover p-4 rounded-lg">
            <p className="text-label-md text-tertiary">Dark Theme</p>
            <p className="text-h3 text-primary mt-2">✓ Active</p>
          </div>
        </div>
      </div>
    </main>
  );
}
