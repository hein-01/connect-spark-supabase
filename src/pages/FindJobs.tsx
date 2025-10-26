import { Navbar } from "@/components/Navbar";
import JobPostingForm from "@/components/JobPostingForm";

const FindJobs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Jobs</h1>
          <p className="text-muted-foreground mb-8">Post a job opening and find the perfect candidate</p>
          <JobPostingForm />
        </div>
      </main>
    </div>
  );
};

export default FindJobs;
