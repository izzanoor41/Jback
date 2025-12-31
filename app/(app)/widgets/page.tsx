"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, XIcon, Palette, Eye, Star, MessageSquare, Sparkles } from "lucide-react";
import { ChromePicker } from "react-color";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useTeam } from "@/lib/store";

const formSchema = z.object({
  button_bg: z.string(),
  button_color: z.string(),
  button_text: z.string(),
  button_position: z.string(),
  form_bg: z.string(),
  form_color: z.string(),
  form_title: z.string(),
  form_subtitle: z.string(),
  form_rate_text: z.string(),
  form_details_text: z.string(),
  form_button_text: z.string(),
});

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [previewRating, setPreviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const team = useTeam((state) => state.team);
  const setTeam = useTeam((state) => state.setTeam);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (team) {
      form.setValue('button_bg', team.style.button_bg)
      form.setValue('button_color', team.style.button_color)
      form.setValue('button_text', team.style.button_text)
      form.setValue('button_position', team.style.button_position)
      form.setValue('form_bg', team.style.form_bg)
      form.setValue('form_color', team.style.form_color)
      form.setValue('form_title', team.style.form_title)
      form.setValue('form_subtitle', team.style.form_subtitle)
      form.setValue('form_rate_text', team.style.form_rate_text)
      form.setValue('form_details_text', team.style.form_details_text)
      form.setValue('form_button_text', team.style.form_button_text)
    }
  }, [team, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    toast.loading("Saving...");

    fetch("/api/team/style", {
      method: "POST",
      body: JSON.stringify({teamId: team.id, style: values}),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (res) => {
        toast.dismiss();
        if (res.success) {
          toast.success("Saved successfully!");
          setTeam(res.data);
        } else {
          toast.error(res.message);
        }
        setIsSubmitting(false);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.message);
        setIsSubmitting(false);
      });
  };

  // Color picker component
  const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (color: string) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Popover>
        <PopoverTrigger className="w-full h-12 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-300 transition-colors flex items-center justify-center gap-2 group">
          <div className="w-6 h-6 rounded-full shadow-inner border border-gray-200" style={{ background: value }} />
          <span className="text-xs text-gray-400 group-hover:text-emerald-600">{value}</span>
        </PopoverTrigger>
        <PopoverContent className="p-0 bg-transparent border-none shadow-none flex items-center justify-center">
          <ChromePicker color={value} onChangeComplete={(color: any) => onChange(color.hex)} />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Widget Customization</h1>
          <p className="text-sm text-gray-500">Design your feedback collection widget</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <h2 className="font-semibold text-gray-900">Widget Settings</h2>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger 
                      value="form" 
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Feedback Form
                    </TabsTrigger>
                    <TabsTrigger 
                      value="button"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Button Trigger
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="form" className="space-y-6 mt-0">
                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <ColorPicker 
                        value={form.watch('form_bg') || '#10B981'} 
                        onChange={(c) => form.setValue('form_bg', c)} 
                        label="Background Color" 
                      />
                      <ColorPicker 
                        value={form.watch('form_color') || '#ffffff'} 
                        onChange={(c) => form.setValue('form_color', c)} 
                        label="Text Color" 
                      />
                    </div>

                    {/* Text Fields */}
                    <div className="space-y-4">
                      <FormField control={form.control} name="form_title" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="We'd love your feedback!" disabled={isSubmitting} className="rounded-xl border-gray-200 focus:border-emerald-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="form_subtitle" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Subtitle</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Help us improve" disabled={isSubmitting} className="rounded-xl border-gray-200 focus:border-emerald-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="form_rate_text" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Rating Label</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Rate us" disabled={isSubmitting} className="rounded-xl border-gray-200 focus:border-emerald-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="form_button_text" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Button Text</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Submit" disabled={isSubmitting} className="rounded-xl border-gray-200 focus:border-emerald-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="form_details_text" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Feedback Label</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Tell us more" disabled={isSubmitting} className="rounded-xl border-gray-200 focus:border-emerald-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </TabsContent>

                  <TabsContent value="button" className="space-y-6 mt-0">
                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <ColorPicker 
                        value={form.watch('button_bg') || '#10B981'} 
                        onChange={(c) => form.setValue('button_bg', c)} 
                        label="Button Background" 
                      />
                      <ColorPicker 
                        value={form.watch('button_color') || '#ffffff'} 
                        onChange={(c) => form.setValue('button_color', c)} 
                        label="Button Text Color" 
                      />
                    </div>

                    <FormField control={form.control} name="button_text" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Button Text</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Feedback" disabled={isSubmitting} className="rounded-xl border-gray-200 focus:border-emerald-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="button_position" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Button Position</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <SelectTrigger className="w-full rounded-xl border-gray-200">
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="right">Right Side</SelectItem>
                              <SelectItem value="left">Left Side</SelectItem>
                              <SelectItem value="bottom-left">Bottom Left</SelectItem>
                              <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t border-gray-100 py-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl shadow-md shadow-emerald-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>

        {/* Preview Panel */}
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <h2 className="font-semibold text-gray-900">Live Preview</h2>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              className="relative w-full aspect-square overflow-hidden"
              style={{ 
                backgroundColor: `#ffffff`, 
                backgroundImage: `radial-gradient(#000000 0.5px, #ffffff 0.5px)`, 
                backgroundSize: `10px 10px` 
              }}
            >
              {/* Synced Tabs for Preview */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex items-center justify-center pt-4">
                <TabsList>
                  <TabsTrigger value="form">Feedback Form</TabsTrigger>
                  <TabsTrigger value="button">Button Trigger</TabsTrigger>
                </TabsList>

                <TabsContent value="form">
                  <div className="absolute bottom-4 right-4 max-w-xs w-full">
                    <div 
                      className="w-full rounded-xl shadow-2xl overflow-hidden"
                      style={{ backgroundColor: form.watch("form_bg") }}
                    >
                      {/* Header */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start justify-between" style={{ color: form.watch("form_color") }}>
                          <div>
                            <h6 className="font-bold">{form.watch("form_title") || "We'd love your feedback!"}</h6>
                            <p className="text-sm opacity-80">{form.watch("form_subtitle") || "Help us improve"}</p>
                          </div>
                          <button type="button" className="p-1 bg-white/50 rounded-full" style={{ color: form.watch("form_bg") }}>
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="bg-white/90 rounded-t-lg p-3 space-y-3">
                        {/* Star Rating */}
                        <div>
                          <p className="text-sm mb-2">{form.watch("form_rate_text") || "How would you rate us?"}</p>
                          <div className="flex gap-1 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setPreviewRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-0.5 transition-transform hover:scale-110"
                              >
                                <Star 
                                  className={`w-8 h-8 transition-colors ${
                                    star <= (hoverRating || previewRating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-gray-200 text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Feedback Text */}
                        <div>
                          <p className="text-sm mb-2">{form.watch("form_details_text") || "Tell us more"}</p>
                          <textarea 
                            className="w-full rounded border p-3 text-sm placeholder:text-sm" 
                            rows={5} 
                            placeholder="Please let us know what's your feedback"
                          />
                        </div>

                        {/* Submit Button */}
                        <Button 
                          type="button" 
                          variant="brand"
                          className="w-full"
                          style={{ 
                            background: form.watch("form_bg"), 
                            color: form.watch("form_color") 
                          }}
                        >
                          {form.watch("form_button_text") || "Submit Feedback"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="button">
                  <div
                    className={clsx(
                      { "absolute right-0 px-4 py-2 rounded-t-lg -rotate-90 bottom-2/3 origin-bottom-right": form.watch("button_position") === "right" },
                      { "absolute left-0 px-4 py-2 rounded-t-lg rotate-90 bottom-2/3 origin-bottom-left": form.watch("button_position") === "left" },
                      { "absolute right-4 px-4 py-2 rounded-t-lg bottom-0": form.watch("button_position") === "bottom-right" },
                      { "absolute left-4 px-4 py-2 rounded-t-lg bottom-0": form.watch("button_position") === "bottom-left" }
                    )}
                    style={{ 
                      background: form.watch("button_bg"), 
                      color: form.watch("button_color") 
                    }}
                  >
                    {form.watch("button_text") || "Feedback"}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
