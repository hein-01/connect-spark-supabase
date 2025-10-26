import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  jobDescription: z.string().min(20, "Job description must be at least 20 characters"),
  salary: z.string().optional(),
  ageRequirement: z.enum(["any", "18-35", "custom"]),
  ageFrom: z.number().min(18).max(100).optional(),
  ageTo: z.number().min(18).max(100).optional(),
  benefits: z.array(z.string()).default([]),
  applicationDeadline: z.date({
    required_error: "Application deadline is required",
  }),
  viberNumber: z.string()
    .regex(/^09\d{7,9}$/, "Viber number must start with 09 and be valid"),
}).refine((data) => {
  if (data.ageRequirement === "custom") {
    return data.ageFrom !== undefined && data.ageTo !== undefined && data.ageFrom <= data.ageTo;
  }
  return true;
}, {
  message: "Invalid age range. 'From' age must be less than or equal to 'To' age",
  path: ["ageTo"],
});

type FormValues = z.infer<typeof formSchema>;

const benefitsOptions = [
  { id: "no-resume", label: "No Resume Needed (Walk-in Interview)" },
  { id: "no-experience", label: "No Experience Required" },
  { id: "seniors-welcome", label: "Seniors Welcome" },
  { id: "training-provided", label: "Training Provided" },
  { id: "flexible-hours", label: "Flexible Working Hours" },
  { id: "immediate-start", label: "Immediate Start" },
  { id: "students-ok", label: "Students OK" },
];

interface JobPostingFormProps {
  onSuccess?: () => void;
}

const JobPostingForm = ({ onSuccess }: JobPostingFormProps) => {
  const [showCustomAge, setShowCustomAge] = useState(false);
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      location: "",
      jobDescription: "",
      salary: "",
      ageRequirement: "any",
      benefits: [],
      viberNumber: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Job posting data:", data);
    toast({
      title: "Job Posted Successfully!",
      description: "Your job posting has been submitted.",
    });
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Sales Representative" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Yangon, Myanmar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the job responsibilities, requirements, etc."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 300,000 - 500,000 MMK" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ageRequirement"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Age Requirement *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowCustomAge(value === "custom");
                  }}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="any" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Any Age
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="18-35" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      18-35 years old
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="custom" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Custom
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCustomAge && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <FormField
              control={form.control}
              name="ageFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={18}
                      max={100}
                      placeholder="18"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ageTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={18}
                      max={100}
                      placeholder="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="benefits"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Best Practices/Benefits</FormLabel>
                <FormDescription>
                  Select all that apply to your job posting
                </FormDescription>
              </div>
              <div className="space-y-3">
                {benefitsOptions.map((benefit) => (
                  <FormField
                    key={benefit.id}
                    control={form.control}
                    name="benefits"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={benefit.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(benefit.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, benefit.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== benefit.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {benefit.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="applicationDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Application Deadline *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > maxDate
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Must be within 60 days from today
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="viberNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Viber Number *</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <div className="flex items-center bg-muted px-3 h-10 rounded-l-md border border-r-0 border-input">
                    <span className="text-sm text-muted-foreground">+95</span>
                  </div>
                  <Input
                    placeholder="09xxxxxxxx"
                    className="rounded-l-none"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Enter your number starting with 09 (without country code)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Post Job
        </Button>
      </form>
    </Form>
  );
};

export default JobPostingForm;
