'use client';
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {CheckCircle2, FileText, Upload, Video} from "lucide-react";
import Navigation from "@/components/Navigation";
import {useQuery} from "@tanstack/react-query";

interface Country {
  name: { common: string };
  flags: { svg: string };
  cca2: string;
}

const Certification = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    certLevel: "",
    company: "",
    country: "",
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [dbFile, setDbFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const { data: countries } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2");
      return response.json();
    },
  });

  const sortedCountries = countries?.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );

  const needsLicense = formData.certLevel === "level2" || formData.certLevel === "level3";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email ||
        !formData.certLevel || !formData.company || !formData.country || !dbFile) {
      toast.error("Please fill all required fields");
      return;
    }

    if (needsLicense && !licenseFile) {
      toast.error("Production license file is required for Level 2 and Level 3");
      return;
    }

    // Analyze the database file with AI
    setAnalyzing(true);
    toast.info("Analyzing your bot project...");

    try {
      const reviewFormData = new FormData();
      reviewFormData.append('dbFile', dbFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/review-bot-db`,
        {
          method: 'POST',
          body: reviewFormData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze database');
      }

      const result = await response.json();
      setAnalysisResult(result);
      setAnalyzing(false);

      toast.success("Analysis complete! See results below.");

      // Still submit the application after analysis
      setTimeout(() => {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      }, 2000);

    } catch (error) {
      console.error('Analysis error:', error);
      setAnalyzing(false);
      toast.error("Could not analyze the database file. Please check the file format.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12">
          <div className="mx-auto max-w-2xl">
            <Card className="shadow-[var(--shadow-card)] text-center">
              <CardHeader className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Application Received!</CardTitle>
                <CardDescription className="text-base">
                  Thank you for submitting your certification application.
                  <br />
                  You will receive a response within approximately 5 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Submit Another Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-12 mx-auto">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Certification Application
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete the form below to apply for Rocketbot certification
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle>Application Form</CardTitle>
                  <CardDescription>All fields are required</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="certLevel">Certification Level *</Label>
                      <Select value={formData.certLevel} onValueChange={(value: string) => setFormData({ ...formData, certLevel: value })}>
                        <SelectTrigger id="certLevel">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="level1">Level 1</SelectItem>
                          <SelectItem value="level2">Level 2</SelectItem>
                          <SelectItem value="level3">Level 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {needsLicense && (
                      <div className="space-y-2">
                        <Label htmlFor="license">Production License (JSON) *</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="license"
                            type="file"
                            accept=".json"
                            onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                            required={needsLicense}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value:string) => setFormData({ ...formData, country: value })}>
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortedCountries?.map((country) => (
                            <SelectItem key={country.cca2} value={country.cca2}>
                              <div className="flex items-center gap-2">
                                <img src={country.flags.svg} alt="" className="w-4 h-3 object-cover" />
                                {country.name.common}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dbFile">Project Database (.db) *</Label>
                      <Input
                        id="dbFile"
                        type="file"
                        accept=".db"
                        onChange={(e) => setDbFile(e.target.files?.[0] || null)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload your Rocketbot project database file
                      </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={analyzing}>
                      <Upload className="mr-2 h-4 w-4" />
                      {analyzing ? "Analyzing Bot..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {analysisResult && (
                <Card className="shadow-[var(--shadow-card)] mt-6">
                  <CardHeader>
                    <CardTitle>Bot Analysis Results</CardTitle>
                    <CardDescription>AI-powered review of your bot project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Summary Card */}
                    <Card className={`border-2 ${
                      analysisResult.summary?.score >= 80 ? 'border-green-500 bg-green-50' : 
                      analysisResult.summary?.score >= 60 ? 'border-yellow-500 bg-yellow-50' : 
                      'border-red-500 bg-red-50'
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl">
                            Score: {analysisResult.summary?.score || 0}/100
                          </CardTitle>
                          <CheckCircle2 className={`h-8 w-8 ${
                            analysisResult.summary?.score >= 80 ? 'text-green-600' : 
                            analysisResult.summary?.score >= 60 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`} />
                        </div>
                        <CardDescription className="text-base font-medium">
                          {analysisResult.summary?.total_issues || 0} issues found: {' '}
                          <span className="text-red-600">{analysisResult.summary?.errors || 0} errors</span>, {' '}
                          <span className="text-yellow-600">{analysisResult.summary?.warnings || 0} warnings</span>
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Issues List */}
                    {analysisResult.issues && analysisResult.issues.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">Issues Found</h4>
                        {analysisResult.issues.map((issue: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border-l-4 ${
                              issue.type === 'error' ? 'bg-red-50 border-red-500 dark:bg-red-950/20' :
                              issue.type === 'warning' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20' :
                              'bg-blue-50 border-blue-500 dark:bg-blue-950/20'
                            }`}
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <span className={`font-bold text-sm uppercase px-2 py-1 rounded ${
                                issue.type === 'error' ? 'bg-red-200 text-red-800' :
                                issue.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-blue-200 text-blue-800'
                              }`}>
                                {issue.type}
                              </span>
                              <span className="text-sm font-medium text-muted-foreground">
                                [{issue.category}]
                              </span>
                            </div>
                            <p className="text-sm font-medium">{issue.message}</p>
                            {issue.line && (
                              <p className="mt-2 text-xs text-muted-foreground">
                                Line: {issue.line}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">Recommendations</h4>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              <span className="text-primary font-bold mt-0.5">✓</span>
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Help Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/QprCv0aD8cg"
                      title="Rocketbot Certification Guide"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Documentation
                    </h4>
                    <div className="space-y-1">
                      <a
                        href="https://rocketbot.com/en/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        Rocketbot Official Documentation
                      </a>
                      <a
                        href="https://rocketbot.com/en/studio-rpa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        RPA Studio Guide
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification;
