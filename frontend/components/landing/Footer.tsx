export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
          &copy; {new Date().getFullYear()} Task-Spare. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
